from django.db import models

# Create your models here.
# social/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone


class CommunityGroup(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    rules = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class GroupMembership(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(CommunityGroup, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    warnings = models.IntegerField(default=0)  # Track how many warnings a user has
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} in {self.group.name} ({self.role})"


class GroupMessage(models.Model):
    membership = models.ForeignKey(GroupMembership, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message by {self.membership.user.email} in {self.membership.group.name}"


# (Optional) If you want a custom username for chat distinct from the user model
# class UserProfile(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     display_name = models.CharField(max_length=100, blank=True)
#     about = models.TextField(blank=True)
#
#     def __str__(self):
#         return f"{self.display_name} ({self.user.email})"
