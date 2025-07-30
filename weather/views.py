import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# Vue météo par nom de ville
class WeatherByCity(APIView):

    @swagger_auto_schema(
        operation_description="Obtenir la météo actuelle en fonction du nom d'une ville",
        tags=['Météo'],
        manual_parameters=[
            openapi.Parameter(
                'city',
                openapi.IN_QUERY,
                description="Nom de la ville (ex: Douala, Yaoundé)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ]
    )
    def get(self, request):
        city = request.GET.get('city')

        if not city:
            return Response(
                {'error': 'Le paramètre "city" est requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = settings.OPENWEATHER_API_KEY
        url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=fr'

        try:
            response = requests.get(url)
            data = response.json()

            if response.status_code != 200:
                return Response(
                    {'error': data.get('message', 'Erreur lors de la récupération de la météo.')},
                    status=status.HTTP_404_NOT_FOUND
                )

            weather_data = {
                'ville': data['name'],
                'temperature': data['main']['temp'],
                'humidite': data['main']['humidity'],
                'pression': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'icone': data['weather'][0]['icon'],
                'vent': data['wind']['speed']
            }

            return Response(weather_data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException:
            return Response(
                {'error': 'Erreur de connexion à l’API météo.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Vue météo par coordonnées GPS
class WeatherByCoordinates(APIView):

    @swagger_auto_schema(
        operation_description="Obtenir la météo actuelle en fonction des coordonnées GPS",
        tags=['Météo'],
        manual_parameters=[
            openapi.Parameter(
                'lat',
                openapi.IN_QUERY,
                description="Latitude (ex: 4.05 pour Yaoundé)",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'lon',
                openapi.IN_QUERY,
                description="Longitude (ex: 9.7 pour Yaoundé)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ]
    )
    def get(self, request):
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')

        if not lat or not lon:
            return Response(
                {'error': 'Les paramètres "lat" et "lon" sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = settings.OPENWEATHER_API_KEY
        url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=fr'

        try:
            response = requests.get(url)
            data = response.json()

            if response.status_code != 200:
                return Response(
                    {'error': data.get('message', 'Erreur lors de la récupération de la météo.')},
                    status=status.HTTP_404_NOT_FOUND
                )

            weather_data = {
                'ville': data['name'],
                'temperature': data['main']['temp'],
                'humidite': data['main']['humidity'],
                'pression': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'icone': data['weather'][0]['icon'],
                'vent': data['wind']['speed']
            }

            return Response(weather_data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException:
            return Response(
                {'error': 'Erreur de connexion à l’API météo.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
