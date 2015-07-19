# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0003_auto_20150708_2017'),
    ]

    operations = [
        migrations.AddField(
            model_name='navigator',
            name='priority',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='navigator',
            name='type',
            field=models.CharField(default='TN', choices=[('TN', 'Normal'), ('TL', 'List'), ('TA', 'Accordion'), ('TM', 'Media'), ('TT', 'Thumbnails')], max_length=2),
        ),
    ]
