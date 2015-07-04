# -*- encoding: utf-8 -*-

from pyramid.view import view_config, view_defaults
from testproject.views.manager import *
from testproject.models.manager.rbac.users_func import (
    delete_users, get_user2, get_users, get_users2, new_user2, edit_user2,
    searchcount_user, count_user, find_username, find_email, get_roles
    )
import json

#Параметры
appconfig = {'timeformat': ('%Y-%m-%d %H:%M:%S', 'YYYY-MM-dd HH:mm:ss'),
            'pagelimit': 30,
            'orderbytable': {'2': 'id', '3': 'username', '4': 'email', '5': 'created', '6': 'activity'},
            'activitytime': 300}

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=deleteitems'))
def deleteitems(request):
    idsusers = json.loads(request.POST.mixed()['delitems'])
    for u in idsusers:
        removeuserdir(u)
    return delete_users(idsusers)

@view_config(route_name='managerparam4', xhr=True, renderer='string', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=saveitem'))
def saveitem(request):
    post = request.POST.mixed()
    roles = json.loads(post['roles'])

    if post['id'] == '0':
        u = new_user2(post, roles, m_useavatars)
        if u and m_useavatars == 1:
            if 'avatarsource' in post:
                copyavatars(post['avatarsource'], post['avatarsize1'], post['avatarsize2'], '0', str(u.id))
            return 1
        else:
            logwrite('Не удалось создать нового пользователя!')
            return 0  
    else:
        u = edit_user2(post, roles, m_useavatars)
        if u and m_useavatars == 1:
            if 'avatarsource' in post:
                copyavatars(post['avatarsource'], post['avatarsize1'], post['avatarsize2'], post['id'], post['id'])
            return 1
        else:
            logwrite('Не удалось изменить пользователя!')
            return 0

#Удаляет папку пользователя с указанным id
def removeuserdir(u):
    import shutil
    import os
    dstpath = m_staticpath() + m_staticuser + u
    if os.path.isdir(dstpath):
        try:
            shutil.rmtree(dstpath)
        except:
            logwrite('Не удалось удалить папку пользователя с id ' + u)
    else:
        pass
    

def copyavatars(avatarsource, avatarsize1, avatarsize2, suserid, duserid):
    #Копируем изображение
    import shutil
    import os
    from testproject.views.uatmp import fuserstmpimgfolder
            
    sourcedir = fuserstmpimgfolder + suserid + '/'
    tmp1 = sourcedir + avatarsource
    tmp2  = sourcedir + avatarsize1
    tmp3  = sourcedir + avatarsize2
            
    dstpath = m_staticpath() + m_staticuser + duserid
    if not os.path.isdir(dstpath):
        try:
            os.mkdir(dstpath)
        except IOError:
            logwrite("Каталог не был создан!") 
            raise  
            
    adstpath = dstpath + '/'  + 'avatars'
    if not os.path.isdir(adstpath):
        try:
            os.mkdir(adstpath)
        except IOError:
            logwrite("Каталог не был создан!")
            raise
    
    adstpath = adstpath + '/'
            
    path1 = adstpath + avatarsource
    path2 = adstpath + avatarsize1
    path3 = adstpath + avatarsize2
                    
    try:
        shutil.copy(tmp1, path1)
        shutil.copy(tmp2, path2)
        shutil.copy(tmp3, path3)
    except IOError:
        logwrite('Копирование не удалось!')
        raise

@view_config(route_name='managerparam4', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=findemail'))
def findemail(request):
    if find_email(request.POST.mixed()) != 0:
        result = False
    else:
        result = True
    return result

@view_config(route_name='managerparam4', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=findusername'))
def findusername(request):
    if find_username(request.POST.mixed()) != 0:
        result = False
    else:
        result = True
    return result

@view_config(route_name='managerparam5', xhr=True, renderer='json', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=loaditem'))
def loaditem(request):
    item = get_user2(int(request.matchdict['p5']))
    return {'id': item.id,
            'username': item.username,
            'email': item.email,
            'fullname': item.profiles.fullname,
            'avatar1': item.profiles.avatar1,
            'avatar2': item.profiles.avatar2,
            'avatar3': item.profiles.avatar3,
            'roles': userroles(item)}


@view_config(route_name='managerparam4', renderer='string', xhr=True, match_param=('p1=options', 'p2=control', 'p3=users', 'p4=searchcount'))
def user_searchcount(request):
    return searchcount_user(request.POST.mixed())

@view_config(route_name='managerparam4', renderer='json', xhr=True, match_param=('p1=options', 'p2=control', 'p3=users', 'p4=count'))
def user_count(request):
    return {'number': count_user()}

@view_config(route_name='managerparam6', renderer='json', xhr=True, request_method='POST', match_param=('p1=options', 'p2=control', 'p3=users', 'p4=data'))    
def users_json(request):
    
    users = get_users2(request.POST.mixed(), appconfig['orderbytable'], int(request.matchdict['p5']), int(request.matchdict['p6']))
    
    rows = []
    for e in users:
        row = [str(e.id), e.username, e.email, e.created, e.activity]
        rows.append(row)

    return rows

@view_defaults(route_name='managerparam3')
class Control(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(renderer=tpl+'users.pt', match_param=('p1=options', 'p2=control', 'p3=users'))    
    def users(self):
        resultparams = super().resultparams
        
        #Сюжет
        limit = appconfig['pagelimit']
        count = count_user()
        users = get_users(0, limit)
        roles = get_roles()
        allroles = []
        i = 0
        s = len(roles)
        while i<s:
            allroles.append([roles[i].id, roles[i].name, roles[i].rolesgroup])
            i += 1
        
        result = {'users': users, 'userstotal': count, 'roles': allroles, 'appconfig': appconfig}
        resultparams['result'] = result
        
        #Заголовок
        resultparams['title'] += 'Управление пользователями'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        csslibs.append(super().csslib('lib/chosen/chosen.css'))
        csslibs.append(super().csslib('lib/colorbox/example4/colorbox.css'))
        csslibs.append(super().csslib('css/users.css'))
        
        #jslibs
        jslibs = resultparams['jslibs']
        jslibs.append(super().jslib('lib/jquerypaging/jquery.paging.min.js'))
        jslibs.append(super().jslib('lib/jquery.customforms.js'))
        jslibs.append(super().jslib('lib/chosen/chosen.jquery.min.js'))
        jslibs.append(super().jslib('lib/qtip2/jquery.qtip.min.js'))
        jslibs.append(super().jslib('lib/validate/jquery.validate.js'))
        jslibs.append(super().jslib('lib/datef/datef.js'))
        jslibs.append(super().jslib('lib/colorbox/jquery.colorbox.js'))
        
        jslibs.append(super().jslib('lib/snippets/tplloader.js'))
        jslibs.append(super().jslib('lib/snippets/rand.js'))
        jslibs.append(super().jslib('lib/snippets/generate.js'))
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
        jslibs.append(super().jslib('lib/snippets/pirobox.js'))
        
        jslibs.append(super().jslib('js/rbac/users.js'))
        
        #jsglobal
        resultparams['jsglobal'] += '''
                    
                      //Главный объект
                      var pageobj = {};
                      
                      pageobj.number = %s;
                      pageobj.limit  = %s;
                      pageobj.pstart = 1;
                      pageobj.pcurrent = 1;
                      pageobj.preurl = '%s/options/control/users/';
                      pageobj.sort   = {'col': 2, 'asc': 1};
                      pageobj.allroles = %s;
                      pageobj.dataitem = {};
                      pageobj.activitytime = '%s';
                      pageobj.timeformat = '%s';
                      pageobj.dotjsfolder = 'options/control/users/';
                    
        ''' % (count, limit, self.request.route_url('manager'), json.dumps(allroles), appconfig['activitytime'], appconfig['timeformat'][1])
        
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
    