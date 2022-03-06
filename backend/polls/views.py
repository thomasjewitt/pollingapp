from django.shortcuts import get_object_or_404
from polls.models import Poll
from polls.serializers import PollSerializer, PollResponseSerializer
from polls.utils import get_ip_address
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET', 'DELETE'])
def poll_detail(request, pk):
    try:
        poll = Poll.objects.get(pk=pk)
    except Poll.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PollSerializer(poll)
        return Response(serializer.data)


@api_view(['POST'])
def poll_create(request):
    serializer_data = request.data
    serializer_data["creator"] = get_ip_address(request)
    serializer = PollSerializer(data=serializer_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def poll_respond(request, pk):
    try:
        poll = Poll.objects.get(pk=pk)
    except Poll.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer_data = request.data
    serializer_data["respondent"] = get_ip_address(request)
    serializer_data["poll"] = poll.id
    serializer = PollResponseSerializer(data=serializer_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)