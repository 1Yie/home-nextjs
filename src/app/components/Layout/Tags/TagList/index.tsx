import Link from 'next/link';
import { PostMetadata } from '@/app/blog/post';
import style from './tags.module.scss';

export async function getServerSideProps() {
	try {
		const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
		const response = await fetch(`${API_BASE}/api/posts`);
		if (!response.ok) throw new Error('Failed to fetch');
		const posts: PostMetadata[] = await response.json();

		const tagMap = posts.reduce((acc: Record<string, { count: number; posts: PostMetadata[] }>, post) => {
			post.tags?.forEach((tag) => {
				if (!acc[tag]) {
					acc[tag] = { count: 0, posts: [] };
				}
				acc[tag].count += 1;
				acc[tag].posts.push(post);
			});
			return acc;
		}, {});

		const sortedTags = Object.entries(tagMap).sort(([, a], [, b]) => b.count - a.count);

		return { props: { sortedTags } };
	} catch (error) {
		console.error('Error fetching posts:', error);
		return { props: { sortedTags: [] } };
	}
}

export default function TagsPage({ sortedTags }: { sortedTags: [string, { count: number; posts: PostMetadata[] }][] }) {
	return (
		<>
			<div className={style.tagsContainer}>
				<section id={style.tags}>
					{sortedTags.length === 0 && (
						<div className={style.noTag}>
							<p>¯\_(ツ)_/¯</p>
							<p>暂无 Tag</p>
						</div>
					)}
					<div className={style.tagList}>
						{sortedTags.map(([tag, { count }]) => (
							<div key={tag} className={style.tag}>
								<Link href={`/tags/${tag}`} className={style.tagTitle}>
									#{tag} ({count})
								</Link>
							</div>
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
