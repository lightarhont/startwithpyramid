from pyramid.view import view_config

from testproject.models.public.blogs.blogs_func import db_get_blogs, db_get_tagblogs, db_get_blog, db_get_tags, db_get_populars

p1 = ['p1=blogs',]

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='GET', match_param=p1+['p2=blog',])
def get_blog(request):
    e = db_get_blog(request.matchdict['p3'])
    if e:
        result = {'id': str(e.id), 'username': e.users.username, 'title': e.title, 'intro': e.intro,
                  'content': e.content, 'comments': e.comments, 'comments_premoderation': e.comments_premoderation,
                  'created': e.created, 'tags': e.tagslist}
        if 'comments_count' in e.__dict__:
            result['comments_count'] = e.comments_count
    else:
        result = {'notfound': 1}
    return result

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='GET', match_param=p1+['p2=blogs',])
def get_blogs(request):
    rows = []
    for e in db_get_blogs():
        tags = []
        for e2 in e.tags:
            tags.append(e2.name)
        row = {'id': str(e.id), 'slug': e.slug, 'username': e.users.username, 'title': e.title,
               'intro': e.intro, 'comments': e.comments, 'created': e.created, 'tags': tags}
        if 'comments_count' in e.__dict__:
            row['comments_count'] = e.comments_count
        rows.append(row)
    return rows

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='GET', match_param=p1+['p2=tagblogs',])
def get_tagblogs(request):
    rows = []
    tag = request.matchdict['p3']
    for e in db_get_tagblogs(tag):
        tags = []
        for e2 in e.tags:
            tags.append(e2.name)
        row = {'id': str(e.id), 'slug': e.slug, 'username': e.users.username, 'title': e.title,
               'intro': e.intro, 'comments': e.comments, 'created': e.created, 'tags': tags}
        if 'comments_count' in e.__dict__:
            row['comments_count'] = e.comments_count
        rows.append(row)
    return rows

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='GET', match_param=p1+['p2=alltags',])
def get_tags(request):
    tags = db_get_tags()
    rows = []
    for e in tags:
        r = {'id': e.id, 'name': e.name}
        rows.append(r)
    return rows

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='GET', match_param=p1+['p2=populars',])
def get_populars(request):
    populars = db_get_populars()
    rows = []
    for e in populars:
        r = {'id': e.id, 'title': e.title, 'slug': e.slug}
        rows.append(r)
    return rows