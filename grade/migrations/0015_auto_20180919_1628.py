# Generated by Django 2.0.5 on 2018-09-19 16:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0014_auto_20180919_1559'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gradelog',
            name='grade_day',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 19, 16, 28, 10, 622068)),
        ),
    ]