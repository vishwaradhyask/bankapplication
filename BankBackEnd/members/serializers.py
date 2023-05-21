from django.contrib.auth.models import User
from .models import UsersDetails, SavingAccount
from rest_framework import serializers


class UserSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDetails
        fields = ['firstname', 'lastname', 'username',
                  'password', 'emaid', 'phone', 'hint']



class SavingAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingAccount
        fields = ['firstname', 'lastname', 'username',
                  'balance', 'emaid', 'phone', 'transaction', 'accountnumber']
        