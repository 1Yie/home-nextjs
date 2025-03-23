'use client';

import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoom() {
	useEffect(() => {
		const images = document.querySelectorAll('img[data-zoom="true"]');
		mediumZoom(images, {
			margin: 24,
		});
	}, []);

	return null;
}
