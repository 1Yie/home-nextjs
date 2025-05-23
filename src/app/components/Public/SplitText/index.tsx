import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
	text?: string;
	delay?: number;
	animationFrom?: { opacity: number; transform: string };
	animationTo?: { opacity: number; transform: string };
	easing?: (t: number) => number;
	threshold?: number;
	rootMargin?: string;
	onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
	text = '',
	delay = 100,
	animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
	animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
	easing = (t) => t,
	threshold = 0.1,
	rootMargin = '-100px',
	onLetterAnimationComplete,
}) => {
	const words = text.split(' ').map((w) => w.split(''));
	const letters = words.flat();

	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLSpanElement>(null);
	const animatedCount = useRef(0);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.unobserve(ref.current as Element);
				}
			},
			{ threshold, rootMargin }
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [threshold, rootMargin]);

	const springs = useSprings(
		letters.length,
		letters.map((_, i) => ({
			from: animationFrom,
			to: inView
				? async (next: (to: { opacity: number; transform: string }) => Promise<void>) => {
						await next(animationTo);
						animatedCount.current += 1;
						if (animatedCount.current === letters.length && onLetterAnimationComplete) {
							onLetterAnimationComplete();
						}
					}
				: animationFrom,
			delay: i * delay,
			config: { easing },
		}))
	);

	return (
		<span ref={ref}>
			{words.map((word, wIdx) => (
				<span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
					{word.map((letter, lIdx) => {
						const index = words.slice(0, wIdx).reduce((acc, w) => acc + w.length, 0) + lIdx;
						return (
							<animated.span
								key={index}
								style={{
									...springs[index],
									display: 'inline-block',
									willChange: 'transform, opacity',
								}}
							>
								{letter}
							</animated.span>
						);
					})}
				</span>
			))}
		</span>
	);
};

export default SplitText;
