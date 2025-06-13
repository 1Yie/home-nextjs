'use client';

import { useEffect, useState, JSX } from 'react';
import style from './content.module.scss';
import Gravatar from '@/lib/gravatar';
import { Carousel } from '@/components/Public/Carousel';
// import { ScrollVelocity } from '@/components/Public/ScrollVelocity';
import SplitText from '@/components/Public/SplitText';
import { Timeline } from '@/app/components/Public/Timeline';
import TimeLineWrapper from '@/app/components/Public/TimeLineWrapper';
import FadeContent from '@/app/components/Public/FadeContent';

import Beams from '@/app/components/Public/Beams';

const email = 'me@ichiyo.in';

interface TimelineItem {
	date: string;
	title: string;
	images: string[];
}

interface TimelineYear {
	year: string;
	items: TimelineItem[];
}

interface TimelineDataItem {
	title: string;
	content: JSX.Element;
}

const renderTimelineFromJson = (data: TimelineYear[]): TimelineDataItem[] => {
	return data.map((yearItem) => {
		let lastFullDate = ''; // 记录上一次渲染的“完整日期”，如 '6月13日'

		return {
			title: yearItem.year,
			content: (
				<>
					{yearItem.items.map((item, index) => {
						const match = item.date.match(/^(\d+)月(\d+)日$/);
						const month = match?.[1] || '';
						const day = match?.[2] || '';
						const fullDate = `${month}月${day}日`;

						const showDate = fullDate !== lastFullDate;
						if (showDate) {
							lastFullDate = fullDate;
						}

						return (
							<TimeLineWrapper key={index} imageSrcList={item.images}>
								{showDate && (
									<>
										<h1>{`${month} 月`}</h1>
										<h2>{`${day} 日`}</h2>
									</>
								)}
								<p>{item.title}</p>
							</TimeLineWrapper>
						);
					})}
				</>
			),
		};
	});
};



export default function Content() {
	const [slides, setSlides] = useState<{ title: string; src: string }[]>([]);
	const [timelineData, setTimelineData] = useState<{ title: string; content: JSX.Element }[]>([]);
	const [timelineLoading, setTimelineLoading] = useState(true);
	const [timelineError, setTimelineError] = useState(false);

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

	useEffect(() => {
		async function fetchTimeline() {
			try {
				const res = await fetch('/data/timeline.json');
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				const data = await res.json();
				const rendered = renderTimelineFromJson(data);
				setTimelineData(rendered);
				setTimelineError(false);
			} catch (error) {
				console.error('读取 timeline 失败:', error);
				setTimelineError(true);
			} finally {
				setTimelineLoading(false);
			}
		}
		fetchTimeline();
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

				{/* <div className={style.scrollBanner}>
					<ScrollVelocity
						texts={['Photos Moment', 'Record Life']}
						velocity={40}
						parallaxClassName={style.bannerBg}
						scrollerClassName={style.bannerText}
					/>
				</div> */}

				<div className={style.intro}>
					<div className={style.carouselInner}>
						<Carousel slides={slides} />
					</div>
				</div>
			</div>

			<div className={style.timelinePanel}>
				<section id={style.timeline}>
					<div className={style.timeTitle}>
						<h1>时间线</h1>
						<p>岁月长河的刻度，历史卷轴的笔触。</p>
					</div>
					{timelineLoading ? (
						<div className={style.loading}>
							<p>欲系数据少驻，加载去</p>
						</div>
					) : timelineError ? (
						<div className={style.error}>
							<p>数据寻它千百度，请稍后重试</p>
						</div>
					) : (
						<Timeline data={timelineData} />
					)}
				</section>
			</div>

			<div className={style.space}>
				<Beams beamWidth={3} beamHeight={30} beamNumber={15} lightColor="#ffffff" speed={2} noiseIntensity={1.75} scale={0.2} rotation={130}>
					<div className={style.beamsTextPanel}>
						<FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
							<div className={style.beamsText}>
								<h1>结束了？</h1>
								<p>正在寻找新的开始，</p>
								<p>也是在和旧日时光告别。</p>
								<br />
								<p>那些未说完的话、没走完的路，</p>
								<p>悄然沉入回忆的深海。</p>
								<br />
								<p>夜色终将褪去，</p>
								<p>而晨光，总会如期而至。</p>
								<p>不要害怕孤独，</p>
								<p>那是灵魂重启的序曲。</p>
								<br />
								<p>路还很长，</p>
								<p>风也终会为你指引方向。</p>
							</div>
						</FadeContent>
					</div>
				</Beams>
			</div>
		</>
	);
}
