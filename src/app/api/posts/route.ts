import { getPosts } from '@/app/blog/post';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
	revalidatePath('/sitemap.xml');
	return new Response('OK');
}

export async function GET() {
	const posts = await getPosts();

	const postData = posts.map((post) => ({
		slug: post.slug,
		title: post.title,
		tags: post.tags,
		date: post.date,
		content: `https://ichiyo.in/blog/${post.slug}`,
	}));

	return NextResponse.json(postData);
}
