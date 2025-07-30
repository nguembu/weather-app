import axios from 'axios';

const BASE_URL = '/api/weather/city';

export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/?city=${city}`);
  return response.data;
};

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/coords/?lat=${lat}&lon=${lon}`);
  return response.data;
};


const fetchWeatherByGPS = async () => {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(`/api/weather/coords/?lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données météo par GPS.");
        }

        const data = await response.json();
        console.log("🌍 Météo par GPS :", data);
        // ici tu peux set un state genre setWeather(data)
      } catch (error) {
        console.error("❌ Erreur API:", error);
        alert("Impossible de récupérer la météo par géolocalisation.");
      }
    },
    (error) => {
      console.error("⛔ Erreur de géolocalisation :", error);
      alert("Autorisez la géolocalisation pour utiliser cette fonctionnalité.");
    }
  );
};
