import React from 'react';
import Link from 'next/link';
import style from './tag.module.scss';

interface TagsProps {
	tags: string[];
}

export default function Tags({ tags }: TagsProps) {
	return (
		<div className={style.tags}>
			{tags.map((tag) => (
				<Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className={style.tag}>
					{tag}
				</Link>
			))}
		</div>
	);
}
