import { useEffect, useState, useCallback } from "react";
import { apiClient } from "./apiClient";

export function useLocation() {
     const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
     const [mapReference, setMapReference] = useState(null);
     const [loading, setLoading] = useState(true);

    const fetchLocation = useCallback(async () => {
        setLoading(true);
        setLatitude(sessionStorage.getItem('latitude'));
        setLongitude(sessionStorage.getItem('longitude'));
        setMapReference(sessionStorage.getItem('mapReference'));
        console.log('Values Loaded');
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    return { latitude, longitude, mapReference, loading, refreshLocation: fetchLocation };
}
