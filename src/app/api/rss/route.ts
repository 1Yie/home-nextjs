import RSS from 'rss';
import { getPosts } from '../../blog/post';

const BASE_URL = 'https://ichiyo.in';

export async function GET() {
	const feed = new RSS({
		title: `ichiyo's Blog`,
		site_url: BASE_URL,
		feed_url: BASE_URL + '/api/rss',
	});

	const posts = await getPosts();

	posts.forEach((post) => {
		const plainTextContent = post.content.replace(/<[^>]*>?/gm, '');

		const date = new Date(post.date);
		const chinaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000); // UTC+8

		feed.item({
			title: post.title,
			author: 'ichiyo',
			url: `${BASE_URL}/blog/${post.slug}`,
			guid: `${BASE_URL}/blog/${post.slug}`,
			date: chinaTime,
			description: plainTextContent.substring(0, 200) + '...',
		});
	});

	return new Response(feed.xml(), {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}
