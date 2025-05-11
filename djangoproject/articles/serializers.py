from rest_framework import serializers
from .models import Article, Comment, Favorite

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
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['id', 'article', 'user', 'created_at', 'updated_at']


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = '__all__'