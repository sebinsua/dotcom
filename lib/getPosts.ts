import * as path from "node:path";
import * as fs from "node:fs/promises";
import matter from "gray-matter";
import formatISO from "date-fns/formatISO";

export interface PostData {
  meta: {
    title: string;
    slug: string;
    date: string;
    description?: string;
    author?: string;
    hidden?: boolean;
    isEffortPost?: boolean;
  };
  content: string;
}

const postsDirectory = path.resolve("./posts");

export async function getPosts(): Promise<PostData[]> {
  const fileNames = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    fileNames
      .filter((fileName) => path.extname(fileName) === ".md")
      .map(async (fileName) => {
        const postContent = await fs.readFile(
          path.join(postsDirectory, fileName),
          "utf8"
        );

        const { data, content } = matter(postContent);

        const post = {
          meta: {
            title: data.title,
            slug: data.slug,
            date: formatISO(new Date(data.date)),
            description: data.description ?? null,
            author: data.author ?? null,
            hidden: data.hidden ?? false,
            isEffortPost: data.isEffortPost ?? false,
          },
          content: content,
        } as PostData;

        return post;
      })
  );

  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}

export async function getVisiblePosts(): Promise<PostData[]> {
  const posts = await getPosts();

  return posts.filter((post) => post.meta.hidden !== true);
}
