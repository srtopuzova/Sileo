from django_filters import rest_framework as filters
from django.utils.timezone import make_aware
from rest_framework import generics, status, views
from .permissions import IsAuthorOrReadOnly
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Article, Comment, CommentLike, ArticleLike
from .serializers import ArticleSerializer, CommentSerializer, LikedArticleSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404
from datetime import datetime, time
from django.db.models import Count, Max
#adding this so i can populate the db when i deploy
from django.http import HttpResponse
from django.core.management import call_command

def migrate_view(request):
    call_command('migrate')
    return HttpResponse("Migrations done.")

# Create your views here.

class ArticleFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="updated_at", lookup_expr='gte', required=False, label='Updated after or on:')
    end_date = filters.DateFilter(field_name="updated_at", method='filter_end_date', required=False, label='Updated before or on:')
    category = filters.ChoiceFilter(choices = Article.Category.choices, required=False, label='Category:')

    class Meta:
        model = Article
        fields = ['start_date', 'end_date', 'category']
    
    def filter_end_date(self, queryset, name, value):
        end_of_day = datetime.combine(value, time.max)
        end_of_day = make_aware(end_of_day)
        return queryset.filter(updated_at__lte=end_of_day)

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-updated_at')
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ArticleFilter
    search_fields = ['title', 'content', 'user__username']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, article_id=self.kwargs['article_id'])
    
    def get_serializer_context(self):
        return {'request': self.request}

class ArticleLikeToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        like, created = ArticleLike.objects.get_or_create(user=request.user, article=article)
        if not created:
            like.delete()
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        return Response({"detail": "Liked"}, status=status.HTTP_201_CREATED)

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

class CommentLikeToggleView(views.APIView) :
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id, article_id):
        comment = get_object_or_404(Comment, pk=comment_id, article_id=article_id)
        like, created = CommentLike.objects.get_or_create(user=request.user, comment=comment)
        if not created:
            like.delete()
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        return Response({"detail": "Liked"}, status=status.HTTP_201_CREATED)

class ArticleRankingView(generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        return Article.objects.annotate(likes_count=Count('likes')).order_by('-likes_count', '-updated_at')

class LikedArticleListView(generics.ListAPIView):
    serializer_class = LikedArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Article.objects
            .filter(likes__user=self.request.user)
            .annotate(liked_at=Max('likes__created_at'))
            .order_by('-liked_at')
        )