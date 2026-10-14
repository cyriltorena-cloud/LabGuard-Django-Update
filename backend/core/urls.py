from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("auth/register/", views.register_student, name="register-student"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", views.me, name="me"),
    path("computers/", views.computers, name="computers"),
    path("students/", views.students, name="students"),
    path("sessions/", views.sessions, name="sessions"),
    path("sessions/mine/", views.my_active_session, name="my-active-session"),
    path("sessions/start/", views.start_session, name="session-start"),
    path("sessions/end/", views.end_session, name="session-end"),
    path("dashboard/", views.dashboard, name="dashboard"),
]
