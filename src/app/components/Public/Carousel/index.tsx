'use client';

import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface SlideData {
	title: string;
	src: string;
}

interface SlideProps {
	slide: SlideData;
	index: number;
	current: number;
	handleSlideClick: (index: number) => void;
	onImageLoad: () => void;
}

const Slide = ({ slide, index, current, handleSlideClick, onImageLoad }: SlideProps) => {
	const slideRef = useRef<HTMLLIElement>(null);
	const xRef = useRef(0);
	const yRef = useRef(0);
	const frameRef = useRef<number>(0);
	const [visible, setVisible] = useState(current === index);

	useEffect(() => {
		const animate = () => {
			if (!slideRef.current) return;
			slideRef.current.style.setProperty('--x', `${xRef.current}px`);
			slideRef.current.style.setProperty('--y', `${yRef.current}px`);
			frameRef.current = requestAnimationFrame(animate);
		};
		frameRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frameRef.current);
	}, []);

	useEffect(() => {
		if (current === index) {
			setVisible(true);
		} else {
			const timeout = setTimeout(() => setVisible(false), 500);
			return () => clearTimeout(timeout);
		}
	}, [current, index]);

	const handleMouseMove = (event: React.MouseEvent) => {
		const el = slideRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		xRef.current = event.clientX - (r.left + r.width / 2);
		yRef.current = event.clientY - (r.top + r.height / 2);
	};

	const handleMouseLeave = () => {
		xRef.current = 0;
		yRef.current = 0;
	};

	const { src, title } = slide;

	return (
		<li
			ref={slideRef}
			className="flex flex-col items-center justify-center relative text-center text-white"
			style={{
				width: '70vmin',
				height: '70vmin',
				margin: '0 4vmin',
				zIndex: current === index ? 10 : 1,
				cursor: current === index ? 'default' : 'pointer',
				transform: current !== index ? 'rotateX(15deg) scale(0.96)' : 'rotateX(0deg) scale(1)',
				transformStyle: 'preserve-3d',
				transformOrigin: 'bottom center',
				transition: 'transform 0.5s ease',
			}}
			onClick={() => handleSlideClick(index)}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
				style={{
					transform: current === index ? 'translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)' : 'none',
				}}
			>
				<Image
					className="absolute inset-0 w-[120%] h-[120%] object-cover transition-opacity duration-600 ease-in-out"
					style={{ opacity: current === index ? 1 : 0.5 }}
					alt={title}
					src={src}
					loading="eager"
					decoding="sync"
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					onLoad={onImageLoad}
				/>
				{current === index && <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />}
			</div>

			<article
				className={`relative p-[4vmin] transition-opacity duration-500 ease-in-out ${current === index ? 'opacity-100' : 'opacity-0'}`}
				style={{
					visibility: visible ? 'visible' : 'hidden',
				}}
			>
				<h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">{title}</h2>
			</article>
		</li>
	);
};

interface CarouselControlProps {
	type: 'previous' | 'next';
	title: string;
	handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
	return (
		<button
			className={`w-14 h-14 flex items-center justify-center
        border-3 border-transparent rounded-full
        focus:outline-none
        hover:-translate-y-0.5 active:translate-y-0.5
        transition duration-200
        ${type === 'previous' ? 'rotate-180' : ''}`}
			title={title}
			onClick={handleClick}
			style={{
				backgroundColor: 'var(--bg-border-color)',
				borderColor: 'transparent',
				color: 'var(--fill-color)',
			}}
			onFocus={(e) => {
				e.currentTarget.style.borderColor = 'var(--border-color)';
			}}
			onBlur={(e) => {
				e.currentTarget.style.borderColor = 'transparent';
			}}
		>
			<IconArrowNarrowRight size={32} />
		</button>
	);
};

interface CarouselProps {
	slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
	const [current, setCurrent] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(slides.length).fill(false));
	const containerRef = useRef<HTMLDivElement>(null);
	const sliderRef = useRef<HTMLUListElement>(null);
	const [transformValue, setTransformValue] = useState('translateX(0)');

	// 计算居中偏移
	const calculateTransform = useCallback(() => {
		if (!containerRef.current || !sliderRef.current) return;
		const container = containerRef.current;
		const slideElements = sliderRef.current.querySelectorAll('li');
		if (!slideElements.length) return;

		const slide = slideElements[current];
		const containerRect = container.getBoundingClientRect();
		const offset = containerRect.width / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
		setTransformValue(`translateX(${offset}px)`);
	}, [current]);

	// 处理图片加载完成
	const handleImageLoad = useCallback((index: number) => {
		setLoadedImages((prev) => {
			const newLoaded = [...prev];
			newLoaded[index] = true;
			return newLoaded;
		});
	}, []);

	// 检查所有图片是否加载完成
	useEffect(() => {
		if (loadedImages.every(Boolean)) {
			setIsLoading(false);
			calculateTransform();
		}
	}, [loadedImages, calculateTransform]);

	// 窗口尺寸变化时重新计算
	useEffect(() => {
		const handleResize = () => {
			if (!isLoading) {
				calculateTransform();
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [calculateTransform, isLoading]);

	// 切换当前项时，计算位置
	useEffect(() => {
		if (!isLoading) {
			calculateTransform();
		}
	}, [current, calculateTransform, isLoading]);

	const handlePreviousClick = () => {
		setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
	};

	const handleNextClick = () => {
		setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
	};

	const handleSlideClick = (index: number) => {
		if (current !== index) {
			setCurrent(index);
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<>
			<div
				className="w-full h-full overflow-hidden relative"
				ref={containerRef}
				style={{ perspective: '1000px', perspectiveOrigin: 'center bottom' }}
			>
				<ul
					ref={sliderRef}
					className="flex transition-transform duration-1000 ease-in-out"
					style={{
						width: `${slides.length * 100}%`,
						transform: transformValue,
					}}
				>
					{slides.map((slide, index) => (
						<Slide
							key={index}
							slide={slide}
							index={index}
							current={current}
							handleSlideClick={handleSlideClick}
							onImageLoad={() => handleImageLoad(index)}
						/>
					))}
				</ul>
			</div>

			<div className="flex justify-center mt-6" style={{ gap: '12px' }}>
				<CarouselControl type="previous" title="上一张" handleClick={handlePreviousClick} />
				<CarouselControl type="next" title="下一张" handleClick={handleNextClick} />
			</div>
		</>
	);
}
