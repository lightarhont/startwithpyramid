# -*- encoding: utf-8 -*-

from pyramid.renderers import render
from pyramid.httpexceptions import HTTPFound
from testproject.models import DBSession
from testproject.models.manager.common_func import (get_user, get_user2,)

from testproject.views import *

staticpreurl = m_staticpreurl
tpl = m_tpl+'manager/'
projecttitle = m_projecttitle

mainmenu = (
            ('Главная', 'home', 'no'),
            ('Блог',      '', (
                                      ('Посты', 'blog/posts', 'no'),
                              )
            ),
            ('Настройки', '', (
                                      ('Основные', 'options/config', 'no'),
                                      ('Шаблоны', '', (('Главные шаблоны', 'options/templates/1', 'no'),
                                                       ('Письма', 'options/templates/2', 'no')
                                                                       )
                                      ),
                                      ('Контроль', '', (('Пользователи', 'options/control/users', 'no'),
                                                        ('Роли',         'options/control/roles', 'no'),
                                                        ('Правила', 'options/control/permissions', 'no'),
                                                        ('Блокировки', 'options/control/blocks', 'no')))
                                     )
            )
           )

def favicons(request):
    return '<link rel="shortcut icon" href="' + request.static_url(staticpreurl + 'favicon.ico') + '" />\n\t\t<link rel="apple-touch-icon-precomposed" href="' + request.static_url(staticpreurl + 'icon.png') + '" />'

def userroles(user, full=False):
    roles = []
    i = 0
    s = len(user.roles)
    while i<s:
        if full==False:
            roles.append(user.roles[i].id)
            i += 1
        else:
            roles.append((user.roles[i].id, user.roles[i].name, user.roles[i].rolesgroup, user.roles[i].description))
            i += 1
    return roles

class Manager():
    
    def __init__(self, request, index, nodotjs=False):
        
        if not request.authenticated_userid:
            raise HTTPFound(location='/manager/login')
        
        user = get_user2(request.authenticated_userid)
        
        roles = userroles(user)
        
        if not (1 in roles or 2 in roles):
            raise HTTPFound(location='/manager/login')
        
        self.request = request
        self.index = index
        self.__user = {'id': user.id, 'username': user.username, 'email': user.email, 'password': user.password,
                     'created': user.created, 'activity': user.activity,  
                     'fullname': user.profiles.fullname, 'roles':roles,}
        
        #Добавить проверку на expired
        
        #JS библиотеки
        jslibs = []
        
        if not nodotjs:
            jslibs.append(self.jslib('lib/dot/doT.min.js'))
        
        jslibs.append(self.jslib('lib/jquery/jquery.min.js'))
        jslibs.append(self.jslib('lib/jQueryUI/jquery-ui-1.8.18.custom.min.js'))
        jslibs.append(self.jslib('lib/s_scripts.js'))
        jslibs.append(self.jslib('lib/jquery.ui.extend.js'))
        
        #CSS таблицы
        csslibs = []
        csslibs.append(self.csslib('foundation/stylesheets/foundation.css'))
        csslibs.append(self.csslib('lib/jQueryUI/css/Aristo/Aristo.css'))
        #csslibs.append("<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300' rel='stylesheet' />")
        #csslibs.append("<link href='http://fonts.googleapis.com/css?family=Terminal+Dosis' rel='stylesheet' />")
        csslibs.append("<!--[if lt IE 9]>")
        csslibs.append(self.csslib('foundation/stylesheets/ie.css'))
        #csslibs.append("<script src='http://html5shiv.googlecode.com/svn/trunk/html5.js'></script>")
        csslibs.append("<![endif]-->")
        
        #Глобальные переменные JavaScript
        jsglobal = '''
        //Базовые опции
        var home = '%s'
        ''' % request.route_url('home')
        
        #Функции JavaScript
        jsopts = []
        
        self.__resultparams = {'title': 'Админ панель::',
                               'stpath': request.static_url(staticpreurl),
                               'csslibs': csslibs,
                               'jslibs': jslibs,
                               'jsopts': jsopts,
                               'jsglobal': jsglobal,
                               'favicons': favicons(request),
                               'mainmenu': self.mainmenu,
                               'my': self.__user,
                               'temp': 'tmp',}
    
    @property
    def mainmenu(self):
        list1 = []
        i=0
        for e1 in mainmenu:
            if e1 == mainmenu[0]:
                first_el = 'first_el'
            else:
                first_el = ''
            if (i == self.index):
                selected = ' selected'
            else:
                selected = ''
            if e1[2] == 'no':
                lvl2 = ''
            else:
                lvl2 = '<ul style="display:none">'
                list2 = []
                submenu = e1[2]
                for e2 in submenu:
                    if e2[2] == 'no':
                        lvl3 = ''
                    else:
                        lvl3 = '<ul style="display:none">'
                        list3 = []
                        subsubmenu = e2[2]
                        for e3 in subsubmenu:
                            list3.append('<li><a href="/manager/' + e3[1] + '">' + e3[0] + '</a></li>')
                        lvl3 += '\n'.join(list3)
                        lvl3 += '</ul>'
                    if e2[1] == '':
                        href2 = 'javascript: void(0);'
                    else:
                        href2 = '/manager/' + e2[1]
                    list2.append('<li><a href="' + href2 + '">' + e2[0] + '</a>' + lvl3 + '</li>')
                lvl2 += '\n'.join(list2)
                lvl2 += '</ul>'
            if e1[1] == '':
                href1 = 'javascript: void(0);'
            else:
                href1 = '/manager/' + e1[1]
            list1.append('<li><a class="mb_parent ' + first_el + selected + '" href="' + href1 + '">' + e1[0] + '</a>' + lvl2 + '</li>')
            i += 1
        return '\n'.join(list1)
    
    
    @property
    def staticmrpreurl(self):
        return staticpreurl + 'manager/'
    
    @property
    def resultparams(self):
        return self.__resultparams
    
    @resultparams.setter
    def resultparams(self, value):
        self.__resultparams = value
        
    def jslib(self,  jspath, fromurl=0):
        if fromurl == 0:
            fromurl = self.staticmrpreurl
            return '<script type="text/javascript" src="%s"></script>' % self.request.static_url(fromurl + jspath)
        else:
            return '<script type="text/javascript" src="%s"></script>' % (self.request.route_url('manager') + fromurl + jspath)
    
    def csslib(self,  csspath):
        return '<link href="%s" rel="stylesheet">' % self.request.static_url(self.staticmrpreurl + csspath)
    
    def prerender(self, resultparams):
        resultparams['projecttitle'] = projecttitle
        resultparams['jslibs'].append(self.jslib('js/pertho.js'))
        resultparams['jslibs'] = '\n\t'.join(resultparams['jslibs'])
        resultparams['jsopts'] = '\n\t'.join(resultparams['jsopts'])
        resultparams['csslibs'].append(self.csslib('css/style.css'))
        resultparams['csslibs'] = '\n\t\t'.join(resultparams['csslibs'])
        return resultparams
