from rest_framework import serializers;
from user.models import User;
import re;

'''
NOTES: 
    - The Meta class is used to define model-level metadata. 
    - This metadata includes options like database table names, ordering of query results, unique constraints, and verbose names, among others.
'''

class   UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex');
    created = serializers.DateTimeField(read_only=True);
    updated = serializers.DateTimeField(read_only=True);

    class   Meta:
        model = User;
        fields = ['id', 'username', 'first_name', 'last_name', 'is_active', 'is_otp_verified', 'bio', 'friends',
                  'avatar', 'created', 'updated', 'games_played', 'games_won', 'games_lost'];
        read_only_field = ['is_active'];

    def validate_username(self, value):
        if not value.isalnum():
            raise serializers.ValidationError("Username must only contain alphanumeric character");
        return value;

    def validate_first_name(self, value):
        if not re.match("^[A-Za-z'-]+$", value):
            raise serializers.ValidationError("No digits or special characters are allowed!");
        return value;

    def validate_last_name(self, value):
        if not re.match("^[A-Za-z'-]+$", value):
            raise serializers.ValidationError("No digits or special characters are allowed!");
        return value;

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use!");
        return value;
