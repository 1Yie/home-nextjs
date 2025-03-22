---
title: 'Next.js 实现个人博客'
date: '2025-3-15'
tags:
  - Next.js
  - React
  - Markdown
---

# 思路

面对博客搭建，以往可能会选择数据库 + 后台管理的方式，但个人搭建博客其实用不上这么复杂。

我选择通过 Markdown 来写博客，通过工具渲染成 HTML 展示出来。

# 技术栈

- React
- Next.js
- Markdown
- remark

# 思考

## 如何通过 Markdown 获取到文章的元数据？

Markdown 可以在 head 定义元数据，然后通过工具来获取到文章的元数据。
我选择了 `gray-matter` ，它可以将 Markdown 的元数据解析成 JSON 对象。

拿到 Markdown 的元数据后，我们就可以将元数据渲染到页面上了。

## 如何渲染？

经过了解，我发现可以通过 `remark` 来渲染 Markdown。

`remark` 是一个基于 React 的库，它提供了一个 React 钩子和组件，能够将 Markdown 轻松转换 为 React 元素。

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

在 `src/app/blog/post` 下后缀为 `.md` 的文件。

```ts
const POSTS_DIR = path.join(process.cwd(), 'src/app/blog/post');
const MD_EXTENSION = '.md';
```

通过 `fs.readdir` 方法获取到这个目录下的所有末尾为 `.md` 的文件。

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


## 生成元数据

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

## 渲染内容

渲染内容的话，我们可以通过 `remark` 来渲染 Markdown。

借助其他库，我们可以实现一些 Markdown 的扩展功能。

```ts
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkAlerts from 'remark-alerts';
```

- unified：用于处理 Markdown 的通用工具
- matter：解析 Markdown 的元数据
- remark-parse：将 Markdown 解析为 AST
- remark-rehype：将 Markdown AST 转换为 HTML AST
- remark-gfm：支持表格
- rehype-highlight：代码高亮
- rehype-stringify：将 HTML AST 转换为 HTML
- remark-alerts：支持 Markdown 警告和提示

```ts
const processMarkdown = async (content: string): Promise<string> => {
	try {
		const processor = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkAlerts)
			.use(remarkRehype, {
				allowDangerousHtml: true,
			})
			.use(rehypeHighlight)
			.use(rehypeStringify, {
				allowDangerousHtml: true,
			});

		const processed = await processor.process(content);
		return processed.toString();
	} catch (error) {
		console.error('Markdown processing failed:', error);
		throw new Error(`Failed to process Markdown content: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};
```

封装成方法，就可以在组件中使用了。

```ts
const validatePostMetadata = (data: Record<string, unknown>): data is PostMetadata => {
	if (!data.title || typeof data.title !== 'string') {
		throw new Error('Missing or invalid title in post metadata');
	}
	if (!data.date || isNaN(Date.parse(data.date as string))) {
		throw new Error('Missing or invalid date in post metadata');
	}

	return true;
};

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
`validatePostMetadata` 方法用于验证元数据的有效性。

`getPost` 将 Markdown 文件解析为 `Post` 对象，包括标题、日期、标签和内容。

`processMarkdown` 使用 `unified` 处理 Markdown，将其转换为 HTML。

最后，在组件中使用 `getPost` 获取文章数据，并渲染内容。

```tsx
import { getPost } from '@/app/blog/post';

export default async function PostPage({ params }: Props) {
	const { slug } = await params;
	const post = await getPost({ slug });

	if (!post) {
		return <div>Post not found</div>;
	}
	
	return <div className={style.postStyle} dangerouslySetInnerHTML={{ __html: post.content }} />;
}
```

数据处理流程：

`浏览器请求 → Next.js 路由匹配 → getPost 获取数据 → 生成元数据 → 渲染页面组件`
