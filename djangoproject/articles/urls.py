from django.urls import path
from .views import ArticleListView, CommentListView, FavoriteToggleView, ArticleDetailView, CommentDetailView, CommentLikeToggleView

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list-create'),
    path('articles/<int:article_id>/comments/', CommentListView.as_view(), name='comment-list-create'),
    path('articles/<int:article_id>/favorite/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name = 'article-detail'),
    path('articles/<int:article_id>/comments/<int:pk>/', CommentDetailView.as_view(), name = 'comment-detail'),
    path('articles/<int:article_id>/comments/<int:comment_id>/like/', CommentLikeToggleView.as_view(), name = 'comment-like-toggle')
]
