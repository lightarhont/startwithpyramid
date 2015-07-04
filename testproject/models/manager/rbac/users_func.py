from sqlalchemy import (desc, asc)
import transaction

from testproject.models import setall, DBSession
from testproject.models.models import Users, Profiles, Roles, RolesUsers
from . import User_datefromtimestamp, User_activityparams
from testproject.libs.hash import hash_password

import time

#Форматирование даты и активности
def setallroute():
    setall([
    [Users, 'datefromtimestamp', User_datefromtimestamp],
    [Users, 'activityparams', User_activityparams]
    ])

#Получить все или срез
def get_users(offset=None, limit=None):
    
    #Форматирование даты и активности
    setallroute()
    
    if offset==None or limit==None:
        return DBSession.query(Users).all()
    else:
        return (DBSession.query(Users).all())[offset:limit]

#Получить по фильтру
def get_users2(post, orderbytable, offset, limit):
    
    #Форматирование даты и активности
    setallroute()
    
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
            filter = (dict(Users.__dict__))[post['lke']].like(phr)
            users = (DBSession.query(Users).filter(filter).order_by(ordering).all())[offset:limit]
    else:
        users = (DBSession.query(Users).order_by(ordering).all())[offset:limit]
    return users

#Количество найденых
def count_user():
    return DBSession.query(Users).count()

#Количество найденых по фильтру
def searchcount_user(post):
    phr = '%'+ post['phr'] +'%'
    filter = (dict(Users.__dict__))[post['lke']].like(phr)
    return DBSession.query(Users).filter(filter).count()

def get_user2(itemid):
    return DBSession.query(Users).filter(Users.id == itemid).one()

def get_user(username):
    user = DBSession.query(Users).filter(Users.username == username).all()
    if user:
        return user[0]
    else:
        return None

#Удалить пользователей по списку
def delete_users(delitems):
    try:
        for e in delitems:
            DBSession.query(Users).filter(Users.id == e).delete()
        transaction.commit()
        result = 1
    except:
        transaction.rollback()
        result = 0
    return result




def new_user2(post, roles, useavatars):
    
    ts = time.time()
    
    #Добавляем запись
    DBSession.autoflush = False
    
    if useavatars == 1 and 'avatarsource' in post:
    #Если используем аваторы
        addprofiles = Profiles(post['fullname'], post['avatarsource'], post['avatarsize1'], post['avatarsize2'])
    else:
        #Если нет
        addprofiles = Profiles(post['fullname'])
            
    u = Users(post['username'], post['email'], hash_password(post['password']), ts, 1, addprofiles)
        
    DBSession.add(u)
    DBSession.flush()
    DBSession.refresh(u)
        
    #Добавляем роли
    for e in roles:
        ru = RolesUsers(u.id, e)
        DBSession.add(ru)
        DBSession.flush()
            
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return u

def edit_user2(post, roles, useavatars):
    #Обновлеяем запись
    obj = get_user2(post['id'])
    if not obj:
        return False
    obj.username = post['username']
    obj.email    = post['email']
    obj.profiles.fullname = post['fullname']
    if useavatars == 1 and 'avatarsource' in post:
        obj.profiles.avatar1 = post['avatarsource']
        obj.profiles.avatar2 = post['avatarsize1']
        obj.profiles.avatar3 = post['avatarsize2']
    if post['password'] != '':
        obj.password = hash_password(post['password'])
        
    #Удаляем роли
    DBSession.query(RolesUsers).filter(RolesUsers.user_id == post['id']).delete()
            
    #Добавляем роли
    for e in roles:
        ru = RolesUsers(post['id'], e)
        DBSession.add(ru)   
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return True

def find_username(post):
    return DBSession.query(Users).filter(Users.username == post['setusername']).filter(Users.id != post['id']).count()

def find_email(post):
    return DBSession.query(Users).filter(Users.email == post['setemail']).filter(Users.id != post['id']).count()

def get_roles(offset=None, limit=None):
    if offset==None or limit==None:
        return DBSession.query(Roles).all()
    else:
        return DBSession.query(Roles).all()[offset:limit]