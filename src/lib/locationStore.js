// store/locationStore.js
import { create } from 'zustand';

const useLocationStore = create((set) => ({
    latitude: '',
    longitude: '',
    mapReference: null,
    loading: true,

    fetchLocation: () => {
        set({ loading: true });

        const latitude = sessionStorage.getItem('latitude') || '';
        const longitude = sessionStorage.getItem('longitude') || '';
        const mapReference = sessionStorage.getItem('mapReference') || null;

        set({
            latitude,
            longitude,
            mapReference,
            loading: false,
        });

        console.log('Values Loaded from sessionStorage');
    },

    setLocation: ({ latitude, longitude, mapReference }) => {
        sessionStorage.setItem('latitude', latitude);
        sessionStorage.setItem('longitude', longitude);
        sessionStorage.setItem('mapReference', mapReference);

        set({ latitude, longitude, mapReference });
    },
}));

export default useLocationStore;
