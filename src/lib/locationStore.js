// store/locationStore.js
import { create } from 'zustand';

const useLocationStore = create((set) => ({
    latitude: '',
    longitude: '',
    mapReference: null,
    addressSearch: '',
    loading: true,
    initialSearchType: 'all',

    fetchLocation: () => {
        set({ loading: true });

        const latitude = sessionStorage.getItem('latitude') || '';
        const longitude = sessionStorage.getItem('longitude') || '';
        const mapReference = sessionStorage.getItem('mapReference') || null;
        const addressSearch = sessionStorage.getItem('addressSearch') || '';

        set({
            latitude,
            longitude,
            mapReference,
            addressSearch,
            loading: false,
        });

        console.log('Values Loaded from sessionStorage');
    },

    setLocation: ({ latitude, longitude, mapReference, addressSearch }) => {
        sessionStorage.setItem('latitude', latitude);
        sessionStorage.setItem('longitude', longitude);
        sessionStorage.setItem('mapReference', mapReference);
        sessionStorage.setItem('addressSearch', addressSearch);

        set({ latitude, longitude, mapReference });
    },

    setInitialSearchType: ({value}) => {
        set({
            initialSearchType : value
        })
    },

}));

export default useLocationStore;
