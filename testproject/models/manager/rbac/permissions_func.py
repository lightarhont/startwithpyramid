from sqlalchemy import (desc, asc)
import transaction

from testproject.models import setopt, DBSession
from testproject.models.models import Permissions

from . import Permissions_shortdesc

#Получить все или срез
def get_permissions2(offset=None, limit=None):
    
    #Добавить короткое описание
    setopt(Permissions, 'shortdesc', Permissions_shortdesc)
    
    if offset==None or limit==None:
        return DBSession.query(Permissions).all()
    else:
        return DBSession.query(Permissions).all()[offset:limit]

#Получить по фильтру
def get_permissions3(post, orderbytable, offset, limit):
    
    #Добавить короткое описание
    setopt(Permissions, 'shortdesc', Permissions_shortdesc)
    
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
            logwrite(post['lke'])
            filter = (dict(Permissions.__dict__))[post['lke']].like(phr)
            roles = (DBSession.query(Permissions).filter(filter).order_by(ordering).all())[offset:limit]
    else:
        roles = (DBSession.query(Permissions).order_by(ordering).all())[offset:limit]
    
    return roles

#Количество найденых
def count_permissions():
    return DBSession.query(Permissions).count()

#Количество найденых по фильтру
def searchcount_permissions(post):
    phr = '%'+ post['phr'] +'%'
    filter = (dict(Permissions.__dict__))[post['lke']].like(phr)
    return DBSession.query(Permissions).filter(filter).count()

def get_permission2(itemid):
    return DBSession.query(Permissions).filter(Permissions.id == itemid).one()

def find_permname(post):
    return DBSession.query(Permissions).filter(Permissions.permname == post['setpermname']).filter(Permissions.id != post['id']).count()

def new_permission2(post):
    #Добавляем запись
    DBSession.autoflush = False
    r = Permissions(post['permname'], description=post['description'], ordering=post['order'])   
    DBSession.add(r)
    DBSession.flush()
    DBSession.refresh(r)
            
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return r

def edit_permission2(post):
    #Обновлеяем запись
    obj = get_permission2(post['id'])
    if not obj:
        return False
    obj.permname = post['permname']
    obj.description = post['description']
    obj.ordering = post['order'] 
    
    try:
        transaction.commit()
    except:
        transaction.rollback()
        return False
    else:
        return True

#Удалить правила по списку
def delete_permissions(delitems):
    try:
        for e in delitems:
            DBSession.query(Permissions).filter(Permissions.id == e).delete()
        transaction.commit()
        result = 1
    except:
        transaction.rollback()
        result = 0
    return result
