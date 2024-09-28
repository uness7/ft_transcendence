from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.conf import settings
from qrcode.image.svg import SvgImage
from io import BytesIO
import uuid
from django.views import View;

@method_decorator(csrf_exempt, name='dispatch')
class QRSetupView(View):
    def post(self, request):
        user_id = request.POST.get('user_id')
        
        try:
            user = User.objects.get(id=user_id)
            if not hasattr(user, 'totpdevice'):
                key = str(uuid.uuid4())
                TOTPDevice.objects.create(
                    user=user,
                    key=key,
                    tolerance=1,
                    t0=0,
                    step=30,
                    drift=0,
                    digits=settings.TOTP_DIGITS,
                    name='default'
                )
            
            otpauth_url = get_otpauth_url(
                    accountname=user.email,
                    issuer=get_current_site(request).name,
                    secret=key,
                    digits=settings.TOTP_DIGITS);

            img = qrcode.make(otpauth_url, image_factory=SvgImage)
            buffer = BytesIO()
            img.save(buffer, format="SVG")
            qr_code_svg = buffer.getvalue().decode('utf-8')
            
            return JsonResponse({
                'status': 'success',
                'qr_code_svg': qr_code_svg,
                'key': key
            })
        except User.DoesNotExist:
            return JsonResponse({'status': 'failure'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class SaveQRCodeKey(View):
    def post(self, request):
        user_id = request.POST.get('user_id')
        key = request.POST.get('key')

        try:
            user = User.objects.get(id=user_id)
            user.totpdevice.key = key
            user.totpdevice.save()
            return JsonResponse({'status': 'success'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'failure'}, status=400)
