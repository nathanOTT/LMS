from rest_framework import serializers
from .models import CommunityGroup, GroupMembership, GroupMessage

class GroupMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')
    group_name = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = GroupMembership
        fields = ['id', 'user', 'user_email', 'user_first_name', 'user_last_name', 'group', 'group_name', 'role', 'warnings', 'joined_at']
        read_only_fields = ['id', 'warnings', 'joined_at']

class GroupMessageSerializer(serializers.ModelSerializer):
    # Nest the membership serializer to get full details
    membership = GroupMembershipSerializer(read_only=True)
    
    class Meta:
        model = GroupMessage
        fields = ['id', 'membership', 'text', 'created_at']
        read_only_fields = ['id', 'created_at']

class CommunityGroupSerializer(serializers.ModelSerializer):
    created_by_email = serializers.ReadOnlyField(source='created_by.email')

    class Meta:
        model = CommunityGroup
        fields = ['id', 'name', 'description', 'rules', 'created_by', 'created_by_email', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']




