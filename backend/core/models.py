from django.conf import settings
from django.db import models

class Profile(models.Model):
    class Role(models.TextChoices):
        ADMIN = "Admin", "Admin"
        TEACHER = "Teacher", "Teacher"
        STUDENT = "Student", "Student"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="labguard_profile")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    student_id = models.CharField(max_length=40, blank=True, unique=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class LabComputer(models.Model):
    computer_id = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=120, blank=True, default="Computer Laboratory")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.computer_id} — {self.name or self.location}"

    @property
    def active_session(self):
        return self.sessions.filter(logout_at__isnull=True).select_related("student").first()

class LabSession(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="lab_sessions")
    computer = models.ForeignKey(LabComputer, on_delete=models.PROTECT, related_name="sessions")
    login_at = models.DateTimeField(auto_now_add=True)
    logout_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-login_at"]

    @property
    def is_active(self):
        return self.logout_at is None

    def __str__(self):
        return f"{self.student.username} on {self.computer.computer_id}"
