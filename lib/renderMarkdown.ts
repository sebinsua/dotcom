import unified from "unified";
import remarkParse from "remark-parse";
// @ts-ignore
import remarkOembed from "remark-oembed";
import remarkShikiTwoSlash from "remark-shiki-twoslash";
import rehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
// @ts-ignore
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

const render = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkOembed)
    .use(remarkShikiTwoSlash, {
      theme: require("../styles/monochrome-dark.json"),
    })
    .use(
      rehype,
      // @ts-ignore
      { allowDangerousHtml: true }
    )
    .use(rehypeRaw)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);

export async function renderMarkdown(markdown: string): Promise<string> {
  const { contents } = await render(markdown);

  return String(contents);
}
