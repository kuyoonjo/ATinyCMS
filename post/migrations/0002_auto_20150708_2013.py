# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Navigator',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=256)),
                ('type', models.CharField(default='TL', max_length=2, choices=[('TL', 'List'), ('TA', 'Accordion'), ('TM', 'Media'), ('TT', 'Thumbnails')])),
            ],
        ),
        migrations.RemoveField(
            model_name='category',
            name='type',
        ),
        migrations.AddField(
            model_name='navigator',
            name='category',
            field=mptt.fields.TreeForeignKey(to='post.Category'),
        ),
    ]
