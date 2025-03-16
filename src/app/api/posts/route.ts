import { getPosts } from '@/app/blog/post';

export async function GET() {
	const posts = await getPosts();

	const postData = posts.map((post) => ({
		slug: post.slug,
		title: post.title,
		tags: post.tags,
		date: post.date,
		content: `https://ichiyo.in/blog/${post.slug}`,
	}));

	return new Response(JSON.stringify(postData), {
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
