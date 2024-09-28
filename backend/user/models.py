import uuid;

from django.db import models;
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin;
from django.core.exceptions import ObjectDoesNotExist;
from django.db import models;
from django.http import Http404;

class   UserManager(BaseUserManager):

    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id);
            return instance;
        except (ObjectDoesNotExist, ValueError, TypeError):
            raise Http404;

    def create_user(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError('Users must have a username');
        if email is None:
            raise TypeError('User must have an email address');
        if password is None:
            raise TypeError('User must have a valid password');
        user = self.model(username=username, email=self.normalize_email(email), **kwargs);
        user.set_password(password);
        user.save(using=self._db);
        return user;

    def create_superuser(self, username, email, password, **kwargs):
        if password is None:
            raise typeerror('superusers must have a password.');
        if email is None:
            raise TypeError('Superuser must have an email address');
        if username is None:
            raise TypeError('Superuser must have a username');
        user = self.create_user(username, email, password, **kwargs);
        user.is_superuser = True;
        user.is_staff = True;
        user.save(using=self._db);
        return user;


class   User(AbstractBaseUser, PermissionsMixin):
    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4, editable=False);
    username = models.CharField(db_index=True, max_length=255, unique=True);
    first_name = models.CharField(max_length=255);
    last_name = models.CharField(max_length=255);
    email = models.EmailField(db_index=True, unique=True);
    is_active = models.BooleanField(default=True);
    is_superuser = models.BooleanField(default=False);
    is_staff = models.BooleanField(default=False);
    created = models.DateTimeField(auto_now=True);
    updated = models.DateTimeField(auto_now_add=True);
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True); # optional
    games_played = models.IntegerField(default=0);
    games_won = models.IntegerField(default=0);
    games_lost = models.IntegerField(default=0);

    @property
    def win_rate(self):
        if self.games_played == 0:
            return 0
        return (self.games_won / self.games_played) * 100

    USERNAME_FIELD = 'email';
    REQUIRED_FIELDS = ['username'];

    objects = UserManager();

    def __str__(self):
        return f"{self.email}";

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

class UserQRCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE);
    qr_code_key = models.CharField(max_length=40);
    created_at = models.DateTimeField(auto_now_add=True);
    updated_at = models.DateTimeField(auto_now=True);

    def save(self, *args, **kwargs):
        if not self.pk:
            self.qr_code_key = str(uuid.uuid4());
        super().save(*args, **kwargs);

    def __str__(self):
        return f"QR Code for {self.user.email}"
