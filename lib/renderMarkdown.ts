import path from "path";
import fs from "fs";
import typescript from "typescript";
import { knownLibFilesForCompilerOptions } from "@typescript/vfs";
import { unified } from "unified";
import remarkParse from "remark-parse";
// @ts-ignore
import remarkOembed from "remark-oembed";
import remarkShikiTwoSlash from "remark-shiki-twoslash";
import remarkMath from "remark-math";
import rehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

function createDefaultMapFromNodeModules(
  compilerOptions: typescript.CompilerOptions
) {
  function getLibContents(name: string) {
    return fs.readFileSync(
      path.join(".", "node_modules", "typescript", "lib", name),
      "utf8"
    );
  }

  const fsMap = knownLibFilesForCompilerOptions(
    compilerOptions,
    typescript
  ).reduce((m, lib) => {
    return m.set("/" + lib, getLibContents(lib));
  }, new Map<string, string>());

  return fsMap;
}

const render = (markdown: string) =>
  unified()
    .use(remarkParse as any)
    .use(remarkOembed, { syncWidget: true })
    .use(remarkShikiTwoSlash, {
      theme: "vitesse-dark",
      fsMap: createDefaultMapFromNodeModules({
        target: typescript.ScriptTarget.ES2020,
      }),
    })
    .use(remarkMath as any)
    .use(
      rehype as any,
      // @ts-ignore
      { allowDangerousHtml: true }
    )
    .use(rehypeRaw)
    .use(rehypeKatex as any)
    .use(rehypeFormat)
    .use(rehypeStringify as any)
    .process(markdown);

export async function renderMarkdown(markdown: string): Promise<string> {
  const vfile = await render(markdown);

  return String(vfile.value);
}
