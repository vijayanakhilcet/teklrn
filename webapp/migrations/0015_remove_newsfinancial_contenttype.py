# Generated by Django 3.0.8 on 2023-05-09 14:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0014_newslinks_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='newsfinancial',
            name='contentType',
        ),
    ]
