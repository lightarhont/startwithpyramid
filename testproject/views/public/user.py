# -- coding: utf-8 --

from pyramid.view import view_config
from pyramid.security import (remember, forget)

from testproject.models.public.user.user_func import (get_user, get_user2, db_put_user, db_get_useractivation)
from testproject.libs.userpermisson import userpermission
from testproject.libs.mail import sendmail

import random
import string

p1 = ['p1=user',]

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=register',])
def ajaxbaseregister(request):
    post = request.json_body
    roles = [8,]
    token = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for x in range(16))
    result = db_put_user(post, roles, token)
    if result == True:
        fromaddr = 'mikha-nikiforov@yandex.ru'
        toaddr = post['email']
        fromname = 'Системное сообщение'
        toname = post['fullname']
        subj = 'Служба активации пользователя сайта XXX'
        msg_txt = '''
        Ссылка для активации пользователя %s:
        http://testproject.python/blogs#useractivation/%s''' % (post['username'], token)
        sendmail(fromaddr, toaddr, fromname, toname, subj, msg_txt)
        return {'registration': True}
    elif result == 3:
        return {'duplicate': True}
    else:
        return {'registration': False}

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=activation',])
def ajaxbaseuseractivation(request):
    post = request.json_body
    result = db_get_useractivation(post, [4,])
    if result != None and result != False:
        return {'useractivation': True}
    else:
        return {'useractivation': False}

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=login',])
def ajaxbaselogin(request):
    post = request.json_body
    user = get_user2(post['username'])
    if user and user.check_password(post['password']):
        ps = userpermission(user)
        if 1 in ps[0]:
            headers = remember(request, user.id)
            result = {'userid': user.id, 'username': user.username, 'permissions': ps[0], 'headers': headers}
            if user.profiles.avatar1 != '' or user.profiles.avatar1 != None:
                result['hasavatar'] = True
        else:
            result = {'auth': False}
    else:
        result = {'user':False}
    return result

@view_config(route_name='restuser', renderer='json', request_method='GET')
def get_permissions(request):
    if request.authenticated_userid:
        user = get_user(request.authenticated_userid)
        ps = userpermission(user)
        result = {'userid': user.id, 'username': user.username, 'permissions': ps[0]}
        if user.profiles.avatar1 != '' or user.profiles.avatar1 != None:
            result['hasavatar'] = True
    else:
        result = {'userid': 0, 'username': 'guest', 'permissions': []}
    return result

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)