import './global.scss';
import React from 'react';

import Header from '@/app/components/Public/Header';
import Footer from '@/app/components/Public/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh">
			<head>
				<meta charSet="utf-8" />
				<link rel="icon" type="image/svg+xml" href="/logo_light.svg" media="(prefers-color-scheme: light)"></link>
				<link rel="icon" type="image/svg+xml" href="/logo_dark.svg" media="(prefers-color-scheme: dark)"></link>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="Hi there! I'm ichiyo. Welcome to my Homepage." />
				<meta name="author" content="ichiyo" />
				<meta name="keywords" content="ichiyo,ICHIYO,Homepage,Blog,React,JavaScript,TypeScript,Web Development,Web"></meta>

				<title>ichiyo (@1Yie)</title>

				<link rel="stylesheet" href="https://static.zeoseven.com/zsft/189/main/result.css" />
				<link rel="stylesheet" href="https://fonts.font.im/css?family=Ubuntu" />
				<link rel="stylesheet" href="https://fonts.font.im/css?family=Source+Code+Pro:500" />
				<link rel="stylesheet" href="https://static.zeoseven.com/zsft/309/main/result.css" />
				<link rel="stylesheet" href="https://fonts.font.im/css?family=Raleway:400,200,300,100,500,600,700,800,900" />
			</head>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
