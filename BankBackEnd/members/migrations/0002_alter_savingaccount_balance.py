# Generated by Django 4.1.7 on 2023-02-27 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savingaccount',
            name='balance',
            field=models.FloatField(max_length=255),
        ),
    ]
