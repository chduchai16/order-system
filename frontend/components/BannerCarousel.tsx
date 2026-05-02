'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/lib/utils/types';

interface BannerCarouselProps {
    banners?: Banner[];
}

const defaultBanners: Banner[] = [
    {
        id: '1',
        title: 'Special Offer',
        subtitle: 'SAVE UP TO 50%',
        discount: 50,
        image: 'linear-gradient(135deg, #FF6B6B, #FFB366)',
    },
    {
        id: '2',
        title: 'Summer Collection',
        subtitle: 'NEW ARRIVALS',
        discount: 30,
        image: 'linear-gradient(135deg, #FF8C94, #FFB6C1)',
    },
    {
        id: '3',
        title: 'Flash Sale',
        subtitle: 'LIMITED TIME',
        discount: 40,
        image: 'linear-gradient(135deg, #A8D8EA, #AA96DA)',
    },
];

export default function BannerCarousel({ banners = defaultBanners }: BannerCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
        setIsAutoPlay(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
        setIsAutoPlay(false);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlay(false);
    };

    return (
        <div className="relative bg-gradient-to-r from-pink-400 to-orange-300 rounded-2xl overflow-hidden mb-12">
            {/* Slides */}
            <div className="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            background: typeof banner.image === 'string' && banner.image.includes('gradient')
                                ? banner.image
                                : `url(${banner.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                            {banner.discount && (
                                <div className="text-white mb-4">
                                    <div className="text-sm md:text-base font-semibold">#{banner.title}</div>
                                </div>
                            )}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-center px-4">
                                {banner.subtitle}
                            </h2>
                            {banner.discount && (
                                <div className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    {banner.discount}%
                                </div>
                            )}
                            <button className="px-6 md:px-8 py-2 md:py-3 bg-white text-red-500 font-bold rounded-md hover:bg-gray-100 transition-colors text-sm md:text-base">
                                MUA NGAY
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-all z-10"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-all z-10"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
