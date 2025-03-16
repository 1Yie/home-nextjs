'use client';
import style from './comment.module.scss';
import { useEffect, useRef } from 'react';
import Artalk from 'artalk';

export default function Comments() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const artalk = new Artalk({
			el: containerRef.current,
			pageKey: window.location.pathname,
			pageTitle: document.title,
			server: process.env.NEXT_PUBLIC_ARTALK_SERVER,
			site: 'blog-artalk',
			darkMode: 'auto',
			flatMode: 'auto',
		});

		return () => {
			artalk.destroy();
		};
	}, []);

	return (
		<>
			<div className={style.commentPanel}>
				<section className={style.comment} ref={containerRef}></section>
			</div>
		</>
	);
}
