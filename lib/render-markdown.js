import util from "util";
import remark from "remark";
import html from "remark-html";
import remarkShikiTwoSlash from "remark-shiki-twoslash";

const render = util.promisify(
  remark().use(remarkShikiTwoSlash).use(html).process
);

export default async function renderMarkdown(markdown) {
  const { contents } = await render(markdown);
  return contents;
}
