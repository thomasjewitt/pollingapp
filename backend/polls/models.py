from django.db import models
import uuid

# Create your models here.


class Poll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.CharField(max_length=512)
    multiple_choice = models.BooleanField(default=False)
    creator = models.CharField(max_length=15)


class PollOption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    option = models.CharField(max_length=128)
    poll = models.ForeignKey(to=Poll, related_name='options', on_delete=models.CASCADE)


class PollResponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(to=Poll, related_name='responses', on_delete=models.CASCADE)
    options = models.ManyToManyField(to=PollOption)
    respondent = models.CharField(max_length=15)

    class Meta:
        unique_together = ('poll', 'respondent')