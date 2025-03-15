import { getPosts } from '@/app/blog/post';
import style from './list.module.scss';

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year} 年 ${month} 月 ${day} 日`;
};

export default async function BlogPage() {
	const posts = await getPosts();
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
					</div>
					<div className={style.postsList}>
						{sortedPosts.map((post) => (
							<a key={post.slug} href={`/blog/${post.slug}`} className={style.postLink}>
								<article className={style.postCard}>
									<div className={style.postPanel}>
										<h2>{post.title}</h2>
										<div className={style.postMeta}>
											<time className={style.postDate}>{formatDate(post.date)}</time>
											<div className={style.tags}>
												{post.tags?.map((tag) => (
													<span key={tag} className={style.tag}>
														{tag}
													</span>
												))}
											</div>
										</div>
									</div>
								</article>
							</a>
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
