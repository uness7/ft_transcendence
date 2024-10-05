from django.urls import path, include;
from routers import urlpatterns as router_urls;
from django.contrib import admin;
from authentication.views import QRSetup;
from authentication.views import VerifyOTPCode;

urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include(router_urls)),
        path('api/v1/get_qr_code/<str:user_id>/', QRSetup.as_view(), name='qr_code'),
        path('api/v1/save_qr_code/<str:user_id>/', QRSetup.as_view(), name='save_qr_code'),
        path('api/v1/verify_otp_code/<str:user_id>/', VerifyOTPCode.as_view(), name='verify_otp_code'),
        path('api/v1/disable_2fa/<str:user_id>/', VerifyOTPCode.as_view(), name='disable_2fa'),
        path('api/v1/display_qr_code/<str:user_id>/', VerifyOTPCode.as_view(), name='display_qr_code'),

];
