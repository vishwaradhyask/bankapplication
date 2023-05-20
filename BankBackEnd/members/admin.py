from django.contrib import admin
from .models import UsersDetails, SavingAccount

admin.site.register(UsersDetails)
# Register your models here.
admin.site.register(SavingAccount)