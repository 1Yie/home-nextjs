import style from './list.module.scss';
import type { PostMetadata } from '@/app/blog/post';
import Link from 'next/link';

import Tag from '@/components/Public/Tag';

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return `${date.getFullYear()} 年 ${String(date.getMonth() + 1).padStart(2, '0')} 月 ${String(date.getDate()).padStart(2, '0')} 日`;
};

export async function getServerSideProps() {
	try {
		const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
		const response = await fetch(`${API_BASE}/api/posts`);
		if (!response.ok) throw new Error('Failed to fetch');
		const posts = await response.json();

		return { props: { posts } };
	} catch (error) {
		console.error('Error fetching posts:', error);
		return { props: { posts: [] } };
	}
}

export default function BlogPage({ posts }: { posts: PostMetadata[] }) {
	const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return (
		<>
			<div className={style.blogContainer}>
				<section id={style.post}>
					<div className={style.rssLink}>
						<a href="/api/rss" aria-label="订阅RSS" className={style.rssIcon}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path d="M19 20.001C19 11.729 12.271 5 4 5v2c7.168 0 13 5.832 13 13.001h2zm-7 0c0-4.962-4.037-9-9-9v2c3.86 0 7 3.14 7 7h2zm-5 0c0-2.761-2.239-5-5-5v2c1.657 0 3 1.344 3 3h2z" />
							</svg>
							RSS 订阅
						</a>
						<Link href="/tags" className={style.tagsLink}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z" />
							</svg>
							Tags
						</Link>
					</div>
					<div className={style.postsList}>
						{sortedPosts.map((post) => (
							<Link key={post.slug} href={`/blog/${post.slug}`} className={style.postLink}>
								<article className={style.postCard}>
									<div className={style.postPanel}>
										<h2>{post.title}</h2>
										<div className={style.postMeta}>
											<time className={style.postDate}>{formatDate(post.date)}</time>
											<Tag tags={post.tags || []} />
										</div>
									</div>
								</article>
							</Link>
						))}
					</div>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
}
