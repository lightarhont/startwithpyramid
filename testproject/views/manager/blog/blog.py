# -*- encoding: utf-8 -*-

from pyramid.view import view_config, view_defaults
from testproject.views.manager import *
from testproject.models.manager.blog.posts_func import (count_posts, get_posts, get_tags, get_users, get_posts2, searchcount_post,
                                                        new_post2, edit_post2, delete_posts, count_post, get_post2)

import json

#Параметры
appconfig = {'timeformat': ('%Y-%m-%d %H:%M:%S', 'YYYY-MM-dd HH:mm:ss'),
            'pagelimit': 2,
            'orderbytable': {'2': 'id', '3': 'title', '4': 'published', '5': 'created', '6': 'last_edited'}}

@view_config(route_name='managerparam3', xhr=True, renderer='string', match_param=('p1=blog', 'p2=posts', 'p3=deleteitems'))
def deleteitems(request):
    idsposts = json.loads(request.POST.mixed()['delitems'])
    return delete_posts(idsposts)

@view_config(route_name='managerparam3', xhr=True, renderer='string', match_param=('p1=blog', 'p2=posts', 'p3=saveitem'))
def saveitem(request):
    post = request.POST.mixed()
    tags = json.loads(post['tags'])

    if post['id'] == '0':
        p = new_post2(post, tags)
        if p:
            return 1
        else:
            logwrite('Не удалось создать пост!')
            return 0  
    else:
        p = edit_post2(post, tags)
        if p:
            return 1
        else:
            logwrite('Не удалось изменить пост!')
            return 0

def posttags(post):
    tags = []
    i = 0
    while i<len(post.tags):
        tags.append(post.tags[i].id)
        i += 1
    return tags

@view_config(route_name='managerparam4', xhr=True, renderer='json', match_param=('p1=blog', 'p2=posts', 'p3=loaditem'))
def loaditem(request):
    item = get_post2(int(request.matchdict['p4']))
    return {'id': item.id,
            'title': item.title,
            'alias': item.slug,
            'userid': item.userid,
            'into': item.intro,
            'content': item.content,
            'published': item.published,
            'comments': item.comments,
            'comments_premoderation': item.comments_premoderation,
            'tags': posttags(item)}

@view_config(route_name='managerparam3', renderer='string', xhr=True, match_param=('p1=blog', 'p2=posts', 'p3=searchcount'))
def user_searchcount(request):
    return searchcount_post(request.POST.mixed())


@view_config(route_name='managerparam3', renderer='json', xhr=True, match_param=('p1=blog', 'p2=posts', 'p3=count'))
def user_count(request):
    return {'number': count_post()}

@view_config(route_name='managerparam5', renderer='json', xhr=True, request_method='POST', match_param=('p1=blog', 'p2=posts', 'p3=data'))    
def posts_json(request):
    
    posts = get_posts2(request.POST.mixed(), appconfig['orderbytable'], int(request.matchdict['p4']), int(request.matchdict['p5']))
    
    rows = []
    for e in posts:
        row = [str(e.id), e.title, e.published, e.created, e.last_edited]
        rows.append(row)

    return rows

@view_defaults(route_name='managerparam2')
class Control(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(renderer=tpl+'blog/posts.pt', match_param=('p1=blog', 'p2=posts'))    
    def users(self):
        resultparams = super().resultparams
        
        #Сюжет
        limit = appconfig['pagelimit']
        count = count_posts()
        posts = get_posts(0, limit)
        tags = get_tags()
        alltags = []
        i = 0
        s = len(tags)
        while i<s:
            alltags.append([tags[i].id, tags[i].name])
            i += 1
        
        allusers = get_users()
        
        def userslist(obj):
            result = []
            for e in obj:
                result.append([e.id, e.username])
            return result
        
        result = {'posts': posts, 'poststotal': count, 'tags': alltags, 'users': allusers, 'appconfig': appconfig}
        resultparams['result'] = result
        
        #Заголовок
        resultparams['title'] += 'Управление постами'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('css/blog/posts.css'))
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        csslibs.append(super().csslib('lib/chosen/chosen.css'))
        csslibs.append(super().csslib('lib/ibutton/css/jquery.ibutton.css'))
        
        #jslibs
        jslibs = resultparams['jslibs']
        jslibs.append(super().jslib('lib/jquerypaging/jquery.paging.min.js'))
        jslibs.append(super().jslib('lib/jquery.customforms.js'))
        jslibs.append(super().jslib('lib/chosen/chosen.jquery.min.js'))
        jslibs.append(super().jslib('lib/qtip2/jquery.qtip.min.js'))
        jslibs.append(super().jslib('lib/validate/jquery.validate.js'))
        jslibs.append(super().jslib('lib/datef/datef.js'))
        jslibs.append(super().jslib('lib/ibutton/jquery.ibutton.min.js'))
        jslibs.append(super().jslib('lib/ckeditor/ckeditor.js'))
        
        jslibs.append(super().jslib('lib/snippets/tplloader.js'))
        jslibs.append(super().jslib('lib/snippets/checkall.js'))
        jslibs.append(super().jslib('lib/snippets/totalpages.js'))
        jslibs.append(super().jslib('lib/snippets/paging.js'))
        jslibs.append(super().jslib('lib/snippets/filter.js'))
        jslibs.append(super().jslib('lib/snippets/filterclear.js'))
        jslibs.append(super().jslib('lib/snippets/orderby.js'))
        jslibs.append(super().jslib('lib/snippets/deleteitems.js'))
        jslibs.append(super().jslib('lib/snippets/funcs.js'))
        jslibs.append(super().jslib('lib/snippets/nebuttons.js'))
        jslibs.append(super().jslib('lib/snippets/tablemenufunc.js'))
        jslibs.append(super().jslib('lib/snippets/edititem.js'))
        
        jslibs.append(super().jslib('js/blog/posts.js'))
        
        #jsglobal
        resultparams['jsglobal'] += '''
                    
                    //Главный объект
                    var pageobj = {};
                    
                    pageobj.number = %s;
                    pageobj.limit  = %s;
                    pageobj.pstart = 1;
                    pageobj.pcurrent = 1;
                    pageobj.preurl = '%s/blog/posts/';
                    pageobj.sort   = {'col': 2, 'asc': 1};
                    pageobj.alltags = %s;
                    pageobj.allusers = %s; 
                    pageobj.dataitem = {};
                    pageobj.timeformat = '%s';
                    pageobj.dotjsfolder = 'blog/posts/';
                    
        ''' % (count, limit, self.request.route_url('manager'), json.dumps(alltags),
               json.dumps(userslist(allusers)), appconfig['timeformat'][1])
        
        #jsopts
        jsopts = resultparams['jsopts']
        jsopts.append('''
                    
                    //Экспорт шаблона редактирования
                    window.edittpl = cmtplloader(pageobj.dotjsfolder + 'edittpl');
                      
                    //Экспорт шаблона таблицы
                    window.trtabletpl = cmtplloader(pageobj.dotjsfolder + 'trtabletpl');
                    
                    window.newrestore = $('#tablefunc').html();
                    
                    //Запуск скриптов
                    pageobj.start();
                      
                    ''')
        
        return super().prerender(resultparams)

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)