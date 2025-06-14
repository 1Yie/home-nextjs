'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps {
	children: React.ReactNode;
	direction?: 'left' | 'right';
	speed?: 'fast' | 'normal' | 'slow';
	className?: string;
	pauseOnHover?: boolean;
}

const getDuration = (speed: string) => {
	switch (speed) {
		case 'fast':
			return '20s';
		case 'slow':
			return '80s';
		default:
			return '40s';
	}
};

const InfiniteScrollWrapper: React.FC<InfiniteScrollProps> = ({ children, direction = 'left', speed = 'normal', className, pauseOnHover = true }) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!scrollRef.current) return;

		const scroller = scrollRef.current;
		const content = scroller.querySelector('.scroll-content');
		if (!content) return;

		const clone = content.cloneNode(true);
		if (clone) {
			scroller.appendChild(clone);
		}
	}, []);

	return (
		<div
			ref={scrollRef}
			className={cn(
				'overflow-hidden whitespace-nowrap relative',
				'before:absolute before:left-0 before:top-0 before:z-10 before:w-16 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent',
				'after:absolute after:right-0 after:top-0 after:z-10 after:w-16 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent',
				className
			)}
		>
			<div
				className={cn(
					'scroll-content inline-flex',
					'gap-4 px-4 py-2',
					'animate-marquee',
					direction === 'right' && 'animate-marquee-reverse',
					pauseOnHover && 'hover:[animation-play-state:paused]'
				)}
				style={{
					animationDuration: getDuration(speed),
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default InfiniteScrollWrapper;
