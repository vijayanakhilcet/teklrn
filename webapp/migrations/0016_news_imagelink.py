# Generated by Django 3.0.8 on 2022-11-13 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0015_auto_20221110_2204'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=400),
        ),
    ]
