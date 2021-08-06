import fs from "fs";
import path from "path";
import matter from "gray-matter";
import parseIso from "date-fns/parseISO";
import format from "date-fns/format";

const humanizeDate = (dateStr) => format(parseIso(dateStr), "MMMM d, yyyy");

export default function getPosts() {
  let dir;
  try {
    dir = fs.readdirSync("./posts/");
  } catch (err) {
    // No posts yet
    return [];
  }

  const posts = dir
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const postContent = fs.readFileSync(`./posts/${file}`, "utf8");
      const { data, content } = matter(postContent);

      if (data.published === false) {
        return null;
      }

      return {
        ...data,
        body: content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((rawPost) => {
      return {
        ...rawPost,
        title: rawPost.title.replace(" ", " "),
        date: humanizeDate(rawPost.date),
      };
    });

  return posts;
}
