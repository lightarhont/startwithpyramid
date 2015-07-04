# -*- encoding: utf-8 -*-

from pyramid.view import view_config, view_defaults
from testproject.views.manager import *
from testproject.models.manager.rbac.roles_func import (get_roles, get_roles2, searchcount_roles, count_roles, find_rolename,
                                      new_role2, get_role2, edit_role2, delete_roles, get_permissions)
import json

appconfig = {'pagelimit': 2,
             'orderbytable': {'2': 'id', '3': 'name', '4': 'rolesgroup', '6': 'ordering'}}

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=deleteitems'))
def deleteitems(request):
    return delete_roles(json.loads(request.POST.mixed()['delitems']))

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=saveitem'))
def saveitem(request):
    post = request.POST.mixed()
    permissions = json.loads(post['permissions'])

    if post['id'] == '0':
        r = new_role2(post, permissions)
        if r:
            return 1
        else:
            logwrite('Не удалось создать новую роль!')
            return 0
    else:
        r = edit_role2(post, permissions)
        if r:
            return 1
        else:
            logwrite('Не удалось изменить роль!')
            return 0

@view_config(route_name='managerparam4', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=findrolename'))
def findrolename(request):
    if find_rolename(request.POST.mixed()) != 0:
        result = False
    else:
        result = True
    return result

@view_config(route_name='managerparam4', renderer='string', xhr=True, match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=searchcount'))
def role_searchcount(request):
    return searchcount_roles(request.POST.mixed())

@view_config(route_name='managerparam4', renderer='json', xhr=True, match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=count'))
def roles_count(request):
    return {'number': count_roles()}

def rolepermissions(role, full=False):
    permissions = []
    i = 0
    s = len(role.permissions)
    while i<s:
        if full==False:
            permissions.append(role.permissions[i].id)
            i += 1
        else:
            permissions.append((role.permissions[i].id, role.permissions[i].permname, role.permissions[i].description))
            i += 1
    return permissions

@view_config(route_name='managerparam5', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=loaditem'))
def loaditem(request):
    item = get_role2(int(request.matchdict['p5']))
    return {'id': item.id,
            'rolename': item.name,
            'rolegroup': item.rolesgroup,
            'description': item.description,
            'ordering': item.ordering,
            'permissions': rolepermissions(item)}

@view_config(route_name='managerparam6', renderer='json', xhr=True, request_method='POST', match_param=('p1=options', 'p2=control', 'p3=roles', 'p4=data'))
def roles_json(request):
    roles = get_roles2(request.POST.mixed(), appconfig['orderbytable'], int(request.matchdict['p5']), int(request.matchdict['p6']))
    
    rows = []
    for e in roles:
        row = [str(e.id), e.name, e.rolesgroup, e.description, e.ordering]
        rows.append(row)
    
    return rows

@view_defaults(route_name='managerparam3')
class Control(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(renderer=tpl+'roles.pt', match_param=('p1=options', 'p2=control', 'p3=roles'))    
    def roles(self):
        resultparams = super().resultparams
        
        limit = appconfig['pagelimit']
        count = count_roles()
        
        permissions = get_permissions()
        allpermissions = []
        i = 0
        s = len(permissions)
        while i<s:
            allpermissions.append([permissions[i].id, permissions[i].permname])
            i += 1
        
        roles = get_roles(offset=0, limit=limit)
        result = {'roles': roles, 'permissions': permissions}
        resultparams['result'] = result
        
        resultparams['title'] += 'Управление ролями'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        csslibs.append(super().csslib('lib/chosen/chosen.css'))
        csslibs.append(super().csslib('css/roles.css'))
        
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
        
        jslibs.append(super().jslib('js/rbac/roles.js'))
        
        #jsglobal
        resultparams['jsglobal'] += '''
                    
                    //Главный объект
                    var pageobj = {};
                    
                    pageobj.number = %s;
                    pageobj.limit  = %s;
                    pageobj.pstart = 1;
                    pageobj.pcurrent = 1;
                    pageobj.preurl = '%s/options/control/roles/';
                    pageobj.sort   = {'col': 2, 'asc': 1};
                    pageobj.allpermissions = %s;
                    pageobj.dotjsfolder = 'options/control/roles/';
                    pageobj.rolesgroup = ['Users', 'Administrators'];
                    
                    
        ''' % (count, limit, self.request.route_url('manager'), json.dumps(allpermissions))
        
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