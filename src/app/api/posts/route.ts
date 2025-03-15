import { getPosts } from '@/app/blog/post';

export async function GET() {
	// 获取所有文章数据
	const posts = await getPosts();

	// 提取所有文章的 slug
	const slugs = posts.map((post) => post.slug);

	// 返回 slugs 列表
	return new Response(JSON.stringify(slugs), {
		headers: {
			'Content-Type': 'application/json', // 返回 JSON 格式
		},
	});
}
