
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField  

class Session(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    jsonUrl = models.URLField(blank=True)
    is_published = models.BooleanField(default=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
