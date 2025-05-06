from django.shortcuts import render
from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer

# Create your views here.

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
