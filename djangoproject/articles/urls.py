from django.urls import path
from .views import ArticleListView, CommentListView, ArticleLikeToggleView, ArticleDetailView, CommentDetailView, CommentLikeToggleView, ArticleRankingView, LikedArticleListView, migrate_view

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list-create'),
    path('articles/<int:article_id>/comments/', CommentListView.as_view(), name='comment-list-create'),
    path('articles/<int:article_id>/like/', ArticleLikeToggleView.as_view(), name='article-like-toggle'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name = 'article-detail'),
    path('articles/<int:article_id>/comments/<int:pk>/', CommentDetailView.as_view(), name = 'comment-detail'),
    path('articles/<int:article_id>/comments/<int:comment_id>/like/', CommentLikeToggleView.as_view(), name = 'comment-like-toggle'),
    path('articles/ranking/', ArticleRankingView.as_view(), name='article-ranking'),
    path('articles/liked/', LikedArticleListView.as_view(), name='liked-article-list'),
    path('run-migrations/', migrate_view)
]
