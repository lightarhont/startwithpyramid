from pyramid.view import view_config, view_defaults
from testproject.views.manager import *
from testproject.models.manager.rbac.blocks_func import (get_blocks, count_blocks, get_users, get_users_exclude,
                                      get_permissions_exclude, new_block2, edit_block2, get_blocks2,
                                      searchcount_blocks, get_block2, delete_blocks)

import json

appconfig = {'timeformat': ('%Y-%m-%d %H:%M:%S', 'YYYY-MM-dd HH:mm:ss'),
             'pagelimit': 2,
             'orderbytable': {'2': 'blocks.id', '3': 'users_1.username', '4': 'permissions.permname', '5': 'users_2.username', '6': 'blocks.datestart', '7': 'blocks.dateend'}}

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=deleteitems'))
def deleteitems(request):
    return delete_blocks(json.loads(request.POST.mixed()['delitems']))

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=saveitem'))
def saveitem(request):
    post = request.POST.mixed()

    if post['id'] == '0':
        r = new_block2(post)
        if r:
            return 1
        else:
            logwrite('Не удалось создать новую блокировку!')
            return 0
    else:
        r = edit_block2(post)
        if r:
            return 1
        else:
            logwrite('Не удалось изменить блокировку!')
            return 0

@view_config(route_name='managerparam5', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=loaditem'))
def loaditem(request):
    item = get_block2(int(request.matchdict['p5']))
    #logwrite(dir(item))
    return {'id': item[0].id,
            'userid': item[1].id,
            'username': item[1].username,
            'ruleid': item[2].id,
            'rulename': item[2].permname,
            'fromuserid': item[3].id,
            'fromusername': item[3].username,
            'datestart': item[0].datestart,
            'dateend': item[0].dateend,
            'comment': item[0].blockcomment}

@view_config(route_name='managerparam4', renderer='string', xhr=True, match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=searchcount'))
def user_searchcount(request):
    return searchcount_blocks(request.POST.mixed())

@view_config(route_name='managerparam4', renderer='json', xhr=True, match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=count'))
def blocks_count(request):
    return {'number': count_blocks()}

@view_config(route_name='managerparam6', renderer='json', xhr=True, request_method='POST', match_param=('p1=options', 'p2=control', 'p3=blocks', 'p4=data'))
def roles_json(request):
    roles = get_blocks2(request.POST.mixed(), appconfig['orderbytable'], int(request.matchdict['p5']), int(request.matchdict['p6']))
    
    rows = []
    for e in roles:
        row = [str(e[0].id), e[1].username, e[2].permname, e[3].username, e[0].datestart, e[0].dateend]
        rows.append(row)
    
    return rows

@view_defaults(route_name='managerparam3')
class Control(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(renderer=tpl+'blocks.pt', match_param=('p1=options', 'p2=control', 'p3=blocks'))    
    def blocks(self):
        resultparams = super().resultparams
        
        limit = appconfig['pagelimit']
        count = count_blocks()
        allusers = get_users()
        exlusers = get_users_exclude((1,))
        exlpermissons = get_permissions_exclude((3,))
        
        resultparams['result'] = {'blocks': get_blocks(offset=0, limit=limit),
                                  'users': allusers,
                                  'excusers': exlusers,
                                  'permissions': exlpermissons}
        
        def userslist(obj):
            result = []
            for e in obj:
                result.append([e.id, e.username])
            return result
        
        def permlist(obj):
            result = []
            for e in obj:
                result.append([e.id, e.permname])
            return result
        
        #Заголовок
        resultparams['title'] += 'Управление блокировками'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        csslibs.append(super().csslib('lib/chosen/chosen.css'))
        csslibs.append(super().csslib('css/blocks.css'))
        
        #jslibs
        jslibs = resultparams['jslibs']
        jslibs.append(super().jslib('lib/jquerypaging/jquery.paging.min.js'))
        jslibs.append(super().jslib('lib/jquery.customforms.js'))
        jslibs.append(super().jslib('lib/timepicker/jquery-ui-timepicker-addon.js'))
        jslibs.append(super().jslib('lib/chosen/chosen.jquery.min.js'))
        jslibs.append(super().jslib('lib/qtip2/jquery.qtip.min.js'))
        jslibs.append(super().jslib('lib/validate/jquery.validate.js'))
        jslibs.append(super().jslib('lib/datef/datef.js'))
        
        jslibs.append(super().jslib('lib/snippets/tplloader.js'))
        jslibs.append(super().jslib('lib/snippets/checkall.js'))
        jslibs.append(super().jslib('lib/snippets/totalpages.js'))
        jslibs.append(super().jslib('lib/snippets/paging2.js'))
        jslibs.append(super().jslib('lib/snippets/filter.js'))
        jslibs.append(super().jslib('lib/snippets/filterclear.js'))
        jslibs.append(super().jslib('lib/snippets/orderby.js'))
        jslibs.append(super().jslib('lib/snippets/deleteitems.js'))
        jslibs.append(super().jslib('lib/snippets/funcs.js'))
        jslibs.append(super().jslib('lib/snippets/nebuttons.js'))
        jslibs.append(super().jslib('lib/snippets/tablemenufunc.js'))
        jslibs.append(super().jslib('lib/snippets/edititem.js'))
        
        jslibs.append(super().jslib('js/rbac/blocks.js'))
        
        #jsglobal
        resultparams['jsglobal'] += '''
        
                    //Главный объект
                    var pageobj = {};
        
                    pageobj.number = %s;
                    pageobj.limit  = %s;
                    pageobj.pstart = 1;
                    pageobj.pcurrent = 1;
                    pageobj.preurl = '%s/options/control/blocks/';
                    pageobj.sort   = {'col': 2, 'asc': 1};
                    pageobj.allusers = %s;
                    pageobj.exlusers = %s;
                    pageobj.exlpermissons = %s;
                    pageobj.timeformat = '%s';
                    pageobj.dotjsfolder = 'options/control/blocks/';
                    
        ''' % (count, limit, self.request.route_url('manager'), json.dumps(userslist(allusers)), json.dumps(userslist(exlusers)), json.dumps(permlist(exlpermissons)), appconfig['timeformat'][1])
        
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