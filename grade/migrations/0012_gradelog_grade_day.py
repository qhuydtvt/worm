# Generated by Django 2.0.5 on 2018-09-12 15:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0011_remove_gradelog_grade_day'),
    ]

    operations = [
        migrations.AddField(
            model_name='gradelog',
            name='grade_day',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]