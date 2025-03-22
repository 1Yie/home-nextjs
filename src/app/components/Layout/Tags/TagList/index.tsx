import Link from 'next/link';
import { PostMetadata } from '@/app/blog/post';
import style from './tags.module.scss';

export default async function TagsPage() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts`);
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

	return (
		<>
			<div className={style.tagsContainer}>
				<section id={style.tags}>
					<div className={style.tagList}>
						{sortedTags.map(([tag, { count }]) => (
							<div key={tag} className={style.tag}>
								<Link key={tag} href={`/tags/${tag}`} className={style.tagTitle}>
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
