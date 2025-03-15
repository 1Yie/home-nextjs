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

export async function getPost({ slug }: { slug: string }): Promise<Post | null> {
	const filePath = path.join(process.cwd(), 'src/app/blog/post', `${slug}.md`);

	try {
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
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return null;
		}
		throw error;
	}
}
