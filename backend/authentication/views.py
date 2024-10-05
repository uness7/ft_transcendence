from base64 import b32encode;
from binascii import unhexlify;
from io import BytesIO;
from django.http import HttpResponse, JsonResponse;
from django.views.decorators.csrf import csrf_exempt;
from django.views.generic.base import View;
from django_otp.plugins.otp_totp.models import TOTPDevice;
from django_otp.util import random_hex;
from django.utils.module_loading import import_string;
from two_factor.utils import get_otpauth_url, totp_digits;
from django.contrib.sites.shortcuts import get_current_site;
from .serializers import QRCodeSerializer;
from django.contrib.auth import get_user_model;
from django.utils.decorators import method_decorator;
from django.views.decorators.csrf import csrf_exempt;
from django.core.exceptions import MultipleObjectsReturned;
from django.db.models import Count;
import qrcode;
import json;

# Notes for my fellow frontend devs :)
# Endpoints availabe for us in this views file:
#   1. GET /get_qr_code/<str:user_id>/
#   2. POST /save_qr_code/<str:user_id>/
#   3. DELETE /disable_2fa/<str:user_id>/
#   4. POST /verify_otp_code/str:user_id>/

# A user can enable the 2FA by hitting /get_qr_code/<std:user_id>/ endpoint
# Once the qr code is generated and stored in the database, the user should never access the
# following /save_qr_code/<str:user_id>/ endpoint unless he disables 2FA in settings.
# A disable functionaliy is provided hitting /disable_2fa/<str:user_id>/ endpoint

# Fetching User Model
User = get_user_model();

# Methods: ['GET', 'POST']
@method_decorator(csrf_exempt, name='dispatch')
class QRSetup(View):

    # Method: GET
    # Endpoint: /get_qr_code/<str:user_id>
    # Body: None
    # Mission: Generate QR Code and provide secret key
    def get(self, request, user_id, *args, **kwargs):
        default_qr_factory = "qrcode.image.svg.SvgPathImage";
        key = random_hex(20);
        print(f"key is: {key}");
        rawkey = unhexlify(key.encode('ascii'));
        b32key = b32encode(rawkey).decode("utf-8");

        # Get data for QRCode
        image_factory = import_string(default_qr_factory);
        content_type = "image/svg+xml; charset=utf-8";

        # fetch current user
        try:
            user = User.objects.get(public_id=user_id);
            username = user.username;
        except User.DoesNotExist:
            return JsonResponse({'error': 'User was not found!'}, status=404);

        issuer = get_current_site(self.request).name;
        otpauth_url = get_otpauth_url(
                accountname=username,
                issuer=issuer,
                secret=b32key,
                digits=totp_digits()
        );
        # Make the QR Code 
        # Create the QR Code
        img = qrcode.make(otpauth_url, image_factory=image_factory);

        # Create a BytesIO object to save the image
        buffer = BytesIO();
        img.save(buffer);

        import base64;
        qr_code_data = base64.b64encode(buffer.getvalue()).decode();

        # Return JSON with the base64-encoded QR code and username
        return JsonResponse({
            'key': key,
            'username': username,
            'qr_code': qr_code_data,
        });

    # Method: POST
    # endpoint: /save_qr_code/<str:user_id>
    # Body: takes in secret key and its value in json
    # Mission: save the QR Code in the db
    def post(self, request, user_id):

        # fetch current user
        try:
            user = User.objects.get(public_id=user_id);
            username = user.username;
        except User.DoesNotExist:
            return JsonResponse({'error': 'User was not found!'}, status=404);

        try:
            body = json.loads(request.body);
            self.key = body.get("key");
            if not self.key:
                return JsonResponse({'error': 'key is required'}, status=400);
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid Json provided'}, status=400);

        # how to check if the user has already a qr code in the db
        devices = TOTPDevice.objects.filter(user=user)
        # In case the user has already a qr code in the database, he needs to be redirected to 
        #  OTP verification page
        if (devices.exists()):
            return JsonResponse({'error': 'QR code already exists for this user'}, status=400)
        try:
            TOTPDevice.objects.create(
                user=user,
                key=self.key,
                tolerance=1,
                t0=0,
                step=30,
                drift=0,
                digits=6,
                name="default",
            );
            return JsonResponse({'message':'Opeartion was succesfful'}, status=201);
        except Exception as e:
            return JsonResponse({'message':'Opeartion has failed'}, status=400); 

# Methods: ['POST', 'GET']
@method_decorator(csrf_exempt, name='dispatch')
class VerifyOTPCode(View):
    # Method: POST
    # Endpoint: /verify_otp_code/<std:user_id>
    # Body: the top code provided by the auth application
    # mission: verify otp codes
    def post(self, request, user_id):
        try:
            user = User.objects.get(public_id=user_id);
            username = user.username;
        except User.DoesNotExist:
            return JsonResponse({'error': 'User was not found!'}, status=404);

        # Retrieve the TOTPDevice associated with the current user
        try:
            devices = TOTPDevice.objects.get(user=user);
        except TOTPDevice.DoesNotExist:
            return JsonResponse({'error': f'TOTP Device was not found for user with email {user.username}'}, 
                                status=400);
        except MultipleObjectsReturned:
            return JsonResponse({'error': 'Multiple objects were found!'}, status=400);

        # Retrieve the OTP code from the body
        try:
            body = json.loads(request.body);
            user_otp_code = body.get("otp_code");
            if not user_otp_code:
                return JsonResponse({'error': 'otp code is required'}, status=400);
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid Json provided'}, status=400);

        # Verify the OTP code
        if devices.verify_token(user_otp_code):
            user.is_otp_verified = True;
            user.save();
            return JsonResponse({'message': 'Access was granted'}, status=200);
        else:
            return JsonResponse({'error': 'Access was not granted'}, status=400);

    # Method: DELETE
    # Endpoint: /disable_2fa/<str:user_id>
    # Body: None
    # mission: disable two factor
    def delete(self, request, user_id, *args, **kwargs):
        # fetch current user
        try:
            user = User.objects.get(public_id=user_id);
            username = user.username;
        except User.DoesNotExist:
            return JsonResponse({'error': 'User was not found!'}, status=404);

        # check if the user had 2fa setup or not, and delete it if found
        try:
            device = TOTPDevice.objects.get(user=user);
            device.delete();
            return JsonResponse({'message': 'Two Factor authentication disabled'}, status=200);
        except TOTPDevice.DoesNotExist:
            return JsonResponse({'error': 'No active two factor authentication found'}, status=404);
