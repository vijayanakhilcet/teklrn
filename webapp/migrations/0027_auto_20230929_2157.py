# Generated by Django 3.0.8 on 2023-09-29 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0026_auto_20230929_2148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courselevel',
            name='description',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='news',
            name='category',
            field=models.CharField(default='General', max_length=40),
        ),
        migrations.AlterField(
            model_name='news',
            name='contentType',
            field=models.CharField(default='WORLD NEWS', max_length=40),
        ),
        migrations.AlterField(
            model_name='news',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=1000),
        ),
        migrations.AlterField(
            model_name='news',
            name='name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='newsentertainment',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=1000),
        ),
        migrations.AlterField(
            model_name='newsentertainmentlevel',
            name='imageLink',
            field=models.CharField(default='', max_length=1000),
        ),
        migrations.AlterField(
            model_name='newsfinancial',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=1000),
        ),
        migrations.AlterField(
            model_name='newsfinanciallevel',
            name='imageLink',
            field=models.CharField(default='', max_length=1000),
        ),
        migrations.AlterField(
            model_name='newstechnology',
            name='imageLink',
            field=models.CharField(default='Hi', max_length=1000),
        ),
        migrations.AlterField(
            model_name='newstechnologylevel',
            name='imageLink',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
