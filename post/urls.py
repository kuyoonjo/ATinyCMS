from django.conf import settings
from django.conf.urls import url, include
from post import views

urlpatterns = [
    url(r'^%s$' % settings.URI_ARTICLE_PREFIX, views.article_view, name='article'),
    url(r'^%s(?P<category_uri>(([^\s\/]+)\/)+)(?P<post_uri>[^\s\/]*)$' % settings.URI_ARTICLE_PREFIX, views.article_view, name='article_view'),
    url(r'^%s$' % settings.URI_SEARCH_PREFIX, views.search_view, name='search'),
    url(r'^%s[\s\S]*$' % settings.URI_POST_PREFIX, views.post_view, name='post'),
]