import style from './main.module.scss';
import NewSplitText from '@/components/Public/NewSplitText';

const Links = () => {
	return (
		<>
			<div className={style.linkContainer}>
				<section id={style.links}>
					<NewSplitText
						as="h1"
						className={style.splitParent}
						text="Links / My Friends"
						delay={100}
						duration={0.6}
						ease="power3.out"
						splitType="words"
						from={{ opacity: 0, y: 40 }}
						to={{ opacity: 1, y: 0 }}
						threshold={0.1}
						rootMargin="-100px"
					/>
					<p>江南无所有，聊赠一枝春。</p>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceConent}></section>
			</div>
		</>
	);
};

export default Links;
