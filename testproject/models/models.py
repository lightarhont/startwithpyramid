from sqlalchemy import (Column, Integer, Unicode, Text, ForeignKey)
#from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import (relationship, backref)

import time

from testproject.models import Base

class IDB:
    __table_args__ = {'mysql_engine':'InnoDB', 'mysql_collate': 'utf8_general_ci'}

class PKID:
    id = Column(Integer, primary_key=True)

class HeatBase:
    
    def __setitem__(self, key, value):
        setattr(self, key, value)

    def __getitem__(self, key):
        return getattr(self, key)

class Users(IDB, PKID, Base):
    
    __tablename__ = 'users'
    
    username = Column(Unicode(32), unique=True)
    email    = Column(Unicode(32), unique=True)
    password = Column(Unicode(255))
    created = Column(Integer)
    activity = Column(Integer)
    
    roles = association_proxy('roles_users', 'roles')
    profiles = relationship("Profiles", uselist=False)
    usersactivation = relationship("UsersActivation", uselist=False)
    
    def __init__(self, username, email, password, created, activity=None, profiles=None, roles=None, usersactivation=None):
        self.username = username
        self.email    = email
        self.password = password
        self.created = created
        if activity:
            self.activity = activity
        if profiles:
            self.profiles = profiles
        if roles:
            self.roles  = roles
        if usersactivation:
            self.usersactivation = usersactivation

class Profiles(IDB, PKID, Base):
    
    __tablename__ = 'profiles'
    
    userid = Column(Integer, ForeignKey('users.id'))
    
    fullname  = Column(Unicode(64))
    avatar1   = Column(Unicode(32))
    avatar2   = Column(Unicode(32))
    avatar3   = Column(Unicode(32))
    
    def __init__(self, fullname, userid=None, register=None, lastlogin=None, expired=None, avatar1=None, avatar2=None, avatar3=None):
        if userid:
            self.userid = userid
        self.fullname  = fullname
        if avatar1:
            self.avatar1   = avatar1
        if avatar2:
            self.avatar2   = avatar2
        if avatar3:
            self.avatar3   = avatar3


class Roles(IDB, PKID, Base):
    
    __tablename__ = 'roles'
    
    name        = Column(Unicode(16))
    rolesgroup  = Column(Unicode(16))
    description = Column(Unicode(255))
    ordering    = Column(Integer)
    
    permissions = association_proxy('perms_roles', 'permissions')
    users = association_proxy('roles_users', 'users')
    
    def __init__(self, name, rolesgroup, description=None, ordering=None):
        self.name = name
        self.rolesgroup = rolesgroup
        if description:
            self.description = description
        if ordering:
            self.ordering = ordering

class Permissions(IDB, PKID, Base):
    
    __tablename__ = 'permissions'
    
    permname = Column(Unicode(24), unique=True)
    description = Column(Unicode(255))
    ordering    = Column(Integer)
    
    def __init__(self, permname, description=None, ordering=None):
        self.permname = permname
        if description:
            self.description = description
        if ordering:
            self.ordering = ordering
    
class Blocks(IDB, PKID, Base):
    
    __tablename__ = 'blocks'
    
    user_id = Column(Integer, ForeignKey('users.id'))
    permission_id = Column(Integer, ForeignKey('permissions.id'))
    fromuser_id = Column(Integer, ForeignKey('users.id'))
    
    datestart = Column(Integer)
    dateend = Column(Integer)
    blockcomment = Column(Unicode(255))
    
    users = relationship('Users', uselist=False, primaryjoin='Users.id == Blocks.user_id')
    permissions = relationship("Permissions", uselist=False)
    fusers = relationship('Users', uselist=False, primaryjoin="Users.id == Blocks.fromuser_id")
    
    def __init__(self, user_id, permission_id, fromuser_id, datestart, dateend, blockcomment=None):
        self.user_id = user_id
        self.permission_id = permission_id
        self.fromuser_id = fromuser_id
        self.datestart = datestart
        self.dateend = dateend
        if blockcomment:
            self.blockcomment = blockcomment

class PermissionsRoles(IDB, Base):
    
    __tablename__ = 'perms_roles'
    
    perm_id = Column(Integer, ForeignKey('permissions.id'), primary_key=True)
    role_id = Column(Integer, ForeignKey('roles.id'), primary_key=True)
    
    permissions = relationship('Permissions', backref=backref("perms_roles"))
    roles = relationship('Roles', backref=backref("perms_roles"))
    
    def __init__(self, role_id, perm_id):
        self.perm_id = perm_id
        self.role_id = role_id
    
class RolesUsers(IDB, Base):
    
    __tablename__ = 'roles_users'
    
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    role_id = Column(Integer, ForeignKey('roles.id'), primary_key=True)
    
    users = relationship('Users', backref=backref('roles_users'))
    roles = relationship('Roles', backref=backref('roles_users'))
    
    def __init__(self, user_id, role_id):
        self.user_id = user_id
        self.role_id = role_id

class AccessLog(IDB, PKID, Base):
    
    __tablename__ = 'accesslog'
    
    ip = Column(Unicode(16))
    event_id = Column(Integer, ForeignKey('accesslogevents.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    description = Column(Unicode(255))
    eventdate = Column(Integer)
    
    events = relationship('AccessLogEvents', uselist=False)
    users = relationship('Users', uselist=False)
    
    def __init__(self, ip, event_id, user_id=None, description=None, eventdate=None):
        self.ip = ip
        self.event_id = event_id
        if user_id:
            self.user_id = user_id
        else:
            self.user_id = 0
        if description:
            self.description = description
        else:
            self.description = ''
        if eventdate:
            self.eventdate = eventdate
        else:
            self.eventdate = int(time.time())
        

class AccessLogEvents(IDB, PKID, Base):
    
    __tablename__ = 'accesslogevents'
    
    description = Column(Unicode(255))
    
    def __init__(self):
        pass

class Comments(IDB, PKID, Base):
    
    __tablename__ = 'comments'
    
    userid = Column(Integer, ForeignKey('users.id'))
    
    thread = Column(Unicode(32))
    threadid    = Column(Unicode(64))
    threadtitle = Column(Unicode(64))
    title       = Column(Unicode(64))
    content     = Column(Text)
    created     = Column(Integer)
    last_edited = Column(Integer)
    published = Column(Integer)
    
    users = relationship('Users', uselist=False)
    
    def __init__(self, userid, thread, threadid, threadtitle, title, content, created=None, last_edited=None, published=1):
        self.userid = userid
        self.thread = thread
        self.threadid = threadid
        self.threadtitle = threadtitle
        self.title = title
        self.content = content
        if created:
            self.created = created
        if last_edited:
            self.last_edited = last_edited
        self.published = published

class Blogs(IDB, PKID, Base):
    
    __tablename__ = 'blogs'
    
    slug = Column(Unicode(120))
    userid = Column(Integer, ForeignKey('users.id'))
    title = Column(Unicode(100))
    intro = Column(Text)
    content = Column(Text)
    comments = Column(Integer)
    comments_premoderation = Column(Integer)
    last_edited = Column(Integer)
    created = Column(Integer)
    viewed = Column(Integer)
    published = Column(Integer)
    
    tags = association_proxy('tags_posts', 'posttags')
    users = relationship('Users', uselist=False)
    
    def __init__(self, title, slug, userid, intro, content, published, comments, comments_premoderation, created, last_edited=None, viewed=0):
        self.slug = slug
        self.userid = userid
        self.title = title
        self.intro = intro
        self.content = content
        self.published = published
        self.comments = comments
        self.comments_premoderation = comments_premoderation
        self.created = created
        if last_edited:
            self.last_edited = last_edited
        self.viewed = viewed

class PostTags(IDB, PKID, Base):
    
    __tablename__ = 'posttags'
    
    name = Column(Unicode(30))
    description = Column(Unicode(255))
    
    def __init__(self, name, description=None):
        self.name = name
        if description:
            self.description = description
        

class TagsPosts(IDB, Base):
    
    __tablename__ = 'tags_posts'
    
    post_id = Column(Integer, ForeignKey('blogs.id'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('posttags.id'), primary_key=True)
    
    posts = relationship('Blogs', backref=backref('tags_posts'))
    posttags = relationship('PostTags', backref=backref('tags_posts'))
    
    def __init__(self, post_id, tag_id):
        self.post_id = post_id
        self.tag_id = tag_id

class UsersActivation(IDB, PKID, Base):
    
    __tablename__ = 'users_activation'
    
    userid = Column(Integer, ForeignKey('users.id'))
    code = Column(Unicode(100))
    life = Column(Integer)
    
    def __init__(self, code, life):
        self.code = code
        self.life = life

class SiteMap(IDB, PKID, Base):
    
    __tablename__ = 'sitemap'
    
    mapgroup = Column(Integer)
    maptype = Column(Integer)
    location = Column(Unicode(255))
    lastmodifed = Column(Integer)
    changefreq = Column(Integer)
    priority = Column(Unicode(5))
    
    def __init__(self, mapgroup, maptype, location, lastmodifed, changefreq, priority):
        self.mapgroup = mapgroup
        self.maptype = maptype
        self.lastmodifed = lastmodifed
        self.changefreq = changefreq
        self.priority = priority
    