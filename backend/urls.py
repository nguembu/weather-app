from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="API Météo Cameroun",
      default_version='v1',
      description="API météo en temps réel basée sur OpenWeatherMap",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@cameroun-meteo.cm"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('weather.urls')),

    # Swagger et Redoc
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
