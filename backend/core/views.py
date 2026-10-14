from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import LabComputer, LabSession, Profile
from .serializers import ComputerSerializer, ProfileSerializer, RegisterSerializer, SessionSerializer

User = get_user_model()

def get_profile(user):
    profile, _ = Profile.objects.get_or_create(user=user, defaults={"role": Profile.Role.ADMIN if user.is_superuser else Profile.Role.STUDENT})
    return profile

def staff_user(user):
    profile = get_profile(user)
    return user.is_superuser or profile.role in (Profile.Role.ADMIN, Profile.Role.TEACHER)

@api_view(["POST"])
@permission_classes([AllowAny])
def register_student(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({"message": "Student account created. You can now sign in.", "username": user.username}, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    profile = get_profile(request.user)
    return Response(ProfileSerializer(profile).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def computers(request):
    if not staff_user(request.user):
        return Response({"detail": "Only authorized staff can view all computers."}, status=403)
    return Response(ComputerSerializer(LabComputer.objects.all(), many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sessions(request):
    if not staff_user(request.user):
        return Response({"detail": "Only authorized staff can view all sessions."}, status=403)
    qs = LabSession.objects.select_related("student", "computer").all()[:250]
    return Response(SessionSerializer(qs, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def students(request):
    if not staff_user(request.user):
        return Response({"detail": "Only authorized staff can view student records."}, status=403)
    profiles = Profile.objects.filter(role=Profile.Role.STUDENT).select_related("user").order_by("user__username")
    return Response(ProfileSerializer(profiles, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if not staff_user(request.user):
        return Response({"detail": "Only authorized staff can view the monitoring dashboard."}, status=403)
    return Response({
        "total_computers": LabComputer.objects.count(),
        "active_computers": LabComputer.objects.filter(is_active=True).count(),
        "occupied_computers": LabSession.objects.filter(logout_at__isnull=True).values("computer_id").distinct().count(),
        "active_sessions": LabSession.objects.filter(logout_at__isnull=True).count(),
        "registered_students": Profile.objects.filter(role=Profile.Role.STUDENT).count(),
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_active_session(request):
    session = LabSession.objects.filter(student=request.user, logout_at__isnull=True).select_related("student", "computer").first()
    if not session:
        return Response(None)
    from .serializers import SessionSerializer
    return Response(SessionSerializer(session).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_session(request):
    profile = get_profile(request.user)
    if profile.role != Profile.Role.STUDENT:
        return Response({"detail": "Only student accounts can start a lab session."}, status=403)
    computer_id = str(request.data.get("computer_id", "")).strip()
    if not computer_id:
        return Response({"detail": "PC ID was not detected. Make sure the local PC agent is running."}, status=400)
    try:
        computer = LabComputer.objects.get(computer_id=computer_id, is_active=True)
    except LabComputer.DoesNotExist:
        return Response({"detail": "This PC is not registered or is disabled. Contact the lab administrator."}, status=400)
    active_for_student = LabSession.objects.filter(student=request.user, logout_at__isnull=True).first()
    if active_for_student:
        if active_for_student.computer_id == computer.id:
            return Response(SessionSerializer(active_for_student).data)
        return Response({"detail": f"You already have an active session on {active_for_student.computer.computer_id}. End it before using another PC."}, status=409)
    if LabSession.objects.filter(computer=computer, logout_at__isnull=True).exists():
        return Response({"detail": "This PC already has an active session. Please contact the teacher."}, status=409)
    session = LabSession.objects.create(student=request.user, computer=computer)
    return Response(SessionSerializer(session).data, status=201)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def end_session(request):
    session_id = request.data.get("session_id")
    qs = LabSession.objects.filter(logout_at__isnull=True)
    if not staff_user(request.user):
        qs = qs.filter(student=request.user)
    if session_id:
        qs = qs.filter(id=session_id)
    else:
        qs = qs.filter(student=request.user)
    session = qs.first()
    if not session:
        return Response({"detail": "No active session was found."}, status=404)
    session.logout_at = timezone.now()
    session.save(update_fields=["logout_at"])
    return Response({"message": "Session ended.", "session": SessionSerializer(session).data})
