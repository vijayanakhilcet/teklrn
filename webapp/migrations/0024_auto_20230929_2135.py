# Generated by Django 3.0.8 on 2023-09-29 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0023_auto_20230929_2131'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=30000),
        ),
    ]