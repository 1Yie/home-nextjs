'use client';

import { useEffect, useState } from 'react';
import style from './friends.module.scss';
import Image from 'next/image';
import SocialIcon, { Social } from '@/components/Public/SocialIcon';
import { InfiniteMovingCards } from '@/components/Public/InfiniteMovingCards';
import FadeContent from '@/app/components/Public/FadeContent';

interface Friend {
	name: string;
	image: string;
	description: string;
	social: Social[];
	pinned?: boolean;
}

export default function Friends() {
	const [pinnedFriends, setPinnedFriends] = useState<Friend[]>([]);
	const [otherFriends, setOtherFriends] = useState<Friend[]>([]);

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const res = await fetch('/data/friends.json');
				const data: Friend[] = await res.json();

				setPinnedFriends(data.filter((friend) => friend.pinned));
				setOtherFriends(data.filter((friend) => !friend.pinned));
			} catch (error) {
				console.error('Failed to load friends list:', error);
			}
		};

		fetchFriends();
	}, []);

	const renderPinnedFriendList = (list: Friend[]) => (
		<div className={style.friendsList}>
			{list.map((friend, index) => (
				<div key={index} className={`${style.friendsItem} ${index % 2 === 0 ? style.leftAlign : style.rightAlign}`}>
					<Image src={friend.image} alt={friend.name} className={style.friendImg} width={150} height={150} priority />
					<div className={style.friendInfo}>
						<h3 className={style.friendName}>{friend.name}</h3>
						<p className={style.friendDescription}>{friend.description}</p>
						<div className={style.social}>
							{friend.social.map((social, idx) => (
								<SocialIcon key={idx} social={social} className={style.socialIcon}/>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);

	const renderOtherFriendList = (list: Friend[]) => {
		const safeList = list
			.map((item) => ({
				...item,
				social: item.social
					.filter((s) => typeof s.icon === 'object' && s.icon !== null && 'light' in s.icon && 'dark' in s.icon)
					.map((s) => ({
						...s,
						icon: s.icon as { light: string; dark: string },
					})),
			}))
			.filter((item) => item.social.length > 0);

		return <InfiniteMovingCards items={safeList} direction="left" speed="normal" pauseOnHover className="my-4" />;
	};

	return (
		<>
			<div className={style.pinnedFriendsTitle}>
				<section id={style.pinnedTitle}>
					<h1>
						<FadeContent blur={true} duration={500}>
							Respected
						</FadeContent>
					</h1>
				</section>
			</div>
			<div className={style.pinnedFriends}>
				<section id={style.pinFriends}>{pinnedFriends.length > 0 && <>{renderPinnedFriendList(pinnedFriends)}</>}</section>
			</div>

			<div className={style.unpinnedFriendsTitle}>
				<section id={style.unpinnedTitle}>
					<h1>
						<FadeContent blur={true} duration={500}>
							Precious
						</FadeContent>
					</h1>
				</section>
			</div>

			{otherFriends.length > 0 && (
				<div className={style.unPinnedFriends}>
					<section id={style.unPinFriends}>{renderOtherFriendList(otherFriends)}</section>
				</div>
			)}
		</>
	);
}
