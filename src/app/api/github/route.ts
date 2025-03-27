import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const user = searchParams.get('username');

	if (!user) {
		return new Response(JSON.stringify({ error: 'Invalid or missing username' }), { status: 400 });
	}

	try {
		const url = `https://github.com/users/${user}/contributions`;
		const html = await (await fetch(url)).text();

		const tooltips = html.matchAll(/>(\w+) contributions? on \w+ \w+/g);
		const cells = html.matchAll(/data-date="(\d+-\d+-\d+)" .*? data-level="(\d+)"/g);
		const contributions: { level: number; date: number; count: number }[] = [];

		for (const [, count] of tooltips) {
			const cell = cells.next().value;
			if (!cell) break;
			const [, date, level] = cell;
			contributions.push({
				level: parseInt(level, 10),
				date: new Date(date).getTime(),
				count: parseInt(count, 10) || 0,
			});
		}

		contributions.sort((a, b) => a.date - b.date);
		return new Response(JSON.stringify(contributions), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		console.error('An error occurred while fetching GitHub contributions:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch GitHub contributions' }), { status: 500 });
	}
}
