"use client"

import { useState, useEffect } from 'react';
import style from './ta.module.scss';

const TopAnchor = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            const shouldShow = scrollY > 300 && (scrollY + windowHeight < documentHeight - 100);
            
            setIsVisible(shouldShow);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div 
            className={`${style.top} ${isVisible ? style.visible : ''}`} 
            onClick={scrollToTop}
            aria-label="返回顶部"
        >
            <div className={style.triangle}></div>
        </div>
    );
};

export default TopAnchor;