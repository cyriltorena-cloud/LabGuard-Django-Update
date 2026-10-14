from django.contrib import admin
from .models import LabComputer, LabSession, Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "student_id")
    list_filter = ("role",)
    search_fields = ("user__username", "student_id")

@admin.register(LabComputer)
class LabComputerAdmin(admin.ModelAdmin):
    list_display = ("computer_id", "name", "location", "is_active")
    list_filter = ("is_active",)
    search_fields = ("computer_id", "name", "location")

@admin.register(LabSession)
class LabSessionAdmin(admin.ModelAdmin):
    list_display = ("student", "computer", "login_at", "logout_at")
    list_filter = ("computer",)
    search_fields = ("student__username", "computer__computer_id")
    readonly_fields = ("login_at",)
