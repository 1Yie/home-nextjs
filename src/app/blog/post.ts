import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkAlerts from 'remark-alerts';
import { visit } from 'unist-util-visit';
import { Element as HastElement, Text as HastText } from 'hast';

export type PostMetadata = {
	title: string;
	date: string;
	tags?: string[];
	slug: string;
};

type Post = PostMetadata & {
	content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'src/app/blog/post');
const MD_EXTENSION = '.md';

const processMarkdown = async (content: string): Promise<string> => {
	try {
		const processor = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkAlerts)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeHighlight)
			.use(rehypeStringify, { allowDangerousHtml: true });

		const file = await processor.parse(content);

		const hastFile = processor.runSync(file);

		visit(hastFile, 'element', (node) => {
			if (node.tagName && node.tagName.startsWith('h') && node.tagName.length === 2) {
				const level = parseInt(node.tagName[1], 10);
				if (level >= 1 && level <= 6) {
					const headingText = node.children
						.filter((child): child is HastText => child.type === 'text')
						.map((child) => child.value)
						.join('');

					(node as HastElement).properties = (node as HastElement).properties || {};
					(node as HastElement).properties.id = headingText;

					node.children.push({
						type: 'element',
						tagName: 'span',
						properties: {
							class: 'anchor-link',
							onclick:
								`const el=document.getElementById('${headingText}');` +
								`if(el){el.scrollIntoView({behavior:'smooth'});` +
								`history.replaceState(null,'','#${headingText}');}`,
						},
						children: [{ type: 'text', value: '#' }],
					});
				}
			}
		});

		return processor.stringify(hastFile);
	} catch (error) {
		console.error('Markdown processing failed:', error);
		throw new Error(`Failed to process Markdown content: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

const validatePostMetadata = (data: Record<string, unknown>): data is PostMetadata => {
	if (!data.title || typeof data.title !== 'string') {
		throw new Error('Missing or invalid title in post metadata');
	}
	if (!data.date || isNaN(Date.parse(data.date as string))) {
		throw new Error('Missing or invalid date in post metadata');
	}

	return true;
};

export async function getPosts(): Promise<Post[]> {
	try {
		const files = await fs.readdir(POSTS_DIR);
		const markdownFiles = files.filter((file) => file.endsWith(MD_EXTENSION));

		const posts = await Promise.all(
			markdownFiles.map(async (file) => {
				const filePath = path.join(POSTS_DIR, file);
				const fileContents = await fs.readFile(filePath, 'utf8');
				const { data, content } = matter(fileContents);

				validatePostMetadata(data);

				return {
					title: data.title,
					date: new Date(data.date).toISOString(),
					tags: data.tags || [],
					slug: file.replace(MD_EXTENSION, ''),
					content: await processMarkdown(content),
				};
			})
		);

		return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	} catch (error) {
		console.error('Failed to get posts:', error);
		throw new Error('Failed to fetch blog posts');
	}
}

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
