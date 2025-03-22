import style from './main.module.scss';

const Links = () => {
	return (
		<>
			<div className={style.tagsContainer}>
				<section id={style.tags}>
					<h1>Tags</h1>
				</section>
			</div>
			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
};

export default Links;
