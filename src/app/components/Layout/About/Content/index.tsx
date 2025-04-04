import style from './content.module.scss';

export default function Content() {
	return (
		<>
			<div className={style.contentContainer}>
				<section id={style.content}>
					<div className={style.contentInner}>
						<span className={style.nameInfo}>
							<h1>ichiyo</h1>
							<p>
								取自罗马音<strong>一葉</strong>（Ichiyō）为名。
							</p>
						</span>

						<h1 className={style.title}>
							关于 <code>ichiyo.in</code>{' '}
						</h1>
						<p className={style.styleFrom}>
							网站样式灵感来自于{' '}
							<a href="https://voidzero.dev/" target="_blank" rel="noopener noreferrer">
								VoidZero
							</a>{' '}
							简单的几何线条构造。
						</p>
					</div>
				</section>
			</div>

			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
}
