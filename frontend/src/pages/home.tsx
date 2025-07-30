import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface WeatherData {
  ville: string;
  temperature: number;
  humidite: number;
  pression: number;
  description: string;
  icone: string;
  vent: number;
}

function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('weather-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!weather) return;
    const desc = weather.description.toLowerCase();
    if (desc.includes('pluie')) {
      setBackgroundUrl('https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1920&q=80');
    } else if (desc.includes('nuage') || desc.includes('couvert')) {
      setBackgroundUrl('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1920&q=80');
    } else if (desc.includes('orage')) {
      setBackgroundUrl('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80');
    } else if (desc.includes('neige')) {
      setBackgroundUrl('https://images.unsplash.com/photo-1608889175600-205b5ccdb318?auto=format&fit=crop&w=1920&q=80');
    } else {
      setBackgroundUrl('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80');
    }
  }, [weather]);

  const updateHistory = (cityName: string) => {
    let newHistory = [cityName, ...history.filter((c) => c.toLowerCase() !== cityName.toLowerCase())];
    newHistory = newHistory.slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weather-history', JSON.stringify(newHistory));
  };

  const removeFromHistory = (cityName: string) => {
    const newHistory = history.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    setHistory(newHistory);
    localStorage.setItem('weather-history', JSON.stringify(newHistory));
  };

  const fetchWeatherByCity = async (ville?: string) => {
    const targetCity = ville || city;
    if (!targetCity) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/weather/city/?city=${targetCity}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setWeather(data);
      updateHistory(targetCity);
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByGPS = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/weather/coords/?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
          setWeather(data);
          updateHistory(data.ville);
        } catch (err: any) {
          setError(err.message);
          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Impossible de récupérer la position.');
        setLoading(false);
      }
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 transition-all duration-700 ease-in-out"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">🌦️ Météo en Direct</h1>

        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon icon="mdi:map-marker" />
          </span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Entrez une ville"
            className="w-full pl-10 pr-4 py-3 text-lg rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
        </div>

        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => fetchWeatherByCity()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
          <button
            onClick={fetchWeatherByGPS}
            className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition"
            title="Utiliser ma position"
          >
            <Icon icon="mdi:crosshairs-gps" className="text-xl" />
          </button>
        </div>

        {history.length > 0 && (
          <div className="mb-4 text-left">
            <h2 className="text-sm text-gray-500 mb-1">Villes récentes :</h2>
            <div className="flex flex-wrap gap-2">
              {history.map((h, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-full text-gray-700 cursor-pointer"
                >
                  <button
                    onClick={() => fetchWeatherByCity(h)}
                    className="mr-2 focus:outline-none"
                    aria-label={`Rechercher la météo pour ${h}`}
                  >
                    {h}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(h);
                    }}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Supprimer ${h} de l'historique`}
                  >
                    <Icon icon="mdi:close-circle" className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="mt-2 text-blue-700 animate-pulse">Chargement...</p>}
        {error && <p className="mt-2 text-red-600">{error}</p>}

        {weather && (
          <div className="mt-6 grid grid-cols-1 gap-6 text-gray-900">
            <div className="text-4xl font-bold text-blue-900">{weather.ville}</div>

            <div className="flex items-center gap-4 bg-blue-100/80 rounded-lg p-4 text-5xl font-semibold text-blue-700 shadow-md">
              <Icon icon="mdi:thermometer" className="text-blue-600 text-6xl" />
              <span>{weather.temperature}°C</span>
            </div>

            <div className="flex items-center gap-4 bg-cyan-100/80 rounded-lg p-4 text-3xl font-semibold text-cyan-700 shadow-md">
              <Icon icon="mdi:water-percent" className="text-cyan-600 text-4xl" />
              <span>{weather.humidite}% humidité</span>
            </div>

            <div className="flex items-center gap-4 bg-indigo-100/80 rounded-lg p-4 text-3xl font-semibold text-indigo-700 shadow-md">
              <Icon icon="mdi:gauge" className="text-indigo-600 text-4xl" />
              <span>{weather.pression} hPa</span>
            </div>

            <div className="flex items-center gap-4 bg-yellow-100/80 rounded-lg p-4 text-3xl font-semibold text-yellow-700 shadow-md">
              <Icon icon="mdi:weather-windy" className="text-yellow-600 text-4xl" />
              <span>{weather.vent} m/s</span>
            </div>

            <div className="flex flex-col items-center mt-6">
              <img
                src={`http://openweathermap.org/img/wn/${weather.icone}@2x.png`}
                alt="icone météo"
                className="h-28 w-28"
              />
              <p className="mt-2 text-2xl italic text-blue-800 font-medium">{weather.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
