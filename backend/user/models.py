import uuid;

from django.db import models;
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin;
from django.core.exceptions import ObjectDoesNotExist;
from django.db import models;
from django.http import Http404;
from django_otp.plugins.otp_totp.models import TOTPDevice;

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
        #TOTPDevice.objects.create(user=user);
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
    bio = models.TextField(max_length=500, blank=True, null=True, default="A short bio about you.");
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default_avatar.jpg', null=True, blank=True);
    games_played = models.IntegerField(default=0);
    games_won = models.IntegerField(default=0);
    games_lost = models.IntegerField(default=0);
    is_anonymous = models.BooleanField(default=False);
    is_otp_verified = models.BooleanField(default=False);
    friends = models.ManyToManyField('self', symmetrical=False, related_name='friend_set', blank=True);
    # user.friend_set.all() would give you all friends of a user.

    # Data validation
    def clean(self):
        super.clean(); # keeping default data validation
        if self.games_won + self.games_lost > self.games_played:
            raise ValidationError("Games won and lost cannot exceed games played.");

        if not self.first_name or not self.last_name:
            raise ValidationError("First name and last name cannot be empty.");
        
        if not self.username.isalnum():
            raise ValidationError("Username should contain only alphanumeric characters.");

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


class   FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user}"

