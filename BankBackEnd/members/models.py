from django.db import models

# Create your models here.

class UsersDetails(models.Model):
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    username = models.CharField(max_length=255, primary_key=True)
    password = models.CharField(max_length=255)
    emaid = models.EmailField()
    phone = models.CharField(max_length=10)
    hint = models.CharField(max_length=255)

    def __str__(self):
        return 'first name=%r lastname=%r username=%r password=%r emaid=%r phone=%r hint=%r' % (self.firstname, self.lastname, self.username, self.password, self.emaid, self.phone, self.hint)

class SavingAccount(models.Model):
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    username = models.CharField(max_length=255, primary_key=True)
    emaid = models.EmailField()
    phone = models.CharField(max_length=10)
    balance = models.FloatField(max_length=255)
    transaction =  models.JSONField()

def __str__(self):
        return 'first name=%r lastname=%r username=%r emaid=%r phone=%r balance=%r' % (self.firstname, self.lastname, self.username, self.emaid, self.phone, self.balance)