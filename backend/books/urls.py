# books/urls.py
from django.urls import path
from .views import (
    BorrowBookView,
    AvailableBooksView,
    borrowed_isbns,
    MyBooksView,
    ReturnBookView,
)

urlpatterns = [
    path('borrow/', BorrowBookView.as_view(), name='borrow-book'),
    path('available/', AvailableBooksView.as_view(), name='available-books'),
    path('borrowed-isbns/', borrowed_isbns, name='borrowed-isbns'),

    # New endpoints
    path('mybooks/', MyBooksView.as_view(), name='my-books'),                      # GET -> fetch all user's borrowed transactions
    path('mybooks/<int:pk>/return', ReturnBookView.as_view(), name='return-book'), # PATCH -> return a borrowed book
]
