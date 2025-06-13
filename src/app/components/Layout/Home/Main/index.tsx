import style from './main.module.scss';
import { ContainerTextFlip } from '@/components/Public/ContainerTextFlip';
import NewSplitText from '@/components/Public/NewSplitText';

const titles = {
	subtitle: '欢迎访问寒舍',
	words: ['边缘', 'CV战士', 'AI依赖症', '程序猿', 'BUG制造者', '咖啡依赖症', '拖延症晚期', '前端小透明'],
};

const Home = () => {
	return (
		<div className={style.main}>
			<section id={style.container}>
				<div className={style.content}>
					<h1>
						<NewSplitText
							as="span"
							text="存活于二十一世纪互联网"
							delay={30}
							duration={0.6}
							ease="power3.out"
							splitType="chars"
							from={{ opacity: 0, y: 40 }}
							to={{ opacity: 1, y: 0 }}
							threshold={0.1}
							rootMargin="-100px"
						/>
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
