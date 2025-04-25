# myapp/urls.py
from django.urls import path
from .views import TaskListCreateView, TaskDetailView, RegisterView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),  # Для получения и создания задач
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),  # Для получения, обновления и удаления задачи
    path('register/', RegisterView.as_view(), name='register'),  # Регистрация
]
