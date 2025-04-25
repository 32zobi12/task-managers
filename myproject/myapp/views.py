from django.contrib.auth.models import User
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer

# Представление для регистрации пользователей
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Проверка на существование пользователя
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=username)
        user.set_password(password)  # Храните пароль в зашифрованном виде
        user.save()
        return Response({'detail': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

# Представление для получения и создания задач
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        
        # Исправлено: правильный отступ и синтаксис
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)  # icontains для регистронезависимого поиска
        
        return queryset.order_by('-created_at')  # Убрана лишняя скобка

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
# Представление для получения, обновления и удаления конкретной задачи
# views.py
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        # Если задача выполняется, устанавливаем её состояние в 'completed'
        completed = self.request.data.get('completed', False)
        serializer.save(completed=completed)

