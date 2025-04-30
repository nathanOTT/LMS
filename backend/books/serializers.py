# books/serializers.py
from rest_framework import serializers
from .models import BorrowTransaction

class BorrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ['id', 'isbn', 'title', 'author', 'summary', 'borrow_date', 'return_date', 'returned']
        read_only_fields = ['user', 'borrow_date', 'return_date', 'returned']
