from django.db import models
from django.shortcuts import get_object_or_404
from django.contrib.sites.models import Site
from django.core.exceptions import ValidationError
from mptt.models import MPTTModel, TreeForeignKey
from ckeditor.fields import RichTextField
import re

def validate_uri(value):
    pattern = r'^[^\s]+$'
    if not re.match(pattern, value):
        raise ValidationError('Whitespace is not allowed')



class Category(MPTTModel):
    uri = models.CharField(max_length=256, validators=[validate_uri])
    name = models.CharField(max_length=256)
    priority = models.IntegerField()
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (('uri', 'parent'),)
        verbose_name_plural = 'Categories'


    @classmethod
    def __get_by_list(cls, list, root=None):
        category = list.pop(0)
        node = get_object_or_404(Category, parent=root, uri=category)
        if list:
            return cls.__get_by_list(list, node)
        return node

    @classmethod
    def get_by_uri(cls, uri):
        category_list = uri.split('/')
        category_list.pop()
        return cls.__get_by_list(category_list)

    @property
    def posts(self):
        return Post.objects.filter(category=self)

    @property
    def as_root(self):
        return self.get_descendants(include_self=True)

    def __concat_category(self, uri):
        uri = self.uri + '/' + uri
        if self.parent:
            return self.parent.__concat_category(uri)
        return uri

    @property
    def abs_uri(self):
        return self.__concat_category('')


class Post(models.Model):
    uri = models.CharField(max_length=256, validators=[validate_uri], verbose_name='URI')
    category = TreeForeignKey(Category)
    title = models.CharField(max_length=256)
    content = RichTextField()
    pub_date = models.DateField(auto_now_add=True, verbose_name='Date Published')
    mod_date = models.DateField(auto_now=True, verbose_name='Date Modified')

    def __str__(self):
        return self.title

    class Meta:
        unique_together = (('uri', 'category'),)

    @property
    def abs_uri(self):
        return self.category.abs_uri + self.uri

class Navigator(models.Model):
    NORMAL = 'TN'
    LIST = 'TL'
    ACCORDION = 'TA'
    MEDIA = 'TM'
    THUMBNAILS = 'TT'
    CHOICES = (
        (NORMAL, 'Normal'),
        (LIST, 'List'),
        (ACCORDION, 'Accordion'),
        (MEDIA, 'Media'),
        (THUMBNAILS, 'Thumbnails'),
    )

    name = models.CharField(max_length=256, unique=True)
    category = TreeForeignKey(Category)
    type = models.CharField(max_length=2, choices=CHOICES, default=NORMAL)
    priority = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.name

    @classmethod
    def __extract_category_node_to_dict(cls, node, uri_prefix=''):
        result = {
            'uri': uri_prefix + node.uri + '/',
            'name': node.name,
            'posts': [{'title': p.title, 'uri': p.uri} for p in node.posts]
        }
        children = [cls.__extract_category_node_to_dict(c, result['uri']) for c in node.get_children()]
        if children:
            result['children'] = children
        return result

    @classmethod
    def dict(cls):
        return [{'type': n.type, 'category': cls.__extract_category_node_to_dict(n.category)} for n in cls.objects.all()]

class Setting(models.Model):
    site = models.OneToOneField(Site)
    title = models.CharField(max_length=256)
    header = models.CharField(max_length=256)
    footer = models.CharField(max_length=256)
    email = models.EmailField()
    bgImage = models.ImageField(upload_to='images')
    headImage = models.ImageField(upload_to='images')
    home = models.CharField(max_length=256)

    def dict(self):
        return {
            'title': self.title,
            'header': self.header,
            'footer': self.footer,
            'email': self.email,
            'bgImage': self.bgImage.url,
            'headImage': self.headImage.url,
            'home': self.home
        }

    def delete(self, *args, **kwargs):
        # You have to prepare what you need before delete the model
        bstorage, bpath = self.bgImage.storage, self.bgImage.path
        hstorage, hpath = self.headImage.storage, self.headImage.path
        # Delete the model before the file
        super(Setting, self).delete(*args, **kwargs)
        # Delete the file after the model
        bstorage.delete(bpath)
        hstorage.delete(hpath)

    def __str__(self):
        return self.site.domain

