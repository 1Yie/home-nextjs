import { MetadataRoute } from 'next';

type Post = {
	slug: string;
	date: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://ichiyo.in';

	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/links`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
	];

	try {
		const apiBase = process.env.NEXT_PUBLIC_API_BASE;
		if (!apiBase) {
			throw new Error('NEXT_PUBLIC_API_BASE is not defined in .env.local');
		}
		const response = await fetch(`${apiBase}/api/posts`, {
			next: { revalidate: 60 },
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const posts: Post[] = await response.json();

		const blogPosts = posts.map((post) => ({
			url: `${baseUrl}/blog/${post.slug}`,
			lastModified: new Date(post.date),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		}));

		return [...staticPages, ...blogPosts];
	} catch (error) {
		console.error('Failed to fetch posts for sitemap:', error);
		return staticPages;
	}
}
