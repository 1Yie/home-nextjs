'use client';

import { useState, useRef, useEffect } from 'react';
import style from './header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const headerName = {
	name: 'ichiyo',
	link: '/',
};

const headerList = [
	{
		name: 'Home',
		link: '/',
	},
	{
		name: 'Blog',
		link: '/blog',
	},
	{
		name: 'About',
		link: '/about',
	},
	{
		name: 'Links',
		link: '/links',
	},
];

const Icon = dynamic(() => import('@ricons/utils').then((mod) => mod.Icon), {
	ssr: false,
});

const MenuSharp = dynamic(() => import('@ricons/ionicons5').then((mod) => mod.MenuSharp), { ssr: false });

const Header = () => {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLElement>(null);
	const buttonRef = useRef<HTMLAnchorElement>(null);

	const isActiveLink = (link: string) => {
		if (link === '/blog') {
			// 匹配 /blog 或 /blog/[slug]
			return pathname === '/blog' || /^\/blog\/[^/]+$/.test(pathname);
		}
		return pathname === link;
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				buttonRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className={style.header}>
			<section>
				<div className={style.headerContainer}>
					<Link href={headerName.link} className="HtmlLogo">
						{headerName.name}
					</Link>

					<a ref={buttonRef} className={style.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation" role="button">
						<Icon size="26">
							<MenuSharp />
						</Icon>
					</a>

					<nav ref={menuRef} className={`${style.nav} ${isMenuOpen ? style.navActive : ''}`}>
						<ul className={style.navList}>
							{headerList.map((item, index) => (
								<li key={index}>
									<Link href={item.link} className={isActiveLink(item.link) ? style.active : ''} onClick={() => setIsMenuOpen(false)}>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</section>
		</header>
	);
};

export default Header;
