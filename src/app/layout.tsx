import './global.scss';
import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Ubuntu_Sans, Source_Code_Pro, Raleway } from 'next/font/google';
import ImageZoom from '@/components/Public/ImgZoom';

import Header from '@/app/components/Public/Header';
import Footer from '@/app/components/Public/Footer';

const ubuntu = Ubuntu_Sans({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
	style: ['normal', 'italic'],
	display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
	subsets: ['latin'],
	weight: ['500'],
	display: 'swap',
});

const raleway = Raleway({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh" className={`${ubuntu.className} ${sourceCodePro.className} ${raleway.className}`}>
			<head>
				<meta charSet="utf-8" />
				<link rel="icon" type="image/svg+xml" href="/logo_light.svg" media="(prefers-color-scheme: light)" />
				<link rel="icon" type="image/svg+xml" href="/logo_dark.svg" media="(prefers-color-scheme: dark)" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="Hi there! I'm ichiyo. Welcome to my Homepage." />
				<meta name="author" content="ichiyo" />
				<meta name="keywords" content="ichiyo,ICHIYO,Homepage,Blog,React,JavaScript,TypeScript,Web Development,Web" />

				<link rel="stylesheet" href="https://fontsapi.zeoseven.com/309/main/result.css" />

				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/github.css" media="(prefers-color-scheme: light)" />
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/github-dark.css" media="(prefers-color-scheme: dark)" />
				<title>ichiyo (@1Yie)</title>
			</head>
			<body>
				<ImageZoom />
				<NextTopLoader
					color="var(--progress-bar-color)"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					zIndex={9999}
					easing="ease"
					speed={200}
					shadow="0 0 10px var(--progress-bar-color),0 0 5px var(--progress-bar-color)"
				/>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
