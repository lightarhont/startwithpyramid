from sqlalchemy.orm import aliased
from sqlalchemy import (desc, asc)
import transaction

from testproject.models import setall, DBSession
from testproject.models.models import Blocks, Users, Permissions

from . import Blocks_datefromtimestamp1, Blocks_datefromtimestamp2

#Дата и активные начала и конца
def setallroute():
    setall([
    [Blocks, 'datefromtimestamp1', Blocks_datefromtimestamp1],
    [Blocks, 'datefromtimestamp2', Blocks_datefromtimestamp2]
    ])

#Получить все или срез
def get_blocks(offset=None, limit=None):
    
    #Дата и активные начала и конца
    setallroute()
    
    busers = aliased(Users)
    fusers = aliased(Users)
    if offset==None or limit==None:
        query = DBSession.query(Blocks, busers, Permissions, fusers)
        query = query.join(busers, busers.id == Blocks.user_id)
        query = query.join(Permissions, Permissions.id == Blocks.permission_id)
        query = query.join(fusers, fusers.id == Blocks.fromuser_id)
        return query.all()
    else:
        query = DBSession.query(Blocks, busers, Permissions, fusers)
        query = query.join(busers, busers.id == Blocks.user_id)
        query = query.join(Permissions, Permissions.id == Blocks.permission_id)
        query = query.join(fusers, fusers.id == Blocks.fromuser_id)
        return query.all()[offset:limit]

#Получить по фильтру
def get_blocks2(post, orderbytable, offset, limit):
    
    #Дата и активные начала и конца
    setallroute()
    
    busers = aliased(Users)
    fusers = aliased(Users)
    
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
            filter = eval(post['lke']).like(phr)
            query = DBSession.query(Blocks, busers, Permissions, fusers)
            query = query.join(busers, busers.id == Blocks.user_id)
            query = query.join(Permissions, Permissions.id == Blocks.permission_id)
            query = query.join(fusers, fusers.id == Blocks.fromuser_id)
            blocks = query.filter(filter).order_by(ordering).all()[offset:limit]
    else:
        query = DBSession.query(Blocks, busers, Permissions, fusers)
        query = query.join(busers, busers.id == Blocks.user_id)
        query = query.join(Permissions, Permissions.id == Blocks.permission_id)
        query = query.join(fusers, fusers.id == Blocks.fromuser_id)
        blocks = query.order_by(ordering).all()[offset:limit]
    
    return blocks

#Количество найденых
def count_blocks():
    return DBSession.query(Blocks).count()

#Количество найденых по фильтру
def searchcount_blocks(post):
    
    busers = aliased(Users)
    fusers = aliased(Users)
    
    phr = '%'+ post['phr'] +'%'
    filter = eval(post['lke']).like(phr)
    
    query = DBSession.query(Blocks, busers, Permissions, fusers)
    query = query.join(busers, busers.id == Blocks.user_id)
    query = query.join(Permissions, Permissions.id == Blocks.permission_id)
    query = query.join(fusers, fusers.id == Blocks.fromuser_id)
    return query.filter(filter).count()

def get_users(offset=None, limit=None):
    if offset==None or limit==None:
        return DBSession.query(Users).all()
    else:
        return (DBSession.query(Users).all())[offset:limit]

def get_users_exclude(exl_list):
    query = DBSession.query(Users)
    for e in exl_list:
        query = query.filter(Users.id != e)
    return query.all()

def get_permissions_exclude(exl_list):
    query = DBSession.query(Permissions)
    for e in exl_list:
        query = query.filter(Permissions.id != e)
    return query.all()

def new_block2(post):
    b = Blocks(post['blockeduser'], post['ruleblock'], post['fromuser'], post['datestart'], post['dateend'], post['blockcomment'])
    DBSession.add(b)
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return b    

def edit_block2(post):
    obj = get_block(post['id'])
    if not obj:
        return False
    obj.user_id = post['blockeduser']
    obj.permission_id = post['ruleblock']
    obj.fromuser_id = post['fromuser']
    obj.datestart = post['datestart']
    obj.dateend = post['dateend']
    obj.blockcomment = post['blockcomment']
    
    try:
        transaction.commit()
    except:
        transaction.rollback()
        return False
    else:
        return True

def get_block2(itemid):
    
    busers = aliased(Users)
    fusers = aliased(Users)
    
    query = DBSession.query(Blocks, busers, Permissions, fusers)
    query = query.join(busers, busers.id == Blocks.user_id)
    query = query.join(Permissions, Permissions.id == Blocks.permission_id)
    query = query.join(fusers, fusers.id == Blocks.fromuser_id)
    
    return query.filter(Blocks.id == itemid).one()

#Удалить пользователей по списку
def delete_blocks(delitems):
    try:
        for e in delitems:
            DBSession.query(Blocks).filter(Blocks.id == e).delete()
        transaction.commit()
        result = 1
    except:
        transaction.rollback()
        result = 0
    return result
