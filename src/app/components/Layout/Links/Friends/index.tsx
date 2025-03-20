'use client';

import { useEffect, useState } from 'react';
import style from './friends.module.scss';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Icon = dynamic(() => import('@ricons/utils').then((mod) => mod.Icon), {
	ssr: false,
});

const Github = dynamic(() => import('@ricons/fa').then((mod) => mod.Github), {
	ssr: false,
});

const Twitter = dynamic(() => import('@ricons/fa').then((mod) => mod.Twitter), {
	ssr: false,
});

const socialIcons = {
	GitHub: Github,
	Twitter: Twitter,
};

interface Social {
	name: string;
	link: string;
}

interface Friend {
	name: string;
	image: string;
	description: string;
	social: Social[];
}

export default function Friends() {
	const [friendsList, setFriendsList] = useState<Friend[]>([]);

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const res = await fetch('/data/friends.json');
				const data: Friend[] = await res.json();
				setFriendsList(data);
			} catch (error) {
				console.error('Failed to load friends list:', error);
			}
		};
		fetchFriends();
	}, []);

	return (
		<div className={style.friendContainer}>
			<section id={style.friends}>
				<div className={style.friendsList}>
					{friendsList.map((friend, index) => (
						<div key={index} className={`${style.friendsItem} ${index % 2 === 0 ? style.leftAlign : style.rightAlign}`}>
							<Image src={friend.image} alt={friend.name} className={style.friendImg} width={150} height={150} priority />
							<div className={style.friendInfo}>
								<h3 className={style.friendName}>{friend.name}</h3>
								<p className={style.friendDescription}>{friend.description}</p>
								<div className={style.social}>
									{friend.social.map((social, idx) => {
										const IconComponent = socialIcons[social.name as keyof typeof socialIcons];

										if (!IconComponent) {
											console.warn(`Icon component not found for social name: ${social.name}`);
											return null;
										}

										return (
											<a key={idx} href={social.link} target="_blank" rel="noopener noreferrer">
												<Icon size="24">
													<IconComponent aria-label={`Link to ${social.name} of ${friend.name}`} />
												</Icon>
											</a>
										);
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
