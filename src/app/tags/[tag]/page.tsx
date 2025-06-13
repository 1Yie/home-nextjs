import { notFound } from 'next/navigation';
import { PostMetadata } from '@/app/blog/post';
import PostList from '@/components/Layout/Blog/PostList';
import style from './tag.module.scss';
import NewSplitText from '@/components/Public/NewSplitText';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
	const resolvedParams = await params;
	const decodedTag = decodeURIComponent(resolvedParams.tag);

	return {
		title: `ichiyo | ${decodedTag}`,
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const resolvedParams = await params;
	const decodedTag = decodeURIComponent(resolvedParams.tag);

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts`, { cache: 'no-store' });
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
					<NewSplitText
						as="h1"
						text={`#${decodedTag}`}
						delay={100}
						duration={0.6}
						ease="power3.out"
						splitType="words"
						from={{ opacity: 0, y: 40 }}
						to={{ opacity: 1, y: 0 }}
						threshold={0.1}
						rootMargin="-100px"
						textAlign="center"
					/>
				</section>
			</div>
			<PostList posts={filteredPosts} />
		</>
	);
}
