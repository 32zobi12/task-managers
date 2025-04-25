from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)  # Заголовок задачи
    description = models.TextField()           # Описание задачи
    completed = models.BooleanField(default=False)  # Поле для выполнения
    created_at = models.DateTimeField(auto_now_add=True)  # Дата и время создания задачи
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Связь с пользователем

    def __str__(self):
        return self.title  # Возвращает заголовок задачи при вызове str
