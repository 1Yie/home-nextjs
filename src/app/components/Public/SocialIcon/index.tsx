'use client';

import { useState } from 'react';
import Image from 'next/image';
import style from './social.module.scss';

export interface Social {
	name: string;
	link: string;
	icon?: string;
}

export default function SocialIcon({ social }: { social: Social }) {
	const [hasError, setHasError] = useState(false);

	const iconFileName = social.icon ?? `${social.name.toLowerCase()}.png`;
	const iconPath = `/icons/${iconFileName}`;

	if (hasError) {
		return (
			<a href={social.link} target="_blank" rel="noopener noreferrer" className={style.socialLink} aria-label={`${social.name} link`}>
				<span className={style.iconFallback}>{social.name}</span>
			</a>
		);
	}

	return (
		<a href={social.link} target="_blank" rel="noopener noreferrer" className={style.socialLink} aria-label={`${social.name} link`}>
			<Image
				src={iconPath}
				alt={`${social.name} icon`}
				width={24}
				height={24}
				className={style.socialIcon}
				onError={() => {
					console.warn(`Icon failed to load: ${iconPath}`);
					setHasError(true);
				}}
			/>
		</a>
	);
}
