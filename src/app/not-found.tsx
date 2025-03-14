import Link from 'next/link';
import type { Metadata } from 'next';

import style from './not-found.module.scss';

export const metadata: Metadata = {
	title: 'ichiyo | 404',
};

export default function NotFound() {
	return (
		<>
			<div className={style.Error404}>
				<section id={style.error}>
					<h1>404</h1>
					<h2>找不到页面</h2>
					<p>访问的页面不存在</p>
					<Link href="/">返回主页</Link>
				</section>
			</div>
		</>
	);
}
