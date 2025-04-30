# social/urls.py
from django.urls import path
from .views import (
    # borrowed_isbns,  <-- REMOVE this import since it's in the books app
    # ...
    CommunityGroupListCreateView,
    JoinGroupView,
    LeaveGroupView,
    RemoveUserView,
    WarnUserView,
    SendMessageView,
    ListMessagesView,
    ListGroupMembersView,
)

urlpatterns = [
    path('groups/', CommunityGroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:group_id>/join/', JoinGroupView.as_view(), name='join-group'),
    path('groups/<int:group_id>/leave/', LeaveGroupView.as_view(), name='leave-group'),
    path('groups/<int:group_id>/remove-user/<int:user_id>/', RemoveUserView.as_view(), name='remove-user'),
    path('groups/<int:group_id>/warn-user/<int:user_id>/', WarnUserView.as_view(), name='warn-user'),
    path('groups/<int:group_id>/messages/', SendMessageView.as_view(), name='send-message'),
    path('groups/<int:group_id>/messages/list/', ListMessagesView.as_view(), name='list-messages'),
    path('groups/<int:group_id>/members/', ListGroupMembersView.as_view(), name='list-members'),
]
