from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
import requests ,os

class WeatherByCityTestCase(APITestCase):

    @patch('weather.views.requests.get')
    def test_weather_by_city_success(self, mock_get):
        # --- Arrange ---
        mock_response = {
            'name': 'Douala',
            'main': {'temp': 28, 'humidity': 85, 'pressure': 1012},
            'weather': [{'description': 'ciel dégagé', 'icon': '01d'}],
            'wind': {'speed': 3.6}
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # --- Act ---
        response = self.client.get('/api/weather/city/?city=Douala')

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['ville'], 'Douala')
        self.assertEqual(response.data['temperature'], 28)

    def test_weather_by_city_missing_param(self):
        # --- Arrange ---
        url = '/api/weather/city/'

        # --- Act ---
        response = self.client.get(url)

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class WeatherByCoordinatesTestCase(APITestCase):

    @patch('weather.views.requests.get')
    def test_weather_by_coordinates_success(self, mock_get):
        # --- Arrange ---
        mock_response = {
            'name': 'Yaoundé',
            'main': {'temp': 25, 'humidity': 80, 'pressure': 1010},
            'weather': [{'description': 'pluie légère', 'icon': '10d'}],
            'wind': {'speed': 2.5}
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # --- Act ---
        response = self.client.get('/api/weather/coords/?lat=3.87&lon=11.52')

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['ville'], 'Yaoundé')
        self.assertEqual(response.data['description'], 'pluie légère')

    def test_weather_by_coordinates_missing_params(self):
        # --- Arrange ---
        url = '/api/weather/coords/'

        # --- Act ---
        response = self.client.get(url)

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class WeatherByCityErrorTestCase(APITestCase):

    @patch('weather.views.requests.get')
    def test_weather_by_city_not_found(self, mock_get):
        # --- Arrange ---
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {
            'message': 'city not found'
        }

        # --- Act ---
        response = self.client.get('/api/weather/city/?city=VilleInexistante')

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'city not found')

    @patch('weather.views.requests.get')
    def test_weather_api_connection_error(self, mock_get):
        # --- Arrange ---
        mock_get.side_effect = requests.exceptions.RequestException()

        # --- Act ---
        response = self.client.get('/api/weather/city/?city=Douala')

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)



class WeatherIntegrationTestCase(APITestCase):
    def test_real_api_weather_by_city(self):
        # --- Arrange ---
        api_key = os.getenv('OPENWEATHER_API_KEY')  # ou settings.OPENWEATHER_API_KEY
        if not api_key:
            self.skipTest("Clé API manquante")

        # --- Act ---
        response = self.client.get('/api/weather/city/?city=Yaoundé')

        # --- Assert ---
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('ville', response.data)
        self.assertIn('temperature', response.data)

    def test_real_api_weather_by_coords(self):
        # --- Arrange ---
        response = self.client.get('/api/weather/coords/?lat=3.87&lon=11.52')

        # --- Assert ---
        self.assertIn(response.status_code, [200, 404])  # dépend de l’API météo
        if response.status_code == 200:
            self.assertIn('temperature', response.data)
        else:
            self.assertIn('error', response.data)
