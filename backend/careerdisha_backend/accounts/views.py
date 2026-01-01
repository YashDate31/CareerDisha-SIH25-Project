from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import CustomUser, UserProfile
from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer, UserProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'message': 'Login successful'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    user_serializer = UserSerializer(user, data=request.data, partial=True)
    
    if user_serializer.is_valid():
        user_serializer.save()
        
        # Update profile if profile data is provided
        profile_data = request.data.get('profile', {})
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Profile updated successfully'
        })
    
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_content(request):
    content_type = request.data.get('content_type')  # 'video', 'article', 'pdf'
    content_id = request.data.get('content_id')
    action = request.data.get('action', 'add')  # 'add' or 'remove'
    
    if not all([content_type, content_id]):
        return Response({'error': 'content_type and content_id are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    bookmarks = profile.bookmarked_content or []
    
    bookmark_item = {'type': content_type, 'id': content_id}
    
    if action == 'add' and bookmark_item not in bookmarks:
        bookmarks.append(bookmark_item)
        message = 'Content bookmarked successfully'
    elif action == 'remove' and bookmark_item in bookmarks:
        bookmarks.remove(bookmark_item)
        message = 'Bookmark removed successfully'
    else:
        return Response({'message': 'No changes made'})
    
    profile.bookmarked_content = bookmarks
    profile.save()
    
    return Response({'message': message, 'bookmarks': bookmarks})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarks(request):
    try:
        profile = request.user.profile
        bookmarks = profile.bookmarked_content or []
        return Response({'bookmarks': bookmarks})
    except UserProfile.DoesNotExist:
        return Response({'bookmarks': []})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_quiz_result(request):
    quiz_id = request.data.get('quiz_id')
    score = request.data.get('score')
    results = request.data.get('results', {})
    
    if not all([quiz_id, score is not None]):
        return Response({'error': 'quiz_id and score are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    quiz_scores = profile.quiz_scores or {}
    
    quiz_scores[str(quiz_id)] = {
        'score': score,
        'results': results,
        'date_taken': str(timezone.now().date())
    }
    
    profile.quiz_scores = quiz_scores
    profile.save()
    
    return Response({'message': 'Quiz result saved successfully', 'quiz_scores': quiz_scores})