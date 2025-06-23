'use client';

import { useEffect, useState } from 'react';
import style from './projects.module.scss';
import Image from 'next/image';
import ContributionCalendar from '@/app/components/Public/ContributionCalendar';

export interface Contribution {
	level: number;
	count: number;
	date: number;
}

interface Project {
	name: string;
	description: string;
	link: string;
	icon: {
		light: string;
		dark: string;
	};
}

const githubTitle = {
	title: 'GitHub 贡献',
	subtitle: '纸上得来终觉浅，绝知此事要躬行。',
};

const projectTitle = {
	title: '跳转',
	subtitle: '不才明主弃，多病故人疏。',
};

export default function Projects() {
	const [contributions, setContributions] = useState<Contribution[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setIsDarkMode(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
		mediaQuery.addEventListener('change', handler);

		const fetchContributions = async () => {
			try {
				const username = '1Yie';
				const response = await fetch(`api/github?username=${username}`);
				const data = await response.json();
				setContributions(data);
			} catch (error) {
				console.error('Failed to load GitHub contributions:', error);
			}
		};

		const fetchProjects = async () => {
			try {
				const res = await fetch('/data/projects.json');
				const data: Project[] = await res.json();
				setProjects(data);
			} catch (error) {
				console.error('Failed to load projects:', error);
			}
		};

		fetchContributions();
		fetchProjects();

		return () => {
			mediaQuery.removeEventListener('change', handler);
		};
	}, []);

	const getIconPath = (icon: { light: string; dark: string }) => {
		return isDarkMode ? icon.dark : icon.light;
	};

	return (
		<>
			<div className={style.content}>
				<section id={style.contentPanel}>
					<h2>{githubTitle.title}</h2>
					<p>{githubTitle.subtitle}</p>
				</section>
			</div>
			<div className={style.github}>
				<section id={style.contributionSection}>
					<div className={style.chartWrapper}>
						<ContributionCalendar contributions={contributions} className={style.contributionCalendar} />
					</div>
				</section>
			</div>

			<div className={style.intro}>
				<section id={style.introPanel}>
					<h2>{projectTitle.title}</h2>
					<p>{projectTitle.subtitle}</p>
				</section>
			</div>

			<div className={style.projects}>
				<section id={style.container}>
					<ul className={style.projectList}>
						{projects.map((project, index) => (
							<li key={index} className={style.project}>
								<div className={style.logo}>
									<Image src={getIconPath(project.icon)} alt={project.name} width={48} height={48} className={style.icon} />
								</div>
								<a href={project.link} target="_blank" rel="noopener noreferrer" className={style.details} aria-label={`访问项目：${project.name}`}>
									<h3>{project.name}</h3>
									<p>{project.description}</p>
								</a>
								<div className={style.empty}></div>
							</li>
						))}
					</ul>
				</section>
			</div>
		</>
	);
}
