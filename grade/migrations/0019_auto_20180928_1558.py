# Generated by Django 2.0.5 on 2018-09-28 15:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0018_auto_20180928_1555'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grade',
            name='attendence',
        ),
        migrations.AlterField(
            model_name='gradelog',
            name='grade_day',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 28, 15, 58, 9, 798778)),
        ),
    ]