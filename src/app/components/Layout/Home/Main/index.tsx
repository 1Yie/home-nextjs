import style from './main.module.scss';
import { ContainerTextFlip } from '@/components/Public/ContainerTextFlip';

const titles = {
	subtitle: '欢迎访问寒舍',
	words: ['CV战士', 'AI依赖症', '程序猿', 'BUG制造者', '键盘侠', '咖啡依赖症', '拖延症晚期', '栈溢出患者', '前端小透明'],
};

const Home = () => {
	return (
		<div className={style.main}>
			<section id={style.container}>
				<div className={style.content}>
					<h1>
						<span>存活于二十一世纪互联网</span>
						<span className={style.br}>の</span>
						<span>
							<ContainerTextFlip words={titles.words} interval={5000} animationDuration={900} />
						</span>
					</h1>
					<p>{titles.subtitle}</p>
				</div>
			</section>
		</div>
	);
};

export default Home;
