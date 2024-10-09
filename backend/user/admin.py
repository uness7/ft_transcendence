from django.contrib import admin
from .models import User, FriendRequest, MatchHistory;

admin.site.register((MatchHistory));
admin.site.register((User));
admin.site.register((FriendRequest));
