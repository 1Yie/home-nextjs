import type { Metadata } from 'next';

import { PostMetadata } from '@/app/blog/post';

import Main from '@/components/Layout/Tags/Main';
import TagList from '@/components/Layout/Tags/TagList';

export const metadata: Metadata = {
	title: 'ichiyo | Tags',
};

export default async function TagPage() {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

	const response = await fetch(`${API_BASE}/api/posts`, { cache: 'no-store' });
	const posts: PostMetadata[] = await response.json();

	const tagCountMap = new Map<string, { count: number; posts: PostMetadata[] }>();
	posts.forEach((post) => {
		post.tags?.forEach((tag) => {
			if (tagCountMap.has(tag)) {
				const current = tagCountMap.get(tag)!;
				tagCountMap.set(tag, {
					count: current.count + 1,
					posts: [...current.posts, post],
				});
			} else {
				tagCountMap.set(tag, {
					count: 1,
					posts: [post],
				});
			}
		});
	});

	const sortedTags = Array.from(tagCountMap.entries()).sort((a, b) => b[1].count - a[1].count);

	return (
		<>
			<Main />
			<TagList sortedTags={sortedTags} />
		</>
	);
}
