from pyramid.view import view_config
from . import m_tpl
from testproject.models.sitemap import get_sitemap

@view_config(route_name='sitemap', renderer=m_tpl+'sitemap.pt')
def sitemap(request):
    request.response.content_type = 'text/xml'
    changefreqlist = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    prioritylist = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    items = []
    for e in get_sitemap():
        item = {'loc': request.route_url('home') + e.location,
                'lastmod': e.lastmodfromtimestamp(),
                'changefreq': changefreqlist[e.changefreq],
                'priority':prioritylist[e.priority]}
        items.append(item)
    return {'items': items}