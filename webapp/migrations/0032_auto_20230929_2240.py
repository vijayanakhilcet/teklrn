# Generated by Django 3.0.8 on 2023-09-29 22:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0031_auto_20230929_2223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='allnewslinks',
            name='link',
            field=models.CharField(max_length=1000),
        ),
    ]
