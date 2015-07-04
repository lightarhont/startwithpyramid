from pyramid.view import view_config
from testproject.models.public.profile.profile_func import db_set_avatar, set_userpassword, get_userprofile, put_userprofile

p1 = ['p1=profile',]

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=avatar',])
def set_avatar(request):
    post = request.POST.mixed()
    if db_set_avatar(post):
        copyavatars(post['avatarsource'], post['avatarsize1'], post['avatarsize2'], post['id'], post['id'])
        result = True
    else:
        result = False
    return {'result': result}

@view_config(route_name='xhrpublicparam2', renderer='json', request_method='POST', match_param=p1+['p2=password',])
def put_password(request):
    post = request.json_body
    u = set_userpassword(post)
    if u:
        if u != 2:
            result = {'result': True}
        else:
            result = {'result': 2}
    else:
        result = {'result': False}
    return result

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='GET', match_param=p1+['p2=profile',])
def get_profile(request):
    itemid = int(request.matchdict['p3'])
    p = get_userprofile(itemid)
    return {'fullname': p.fullname}

@view_config(route_name='xhrpublicparam3', renderer='json', request_method='PUT', match_param=p1+['p2=profile',])
def put_profile(request):
    itemid = int(request.matchdict['p3'])
    post = request.json_body
    result = put_userprofile(itemid, post)
    return {'result': result}

def copyavatars(avatarsource, avatarsize1, avatarsize2, suserid, duserid):
    #Копируем изображение
    import shutil
    import os
    from testproject.views.uatmp import fuserstmpimgfolder
    from . import m_staticpath, m_staticuser
            
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

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)