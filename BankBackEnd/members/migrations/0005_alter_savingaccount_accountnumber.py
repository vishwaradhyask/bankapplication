# Generated by Django 4.1.7 on 2023-05-20 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0004_savingaccount_accountnumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savingaccount',
            name='accountnumber',
            field=models.IntegerField(max_length=10),
        ),
    ]
