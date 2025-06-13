'use client';

import React, { useRef, useEffect, forwardRef, ElementType, createElement, HTMLAttributes } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps extends HTMLAttributes<HTMLElement> {
	/**
	 * 要显示并拆分的文本内容
	 * @type {string}
	 */
	text: string;

	/**
	 * 要渲染的 HTML 元素类型（如 'div'、'span' 等）
	 * @type {ElementType}
	 * @default 'span'
	 */
	as?: ElementType;

	/**
	 * 组件的样式类名
	 * @type {string}
	 */
	className?: string;

	/**
	 * 每个子元素（如字符、单词）动画的延迟（单位：毫秒）
	 * @type {number}
	 * @default 100
	 */
	delay?: number;

	/**
	 * 动画持续时间（单位：秒）
	 * @type {number}
	 * @default 0.5
	 */
	duration?: number;

	/**
	 * 缓动函数，可使用 gsap 的字符串（如 'power1.out'）或自定义函数
	 * @type {string | ((t: number) => number)}
	 */
	ease?: string | ((t: number) => number);

	/**
	 * 拆分文本的方式，可按字符、单词、行或组合
	 * @type {'chars' | 'words' | 'lines' | 'words, chars'}
	 * @default 'chars'
	 */
	splitType?: 'chars' | 'words' | 'lines' | 'words, chars';

	/**
	 * 动画的起始属性（GSAP 的 TweenVars）
	 * @type {gsap.TweenVars}
	 */
	from?: gsap.TweenVars;

	/**
	 * 动画的目标属性（GSAP 的 TweenVars）
	 * @type {gsap.TweenVars}
	 */
	to?: gsap.TweenVars;

	/**
	 * Intersection Observer 的触发比例阈值（0~1）
	 * @type {number}
	 * @default 0.25
	 */
	threshold?: number;

	/**
	 * Intersection Observer 的根边距设置
	 * @type {string}
	 * @default '0px 0px -10% 0px'
	 */
	rootMargin?: string;

	/**
	 * 文本对齐方式
	 * @type {React.CSSProperties['textAlign']}
	 */
	textAlign?: React.CSSProperties['textAlign'];

	/**
	 * 所有字母动画完成后的回调函数
	 * @type {() => void}
	 */
	onLetterAnimationComplete?: () => void;
}

const SplitText = forwardRef<HTMLElement, SplitTextProps>(
	(
		{
			text,
			as = 'span',
			className = '',
			delay = 100,
			duration = 0.6,
			ease = 'power3.out',
			splitType = 'chars',
			from = { opacity: 0, y: 40 },
			to = { opacity: 1, y: 0 },
			threshold = 0.1,
			rootMargin = '-100px',
			onLetterAnimationComplete,
			...rest
		},
		refFromParent
	) => {
		const localRef = useRef<HTMLElement>(null);
		const ref = (refFromParent || localRef) as React.RefObject<HTMLElement>;

		useEffect(() => {
			const el = ref.current;
			if (!el) return;

			const absoluteLines = splitType === 'lines';
			if (absoluteLines) el.style.position = 'relative';

			const splitter = new GSAPSplitText(el, {
				type: splitType,
				absolute: absoluteLines,
				linesClass: 'split-line',
			});

			let targets: Element[] = [];
			switch (splitType) {
				case 'lines':
					targets = splitter.lines;
					break;
				case 'words':
					targets = splitter.words;
					break;
				case 'words, chars':
					targets = [...splitter.words, ...splitter.chars];
					break;
				default:
					targets = splitter.chars;
			}

			targets.forEach((t) => {
				(t as HTMLElement).style.willChange = 'transform, opacity';
			});

			const startPct = (1 - threshold) * 100;
			const m = /^(-?\d+)px$/.exec(rootMargin);
			const raw = m ? parseInt(m[1], 10) : 0;
			const sign = raw < 0 ? `-=${Math.abs(raw)}px` : `+=${raw}px`;
			const start = `top ${startPct}%${sign}`;

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: el,
					start,
					toggleActions: 'play none none none',
					once: true,
				},
				smoothChildTiming: true,
				onComplete: onLetterAnimationComplete,
			});

			tl.set(targets, { ...from, immediateRender: false, force3D: true });
			tl.to(targets, {
				...to,
				duration,
				ease,
				stagger: delay / 1000,
				force3D: true,
			});

			return () => {
				tl.kill();
				ScrollTrigger.getAll().forEach((t) => t.kill());
				gsap.killTweensOf(targets);
				splitter.revert();
			};
		}, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete, ref]);

		return createElement(
			as,
			{
				ref,
				className: `split-parent ${className}`,
				style: {
					overflow: 'hidden',
					display: 'inline-block',
					whiteSpace: 'normal',
					wordWrap: 'break-word',
					...(rest.style || {}),
				},
				...rest,
			},
			text
		);
	}
);

SplitText.displayName = 'SplitText';
export default SplitText;
