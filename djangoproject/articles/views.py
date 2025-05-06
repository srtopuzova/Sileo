from django.shortcuts import render
from rest_framework import generics
from .models import Article, Comment
from .serializers import ArticleSerializer, CommentSerializer

# Create your views here.

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('created_at')
    serializer_class = ArticleSerializer
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, article_id=self.kwargs['article_id'])