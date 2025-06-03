'use client';

import dynamic from 'next/dynamic';

// Disable SSR for ImageCarousel
const ImageCarousel = dynamic(() => import('./ImageCarousel'), {
    ssr: false,
});

export default function ImageCarouselClientWrapper(props) {
    return <ImageCarousel {...props} />;
}
