# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_setting'),
    ]

    operations = [
        migrations.AlterField(
            model_name='setting',
            name='bgImage',
            field=models.ImageField(upload_to='images'),
        ),
        migrations.AlterField(
            model_name='setting',
            name='headImage',
            field=models.ImageField(upload_to='images'),
        ),
    ]
