# Generated by Django 3.0.8 on 2023-03-17 23:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_person'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='facebook',
            field=models.CharField(default='', max_length=400),
        ),
        migrations.AddField(
            model_name='person',
            name='instagram',
            field=models.CharField(default='', max_length=400),
        ),
        migrations.AddField(
            model_name='person',
            name='twitter',
            field=models.CharField(default='', max_length=400),
        ),
    ]
