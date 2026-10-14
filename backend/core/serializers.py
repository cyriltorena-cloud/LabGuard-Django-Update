from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import LabComputer, LabSession, Profile

User = get_user_model()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)
    student_id = serializers.CharField(max_length=40)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already registered.")
        return value

    def validate_student_id(self, value):
        if Profile.objects.filter(student_id=value).exists():
            raise serializers.ValidationError("Student ID is already registered.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        student_id = validated_data.pop("student_id")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        Profile.objects.create(user=user, role=Profile.Role.STUDENT, student_id=student_id)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    class Meta:
        model = Profile
        fields = ["username", "first_name", "last_name", "role", "student_id"]

class ComputerSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    active_student = serializers.SerializerMethodField()
    active_login_at = serializers.SerializerMethodField()

    class Meta:
        model = LabComputer
        fields = ["id", "computer_id", "name", "location", "is_active", "status", "active_student", "active_login_at"]

    def get_status(self, obj):
        if not obj.is_active:
            return "Disabled"
        return "Occupied" if obj.active_session else "Available"

    def get_active_student(self, obj):
        session = obj.active_session
        return session.student.username if session else None

    def get_active_login_at(self, obj):
        session = obj.active_session
        return session.login_at if session else None

class SessionSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source="student.username", read_only=True)
    computer_id = serializers.CharField(source="computer.computer_id", read_only=True)
    class Meta:
        model = LabSession
        fields = ["id", "student_username", "computer_id", "login_at", "logout_at", "is_active"]
        read_only_fields = fields
