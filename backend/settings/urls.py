from django.urls import path, include;
from routers import urlpatterns as router_urls;
from django.contrib import admin;
from two_factor.urls import urlpatterns as tf_urls; # needed for 2FA


urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include(tf_urls)),
        path('api/', include(router_urls)),
]
