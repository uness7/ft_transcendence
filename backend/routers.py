from rest_framework import routers;
from user.viewsets import UserViewSet;
from authentication.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet;


router = routers.SimpleRouter();

# User routes
router.register(r'user', UserViewSet, basename='user');

# Auth routes
router.register(r'authentication/register', RegisterViewSet, basename='auth-register');
router.register(r'authentication/login', LoginViewSet, basename='auth-login');
router.register(r'authentication/refresh', RefreshViewSet, basename='auth-refresh');

urlpatterns = [
        *router.urls,
];



