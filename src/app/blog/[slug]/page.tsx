import Link from 'next/link';
import { getPost } from '@/app/blog/post';
import style from './post.module.scss';

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

	return (
		<>
			<div className={style.postTitle}>
				<section id={style.postTop}>
					<div className={style.titlePanel}>
						<nav className={style.breadcrumb}>
							<Link href="/" className={style.breadcrumbHome}>
								&nbsp;Home&nbsp;
							</Link>
							&gt;
							<Link href="/blog" className={style.breadcrumbBlog}>
								&nbsp;Blog&nbsp;
							</Link>
							&gt;
							<span className={style.breadcrumbTitle}>&nbsp;{post.title}&nbsp;</span>
						</nav>
						<div className={style.content}>
							<h1>{post.title}</h1>
							<div className={style.tags}>
								{post.tags?.map((tag) => (
									<span key={tag} className={style.tag}>
										{tag}
									</span>
								))}
							</div>
							<time className={style.date}>{formatDate(post.date)}</time>
						</div>
					</div>
				</section>
			</div>
			<div className={style.postContent}>
				<section id={style.postDown}>
					<article>
						<div className={style.postStyle} dangerouslySetInnerHTML={{ __html: post.content }} />
					</article>
				</section>
			</div>
		</>
	);
}
