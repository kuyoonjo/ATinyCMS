# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import post.models
import mptt.fields
import ckeditor.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uri', models.CharField(validators=[post.models.validate_uri], max_length=256)),
                ('name', models.CharField(max_length=256)),
                ('priority', models.IntegerField()),
                ('type', models.CharField(choices=[('TL', 'List'), ('TA', 'Accordion'), ('TM', 'Media'), ('TT', 'Thumbnails')], default='TL', max_length=2)),
                ('lft', models.PositiveIntegerField(editable=False, db_index=True)),
                ('rght', models.PositiveIntegerField(editable=False, db_index=True)),
                ('tree_id', models.PositiveIntegerField(editable=False, db_index=True)),
                ('level', models.PositiveIntegerField(editable=False, db_index=True)),
                ('parent', mptt.fields.TreeForeignKey(related_name='children', to='post.Category', blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('uri', models.CharField(validators=[post.models.validate_uri], max_length=256)),
                ('title', models.CharField(max_length=256)),
                ('content', ckeditor.fields.RichTextField()),
                ('pub_date', models.DateField(auto_now_add=True)),
                ('mod_date', models.DateField(auto_now=True)),
                ('category', mptt.fields.TreeForeignKey(to='post.Category')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='post',
            unique_together=set([('uri', 'category')]),
        ),
        migrations.AlterUniqueTogether(
            name='category',
            unique_together=set([('uri', 'parent')]),
        ),
    ]
