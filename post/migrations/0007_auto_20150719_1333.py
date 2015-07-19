# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import post.models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0006_auto_20150712_1841'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'Categories'},
        ),
        migrations.AddField(
            model_name='setting',
            name='home',
            field=models.CharField(max_length=256, default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='post',
            name='mod_date',
            field=models.DateField(verbose_name='Date Modified', auto_now=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='pub_date',
            field=models.DateField(verbose_name='Date Published', auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='uri',
            field=models.CharField(max_length=256, verbose_name='URI', validators=[post.models.validate_uri]),
        ),
    ]
