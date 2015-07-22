from django.conf import settings
from django.conf.urls import url, include
from post import views

urlpatterns = [
    url(r'^%s$' % settings.URI_ARTICLE_PREFIX, views.article_view, name='article'),
    url(r'^%s(?P<category_uri>(([^\s\/]+)\/)+)(?P<post_uri>[^\s\/]*)$' % settings.URI_ARTICLE_PREFIX, views.article_view, name='article_view'),
    url(r'^%s$' % settings.URI_SEARCH_PREFIX, views.search_view, name='search'),
    url(r'^%s$' % settings.URI_TAGS_INDEX_PREFIX, views.tags_index, name='tags_index'),
    url(r'^%s$' % settings.URI_TAG_PREFIX, views.tag_view, name='tag'),
    url(r'^%s(?P<tag>[^\s\/]*)$' % settings.URI_TAG_PREFIX, views.tag_view, name='tag_view'),
    url(r'^%s$' % settings.URI_DATE_INDEX_PREFIX, views.date_index, name='date_index'),
    url(r'^%s$' % settings.URI_DATE_PREFIX, views.date_view, name='date'),
    url(r'^%s(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$' % settings.URI_DATE_PREFIX, views.date_view, name='date_view'),
    url(r'^%s[\s\S]*$' % settings.URI_POST_PREFIX, views.post_view, name='post'),
]