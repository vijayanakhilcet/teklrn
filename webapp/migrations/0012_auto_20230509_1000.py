# Generated by Django 3.0.8 on 2023-05-09 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0011_newslinks_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newslinks',
            name='category',
            field=models.CharField(default='NEWS', max_length=20),
        ),
    ]
