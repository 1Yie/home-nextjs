'use client';

import { useEffect, useState } from 'react';
import style from './friends.module.scss';
import Image from 'next/image';
import SocialIcon, { Social } from '@/components/Public/SocialIcon';

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
									{friend.social.map((social, idx) => (
										<SocialIcon key={idx} social={social} />
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
