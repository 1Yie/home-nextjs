'use client';

import dynamic from 'next/dynamic';
import style from './projects.module.scss';
import React, { useState, useEffect } from 'react';
import ContributionCalendar from '@/app/components/Public/ContributionCalendar';

export interface Contribution {
	level: number;
	count: number;
	date: number;
}

const Icon = dynamic(() => import('@ricons/utils').then((mod) => mod.Icon), {
	ssr: false,
});

const BookOpen = dynamic(() => import('@ricons/fa').then((mod) => mod.BookOpen), { ssr: false });

const Code = dynamic(() => import('@ricons/fa').then((mod) => mod.Code), {
	ssr: false,
});

const CheckCircle = dynamic(() => import('@ricons/fa').then((mod) => mod.CheckCircle), { ssr: false });
const CalendarCheck = dynamic(() => import('@ricons/fa').then((mod) => mod.CalendarCheck), { ssr: false });

const githubTitle = {
	title: 'GitHub 贡献',
};

const projectTitle = {
	title: '跳转',
	subtitle: '不才明主弃，多病故人疏。',
};

const iconComponents = {
	Blog: BookOpen,
	Code: Code,
	Check: CheckCircle,
	CalendarCheck: CalendarCheck,
};

const projects = [
	{
		name: '今天你做到了吗？',
		description: '由 Reflex 开发，一个简单的在线打卡工具',
		link: 'https://check.ichiyo.in/',
		icon: 'CalendarCheck' as const,
	},
	{
		name: 'ICHIYO STATUS',
		description: '用于检测各种服务的状态',
		link: 'https://status.ichiyo.in/',
		icon: 'Check' as const,
	},
];

export default function Projects() {
	const [contributions, setContributions] = useState<Contribution[]>([]);

	useEffect(() => {
		const fetchContributions = async () => {
			const username = '1Yie';
			const response = await fetch(`api/github?username=${username}`);
			const data = await response.json();
			setContributions(data);
		};

		fetchContributions();
	}, []);

	return (
		<>
			<div className={style.github}>
				<section id={style.contributionSection}>
					<div className={style.content}>
						<div className={style.intro}>
							<h2>{githubTitle.title}</h2>
						</div>
					</div>
					<div className={style.chartWrapper}>
						<ContributionCalendar contributions={contributions} className={style.contributionCalendar} />
					</div>
				</section>
			</div>

			<div className={style.projects}>
				<section id={style.container}>
					<div className={style.intro}>
						<h2>{projectTitle.title}</h2>
						<p>{projectTitle.subtitle}</p>
					</div>

					<ul className={style.projectList}>
						{projects.map((project, index) => {
							const IconComponent = iconComponents[project.icon];

							if (!IconComponent) {
								console.warn(`Icon component not found for icon name: ${project.icon}`);
								return null;
							}

							return (
								<a
									key={index}
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className={style.project}
									aria-label={`访问项目：${project.name}`}
								>
									<div className={style.logo}>
										<Icon size="48">
											<IconComponent aria-hidden="true" />
										</Icon>
									</div>
									<div className={style.details}>
										<h3>{project.name}</h3>
										<p>{project.description}</p>
									</div>
									<div className={style.empty}></div>
								</a>
							);
						})}
					</ul>
				</section>
			</div>
		</>
	);
}
