"use client"

import { useState, useEffect } from 'react';
import style from './ta.module.scss';

const TopAnchor = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollY, innerHeight } = window;
            const { scrollHeight } = document.documentElement;
            
            setIsVisible(scrollY > 300 && (scrollY + innerHeight < scrollHeight - 100));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div 
            className={`${style.top} ${isVisible ? style.visible : style.hidden}`} 
            onClick={isVisible ? scrollToTop : undefined}
            aria-hidden={!isVisible}
        >
            <div className={style.triangle} />
        </div>
    );
};

export default TopAnchor;