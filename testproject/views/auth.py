# -*- encoding: utf-8 -*-
from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config
from pyramid.security import (remember, forget)

from testproject.models.manager.auth_func import get_user, new_accesslog, get_accesslog_badlogin
from testproject.libs.userpermisson import userpermission
from . import *

@view_config(route_name='managerparam', renderer=m_tpl+'loginform.pt', match_param=('p1=login'))
def loginform(request):
    return {'stpath': request.static_url(m_staticpreurl), 'errormsg': ''}

@view_config(route_name='managerparam2', renderer=m_tpl+'loginform.pt', match_param=('p1=login'))
def loginformerror(request):
    result = {'stpath': request.static_url(m_staticpreurl)}
    msg = ''
    if request.matchdict['p2'] == 'noverifyuser':
        msg = 'Неправильный логин или пароль!'
    if request.matchdict['p2'] == 'noverifypermission':
        msg = 'Не достаточно прав для входа!'
    if request.matchdict['p2'] == 'whaittime':
        msg = 'Ждите 180 секунд для новой попытки!'
    if msg != '':
        result['errormsg'] = '<div class="errorlogin">%s</div>' % msg
    else:
        result['errormsg'] = ''
    return result

@view_config(route_name='managerparam', match_param=('p1=logout'))
def logout(request):
    headers = forget(request)
    return HTTPFound(location='/manager/login', headers=headers)

@view_config(route_name='managerparam', match_param=('p1=auth'))
def authuser(request):
    login_url = request.current_route_url()
    referrer = request.url
    login = '/manager/login'
    if referrer == login_url:
        referrer = '/manager'
    came_from = request.params.get('came_from', referrer)
    if 'submit' in request.POST:
        
        new_accesslog(request.client_addr)
        if not get_accesslog_badlogin(request.client_addr):
            loginerror = login + '/whaittime'
            return HTTPFound(location=loginerror)
        loginerror = login + '/noverifyuser'
        username = request.POST.get('username', '')
        passwd   = request.POST.get('password', '')
        user = get_user(username)
        if user and user.check_password(passwd):
            loginerror = login + '/noverifypermission'
            ps = userpermission(user)
            if 2 in ps[0]:
                new_accesslog(request.client_addr, 2, user.id)
                headers = remember(request, user.id)
                return HTTPFound(location=came_from, headers=headers)
            else:
                #Нет прав доступа
                return HTTPFound(location=loginerror)
        else:
            #Нет такого пользователя
            return HTTPFound(location=loginerror)
        
    #Переход не через форму авторизации
    return HTTPFound(location=login)