import style from './main.module.scss';
import NewSplitText from '@/components/Public/NewSplitText';

const Post = () => {
	return (
		<>
			<div className={style.blogContainer}>
				<section id={style.blog}>
					<NewSplitText
						as="h1"
						className={style.splitParent}
						text="Blog"
						delay={100}
						duration={0.6}
						ease="power3.out"
						splitType="words"
						from={{ opacity: 0, y: 40 }}
						to={{ opacity: 1, y: 0 }}
						threshold={0.1}
						rootMargin="-100px"
					/>
					<p>岁吟事，墨记笺。</p>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
};

export default Post;
