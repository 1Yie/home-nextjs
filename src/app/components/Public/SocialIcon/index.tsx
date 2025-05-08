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

	const getIconPath = () => {
		if (!social.icon) {
			return `/icons/${social.name.toLowerCase()}${isDarkMode ? '-dark' : ''}.svg`;
		}

		if (typeof social.icon === 'string') {
			return `/icons/${social.icon}`;
		}

		return `/icons/${isDarkMode ? social.icon.dark : social.icon.light}`;
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
