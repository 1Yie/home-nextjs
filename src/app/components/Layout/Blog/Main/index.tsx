import style from './main.module.scss';

const Post = () => {
	return (
		<>
			<div className={style.blogContainer}>
				<section id={style.blog}>
					<h1>Blog</h1>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
};

export default Post;
