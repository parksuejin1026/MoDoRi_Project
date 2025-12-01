'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // content-area 클래스를 가진 요소의 스크롤을 감지해야 함
            const contentArea = document.querySelector('.content-area');
            if (contentArea && contentArea.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.addEventListener('scroll', toggleVisibility);
        }

        return () => {
            if (contentArea) {
                contentArea.removeEventListener('scroll', toggleVisibility);
            }
        };
    }, []);

    const scrollToTop = () => {
        const contentArea = document.querySelector('.content-area');
        contentArea?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="absolute bottom-24 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-90 z-40 animate-in fade-in slide-in-from-bottom-4"
            aria-label="맨 위로 스크롤"
        >
            <ArrowUp size={20} />
        </button>
    );
}
