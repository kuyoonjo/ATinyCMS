from django.contrib import admin
from django_mptt_admin.admin import DjangoMpttAdmin
from .models import Post, Category, Navigator, Setting


class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'pub_date', 'mod_date')
    list_filter = ['category', 'pub_date', 'mod_date']
    search_fields = ['title']
    readonly_fields = ('pub_date', 'mod_date')
    fieldsets = (
        (None, {
            'fields': (('title','category','uri', 'show_comment'), 'content')
        }),
        ('Date information', {
            'fields': (('pub_date', 'mod_date', 'show_date', 'show_author'),),
            'classes': ('collapse',)
        })
    )
admin.site.register(Post, PostAdmin)
admin.site.register(Category, DjangoMpttAdmin)
admin.site.register(Navigator)
admin.site.register(Setting)