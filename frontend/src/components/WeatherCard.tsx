import * as React from 'react';


interface WeatherProps {
  ville: string;
  temperature: number;
  humidite: number;
  pression: number;
  description: string;
  icone: string;
  vent: number;
}

const WeatherCard: React.FC<WeatherProps> = (props) => {
  return (
    <div className="weather-card">
      <h2>Météo à {props.ville}</h2>
      <p>{props.description}</p>
      <img src={`https://openweathermap.org/img/wn/${props.icone}@2x.png`} alt={props.description} />
      <p>Température: {props.temperature}°C</p>
      <p>Humidité: {props.humidite}%</p>
      <p>Pression: {props.pression} hPa</p>
      <p>Vent: {props.vent} m/s</p>
    </div>
  );
};

export default WeatherCard;
