import Link from 'next/link';
import { getPost } from '@/app/blog/post';
import style from './post.module.scss';
import { notFound } from 'next/navigation';
import Comments from '@/app/components/Public/Comment';
import Tag from '@/components/Public/Tag';
import TopAnchor from '@/app/components/Public/TopAnchor';
import NewSplitText from '@/components/Public/NewSplitText';

import type { Metadata, ResolvingMetadata } from 'next';

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year} 年 ${month} 月 ${day} 日`;
};

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost({ slug });
	const previousImages = (await parent).openGraph?.images || [];

	if (!post) {
		notFound();
	}

	return {
		title: post.title + ' | ichiyo',
		description: `${post.title}`,
		openGraph: {
			title: post.title + ' | ichiyo',
			description: `${post.title}`,
			images: [...previousImages],
			type: 'article',
			publishedTime: post.date,
			tags: post.tags,
		},
	};
}

export default async function PostPage({ params }: Props) {
	const { slug } = await params;
	const post = await getPost({ slug });

	if (!post) {
		notFound();
	}

	return (
		<>
			<TopAnchor />
			<div className={style.postTitle}>
				<section id={style.postTop}>
					<div className={style.titlePanel}>
						<nav className={style.breadcrumb}>
							<Link href="/" className={style.breadcrumbHome}>
								&nbsp;Home&nbsp;
							</Link>
							/
							<Link href="/blog" className={style.breadcrumbBlog}>
								&nbsp;Blog&nbsp;
							</Link>
							/<span className={style.breadcrumbTitle}>&nbsp;{post.title}&nbsp;</span>
						</nav>
						<div className={style.content}>
							<NewSplitText
								as="h1"
								text={post.title}
								delay={100}
								duration={0.6}
								ease="power3.out"
								splitType="words"
								from={{ opacity: 0, y: 40 }}
								to={{ opacity: 1, y: 0 }}
								threshold={0.1}
								rootMargin="-100px"
							/>

							<Tag tags={post.tags || []} />
							<time className={style.date}>{formatDate(post.date)}</time>
						</div>
					</div>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
			<div className={style.postContent}>
				<section id={style.postDown}>
					<article>
						<div
							className={style.postStyle}
							dangerouslySetInnerHTML={{
								__html: post.content.replace(/<img/g, '<img data-zoom="true"'),
							}}
						/>
					</article>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
			<Comments />
		</>
	);
}
