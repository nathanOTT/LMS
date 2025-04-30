from django.shortcuts import render

# social/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import CommunityGroup, GroupMembership, GroupMessage
from .serializers import (
    CommunityGroupSerializer, 
    GroupMembershipSerializer, 
    GroupMessageSerializer
)


class CommunityGroupListCreateView(generics.ListCreateAPIView):
    """
    GET: List all community groups
    POST: Create a new community group (the creator is admin by default)
    """
    queryset = CommunityGroup.objects.all()
    serializer_class = CommunityGroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # The user creating the group is the admin
        group = serializer.save(created_by=self.request.user)
        # Also create a membership with role=admin
        GroupMembership.objects.create(
            user=self.request.user,
            group=group,
            role='admin'
        )


class JoinGroupView(APIView):
    """
    POST: A user joins a group as a member (unless they're the creator).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        group = get_object_or_404(CommunityGroup, pk=group_id)

        # Check if membership already exists
        if GroupMembership.objects.filter(user=request.user, group=group).exists():
            return Response({"detail": "You are already a member of this group."}, status=status.HTTP_400_BAD_REQUEST)

        GroupMembership.objects.create(user=request.user, group=group, role='member')
        return Response({"detail": "Joined the group successfully."}, status=status.HTTP_201_CREATED)


class LeaveGroupView(APIView):
    """
    POST: A user leaves the group (if they are a member).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        group = get_object_or_404(CommunityGroup, pk=group_id)
        membership = GroupMembership.objects.filter(user=request.user, group=group).first()
        if not membership:
            return Response({"detail": "You are not a member of this group."}, status=status.HTTP_400_BAD_REQUEST)

        membership.delete()
        return Response({"detail": "You have left the group."}, status=status.HTTP_200_OK)


class RemoveUserView(APIView):
    """
    POST: Admin can remove another user from the group.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id, user_id):
        group = get_object_or_404(CommunityGroup, pk=group_id)
        # Must be admin
        admin_membership = GroupMembership.objects.filter(user=request.user, group=group, role='admin').first()
        if not admin_membership:
            return Response({"detail": "You are not an admin of this group."}, status=status.HTTP_403_FORBIDDEN)

        # Remove target user
        membership_to_remove = GroupMembership.objects.filter(user_id=user_id, group=group).first()
        if not membership_to_remove:
            return Response({"detail": "User not found in this group."}, status=status.HTTP_404_NOT_FOUND)

        membership_to_remove.delete()
        return Response({"detail": "User removed from the group."}, status=status.HTTP_200_OK)


class WarnUserView(APIView):
    """
    POST: Admin warns a user (increments warnings).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id, user_id):
        group = get_object_or_404(CommunityGroup, pk=group_id)
        # Must be admin
        admin_membership = GroupMembership.objects.filter(user=request.user, group=group, role='admin').first()
        if not admin_membership:
            return Response({"detail": "You are not an admin of this group."}, status=status.HTTP_403_FORBIDDEN)

        membership = GroupMembership.objects.filter(user_id=user_id, group=group).first()
        if not membership:
            return Response({"detail": "User not found in this group."}, status=status.HTTP_404_NOT_FOUND)

        membership.warnings += 1
        membership.save()
        return Response({"detail": "User has been warned.", "warnings": membership.warnings}, status=status.HTTP_200_OK)


class SendMessageView(APIView):
    """
    POST: Send a message to a group.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        group = get_object_or_404(CommunityGroup, pk=group_id)
        membership = GroupMembership.objects.filter(user=request.user, group=group).first()
        if not membership:
            return Response({"detail": "You are not a member of this group."}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text', '').strip()
        if not text:
            return Response({"detail": "Message text is required."}, status=status.HTTP_400_BAD_REQUEST)

        message = GroupMessage.objects.create(membership=membership, text=text)
        serializer = GroupMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListMessagesView(generics.ListAPIView):
    """
    GET: List all messages in a group.
    """
    serializer_class = GroupMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        group = get_object_or_404(CommunityGroup, pk=group_id)
        membership = GroupMembership.objects.filter(user=self.request.user, group=group).first()
        if not membership:
            # If not a member, no messages
            return GroupMessage.objects.none()
        # Return all messages in this group
        # We'll filter by memberships that belong to the same group
        group_memberships = GroupMembership.objects.filter(group=group)
        return GroupMessage.objects.filter(membership__in=group_memberships)


class ListGroupMembersView(generics.ListAPIView):
    """
    GET: List all members of a group (with roles, warnings, etc.).
    """
    serializer_class = GroupMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        group = get_object_or_404(CommunityGroup, pk=group_id)
        # Optionally check membership if group is private
        return GroupMembership.objects.filter(group=group)
