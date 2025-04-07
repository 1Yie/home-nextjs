import Image from 'next/image';
import md5 from 'md5';

interface GravatarProps {
	email: string;
	size?: number;
	className?: string;
}

export function Gravatar({ email, size = 128, className = '' }: GravatarProps) {
	const hash = md5(email.trim().toLowerCase());
	const url = `https://gravatar.com/avatar/${hash}?s=${size}&d=identicon`;

	return <Image unoptimized src={url} alt={`${email}'s avatar`} width={size} height={size} className={`rounded-full ${className}`} />;
}

export default Gravatar;
