'use client';

import dynamic from 'next/dynamic';
import style from './footer.module.scss';

const Icon = dynamic(() => import('@ricons/utils').then((mod) => mod.Icon), {
	ssr: false,
});

const Mail = dynamic(() => import('react-icons/si').then((mod) => mod.SiMaildotru), { ssr: false });
const LogoGithub = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaGithub), { ssr: false });
const LogoX = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaXTwitter), { ssr: false });
const LogoBilibili = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaBilibili), { ssr: false });
const LogoBluesky = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaBluesky), { ssr: false });
const LogoTelegram = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaTelegram), { ssr: false });
const LogoQQ = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaQq), { ssr: false });

const headerName = {
	name: 'ichiyo',
	link: '/',
};

const iconComponents = {
	Github: LogoGithub,
	X: LogoX,
	Mail: Mail,
	Bluesky: LogoBluesky,
	Bilibili: LogoBilibili,
	Telegram: LogoTelegram,
	QQ: LogoQQ,
	Size: '22',
};

const socialLinks = [
	{
		name: 'E-mail',
		link: 'mailto:me@ichiyo.in',
		icon: 'Mail',
	},
	{
		name: 'GitHub',
		link: 'https://github.com/1Yie',
		icon: 'Github',
	},
	{
		name: 'Bilibili',
		link: 'https://space.bilibili.com/35020597',
		icon: 'Bilibili',
	},
	{
		name: 'X',
		link: 'https://x.com/IchiyoNico',
		icon: 'X',
	},
	{
		name: 'Telegram',
		link: 'https://t.me/ichiyo233',
		icon: 'Telegram',
	},
	{
		name: 'Bluesky',
		link: 'https://bsky.app/profile/ichiyo.in',
		icon: 'Bluesky',
	},
];

export default function Footer() {
	return (
		<footer className={style.footer}>
			<section>
				<div className={style.container}>
					<a href={headerName.link} className="HtmlLogo">
						{headerName.name}
					</a>
					<div className={style.copyright}>
						<p>Copyright &copy; {new Date().getFullYear()} ichiyo</p>
					</div>
					<div className={style.sociallinks}>
						{socialLinks.map((link, index) => {
							const IconComponent = iconComponents[link.icon as keyof typeof iconComponents];
							if (!IconComponent) {
								console.warn(`Icon component not found for icon name: ${link.icon}`);
								return null;
							}

							return (
								<a key={index} href={link.link} target="_blank" rel="noopener noreferrer">
									<Icon size={iconComponents.Size}>
										<IconComponent aria-label={link.name} />
									</Icon>
								</a>
							);
						})}
					</div>
				</div>
			</section>
		</footer>
	);
}
