import { notFound } from 'next/navigation';
import { PostMetadata } from '@/app/blog/post';
import PostList from '@/components/Layout/Blog/PostList';
import style from './tag.module.scss';

export async function generateStaticParams() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts`);
	const posts: PostMetadata[] = await response.json();

	const tags = new Set(posts.flatMap((post) => post.tags));
	return Array.from(tags).map((tag) => ({
		tag: tag ? encodeURIComponent(tag) : '',
	}));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	let decodedTag: string;
	try {
		const { tag } = await params;
		decodedTag = decodeURIComponent(tag);
	} catch {
		notFound();
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts`);
	const posts: PostMetadata[] = await response.json();

	const allTags = new Set(posts.flatMap((post) => post.tags || []).map((t) => t.toLowerCase()));
	if (!allTags.has(decodedTag.toLowerCase())) {
		notFound();
	}

	const filteredPosts = posts.filter((post) => post.tags?.some((t) => t.toLowerCase() === decodedTag.toLowerCase()));

	return (
		<>
			<div className={style.tagContainer}>
				<section id={style.tag}>
					<h1>#{decodedTag}</h1>
				</section>
			</div>
			<PostList posts={filteredPosts} />
		</>
	);
}
