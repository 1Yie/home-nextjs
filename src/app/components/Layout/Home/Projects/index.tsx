'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import style from './projects.module.scss';

const Icon = dynamic(() => import('@ricons/utils').then((mod) => mod.Icon), {
	ssr: false,
});

const BookOpen = dynamic(() => import('@ricons/fa').then((mod) => mod.BookOpen), { ssr: false });

const Code = dynamic(() => import('@ricons/fa').then((mod) => mod.Code), {
	ssr: false,
});

const CheckCircle = dynamic(() => import('@ricons/fa').then((mod) => mod.CheckCircle), { ssr: false });

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
};

const projects = [
	{
		name: 'ICHIYO STATUS',
		description: '用于检测各种服务的状态',
		link: 'https://status.ichiyo.in/',
		icon: 'Check' as const,
	},
];

export default function Projects() {
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
						<Image
							src="https://ghchart.rshah.org/202020/1Yie"
							alt=""
							width={0}
							height={200}
							style={{
								display: 'block',
								width: '1000px',
								objectFit: 'contain',
								margin: '0 auto',
								transition: 'filter 0.3s ease',
							}}
							priority
						/>
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
