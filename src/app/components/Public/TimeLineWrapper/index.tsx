'use client';

import styles from './tw.module.scss';
import Image from 'next/image';
import React from 'react';

interface Props {
	children: React.ReactNode;
	imageSrcList?: string[];
}

const TimeLineWrapper = ({ children, imageSrcList = [] }: Props) => {
	return (
		<div className={styles.timelineCard}>
			{children}

			{imageSrcList.length > 0 && (
				<div className={styles.imagesMasonry}>
					{imageSrcList.map((src, idx) => (
						<div className={styles.imageContainer} key={idx}>
							<Image
								data-zoom
								src={src}
								alt={`timeline-${idx}`}
								width={800}
								height={600}
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: '0px',
									display: 'block',
								}}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TimeLineWrapper;
