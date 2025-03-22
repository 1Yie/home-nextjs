import type { Metadata } from 'next';

import Main from '@/components/Layout/Tags/Main';
import TagList from '@/components/Layout/Tags/TagList';

export const metadata: Metadata = {
	title: 'ichiyo | Tags',
};

const Tags = () => (
	<>
		<Main />
		<TagList />
	</>
);

export default Tags;
