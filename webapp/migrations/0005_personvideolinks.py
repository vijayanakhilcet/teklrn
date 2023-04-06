# Generated by Django 3.0.8 on 2023-03-27 16:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0004_auto_20230317_1916'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonVideoLinks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.CharField(default='', max_length=1000)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webapp.Person')),
            ],
        ),
    ]