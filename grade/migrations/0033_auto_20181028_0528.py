# Generated by Django 2.0.5 on 2018-10-28 05:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0032_auto_20181028_0440'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gradelog',
            name='grade_day',
            field=models.DateTimeField(default=datetime.datetime(2018, 10, 28, 5, 28, 24, 586640)),
        ),
    ]
