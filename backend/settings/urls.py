from django.urls import path, include;
from routers import urlpatterns as router_urls

urlpatterns = [
    path('api/', include(router_urls)),
]
