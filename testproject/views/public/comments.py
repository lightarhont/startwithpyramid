from pyramid.view import view_config
import time

from testproject.models.public.comments.comments_func import (get_comments2, get_comment2,
    db_put_comment, db_delete_comment, db_add_comment, db_count_comments)

p1 = ['p1=comments',]

@view_config(route_name='xhrpublicparam4', renderer='json', request_method='GET', match_param=p1+['p2=countcomments',])
def countrestcomments(request):
    thread = request.matchdict['p3']
    threadid = int(request.matchdict['p4'])
    count = db_count_comments(thread, threadid)
    return {'totalcomments': count} 

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=comment',])
def post_comment(request):
    post = request.json_body
    post['created'] = int(time.time())
    result = db_add_comment(post)
    if result[0] != 2:
        resp = {'result': result[0], 'content': result[1], 'id': result[2], 'created': post['created'], 'avatar': result[3]}
    else:
        resp = {'result': result[0]}
    return resp

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='PUT', match_param=p1+['p2=comment',])
def put_comment(request):
    post = request.json_body
    post['last_edited'] = int(time.time());
    itemid = int(request.matchdict['p3'])
    result = db_put_comment(itemid, post)
    return {'result': result[0], 'content': result[1], 'last_edited': post['last_edited']}

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='DELETE', match_param=p1+['p2=comment',])
def delete_comment(request):
    itemid = int(request.matchdict['p3'])
    result = db_delete_comment(itemid)
    return {'result': result}

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='GET', match_param=p1+['p2=comment',])
def get_comment(request):
    e = get_comment2(int(request.matchdict['p3']))
    
    return {'id': str(e.id), 'userid': e.userid, 'username': 'mik', 'thread': e.thread, 'threadid': e.threadid, 'threadtitle': e.threadtitle,
            'title': e.title, 'content': e.content, 'last_edited': e.last_edited}

@view_config(route_name='xhrpublicparam4', renderer='json', request_method='GET', match_param=p1+['p2=comments',])
def get_comments(request):
    #def get_comments(ordering, component, componentid, offset, limit):
    get = request.GET.mixed()
    thread = request.matchdict['p3']
    threadid = int(request.matchdict['p4'])
    rows = []
    for e in get_comments2(get, thread=thread, threadid=threadid):
        row = {'id': str(e.id), 'userid': e.userid,  'username': e.users.username, 'avatar': e.users.profiles.avatar3, 'thread': e.thread, 'threadid': e.threadid, 'threadtitle': e.threadtitle,
               'title': e.title, 'content': e.content, 'created': e.created, 'last_edited': e.last_edited}
        rows.append(row)
    return rows