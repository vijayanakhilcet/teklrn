# Generated by Django 3.0.8 on 2021-06-16 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0011_auto_20210219_1405'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='courselevel',
            options={'ordering': ['level_number']},
        ),
        migrations.AddField(
            model_name='course',
            name='contentType',
            field=models.CharField(default='Tech', max_length=30),
        ),
    ]
