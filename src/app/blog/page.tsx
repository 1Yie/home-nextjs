import type { Metadata } from 'next';

import Main from '@/components/Layout/Blog/Main';
import PostList from '@/components/Layout/Blog/PostList';

export const metadata: Metadata = {
	title: 'ichiyo | Blog',
};

export default function BlogPage() {
	return (
		<>
			<Main />
			<PostList />
		</>
	);
}
