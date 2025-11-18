import { create } from 'zustand';
import axios from 'axios';

const useWeatherStore = create((set) => ({
  weather: null,
  loading: false,
  error: null,
  city: '',

  setCity: (city) => set({ city }),

  fetchWeather: async (cityName) => {
    set({ loading: true, error: null });
    
    try {
      // Сначала получаем координаты города
      const geocodeResponse = await axios.get(`/api/geocode?city=${encodeURIComponent(cityName)}`);
      const { name, country, lat, lon } = geocodeResponse.data;
      
      // Затем получаем погоду по координатам
      const weatherResponse = await axios.get(
        `/api/weather?lat=${lat}&lon=${lon}&city=${name}, ${country}`
      );
      
      set({ 
        weather: weatherResponse.data, 
        loading: false,
        city: `${name}, ${country}`
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Не удалось получить данные о погоде',
        loading: false,
        weather: null
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useWeatherStore;
