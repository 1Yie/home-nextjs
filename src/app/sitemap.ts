import { MetadataRoute } from 'next';
import { getPosts } from '@/app/blog/post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://ichiyo.in';

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/links`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		...(await getPosts()).map((post) => ({
			url: `${baseUrl}/blog/${post.slug}`,
			lastModified: new Date(post.date),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		})),
	];
}
