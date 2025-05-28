'use client';

import { useEffect, useState } from 'react';
import style from './content.module.scss';
import Gravatar from '@/lib/gravatar';
import { Carousel } from '@/components/Public/Carousel';
import { ScrollVelocity } from '@/components/Public/ScrollVelocity';
import SplitText from '@/components/Public/SplitText';

const email = 'me@ichiyo.in';

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

			<div className={style.space}>
				<section id={style.spaceContent}></section>
			</div>
		</>
	);
}
