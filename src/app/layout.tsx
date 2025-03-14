import '@/app/global.scss';
import React from 'react';

import Header from '@/app/components/Pubilc/Header';
import Footer from '@/app/components/Pubilc/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo.svg" />

				<link rel="stylesheet" href="https://static.zeoseven.com/zsft/189/main/result.css" />
				<link rel="stylesheet" href="https://fonts.font.im/css?family=Ubuntu" />
				<link rel="stylesheet" href="https://fonts.font.im/css?family=Source+Code+Pro:500" />
				<link rel="stylesheet" href="https://static.zeoseven.com/zsft/309/main/result.css" />
			</head>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
