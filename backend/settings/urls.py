from django.urls import path, include;
from routers import urlpatterns as router_urls;
from django.contrib import admin;
from authentication.views import QRSetupView;
from authentication.views import SaveQRCodeKey;

urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include(router_urls)),
        path("api/v2/qrcode/", QRSetupView.as_view(), name="testOtp"),
        path("api/v2/save_qrcode_key/", SaveQRCodeKey.as_view(), name="saveOtp"),
]
