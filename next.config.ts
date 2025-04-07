import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'iph.href.lu',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'ghchart.rshah.org',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'www.gravatar.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
