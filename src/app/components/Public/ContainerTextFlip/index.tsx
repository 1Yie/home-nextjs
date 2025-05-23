'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ContainerTextFlipProps {
	words?: string[];
	interval?: number;
	className?: string;
	textClassName?: string;
	letterClassName?: string;
	animationDuration?: number;
}

export function ContainerTextFlip({
	words = [''],
	interval = 3000,
	className,
	textClassName,
	letterClassName,
	animationDuration = 700,
}: ContainerTextFlipProps) {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, interval);

		return () => clearInterval(intervalId);
	}, [words, interval]);

	return (
		<motion.span
			key={words[currentWordIndex]}
			initial="initial"
			animate="animate"
			transition={{
				duration: animationDuration / 1000,
				ease: 'easeInOut',
			}}
			className={cn(className, textClassName)}
			variants={{
				initial: { opacity: 0, y: 10, filter: 'blur(10px)' },
				animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
			}}
			style={{ display: 'inline-flex' }}
		>
			{words[currentWordIndex].split('').map((letter, index) => (
				<motion.span
					key={index}
					initial={{ opacity: 0, filter: 'blur(4px)' }}
					animate={{ opacity: 1, filter: 'blur(0px)' }}
					transition={{ delay: index * 0.02 }}
					className={cn(letterClassName)}
					style={{ display: 'inline-block' }}
				>
					{letter}
				</motion.span>
			))}
		</motion.span>
	);
}
