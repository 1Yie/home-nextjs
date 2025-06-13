import style from './main.module.scss';
import NewSplitText from '@/components/Public/NewSplitText';

const About = () => {
	return (
		<>
			<div className={style.aboutContainer}>
				<section id={style.about}>
					<NewSplitText
						as="h1"
						className={style.splitParent}
						text="About"
						delay={100}
						duration={0.6}
						ease="power3.out"
						splitType="words"
						from={{ opacity: 0, y: 40 }}
						to={{ opacity: 1, y: 0 }}
						threshold={0.1}
						rootMargin="-100px"
					/>
					<p>逍遥天地间，心梦随云烟。</p>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
};

export default About;
