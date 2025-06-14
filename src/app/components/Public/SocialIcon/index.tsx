'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import style from './social.module.scss';

export interface Social {
	name: string;
	link: string;
	icon?: string | { light: string; dark: string };
}

export default function SocialIcon({ social, className = '', iconClassName = '' }: { social: Social; className?: string; iconClassName?: string }) {
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
			return `/icons/${social.name.toLowerCase()}${isDarkMode ? '-dark' : ''}.svg`;
		}
		if (typeof social.icon === 'string') {
			return isFullUrl(social.icon) ? social.icon : `/icons/${social.icon}`;
		}
		const iconPath = isDarkMode ? social.icon.dark : social.icon.light;
		return isFullUrl(iconPath) ? iconPath : `/icons/${iconPath}`;
	};

	return (
		<a href={social.link} target="_blank" rel="noopener noreferrer" className={`${style.socialLink} ${className}`} aria-label={`${social.name} link`}>
			<div className={style.iconWrapper}>
				<Image
					src={getIconPath()}
					alt={`${social.name} icon`}
					fill
					className={`${style.socialIcon} ${iconClassName}`}
					style={{ objectFit: 'contain' }}
					onError={() => {
						console.warn(`Icon failed to load: ${getIconPath()}`);
						setHasError(true);
					}}
				/>
			</div>
		</a>
	);
}
