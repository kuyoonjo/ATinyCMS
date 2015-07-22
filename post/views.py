from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.urlresolvers import reverse
from django.contrib.sites.models import Site
from haystack.query import SearchQuerySet
from haystack.utils import Highlighter
from .models import Category, Post, Navigator, Setting
import json
from collections import Counter

def post_view(request):
    setting_dict = get_object_or_404(Setting, site=Site.objects.get_current()).dict()
    setting_dict.update({
        'postUri': reverse('post'),
        'articleUri': reverse('article'),
        'searchUri': reverse('post') + settings.URI_SEARCH_PREFIX,
        'searchEngineUri': reverse('search'),
        'tagsIndexUri': reverse('tags_index'),
        'tagUri': reverse('tag'),
        'dateIndexUri': reverse('date_index'),
        'dateUri': reverse('date'),
        'staticUri': settings.STATIC_URL,
        'mediaUri': settings.MEDIA_URL
    })

    nav_dict = Navigator.dict()
    data_dict = {'navigators': nav_dict, 'settings': setting_dict}
    return render(request, 'post/base.html', {'config': json.dumps(data_dict, indent=4)})

def article_view(request, category_uri=None, post_uri=None):
    if not category_uri and not post_uri:
        return None

    category = Category.get_by_uri(category_uri)

    if post_uri:
        posts = Post.objects.filter(uri=post_uri, category=category)
    else:
        posts = Post.objects.filter(category=category)

    articles_dict = {
        'by': 'article',
        'list': [p.dict() for p in posts]
    }
    return HttpResponse(json.dumps(articles_dict), content_type="application/json")

def search_view(request):
    keyword = request.GET['q']
    results = SearchQuerySet().filter(content=keyword)
    highlighter = Highlighter(keyword)
    results_dict = {
        'by': 'search',
        'list': [{
                'title': r.object.title,
                'content': highlighter.highlight(r.object.content),
                'uri': r.object.abs_uri
                } for r in results]
    }
    return HttpResponse(json.dumps(results_dict), content_type="application/json")

def tags_index(request):
    tags = []
    for p in Post.objects.all():
        tags.extend(p.tags.split(','))
    tags_dict = [{'name': k, 'count': v} for k, v in Counter(tags).most_common()]
    return HttpResponse(json.dumps(tags_dict), content_type="application/json")

def tag_view(request, tag=''):
    posts = []
    for post in Post.objects.all():
        tags = post.tags.split(',')
        if tag in tags:
            posts.append(post)
    articles_dict = {
        'by': 'tag',
        'list': [p.dict() for p in posts]
    }
    return HttpResponse(json.dumps(articles_dict), content_type="application/json")

def date_index(request):
    posts = Post.objects.filter(show_date=True)
    mods = [p.mod_date.strftime('%Y-%m-%d') for p in posts]
    mods_dict = {k: v for k, v in Counter(mods).most_common()}
    dates_dist = [{'prefix': 'Post: ','affix': '', 'list': mods_dict}]
    return HttpResponse(json.dumps(dates_dist), content_type="application/json")


def date_view(request, year, month, day):
    _year = int(year)
    _month = int(month)
    _day = int(day)
    mod = Post.objects.filter(show_date=True, mod_date__year=_year, mod_date__month=_month, mod_date__day=_day)
    articles_dict = {
        'by': 'date',
        'list': [p.dict() for p in mod]
    }
    return HttpResponse(json.dumps(articles_dict), content_type="application/json")






