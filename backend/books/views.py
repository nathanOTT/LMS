from django.shortcuts import render

# Create your views here.
# books/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BorrowTransaction
from .serializers import BorrowTransactionSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import BorrowTransaction
from .serializers import BorrowTransactionSerializer

class BorrowBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Expect the payload to include: isbn, title, author, summary
        isbn = request.data.get('isbn')
        if not isbn:
            return Response({"error": "ISBN is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the book is already borrowed (active transaction)
        if BorrowTransaction.objects.filter(isbn=isbn, returned=False).exists():
            return Response({"error": "This book is currently borrowed."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user  # Get the logged-in user
        title = request.data.get('title')
        author = request.data.get('author')
        summary = request.data.get('summary')

        # Create the borrow transaction
        borrow_transaction = BorrowTransaction.objects.create(
            user=user,
            isbn=isbn,
            title=title,
            author=author,
            summary=summary,
        )

        return Response(BorrowTransactionSerializer(borrow_transaction).data, status=status.HTTP_201_CREATED)



# books/views.py (add another view)
import requests
from rest_framework.views import APIView

class AvailableBooksView(APIView):
    """
    This endpoint fetches books from the Google Books API,
    then filters out any book whose ISBN is currently borrowed.
    """
    def get(self, request, *args, **kwargs):
        # Example query: can adjust query to more limit if needed.
        google_api_url = 'https://www.googleapis.com/books/v1/volumes'
        params = {
            'q': 'subject:fiction',  # or any other query
            'maxResults': 20,
        }
        response = requests.get(google_api_url, params=params)
        data = response.json()

        # Get the list of borrowed ISBNs from our DB:
        borrowed_isbns = BorrowTransaction.objects.filter(returned=False).values_list('isbn', flat=True)

        # Filter out volumes that do not have an ISBN or whose ISBN is borrowed.
        filtered_items = []
        for item in data.get('items', []):
            volume_info = item.get('volumeInfo', {})
            identifiers = volume_info.get('industryIdentifiers', [])
            isbn = None
            # Look for a valid ISBN (you can customize which type you want, e.g., ISBN_13)
            for identifier in identifiers:
                if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                    isbn = identifier.get('identifier')
                    break
            if isbn and isbn not in borrowed_isbns:
                # Attach the isbn for later use.
                volume_info['isbn'] = isbn
                filtered_items.append(item)
        data['items'] = filtered_items
        return Response(data)


# books/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import BorrowTransaction

@api_view(['GET'])
@permission_classes([AllowAny])  # No auth required
def borrowed_isbns(request):
    """
    Returns a list of ISBNs for books that are currently borrowed (returned=False).
    """
    borrowed_list = BorrowTransaction.objects.filter(returned=False).values_list('isbn', flat=True)
    return Response(list(borrowed_list))

# books/views.py

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import BorrowTransaction
from .serializers import BorrowTransactionSerializer

# ...

class MyBooksView(APIView):
    """
    Returns all BorrowTransaction records for the authenticated user.
    The frontend can decide how to categorize them into borrowed/late/returned/all.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = BorrowTransaction.objects.filter(user=user)
        serializer = BorrowTransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReturnBookView(APIView):
    """
    Allows the user to 'return' a borrowed book by setting returned=True.
    Expects a PATCH request to /api/books/mybooks/<pk>/return
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            # Only find a transaction that belongs to the user and is not yet returned
            transaction = BorrowTransaction.objects.get(pk=pk, user=request.user, returned=False)
        except BorrowTransaction.DoesNotExist:
            return Response({"error": "Transaction not found or already returned."}, status=status.HTTP_404_NOT_FOUND)

        # Mark the book as returned
        transaction.returned = True
        transaction.save()
        serializer = BorrowTransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])  # No auth required for borrowed_isbns
def borrowed_isbns(request):
    """
    Returns a list of ISBNs for books that are currently borrowed (returned=False).
    """
    borrowed_list = BorrowTransaction.objects.filter(returned=False).values_list('isbn', flat=True)
    return Response(list(borrowed_list))
