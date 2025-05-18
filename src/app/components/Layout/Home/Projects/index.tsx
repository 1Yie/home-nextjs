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
						{projects.map((project, index) => (
							<a
								key={index}
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className={style.project}
								aria-label={`访问项目：${project.name}`}
							>
								<div className={style.logo}>
									<Image src={getIconPath(project.icon)} alt={project.name} width={48} height={48} className={style.icon} />
								</div>
								<div className={style.details}>
									<h3>{project.name}</h3>
									<p>{project.description}</p>
								</div>
								<div className={style.empty}></div>
							</a>
						))}
					</ul>
				</section>
			</div>
		</>
	);
}
