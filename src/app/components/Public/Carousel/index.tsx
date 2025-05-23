'use client';

import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import './Carousel.scss';

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
			className={`slide ${current === index ? 'slide--active' : 'slide--inactive'}`}
			onClick={() => handleSlideClick(index)}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className="slide__image-container"
				style={{
					transform: current === index ? 'translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)' : 'none',
				}}
			>
				<Image
					className="slide__image"
					style={{ opacity: current === index ? 1 : 0.5 }}
					alt={title}
					src={src}
					loading="eager"
					decoding="sync"
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					onLoad={onImageLoad}
				/>
				{current === index && <div className="slide__overlay" />}
			</div>

			<article
				className={`slide__content ${current === index ? 'opacity-100' : 'opacity-0'}`}
				style={{
					visibility: visible ? 'visible' : 'hidden',
				}}
			>
				<h2 className="slide__title">{title}</h2>
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
		<button className={`carousel-control ${type === 'previous' ? 'carousel-control--previous' : ''}`} title={title} onClick={handleClick}>
			<IconArrowNarrowRight size={40} />
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

	const handleImageLoad = useCallback((index: number) => {
		setLoadedImages((prev) => {
			const newLoaded = [...prev];
			newLoaded[index] = true;
			return newLoaded;
		});
	}, []);

	useEffect(() => {
		if (loadedImages.every(Boolean)) {
			setIsLoading(false);
			calculateTransform();
		}
	}, [loadedImages, calculateTransform]);

	useEffect(() => {
		const handleResize = () => {
			if (!isLoading) {
				calculateTransform();
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [calculateTransform, isLoading]);

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
			<div className="loading-spinner">
				<div className="loading-spinner__circle"></div>
			</div>
		);
	}

	return (
		<>
			<div className="carousel" ref={containerRef}>
				<ul
					ref={sliderRef}
					className="carousel__slider"
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

			<div className="carousel__controls">
				<CarouselControl type="previous" title="上一张" handleClick={handlePreviousClick} />
				<CarouselControl type="next" title="下一张" handleClick={handleNextClick} />
			</div>
		</>
	);
}
