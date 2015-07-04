# -*- encoding: utf-8 -*-

systemtmp = '/tmp'

m_staticfilesfolder = 'static/'

m_project = 'testproject'

def m_staticpath():
    from pyramid.path import AssetResolver
    a = AssetResolver(m_project)
    resolver = a.resolve(m_staticfilesfolder)
    return resolver.abspath()

m_statictmp = 'tmp/'
m_staticuser = 'users/'

m_staticpreurl = m_project+':'+m_staticfilesfolder
m_tpl = m_project+':templates/'
m_projecttitle = 'TESTPROJECT'

#Использовать аватары у пользователей
m_useavatars = 1
