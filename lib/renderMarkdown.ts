import { unified } from "unified";
import remarkParse from "remark-parse";
// @ts-ignore
import remarkOembed from "remark-oembed";
import remarkShikiTwoSlash from "remark-shiki-twoslash";
import remarkMath from "remark-math";
import rehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
// @ts-ignore
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

const render = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkOembed)
    .use(remarkShikiTwoSlash, {
      theme: "vitesse-dark",
    })
    .use(remarkMath)
    .use(
      rehype,
      // @ts-ignore
      { allowDangerousHtml: true }
    )
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);

export async function renderMarkdown(markdown: string): Promise<string> {
  const vfile = await render(markdown);

  return String(vfile.value);
}
