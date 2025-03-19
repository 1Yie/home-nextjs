import type { Metadata } from 'next';

import type { PostMetadata } from '@/app/blog/post';

import Main from '@/components/Layout/Blog/Main';
import PostList from '@/components/Layout/Blog/PostList';

export const metadata: Metadata = {
	title: 'ichiyo | Blog',
};

export default async function BlogPage() {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

	const response = await fetch(`${API_BASE}/api/posts`, { cache: 'no-store' });
	const posts: PostMetadata[] = await response.json();

	return (
		<>
			<Main />
			<PostList posts={posts} />
		</>
	);
}
