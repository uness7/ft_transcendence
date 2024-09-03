from rest_framework import serializers;
from user.models import User;

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
        fields = [
                    'id',
                    'username', 
                    'first_name', 
                    'last_name', 
                    'is_active', 
                    'created', 
                    'updated'
                ];
        read_only_field = ['is_active'];


