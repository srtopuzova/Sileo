from rest_framework import generics, status, views, filters
from .permissions import IsAuthorOrReadOnly
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Article, Comment, Favorite
from .serializers import ArticleSerializer, CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

# Create your views here.

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-updated_at')
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'content', 'user__username']
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, article_id=self.kwargs['article_id'])

class FavoriteToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, article=article)
        if not created:
            favorite.delete()
            return Response({"detail": "Unfavorited"}, status=status.HTTP_200_OK)
        return Response({"detail": "Favorited"}, status=status.HTTP_201_CREATED)

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthorOrReadOnly]

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]