# myapp/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id','title', 'description', 'completed', 'created_at']  # Укажите поля модели Task, которые нужно сериализовать

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])  # Храните хэшированный пароль
        user.save()
        return user
