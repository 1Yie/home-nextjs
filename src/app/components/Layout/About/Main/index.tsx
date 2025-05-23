import style from './main.module.scss';

const About = () => {
	return (
		<>
			<div className={style.aboutContainer}>
				<section id={style.about}>
					<h1>About Me</h1>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
};

export default About;
