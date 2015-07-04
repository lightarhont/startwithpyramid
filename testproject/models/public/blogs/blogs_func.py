import transaction
import time

from testproject.models import DBSession
from testproject.models.models import Users, Blogs, TagsPosts, PostTags, Comments

def db_get_blogs(thread='blog'):
    r = DBSession.query(Blogs).all()
    for e in r:
        if e.comments == 1:
            e.comments_count = (DBSession.query(Comments)
            .filter(Comments.thread == thread).filter(Comments.published == 1)
            .filter(Comments.threadid == e.id).count())
    return r

def db_get_tagblogs(tag, thread='blog'):
    query = DBSession.query(Blogs)
    query = query.join(TagsPosts, Blogs.id == TagsPosts.post_id)
    query = query.join(PostTags, TagsPosts.tag_id == PostTags.id)
    r = query.filter(PostTags.name == tag).all()
    for e in r:
        if e.comments == 1:
            e.comments_count = (DBSession.query(Comments)
            .filter(Comments.thread == thread).filter(Comments.published == 1)
            .filter(Comments.threadid == e.id).count())
    return r

def db_get_blog(slug, thread='blog'):
    try:
        result = DBSession.query(Blogs).filter(Blogs.slug == slug).one()    
    except:
        result = False
    else:
        if result.comments == 1:
            result.comments_count = (DBSession.query(Comments)
            .filter(Comments.thread == thread).filter(Comments.published == 1)
            .filter(Comments.threadid == result.id).count())
        
        result.users
        result.tagslist = []
        for e2 in result.tags:
            result.tagslist.append(e2.name)
        
        result.viewed = result.viewed + 1
        
        try:
            transaction.commit()
        except:
            DBSession.rollback()
    
    return result

def db_get_populars():
    return DBSession.query(Blogs).all()

def db_get_tags():
    return DBSession.query(PostTags).all()

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)