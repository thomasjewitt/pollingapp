from rest_framework import serializers
from polls.models import Poll, PollOption, PollResponse

class PollOptionSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(required=False)
    option = serializers.CharField(required=False)

    class Meta:
        model = PollOption
        fields = ['id', 'option']

class PollResponseSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(read_only=True)
    options = PollOptionSerializer(many=True)
    respondent = serializers.CharField(write_only=True)
    poll = serializers.UUIDField()

    def create(self, validated_data):
        popped_options = validated_data.pop('options')
        print(popped_options)
        option_ids = [option["id"] for option in popped_options]
        options = PollOption.objects.filter(id__in=option_ids)
        poll_id = validated_data.pop('poll')
        poll = Poll.objects.get(pk=poll_id)
        new_response = PollResponse.objects.create(**validated_data, poll=poll)
        new_response.options.set(options)
        return new_response

    class Meta:
        model = PollResponse
        fields = ['id', 'options', 'respondent', 'poll']

class PollSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(read_only=True)
    responses = PollResponseSerializer(many=True, read_only=True)
    options = PollOptionSerializer(many=True)
    creator = serializers.CharField(write_only=True)

    def create(self, validated_data):
        temp_options = validated_data.pop('options')
        new_poll = Poll.objects.create(**validated_data)
        for option in temp_options:
            PollOption.objects.create(**option, poll=new_poll)
        return new_poll

    class Meta:
        model = Poll
        fields = ['id', 'question', 'multiple_choice', 'options', 'responses', 'creator']
    