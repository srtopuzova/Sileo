from django.urls import path
from .views import ArticleListView, CommentListView

urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article-list-create'),
    path('articles/<int:article_id>/comments/', CommentListView.as_view(), name='comment-list-create')
]
