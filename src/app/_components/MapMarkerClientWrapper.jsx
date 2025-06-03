'use client';

import dynamic from 'next/dynamic';

const MapMarker = dynamic(() => import('./MapMarker'), {
    ssr: false,
});

export default function MapMarkerClientWrapper(props) {
    return <MapMarker {...props} />;
}
