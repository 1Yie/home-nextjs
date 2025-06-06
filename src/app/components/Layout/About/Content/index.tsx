'use client';

import { useEffect, useState, JSX } from 'react';

import style from './content.module.scss';
import Gravatar from '@/lib/gravatar';
import { Carousel } from '@/components/Public/Carousel';
import { ScrollVelocity } from '@/components/Public/ScrollVelocity';
import SplitText from '@/components/Public/SplitText';
import { Timeline } from '@/app/components/Public/Timeline';
import TimeLineWrapper from '@/app/components/Public/TimeLineWrapper';

const email = 'me@ichiyo.in';

const TimeLine2025: () => JSX.Element = () => {
	return (
		<>
			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/screenshot-1749195007515.png']}>
				<h1>6 月</h1>
				<h2>6 日</h2>
				<p>更新了时间线</p>
			</TimeLineWrapper>

			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/screenshot-1749195734501.png']}>
				<h1>5 月</h1>
				<h2>28 日</h2>
				<p>更新了图片墙</p>
			</TimeLineWrapper>

			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/screenshot-1749196846967.png']}>
				<h2>24 日</h2>
				<p>更新了 Scroll Velocity 效果</p>
			</TimeLineWrapper>

			<TimeLineWrapper
				imageSrcList={[
					'https://file.ichiyo.in/sakura/images/changelog/screenshot-1749194926507.png',
					'https://file.ichiyo.in/sakura/images/changelog/screenshot-1749197512527.png',
				]}
			>
				<h2>22 日</h2>
				<p>更新了一些文字动画效果</p>
			</TimeLineWrapper>

			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/blog-page.png']}>
				<h1>3 月</h1>
				<h2>17 日</h2>
				<p>更新博客页面</p>
			</TimeLineWrapper>

			<TimeLineWrapper>
				<h2>12 日</h2>
				<p>站点使用 Next.js 重写</p>
			</TimeLineWrapper>

			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/react-home.png']}>
				<h1>2 月</h1>
				<h2>19 日</h2>
				<p>站点从 ingstar.moe 转为 ichiyo.in</p>
			</TimeLineWrapper>
		</>
	);
};

const TimeLine2024: () => JSX.Element = () => {
	return (
		<>
			<TimeLineWrapper imageSrcList={['https://file.ichiyo.in/sakura/images/changelog/screenshot-1749199842467.png']}>
				<h1>12 月</h1>
				<h2>29 日</h2>
				<p>ingStar - 星之进行时</p>
			</TimeLineWrapper>
		</>
	);
};

const timelineData = [
	{
		title: '2025',
		content: <TimeLine2025 />,
	},
	{
		title: '2024',
		content: <TimeLine2024 />,
	},
];

export default function Content() {
	const [slides, setSlides] = useState<{ title: string; src: string }[]>([]);

	useEffect(() => {
		async function fetchSlides() {
			try {
				const res = await fetch('/data/slides.json');
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				const data = await res.json();
				setSlides(data);
			} catch (error) {
				console.error('读取 slides 失败:', error);
			}
		}
		fetchSlides();
	}, []);

	return (
		<>
			<div className={style.contentContainer}>
				<section id={style.content}>
					<div className={style.contentInner}>
						<div className={style.nameIcon}>
							<Gravatar email={email} size={128} className={style.gravatar} />
						</div>
						<span className={style.nameInfo}>
							<h1>
								<SplitText
									text="Ichiyo"
									delay={50}
									animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
									animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
									threshold={0.2}
									rootMargin="-50px"
									easing={(t) => t * t}
								/>
							</h1>
							<p>
								取自罗马音<strong>一葉</strong>（Ichiyō）为名。
							</p>
						</span>

						<h1 className={style.title}>
							关于 <code>ichiyo.in</code>
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
				<div className={style.scrollBanner}>
					<ScrollVelocity
						texts={['Photos Moment', 'Record Life']}
						velocity={40}
						parallaxClassName={style.bannerBg}
						scrollerClassName={style.bannerText}
					/>
				</div>
				<div className={style.intro}>
					<section id={style.carousel}>
						<div className={style.carouselInner}>
							<Carousel slides={slides} />
						</div>
					</section>
				</div>
			</div>

			<div className={style.timelinePanel}>
				<section id={style.timeline}>
					<div className={style.timeTitle}>
						<h1>时间线</h1>
						<p>岁月长河的刻度，历史卷轴的笔触。</p>
					</div>
					<Timeline data={timelineData} />
				</section>
			</div>

			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
}
