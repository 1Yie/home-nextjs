---
title: 'Next.js + gray-matter + Markdown 搭建个人博客'
date: '2025-3-15'
tags:
  - Blog
  - Next.js
  - Markdown
---

# 思路

（测试文章样式）

其实面对个人博客，使用 MD + Next.js 解析成页面展示，不需要数据库，也不需要复杂的后台管理系统。

# 技术栈

- Next.js
- Markdown
- gray-matter

通过 `gray-matter` 将 Markdown 解析成 HTML，然后在 Next.js 中渲染。

后续如果更新博客，只需要在 post 目录下新建 md 文件，再 pull 到服务器即可。

# 代码

解析 Markdown 的代码如下：

```ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

type PostMetadata = {
	title: string;
	date: string;
	tags?: string[];
	slug: string;
};

type Post = PostMetadata & {
	content: string;
};

export async function getPosts(): Promise<Post[]> {
	const postsDir = path.join(process.cwd(), 'src/app/blog/post');
	const files = await fs.readdir(postsDir);

	const posts = await Promise.all(
		files.map(async (file) => {
			const filePath = path.join(postsDir, file);
			const fileContents = await fs.readFile(filePath, 'utf8');
			const { data, content } = matter(fileContents);

			const processedContent = await remark().use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(content);

			return {
				title: data.title,
				date: data.date,
				tags: data.tags || [],
				slug: file.replace(/\.md$/, ''),
				content: processedContent.toString(),
			} as Post;
		})
	);

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost({ slug }: { slug: string }): Promise<Post> {
	const filePath = path.join(process.cwd(), 'src/app/blog/post', `${slug}.md`);
	const fileContents = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContents);

	const processedContent = await remark().use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(content);

	return {
		title: data.title,
		date: data.date,
		tags: data.tags || [],
		slug: slug,
		content: processedContent.toString(),
	};
}
```
