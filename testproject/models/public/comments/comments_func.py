from sqlalchemy import (desc, asc)
import transaction
import time
from bbcode import Parser, g_parser, render_html

from testproject.models import setopt, DBSession
from testproject.models.models import Users, Comments

from . import Comments_datefromtimestamp

#Ввод комментариев
def get_comment(id):
    return DBSession.query(Comments).filter(Comments.id == id).one()

def add_comment(userid, thread, threadid, threadtitle, title, content):
    
    p = Parser()
    p.add_simple_formatter('video', '<object width="480" height="360"><embed src="http://www.youtube.com/v/%(value)s" type="application/x-shockwave-flash" width="480" height="360"></embed></object>')
    p.add_simple_formatter('img', '<img style="max-width:480px; max-height:400px;" src="%(value)s" alt="" />', replace_links=False)
    
    ts = int(time.time())
    
    DBSession.autoflush = False
    c = Comments(userid, thread, threadid, threadtitle, title, p.format(content), created=ts)
    DBSession.add(c)
    DBSession.flush()
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    return result

def edit_comment(itemid, title, content):
    
    ts = int(time.time())
    
    obj = get_comment(itemid)
    obj.title = title
    obj.content = content
    obj.last_edited = ts
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    return result

#Список комментариев
def count_comments(component, componentid):
    return (DBSession.query(Comments).filter(Comments.thread == component)
            .filter(Comments.threadid == componentid).filter(Comments.published == 1).count())

def get_comments(ordering, component, componentid, offset, limit):
    #Вывод с форматированием даты
    setopt(Comments, 'datefromtimestamp', Comments_datefromtimestamp)
    order_by = asc(ordering)
    return (DBSession.query(Comments).filter(Comments.thread == component).filter(Comments.threadid == componentid).order_by(order_by).all())[offset:limit]

def delete_comment(itemid):
    
    DBSession.query(Comments).filter(Comments.id == itemid).delete()
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    return result

def get_comments2(get, ordering='id', thread='blog', threadid=1, offset=0, limit=100):
    #Вывод с форматированием даты
    setopt(Comments, 'datefromtimestamp', Comments_datefromtimestamp)
    #order_by = asc(ordering)
    if get['sortorder'] == 'asc':
        order_by = asc(ordering)
    if get['sortorder'] == 'desc':
        order_by = desc(ordering)
    return (DBSession.query(Comments).filter(Comments.thread == thread)
            .filter(Comments.threadid == threadid).filter(Comments.published == 1)
            .order_by(order_by).all())[offset:limit]

def get_comment2(id, ordering='id', component='blog', componentid=1):
    #Вывод с форматированием даты
    setopt(Comments, 'datefromtimestamp', Comments_datefromtimestamp)
    return (DBSession.query(Comments).filter(Comments.id == id).filter(Comments.thread == component).filter(Comments.threadid == componentid).one())

def db_count_comments(thread, threadid):
    return (DBSession.query(Comments).filter(Comments.thread == thread)
            .filter(Comments.published == 1).filter(Comments.threadid == threadid).count())

def db_delete_comment(itemid):
    
    DBSession.query(Comments).filter(Comments.id == itemid).delete()
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    return result

def get_bbparser():
    
    p = Parser()
    p.add_simple_formatter('video', '<iframe width="450" height="340" src="https://www.youtube.com/embed/%(value)s?feature=player_embedded" frameborder="0" allowfullscreen></iframe>')
    p.add_simple_formatter('img', '<img style="max-width:480px; max-height:400px;" src="%(value)s" alt="" />', replace_links=False)
    
    return p
    

def db_add_comment(post):
    
    p = get_bbparser()
    
    content = p.format(post['content'])
    
    DBSession.autoflush = False
    c = Comments(post['userid'], post['thread'], post['threadid'], post['threadtitle'], post['title'],
                 content, post['created'])
    DBSession.add(c)
    DBSession.flush()
    DBSession.refresh(c)
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    u = DBSession.query(Users).filter(Users.id == post['userid']).one();
    
    return (result, content, c.id, u.profiles.avatar3)

def db_put_comment(itemid, post):
    
    p = get_bbparser()
    
    content = p.format(post['content'])
    
    obj = get_comment(itemid)
    obj.title = post['title']
    obj.content = content
    obj.last_edited = post['last_edited']
    
    try:
        transaction.commit()
        result = 1
    except:
        DBSession.rollback()
        result = 0
    
    return (result, content)