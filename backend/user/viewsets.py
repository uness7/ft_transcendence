'''
-----------------------------------------------------------------------------------------
Method                          | URL                           | Result
-----------------------------------------------------------------------------------------
Get                             | /api/user/                    | Lists all the users
-----------------------------------------------------------------------------------------
Get                             | /api/user/user_pk             | Lists a specific user
-----------------------------------------------------------------------------------------
PATCH                           | /api/user/user_pk             | Modifies a specific user
-----------------------------------------------------------------------------------------

'''

from rest_framework.permissions import AllowAny, IsAuthenticated;
from rest_framework import viewsets;
from user.models import User;
from user.serializers import UserSerializer;

class   UserViewSet(viewsets.ModelViewSet):
    http_method_names = (
            'patch', 
            'get'
    );
    permission_classes = (
            IsAuthenticated,
    );
    serializer_class = UserSerializer;

    # This method will get called when /user/ path is hit to get a list of users
    def get_queryset(self):
         if self.request.user.is_superuser:
             return User.objects.all();
         return User.objects.exclude(is_superuser=True);

    # This method will get called when /user/:id path is hit to get one user
    def get_object(self):
        # retrieve the object using the public id from the url kwargs
        obj = User.objects.get_object_by_public_id(self.kwargs['pk']);
        # check the permissions for the retrieved object
        self.check_object_permissions(self.request, obj);
        return obj;
    




