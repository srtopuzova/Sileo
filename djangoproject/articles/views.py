from django.shortcuts import render
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Article, Comment, Favorite
from .serializers import ArticleSerializer, CommentSerializer, FavoriteSerializer

# Create your views here.

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, article_id=self.kwargs['article_id'])

class FavoriteToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        article = Article.objects.get(pk=article_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, article=article)
        if not created:
            favorite.delete()
            return Response({"detail": "Unfavorited"}, status=status.HTTP_200_OK)
        return Response({"detail": "Favorited"}, status=status.HTTP_201_CREATED)