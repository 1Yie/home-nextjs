import style from './info.module.scss';

const Info = () => {
	return (
		<>
			<div className={style.infoContainer}>
				<section id={style.info}>
					<div className={style.infoContent}>
						<h1>如何加入友链？</h1>
						<ul>
							<li>
								确保<strong>内容活跃</strong>，有足够的阅读量；
							</li>
							<li>
								<strong>不轻易弃坑</strong>，保持存活与互联网之中；
							</li>
							<li>
								确保网页链接为 <strong>HTTPS</strong>；
							</li>
							<li>
								内容要求<strong>不得违反</strong>
								国家法律法规，不涉及政治敏感内容；
							</li>
							<li>
								<em>
									<s>成为我的朋友 ξ( ✿＞◡❛)</s>
								</em>
								；
							</li>
						</ul>
					</div>

					<div className={style.infoContentTip}>
						<h1>
							如果<strong>满足上述条件</strong>，欢迎邮件发送你的友链！
						</h1>
						<p>
							<strong>内容包含：</strong>
							头像、名称、介绍、链接、以及社交账号地址；
						</p>
						<p>
							<strong>
								邮箱地址：<a href="mailto:me@ichiyo.in">me@ichiyo.in</a>
							</strong>
						</p>
						<p>
							<strong>邮箱主题：友链申请</strong>
							，我将在第一时间审核并添加到友链栏目中。
						</p>
					</div>
				</section>
			</div>

			<div className={style.space}>
				<section id={style.spaceConent}></section>
			</div>
		</>
	);
};

export default Info;
