# Generated by Django 2.0.5 on 2018-08-24 09:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('grade', '0002_time'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Time',
        ),
    ]