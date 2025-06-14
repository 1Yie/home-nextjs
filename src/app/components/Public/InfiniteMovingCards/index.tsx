'use client';

import React, { useEffect, useState,  } from 'react';
import Image from 'next/image';
import style from './InfiniteMovingCards.module.scss';

interface FriendCard {
	name: string;
	image: string;
	description: string;
	social: {
		name: string;
		link: string;
		icon: {
			light: string;
			dark: string;
		};
	}[];
	pinned?: boolean;
}

export const InfiniteMovingCards = ({
	items,
	direction = 'left',
	speed = 'fast',
	pauseOnHover = true,
	className,
}: {
	items: FriendCard[];
	direction?: 'left' | 'right';
	speed?: 'fast' | 'normal' | 'slow';
	pauseOnHover?: boolean;
	className?: string;
}) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const scrollerRef = React.useRef<HTMLUListElement>(null);
	const [start, setStart] = useState(false);

	useEffect(() => {
		addAnimation();
	});

	function addAnimation() {
		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);

			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				scrollerRef.current!.appendChild(duplicatedItem);
			});

			getDirection();
			getSpeed();
			setStart(true);
		}
	}

	const getDirection = () => {
		containerRef.current?.style.setProperty('--animation-direction', direction === 'left' ? 'forwards' : 'reverse');
	};

	const getSpeed = () => {
		const duration = speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s';
		containerRef.current?.style.setProperty('--animation-duration', duration);
	};

	return (
		<div ref={containerRef} className={`${style.scroller} ${className ?? ''}`}>
			<ul ref={scrollerRef} className={`${style.scrollerList} ${start ? style.animateScroll : ''} ${pauseOnHover ? style.pauseOnHover : ''}`}>
				{items.map((item) => (
					<li key={item.name} className={style.card}>
						<div className={style.cardContent}>
							<Image src={item.image} alt={item.name} width={80} height={80} className={style.avatarImg} />
							<h4 className={style.name}>{item.name}</h4>
							<p className={style.description}>{item.description}</p>
							<div className={style.socialList}>
								{item.social.map((social) => (
									<a key={social.name} href={social.link} target="_blank" rel="noopener noreferrer" className={style.socialLink}>
										<picture>
											<source srcSet={social.icon.dark} media="(prefers-color-scheme: dark)" />
											<img src={social.icon.light} alt={social.name} className={style.socialIcon} />
										</picture>
									</a>
								))}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
