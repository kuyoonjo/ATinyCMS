# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0001_initial'),
        ('post', '0004_auto_20150708_2027'),
    ]

    operations = [
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=256)),
                ('header', models.CharField(max_length=256)),
                ('footer', models.CharField(max_length=256)),
                ('email', models.EmailField(max_length=254)),
                ('bgImage', models.ImageField(upload_to='')),
                ('headImage', models.ImageField(upload_to='')),
                ('site', models.OneToOneField(to='sites.Site')),
            ],
        ),
    ]
