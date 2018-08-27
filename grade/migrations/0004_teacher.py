# Generated by Django 2.0.5 on 2018-08-27 09:42

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0003_delete_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('teacher_id', models.CharField(max_length=50)),
                ('grade_day', models.DateTimeField(default=datetime.datetime(2018, 8, 27, 9, 42, 53, 955223, tzinfo=utc))),
                ('grade_time', models.DateTimeField()),
            ],
        ),
    ]
