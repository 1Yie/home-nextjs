'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import styles from './timeline.module.scss';

interface TimelineEntry {
	title: string;
	content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
	const ref = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new ResizeObserver(([entry]) => {
			setHeight(entry.contentRect.height);
		});

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start 10%', 'end 50%'],
	});

	const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
	const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

	return (
		<div ref={containerRef} className={styles.container}>
			<div ref={ref} className={styles.timelineContainer}>
				{data.map((item, index) => (
					<div key={index} className={styles.timelineEntry}>
						<div className={styles.leftSection}>
							<div className={styles.dotContainer}>
								<div className={styles.dot} />
							</div>
							<div className={styles.titleLarge}>
								<h3>{item.title}</h3>
							</div>
						</div>

						<div className={styles.rightSection}>
							{/* <h3 className={styles.titleSmall}>{item.title}</h3> */}
							{item.content}
						</div>
					</div>
				))}
				<div style={{ height: `${height}px` }} className={styles.lineBackground}>
					<motion.div
						style={{
							height: heightTransform,
							opacity: opacityTransform,
						}}
						className={styles.lineProgress}
					/>
				</div>
			</div>
		</div>
	);
};
