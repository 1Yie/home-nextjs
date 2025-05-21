'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import style from './social.module.scss';

export interface Social {
	name: string;
	link: string;
	icon?: string | { light: string; dark: string };
}

export default function SocialIcon({ social }: { social: Social }) {
	const [, setHasError] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, []);

	const isFullUrl = (str: string) => /^https?:\/\//.test(str);

	const getIconPath = () => {
		if (!social.icon) {
			// 没传 icon，默认本地 /icons/ 目录 + 深色后缀
			return `/icons/${social.name.toLowerCase()}${isDarkMode ? '-dark' : ''}.svg`;
		}

		if (typeof social.icon === 'string') {
			// 字符串，如果是完整 url，直接用；否则拼本地路径
			return isFullUrl(social.icon) ? social.icon : `/icons/${social.icon}`;
		}

		// icon 是对象，light 和 dark 可能是完整 url，也可能是相对路径
		const iconPath = isDarkMode ? social.icon.dark : social.icon.light;
		return isFullUrl(iconPath) ? iconPath : `/icons/${iconPath}`;
	};

	return (
		<a href={social.link} target="_blank" rel="noopener noreferrer" className={style.socialLink} aria-label={`${social.name} link`}>
			<Image
				src={getIconPath()}
				alt={`${social.name} icon`}
				width={24}
				height={24}
				className={style.socialIcon}
				onError={() => {
					console.warn(`Icon failed to load: ${getIconPath()}`);
					setHasError(true);
				}}
			/>
		</a>
	);
}
