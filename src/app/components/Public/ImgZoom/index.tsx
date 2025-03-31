'use client';

import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoom() {
	useEffect(() => {
		const images = document.querySelectorAll('img[data-zoom="true"]');
		images.forEach((img) => {
			img.setAttribute('fetchpriority', 'low');
			img.setAttribute('loading', 'lazy');
			img.setAttribute('decoding', 'async');
		});
		mediumZoom(images, {
			margin: 12,
		});
	}, []);

	return null;
}
