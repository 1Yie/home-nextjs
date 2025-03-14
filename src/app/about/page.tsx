import type { Metadata } from 'next';

import Main from '@/components/Layout/About/Main';
import Content from '@/components/Layout/About/Content';

export const metadata: Metadata = {
	title: 'ichiyo | About',
};

const About = () => (
	<>
		<Main />
		<Content />
	</>
);

export default About;
