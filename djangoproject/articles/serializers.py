from rest_framework import serializers
from .models import Article, Comment, Favorite, CommentLike

class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    favorites_count = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'favorites_count'] 
    def get_favorites_count(self, obj):
        return obj.favorites.count()

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    likes_count = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['id', 'article', 'user', 'created_at', 'updated_at']
    def get_likes_count(self, obj):
        return obj.likes.count()


class FavoriteArticleSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only = True)
    favorites_count = serializers.SerializerMethodField()
    favorited_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'favorited_at', 'favorites_count']
    def get_favorites_count(self, obj):
        return obj.favorites.count()