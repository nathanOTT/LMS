from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    # Remove the username field by setting it to None.
    username = None

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=15)

    # Use email as the unique identifier instead of username.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']

    def __str__(self):
        return self.email

class UserGenre(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='genres')
    genre = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.email} - {self.genre}"
