from django.db import models

# Create your models here.

class Article(models.Model):
    class Category(models.TextChoices):
        ETHICS = 'ethics', 'Ethics'
        LOGIC = 'logic', 'Logic'
        METAPHYSICS = 'metaphysics', 'Metaphysics'
        EPISTEMOLOGY = 'epistemology', 'Epistemology'
        AESTHETICS = 'aesthetics', 'Aesthetics'
        EXISTENTIALISM = 'existentialism', 'Existentialism'
        OTHER = 'other', 'Other'

    title = models.CharField(max_length=500)
    content = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title