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
			</head>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
