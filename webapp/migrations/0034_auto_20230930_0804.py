# Generated by Django 3.0.8 on 2023-09-30 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0033_auto_20230929_2352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allnewslinks',
            name='link',
            field=models.CharField(max_length=10000),
        ),
    ]