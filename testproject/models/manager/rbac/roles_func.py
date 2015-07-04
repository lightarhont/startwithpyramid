from sqlalchemy import (desc, asc)
import transaction

from testproject.models import setopt, DBSession
from testproject.models.models import Roles, Permissions, PermissionsRoles

from . import Roles_shortdesc

#Получить все или срез
def get_roles(offset=None, limit=None):
    
    #Добавить короткое описание
    setopt(Roles, 'shortdesc', Roles_shortdesc)
    
    if offset==None or limit==None:
        return DBSession.query(Roles).all()
    else:
        return DBSession.query(Roles).all()[offset:limit]

#Получить по фильтру    
def get_roles2(post, orderbytable, offset, limit):
    
    #Добавить короткое описание
    setopt(Roles, 'shortdesc', Roles_shortdesc)
    
    for key in orderbytable.keys():
        if post['col'] == key:
            order_by=orderbytable[key]
    
    if post['asc'] == '1':
        ordering = asc(order_by)
    if post['asc'] == '0':
        ordering = desc(order_by)
    
    if 'phr' in post:
        if post['phr'] != '':
            phr = '%'+ post['phr'] +'%'
            filter = (dict(Roles.__dict__))[post['lke']].like(phr)
            roles = (DBSession.query(Roles).filter(filter).order_by(ordering).all())[offset:limit]
    else:
        roles = (DBSession.query(Roles).order_by(ordering).all())[offset:limit]
    
    return roles

#Количество найденых
def count_roles():
    return DBSession.query(Roles).count()

#Количество найденых по фильтру
def searchcount_roles(post):
    phr = '%'+ post['phr'] +'%'
    filter = (dict(Roles.__dict__))[post['lke']].like(phr)
    return DBSession.query(Roles).filter(filter).count()



def find_rolename(post):
    return DBSession.query(Roles).filter(Roles.name == post['setrolename']).filter(Roles.id != post['id']).count()

def new_role2(post, permissions):
    #Добавляем запись
    DBSession.autoflush = False
    r = Roles(post['rolename'], post['rolegroup'], description=post['description'], ordering=post['order'])   
    DBSession.add(r)
    DBSession.flush()
    DBSession.refresh(r)
    
    #Добавляем права
    for e in permissions:
        pr = PermissionsRoles(r.id, e)
        DBSession.add(pr)
        DBSession.flush()
            
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return r

def edit_role2(post, permissions):
    #Обновлеяем запись
    obj = get_role2(post['id'])
    if not obj:
        return False
    obj.name = post['rolename']
    obj.rolesgroup = post['rolegroup']
    obj.description = post['description']
    obj.ordering = post['order']  
    
    #Удаляем роли
    DBSession.query(PermissionsRoles).filter(PermissionsRoles.role_id == post['id']).delete()
            
    #Добавляем роли
    for e in permissions:
        pr = PermissionsRoles(post['id'], e)
        DBSession.add(pr)  
    
    try:
        transaction.commit()
    except:
        transaction.rollback()
        return False
    else:
        return True

def get_role2(itemid):
    return DBSession.query(Roles).filter(Roles.id == itemid).one()

#Удалить роли по списку
def delete_roles(delitems):
    try:
        for e in delitems:
            DBSession.query(Roles).filter(Roles.id == e).delete()
        transaction.commit()
        result = 1
    except:
        transaction.rollback()
        result = 0
    return result

def get_permissions():
    return DBSession.query(Permissions).all()