import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
import {
  createTransformerFactory,
  rendererRich,
} from "@shikijs/twoslash/core";
import { createTwoslashFromCDN } from "twoslash-cdn";
import katexPlugin from "@vscode/markdown-it-katex";

// Create twoslash instance using CDN for types (avoids @typescript/vfs issues with Turbopack)
const twoslash = createTwoslashFromCDN({
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
});

// Create transformer using the factory pattern (avoids importing regular twoslash)
const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererRich(),
  explicitTrigger: true, // Only process ```ts twoslash blocks
  throws: false,
});

// Pre-process: strip blockquote markers from inside math blocks
// This handles the edge case of math inside blockquotes where each line
// has a `> ` prefix that KaTeX cannot parse
function preprocessBlockquoteMath(markdown: string): string {
  return markdown.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    // Only process if there are blockquote markers to strip
    if (!math.includes(">")) {
      return match;
    }
    const cleanedMath = math
      .split("\n")
      .map((line: string) => line.replace(/^>\s?/, ""))
      .join("\n");
    return `$$${cleanedMath}$$`;
  });
}

// Cache for oEmbed responses to avoid repeated API calls
const oEmbedCache = new Map<string, string>();

// Fetch oEmbed HTML from Twitter/X
async function fetchTwitterOEmbed(url: string): Promise<string> {
  if (oEmbedCache.has(url)) {
    return oEmbedCache.get(url)!;
  }

  try {
    const oEmbedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
    const response = await fetch(oEmbedUrl);
    if (!response.ok) {
      throw new Error(`oEmbed fetch failed: ${response.status}`);
    }
    const data = await response.json();
    const html = data.html as string;
    oEmbedCache.set(url, html);
    return html;
  } catch (error) {
    console.warn(`Failed to fetch oEmbed for ${url}:`, error);
    // Fallback to simple blockquote
    return `<blockquote class="twitter-tweet"><a href="${url}">${url}</a></blockquote>`;
  }
}

// Pre-process: convert bare Twitter URLs to embeds using oEmbed API
async function processTwitterEmbeds(markdown: string): Promise<string> {
  const twitterUrlRegex = /^(https:\/\/(twitter|x)\.com\/\w+\/status\/\d+)$/gm;
  const matches = [...markdown.matchAll(twitterUrlRegex)];

  // Fetch all oEmbed responses in parallel
  const replacements = await Promise.all(
    matches.map(async (match) => {
      const url = match[1];
      const html = await fetchTwitterOEmbed(url);
      return { url, html };
    })
  );

  // Apply replacements
  let result = markdown;
  for (const { url, html } of replacements) {
    result = result.replace(
      new RegExp(`^${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "gm"),
      html
    );
  }

  return result;
}

let mdPromise: Promise<MarkdownIt> | null = null;

async function getMarkdownIt(): Promise<MarkdownIt> {
  if (!mdPromise) {
    mdPromise = (async () => {
      const md = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      });

      // Use official KaTeX plugin - handles math correctly in the parsing pipeline
      // This integrates with markdown-it's tokenizer so math content is never
      // processed as regular markdown (avoiding issues with underscores, etc.)
      md.use(katexPlugin, {
        output: "html", // Avoid MathML which can cause rendering issues
        throwOnError: false,
      });

      md.use(
        await Shiki({
          themes: {
            light: "vitesse-dark",
            dark: "vitesse-dark",
          },
          transformers: [transformerTwoslash],
        })
      );

      return md;
    })();
  }
  return mdPromise;
}

// Post-process: convert <a name="..."></a> followed by heading to heading with id
function fixAnchorTags(html: string): string {
  // First, remove <p> wrappers around standalone anchor tags
  let result = html.replace(/<p>(<a\s+name="[^"]*">\s*<\/a>)<\/p>/g, "$1");

  // Then convert <a name="..."></a> followed by <h1-6> to <h1-6 id="...">
  // This handles: <a name="foo"></a>\n<h3>... -> <h3 id="foo">...
  result = result.replace(
    /<a\s+name="([^"]*)">\s*<\/a>\s*<(h[1-6])>/g,
    '<$2 id="$1">'
  );

  return result;
}

// Extract twoslash code blocks and prepare their types
async function prepareTwoslashTypes(markdown: string): Promise<void> {
  // Match code blocks with twoslash flag (ts, tsx, typescript, js, jsx, javascript)
  const twoslashRegex =
    /```(?:tsx?|typescript|jsx?|javascript)\s+twoslash[^\n]*\n([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(twoslashRegex)];

  // Prepare types for all twoslash blocks in parallel
  await Promise.all(
    matches.map(async (match) => {
      const code = match[1];
      try {
        await twoslash.prepareTypes(code);
      } catch (error) {
        console.error("Failed to prepare twoslash types:", error);
      }
    })
  );
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const md = await getMarkdownIt();

  // Pre-process: fix blockquote math and Twitter embeds
  let processed = preprocessBlockquoteMath(markdown);
  processed = await processTwitterEmbeds(processed);

  // Prepare twoslash types before rendering (must happen before sync render)
  await prepareTwoslashTypes(processed);

  // Parse markdown to HTML (math is handled by the KaTeX plugin)
  let html = md.render(processed);

  // Post-process: fix anchor tags
  html = fixAnchorTags(html);

  return html;
}
