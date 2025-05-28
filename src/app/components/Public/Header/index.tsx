'use client';

import { useState, useEffect, useRef } from 'react';
import style from './header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const headerName = {
	name: 'ichiyo',
	link: '/',
};

const headerList = [
	{ name: 'Home', link: '/' },
	{ name: 'Blog', link: '/blog' },
	{ name: 'About', link: '/about' },
	{ name: 'Links', link: '/links' },
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
	const scrollY = useRef(0);

	const isActiveLink = (link: string) => pathname === link;

	// 禁止滚动逻辑
	useEffect(() => {
		if (isMenuOpen) {
			scrollY.current = window.scrollY;
			window.scrollTo({ top: 0, behavior: 'smooth' });

			document.body.style.position = 'fixed';
			document.body.style.top = '0';
			document.body.style.left = '0';
			document.body.style.right = '0';
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.overflow = '';
		};
	}, [isMenuOpen]);

	// 点击外部关闭菜单
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
			<section id={style.headerPanel}>
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
				<div className={`${style.blurOverlay} ${isMenuOpen ? style.active : ''}`} onClick={() => setIsMenuOpen(false)} />
			</section>
		</header>
	);
};

export default Header;
