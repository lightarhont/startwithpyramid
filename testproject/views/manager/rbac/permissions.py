# -*- encoding: utf-8 -*-

from pyramid.view import view_config, view_defaults
from testproject.views.manager import *
from testproject.models.manager.rbac.permissions_func import (get_permissions2, count_permissions, get_permissions3, searchcount_permissions,
                                      get_permission2, find_permname, new_permission2, edit_permission2, delete_permissions)
import json

appconfig = {'pagelimit': 2,
             'orderbytable': {'2': 'id', '3': 'permname', '5': 'ordering'}}

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=deleteitems'))
def deleteitems(request):
    return delete_permissions(json.loads(request.POST.mixed()['delitems']))

@view_config(route_name='managerparam4', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=findpermname'))
def findrolename(request):
    if find_permname(request.POST.mixed()) != 0:
        result = False
    else:
        result = True
    return result

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=saveitem'))
def saveitem(request):
    post = request.POST.mixed()

    if post['id'] == '0':
        r = new_permission2(post)
        if r:
            return 1
        else:
            logwrite('Не удалось создать новое правило!')
            return 0
    else:
        r = edit_permission2(post)
        if r:
            return 1
        else:
            logwrite('Не удалось изменить правило!')
            return 0

@view_config(route_name='managerparam4', renderer='string', xhr=True, match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=searchcount'))
def permission_searchcount(request):
    return searchcount_permissions(request.POST.mixed())

@view_config(route_name='managerparam4', renderer='json', xhr=True, match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=count'))
def permissions_count(request):
    return {'number': count_permissions()}

@view_config(route_name='managerparam5', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=loaditem'))
def loaditem(request):
    item = get_permission2(int(request.matchdict['p5']))
    return {'id': item.id,
            'permname': item.permname,
            'description': item.description,
            'ordering': item.ordering,}

@view_config(route_name='managerparam6', renderer='json', xhr=True, request_method='POST', match_param=('p1=options', 'p2=control', 'p3=permissions', 'p4=data'))
def permissions_json(request):
    roles = get_permissions3(request.POST.mixed(), appconfig['orderbytable'], int(request.matchdict['p5']), int(request.matchdict['p6']))
    
    rows = []
    for e in roles:
        row = [str(e.id), e.permname, e.description, e.ordering]
        rows.append(row)
    
    return rows

@view_defaults(route_name='managerparam3')
class Control(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(renderer=tpl+'permissions.pt', match_param=('p1=options', 'p2=control', 'p3=permissions'))    
    def roles(self):
        resultparams = super().resultparams
        
        limit = appconfig['pagelimit']
        count = count_permissions()
        
        permissions = get_permissions2(offset=0, limit=limit)
        result = {'permissions': permissions}
        resultparams['result'] = result
        
        resultparams['title'] += 'Управление правилами'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        csslibs.append(super().csslib('lib/chosen/chosen.css'))
        csslibs.append(super().csslib('css/permissions.css'))
        
        #jslibs
        jslibs = resultparams['jslibs']
        jslibs.append(super().jslib('lib/jquerypaging/jquery.paging.min.js'))
        jslibs.append(super().jslib('lib/jquery.customforms.js'))
        jslibs.append(super().jslib('lib/chosen/chosen.jquery.min.js'))
        jslibs.append(super().jslib('lib/qtip2/jquery.qtip.min.js'))
        jslibs.append(super().jslib('lib/ui.spinner.js'))
        jslibs.append(super().jslib('lib/validate/jquery.validate.js'))
        
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
        
        jslibs.append(super().jslib('js/rbac/permissions.js'))
        
        #jsglobal
        resultparams['jsglobal'] += '''
                    
                    //Главный объект
                    var pageobj = {};
                    
                    pageobj.number = %s;
                    pageobj.limit  = %s;
                    pageobj.pstart = 1;
                    pageobj.pcurrent = 1;
                    pageobj.preurl = '%s/options/control/permissions/';
                    pageobj.sort   = {'col': 2, 'asc': 1};
                    pageobj.dotjsfolder = 'options/control/permissions/';
        
        ''' % (count, limit, self.request.route_url('manager'))
        
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