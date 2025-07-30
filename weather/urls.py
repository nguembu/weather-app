from django.urls import path
from .views import WeatherByCity, WeatherByCoordinates

urlpatterns = [
    path('weather/city/', WeatherByCity.as_view(), name='weather_by_city'),
    path('weather/coords/', WeatherByCoordinates.as_view(), name='weather_by_coords'),
]
