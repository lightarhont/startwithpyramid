# -*- encoding: utf-8 -*-

from testproject.views import *

tpl = m_tpl+'public/'

staticpreurl = m_staticpreurl

def favicons(request):
    return '<link rel="shortcut icon" href="' + request.static_url(staticpreurl + 'favicon.ico') + '" />\n\t\t<link rel="apple-touch-icon-precomposed" href="' + request.static_url(staticpreurl + 'icon.png') + '" />'

class Public():
    
    def __init__(self, request, index, nojquery=False, nodotjs=False, nofoundation=False):
        
        self.request = request
        self.__index = index
        self.__resultparams = {}
        
        #JS библиотеки
        jslibs = []
        
        #Функции JavaScript
        jsopts = []
        
        #CSS таблицы
        csslibs = []
        
        if not nojquery and not nodotjs:
            pass
            #jslibs.append(self.jslib('lib/bower_components/jquery/dist/jquery.min.js'))
        if not nodotjs:
            #jslibs.append(self.jslib('lib/doT.js'))
            self.__resultparams['dotjsopts'] = []
        if not nojquery and not nofoundation:
            #jslibs.append(self.jslib('lib/foundation/bower_components/foundation/js/vendor/modernizr.js'))
            #jslibs.append(self.jslib('lib/foundation/bower_components/foundation/js/foundation.js'))
            fstart = '''
            
            '''
            jsopts.append(fstart)
            csslibs.append(self.csslib('lib/foundation/bower_components/foundation/css/normalize.css'))
            csslibs.append(self.csslib('lib/foundation/bower_components/foundation/css/foundation.css'))
            csslibs.append(self.csslib('lib/foundation/stylesheets/app.css'))
        
        #Глобальные переменные JavaScript
        jsglobal = '''
        //Базовые опции
        var home = '%s'
        ''' % request.route_url('home')
        
        self.__resultparams['title'] = 'Проект::'
        self.__resultparams['stpath'] = request.static_url(staticpreurl)
        self.__resultparams['csslibs'] = csslibs
        self.__resultparams['jslibs'] = jslibs
        self.__resultparams['jsopts'] = jsopts
        self.__resultparams['jsglobal'] = jsglobal
        self.__resultparams['favicons'] = favicons(request)
        self.__resultparams['result'] = {}
        self.__resultparams['dotjs'] = {'nojquery': nojquery, 'nodotjs': nodotjs}
    
    def requirejs(self,  app, jspath):
        return '<script  data-main="%s" src="%s"></script>' % (self.request.static_url(self.staticmrpreurl + app), self.request.static_url(self.staticmrpreurl + jspath))
    
    def jslib(self,  jspath, fromurl=0):
        if fromurl == 0:
            fromurl = self.staticmrpreurl
            return '<script type="text/javascript" src="%s"></script>' % self.request.static_url(fromurl + jspath)
        else:
            return '<script type="text/javascript" src="%s"></script>' % (self.request.route_url('manager') + fromurl + jspath)
    
    def csslib(self,  csspath):
        return '<link href="%s" rel="stylesheet">' % self.request.static_url(self.staticmrpreurl + csspath)
    
    @property
    def staticmrpreurl(self):
        return staticpreurl + 'public/'
    
    @property
    def resultparams(self):
        return self.__resultparams
    
    @resultparams.setter
    def resultparams(self, value):
        self.__resultparams = value
    
    def prerender(self, resultparams):
        #resultparams['projecttitle'] = projecttitle
        resultparams['jslibs'] = '\n\t'.join(resultparams['jslibs'])
        
        resultparams['jsopts'] = '\n\t'.join(resultparams['jsopts'])
        resultparams['csslibs'] = '\n\t\t'.join(resultparams['csslibs'])
        return resultparams

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)
    