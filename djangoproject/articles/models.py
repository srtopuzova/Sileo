from django.db import models
from django.conf import settings

# Create your models here.

class Article(models.Model):
    class Category(models.TextChoices):
        ETHICS = 'Ethics'
        LOGIC = 'Logic'
        METAPHYSICS = 'Metaphysics'
        EPISTEMOLOGY = 'Epistemology'
        AESTHETICS = 'Aesthetics'
        EXISTENTIALISM = 'Existentialism'
        OTHER = 'Other'

    title = models.CharField(max_length=500)
    content = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    article = models.ForeignKey('Article', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Comment by {self.user} on "{self.article.title}"'

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')

    def __str__(self):
        return f'{self.user.username} favorited "{self.article.title}"'

class CommentLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,  on_delete=models.CASCADE)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')
    
    def __str__(self):
        return f'{self.user.username} liked a comment on "{self.comment.article.title}"'