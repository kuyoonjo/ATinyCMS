from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.core.urlresolvers import reverse
from django.contrib.sites.models import Site
from haystack.query import SearchQuerySet
from haystack.utils import Highlighter
from .models import Category, Post, Navigator, Setting
import json

def post_view(request):
    setting_dict = get_object_or_404(Setting, site=Site.objects.get_current()).dict()
    setting_dict.update({
        'postUri': reverse('post'),
        'articleUri': reverse('article'),
        'searchUri': reverse('post') + settings.URI_SEARCH_PREFIX,
        'searchEngineUri': reverse('search'),
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
        posts = get_list_or_404(Post, uri=post_uri, category=category)
    else:
        posts = get_list_or_404(Post, category=category)

    articles_dict = [p.dict() for p in posts]
    return HttpResponse(json.dumps(articles_dict), content_type="application/json")

def search_view(request):
    keyword = request.GET['q']
    results = SearchQuerySet().filter(content=keyword)
    highlighter = Highlighter(keyword)
    results_dict = [{
        'title': r.object.title,
        'content': highlighter.highlight(r.object.content),
        'uri': r.object.abs_uri
    } for r in results]
    return HttpResponse(json.dumps(results_dict), content_type="application/json")



