from sqlalchemy import (desc, asc)
import transaction

from testproject.models import setall, DBSession
from testproject.models.models import Blogs, PostTags, TagsPosts, Users, Comments
from . import Post_datefromtimestamp, Post_datefromtimestamp2

import time

def setallroute():
    setall([
    [Blogs, 'datefromtimestamp', Post_datefromtimestamp],
    [Blogs, 'datefromtimestamp2', Post_datefromtimestamp2]
    ])

def count_posts():
    return DBSession.query(Blogs).count()

def get_posts(offset=None, limit=None):
    
    setallroute()
    
    if offset==None or limit==None:
        return DBSession.query(Blogs).all()
    else:
        return (DBSession.query(Blogs).all())[offset:limit]

def get_posts2(post, orderbytable, offset, limit):
    
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
            filter = (dict(Blogs.__dict__))[post['lke']].like(phr)
            blogs = (DBSession.query(Blogs).filter(filter).order_by(ordering).all())[offset:limit]
    else:
        blogs = (DBSession.query(Blogs).order_by(ordering).all())[offset:limit]
    return blogs

#Количество найденых
def count_post():
    return DBSession.query(Blogs).count()

#Количество найденых по фильтру
def searchcount_post(post):
    phr = '%'+ post['phr'] +'%'
    filter = (dict(Blogs.__dict__))[post['lke']].like(phr)
    return DBSession.query(Blogs).filter(filter).count()

def get_tags():
    return DBSession.query(PostTags).all()

def get_users():
    return DBSession.query(Users).all()

def get_post2(itemid):
    return DBSession.query(Blogs).filter(Blogs.id == itemid).one()

def new_post2(post, tags):
    
    ts = time.time()
    
    #Добавляем запись
    DBSession.autoflush = False
    
    p = Blogs(post['title'], post['alias'], post['userid'], post['into'], post['content'],
              post['published'], post['comments'], post['comments_premoderation'], ts)
    
    DBSession.add(p)
    DBSession.flush()
    DBSession.refresh(p)
    
    #Добавляем тэги
    for e in tags:
        pt = TagsPosts(p.id, e)
        DBSession.add(pt)
        DBSession.flush()
        
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return p

def edit_post2(post, tags):
    
    ts = time.time()
    
    obj = get_post2(post['id'])
    if not obj:
        return False
    obj.title = post['title']
    obj.slug = post['alias']
    obj.userid = post['userid']
    obj.intro = post['into']
    obj.content = post['content']
    obj.published = post['published']
    obj.comments = post['comments']
    obj.comments_premoderation = post['comments_premoderation']
    obj.last_edited = ts
    
    #Удаляем тэги
    DBSession.query(TagsPosts).filter(TagsPosts.post_id == post['id']).delete()
    
    #Добавляем тэги
    for e in tags:
        pt = TagsPosts(post['id'], e)
        DBSession.add(pt)
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return True

def delete_posts(delitems, thread='blog'):
    try:
        for e in delitems:
            DBSession.query(Blogs).filter(Blogs.id == e).delete()
            DBSession.query(Comments).filter(Comments.thread == thread).filter(Comments.threadid == e).delete()
        transaction.commit()
        result = 1
    except:
        transaction.rollback()
        result = 0
    return result
