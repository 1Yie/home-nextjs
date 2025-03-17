---
title: 'Next.js + gray-matter + Markdown 搭建个人博客'
date: '2025-3-15'
tags:
  - Blog
  - Next.js
  - Markdown
---

# 思路

面对博客搭建，以往可能会选择数据库 + 后台管理的方式，但个人搭建博客其实用不上这么复杂。

我选择通过 Markdown 来写博客，通过工具渲染成 HTML 展示出来。

# 技术栈

- React
- Next.js
- Markdown
- gray-matter
- remark

# 思考

## 如何通过 Markdown 获取到文章的元数据？

Markdown 可以在 head 定义元数据，然后通过工具来获取到文章的元数据。
我选择了 `gray-matter` ，它可以将 Markdown 的元数据解析成 JSON 对象。

拿到 Markdown 的元数据后，我们就可以将元数据渲染到页面上了。

## 如何渲染？

经过了解，我发现可以通过 `remark` 来渲染 Markdown。

`remark` 是一个基于 React 的库，它提供了一个 React 钩子和组件，能够将 Markdown 轻松转换 为 React 元素。

`remark` 拥有插件系统，我们可以通过插件来扩展 `remark` 的功能。

使用 `remark-rehype` 插件将 mdast 转换成 HTML 抽象语法树（hast）。

当然，`remark` 还提供了一些其他的插件，比如 `remark-highlight.js` 插件，可以将代码块高亮，`remark-gfm` 插件可以支持 GitHub Flavored Markdown， `rehype-stringify` 插件可以将 hast 转换成 HTML 字符串。

# 实现

## 解析 Markdown 的元数据

首先，假设我们在 `src/app/blog/post` 目录下有一个 `test.md` 文件，内容如下：

```md
---

title: '测试文章标题'
date: '2025-3-15'
tags:
  - test

---

这是一篇测试文章。
```

我们要先获取这个目录下的所有 md 文件。

```ts
const POSTS_DIR = path.join(process.cwd(), 'src/app/blog/post');
const MD_EXTENSION = '.md';
```

通过 `fs.readdir` 方法获取到这个目录下的所有文件。

```ts
const files = await fs.readdir(POSTS_DIR);
const markdownFiles = files.filter((file) => file.endsWith(MD_EXTENSION));
```

然后，我们可以通过 `gray-matter` 来解析 Markdown 的元数据。

```ts
type PostMetadata = {
	title: string;
	date: string;
	tags?: string[];
	slug: string;
};

const posts = await Promise.all(
	markdownFiles.map(async (file) => {
		const filePath = path.join(POSTS_DIR, file);
		const fileContents = await fs.readFile(filePath, 'utf8');
		const { data } = matter(fileContents);
		return {
			title: data.title,
			date: data.date,
			tags: data.tags || [],
			slug: file.replace(/\.md$/, ''),
		} as PostMetadata;
	})
);
```

```ts
// 排序
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

通过获取的 slug 可以获取到文章的内容。

```ts
export async function getPost({ slug }: { slug: string }): Promise<Post | null> {
	const filePath = path.join(POSTS_DIR, `${slug}${MD_EXTENSION}`);

	try {
		const fileContents = await fs.readFile(filePath, 'utf8');
		const { data, content } = matter(fileContents);

		validatePostMetadata(data);

		return {
			title: data.title,
			date: new Date(data.date).toISOString(),
			tags: data.tags || [],
			slug,
			content: await processMarkdown(content),
		};
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return null;
		}
		console.error(`Error loading post ${slug}:`, error);
		throw new Error(`Failed to load post: ${slug}`);
	}
}
```

## 渲染内容

- 根据 slug 参数获取文章内容
- 生成 SEO 元数据
- 渲染文章详情页

```ts
// SEO元数据生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// 获取文章数据
	const post = await getPost({ slug });

	return {
		title: post.title + ' | ichiyo', // 动态标题
		openGraph: {
			type: 'article',
			publishedTime: post.date, // 结构化数据
			tags: post.tags, // 文章标签
		},
	};
}
```

> Next.js 15 之后，元数据生成 (generateMetadata) 必须是 Promise，否则在 build 时 会抛出 Type 'Props' does not satisfy the constraint 'PageProps'

文章内容渲染

```tsx
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

数据处理流程：

`浏览器请求 → Next.js 路由匹配 → getPost 获取数据 → 生成元数据 → 渲染页面组件`
