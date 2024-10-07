from django.http import HttpResponse, JsonResponse;
from django.views.generic.base import View;
from django.contrib.auth import get_user_model;
from django.utils.decorators import method_decorator;
from django.core.exceptions import ObjectDoesNotExist;
from django.views.decorators.csrf import csrf_exempt;
from django.shortcuts import get_object_or_404;
from user.models import FriendRequest;

import anon;


User = get_user_model();

@method_decorator(csrf_exempt, name='dispatch')
class AnonymizeUser(View, anon.BaseAnonymizer):

    class Meta:
        model = User;

    # Mission: anonymize user entity
    def patch(self, request, user_id):
        try:
            user = User.objects.get(public_id=user_id);
        except User.ObjectDoesNotExist:
            return JsonResponse({"message": "User Not Found"}, status=400);
        
        # anonymization logic
        user.username = anon.fake_username(max_size=10, separator='')
        user.first_name = anon.fake_word(min_size=5, max_size=20);
        user.last_name = anon.fake_word(min_size=5, max_size=20);
        user.email = anon.fake_email(max_size=40, suffix='@waizi.com')

        user.is_anonymous = True;
        user.save();
        return JsonResponse({
                "message": "User has been anonymized, your password remains unchanged", 
                "note": "You must keep your new email to be able to log in",
                "data update" : {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }
            },
            status=201
        );


@method_decorator(csrf_exempt, name='dispatch')
class SendRequestView(View):
    def post(self, request, user_id, to_user_id):
        try:
            user = User.objects.get(public_id=user_id);
            to_user = User.objects.get(public_id=to_user_id);
        except User.ObjectDoesNotExist:
            return JsonResponse({"message": "User Not Found"}, status=400);
        
        if user != to_user and not user.friends.filter(public_id=to_user.public_id).exists():
            friend_request, created = FriendRequest.objects.get_or_create(from_user=user, to_user=to_user);
            return JsonResponse({
                "message": "Friend request sent.",
                "request_id": friend_request.id,  # Access the ID here
                "created": created
            });
            #return JsonResponse({"message": "Friend request sent."}, status=201);
        else:
            return JsonResponse({"message": "Friend request was already sent or cannot add self."}, status=400);

@method_decorator(csrf_exempt, name='dispatch')
class AcceptRequestView(View):
    def post(self, request, user_id, request_id):
        try:
            user = User.objects.get(public_id=user_id);
            friend_request = FriendRequest.objects.get(id=request_id, to_user=user);
        except User.DoesNotExist:
            return JsonResponse({"message": "User Not Found"}, status=400)
        except FriendRequest.DoesNotExist:
            return JsonResponse({"message": "Friend request not found"}, status=404)
        user.friends.add(friend_request.from_user);
        friend_request.from_user.friends.add(user);
        friend_request.delete();
        return JsonResponse({"message": "Friend request accepted."}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class RemoveFriendView(View):
    def post(self, request, user_id, to_user_username):
        try:
            user = User.objects.get(public_id=user_id);
            friend = User.objects.get(username=to_user_username);
        except User.ObjectDoesNotExist:
            return JsonResponse({"message": "User Not Found"}, status=400);

        if user.friends.filter(public_id=friend.public_id).exists():
            user.friends.remove(friend);
            friend.friends.remove(user);
            user.save();
            return JsonResponse({"message": "Friend was blocked"}, status=200);
        else:
            return JsonResponse({"message": "Friend does not exist."}, status=400)
    
        




