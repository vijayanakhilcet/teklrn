# Generated by Django 3.0.8 on 2023-05-09 14:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0015_remove_newsfinancial_contenttype'),
    ]

    operations = [
        migrations.AddField(
            model_name='newsfinancial',
            name='contentType',
            field=models.CharField(default='FINANCIAL [en]', max_length=30),
        ),
    ]
