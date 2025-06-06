'use client';

import { useEffect } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoom() {
	useEffect(() => {
		const imgs = document.querySelectorAll('img[data-zoom="true"]');
		const readyImages: HTMLImageElement[] = [];

		imgs.forEach((imgElement) => {
			const img = imgElement as HTMLImageElement;

			img.setAttribute('fetchpriority', 'low');
			img.setAttribute('loading', 'lazy');
			img.setAttribute('decoding', 'async');

			if (img.complete && img.naturalWidth !== 0) {
				readyImages.push(img);
			} else {
				img.addEventListener('load', () => {
					mediumZoom(img, { margin: 12 });
				});
			}
		});

		if (readyImages.length > 0) {
			mediumZoom(readyImages, { margin: 12 });
		}
	}, []);

	return null;
}
