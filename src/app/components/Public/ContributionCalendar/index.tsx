import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './cc.module.scss';

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] as const;

interface Contribution {
	level: number;
	count: number;
	date: number;
}

interface ContributionCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
	contributions?: Contribution[];
	className?: string;
}

const generateEmptyContributions = () => {
	return Array.from({ length: 365 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - i);
		return { level: 0, count: 0, date: date.getTime() };
	}).reverse();
};

function getTooltip(oneDay: Contribution, date: Date): string {
	const dateStr = date.toISOString().split('T')[0];
	return oneDay.count === 0 ? `${dateStr} 没有贡献` : `${dateStr} 有 ${oneDay.count} 次贡献`;
}

function ContributionCalendar({ contributions, className, ...rest }: ContributionCalendarProps) {
	const data = useMemo(() => (contributions?.length ? contributions : generateEmptyContributions()), [contributions]);
	const firstDate = new Date(data[0].date);
	const startRow = firstDate.getDay();
	let total = 0;
	let latestMonth = -1;
	const months: React.ReactElement[] = [];

	const tiles = data.map((c, i) => {
		const date = new Date(c.date);
		total += c.count;
		const month = date.getMonth();
		if (date.getDay() === 0 && month !== latestMonth) {
			latestMonth = month;
			months.push(
				<span className={styles.month} key={`month-${i}`} style={{ gridColumn: 2 + Math.floor((i + startRow) / 7) }}>
					{MONTHS[month]}
				</span>
			);
		}
		return <i className={styles.tile} key={i} data-level={c.level} title={getTooltip(c, date)} />;
	});

	tiles[0] = React.cloneElement(tiles[0], { style: { gridRow: startRow + 1 } });

	return (
		<div {...rest} className={clsx(styles.container, className)}>
			{months}
			<span className={styles.week}>周一</span>
			<span className={styles.week}>周三</span>
			<span className={styles.week}>周五</span>
			<div className={styles.tiles}>{tiles}</div>
			<div className={styles.total}>过去一年共有 {total} 次贡献</div>
			<div className={styles.legend}>
				少
				<i className={styles.tile} data-level={0} />
				<i className={styles.tile} data-level={1} />
				<i className={styles.tile} data-level={2} />
				<i className={styles.tile} data-level={3} />
				<i className={styles.tile} data-level={4} />多
			</div>
		</div>
	);
}

export default React.memo(ContributionCalendar);
