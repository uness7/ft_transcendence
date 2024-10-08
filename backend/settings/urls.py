from django.urls import path, include;
from routers import urlpatterns as router_urls;
from django.contrib import admin;
from authentication.views import QRSetup;
from authentication.views import VerifyOTPCode;
from user.views import AnonymizeUser;
from django.conf import settings;
from django.conf.urls.static import static
from user.views import SendRequestView, AcceptRequestView, RemoveFriendView, GetRequestView, GetFriendsListView;


urlpatterns = [
        # Admin
        path('admin/', admin.site.urls),

        # Authentication
        path('api/', include(router_urls)),

        # 2FA
        path('api/v1/get_qr_code/<str:user_id>/', QRSetup.as_view(), name='qr_code'),
        path('api/v1/save_qr_code/<str:user_id>/', QRSetup.as_view(), name='save_qr_code'),
        path('api/v1/verify_otp_code/<str:user_id>/', VerifyOTPCode.as_view(), name='verify_otp_code'),
        path('api/v1/disable_2fa/<str:user_id>/', VerifyOTPCode.as_view(), name='disable_2fa'),
        path('api/v1/display_qr_code/<str:user_id>/', VerifyOTPCode.as_view(), name='display_qr_code'),

        # Anonymize User
        path('api/v1/anonymize_user/<str:user_id>/', AnonymizeUser.as_view(), name='anonymize_user'),
        
        # Friends
        path('api/v1/send_request/<str:user_id>/<str:to_user_id>/', SendRequestView.as_view(), name='send_request'),
        path('api/v1/accept_request/<str:user_id>/<int:request_id>/', AcceptRequestView.as_view(), name='accept_request'),
        path('api/v1/remove_friend/<str:user_id>/<str:to_user_username>/', RemoveFriendView.as_view(), name='remove_friend'),
        path('api/v1/friend_requests/<str:user_id>/', GetRequestView.as_view(), name='requests'),
        path('api/v1/get_friends_list/<str:user_id>/', GetFriendsListView.as_view(), name='requests'),
];

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

