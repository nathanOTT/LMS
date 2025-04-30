from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import UserGenre

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    genres = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'email',
            'phone',
            'password',
            'confirm_password',
            'genres',
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if len(attrs.get('genres', [])) < 2:
            raise serializers.ValidationError({"genres": "Please select at least 2 genres."})
        
        return attrs

    def create(self, validated_data):
        genres = validated_data.pop('genres')
        validated_data.pop('confirm_password')
        
        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        # Create genre preferences
        for genre in genres:
            UserGenre.objects.create(user=user, genre=genre)
        
        return user


from rest_framework import serializers
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Since USERNAME_FIELD is set to 'email', authenticate() uses email.
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include email and password.")
        
        attrs['user'] = user
        return attrs
