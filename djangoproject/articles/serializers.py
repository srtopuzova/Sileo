from rest_framework import serializers
from .models import Article, Comment

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only = True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only = True)
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['id', 'author', 'created_at', 'updated_at'] 

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only = True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['id', 'article', 'user', 'created_at']