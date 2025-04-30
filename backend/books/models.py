from django.db import models

# Create your models here.
# books/models.py
import random
from datetime import timedelta
from django.db import models
from django.utils import timezone
from django.conf import settings

class BorrowTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='borrow_transactions')
    isbn = models.CharField(max_length=100)
    title = models.CharField(max_length=300)
    author = models.CharField(max_length=300, blank=True)
    summary = models.TextField(blank=True)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField()
    returned = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Set a random return date between 3 to 10 days after now if not provided.
        if not self.return_date:
            days = random.randint(3, 10)
            self.return_date = timezone.now() + timedelta(days=days)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.isbn}) - {self.user.email}"
