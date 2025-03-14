import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'iph.href.lu',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
