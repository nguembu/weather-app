from django.db import models


class WeatherRequest(models.Model):
    city = models.CharField(max_length=100)
    requested_at = models.DateTimeField(auto_now_add=True)
