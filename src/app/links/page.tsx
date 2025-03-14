import type { Metadata } from 'next';

import Main from '@/components/Layout/Links/Main';
import Friends from '@/components/Layout/Links/Friends';
import Info from '@/components/Layout/Links/Info';

export const metadata: Metadata = {
	title: 'ichiyo | Links',
};

const Links = () => (
	<>
		<Main />
		<Friends />
		<Info />
	</>
);

export default Links;
