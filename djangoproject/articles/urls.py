from django.urls import path
from .views import ArticleListView, CommentListView, FavoriteToggleView, ArticleDetailView

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list-create'),
    path('articles/<int:article_id>/comments/', CommentListView.as_view(), name='comment-list-create'),
    path('articles/<int:article_id>/favorite/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name = 'article-detail')
]
