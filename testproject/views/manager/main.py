# -*- encoding: utf-8 -*-

from pyramid.response import Response
from pyramid.renderers import render
from pyramid.view import view_config

from . import *

class Main(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
    
    @view_config(route_name='managerparam', renderer=tpl+'main.pt', match_param=("p1=home"))
    @view_config(route_name='manager', renderer=tpl+'main.pt')
    def manager(self):
        resultparams = super().resultparams
        resultparams['title'] += 'Новости сайта'
        
        #csslibs
        csslibs = resultparams['csslibs']
        csslibs.append(super().csslib('lib/jQplot/jquery.jqplot.css'))
        csslibs.append(super().csslib('lib/fancybox/jquery.fancybox-1.3.4.css'))
        csslibs.append(super().csslib('lib/qtip2/jquery.qtip.min.css'))
        
        #jslibs
        jslibs = resultparams['jslibs']
        jslibs.append(super().jslib('lib/qtip2/jquery.qtip.min.js'))
        jslibs.append(super().jslib('lib/jQplot/jquery.jqplot.min.js'))
        jslibs.append(super().jslib('lib/jQplot/jqplot.plugins.js'))
        
        #jsopts
        jsopts = resultparams['jsopts']
        jsopts.append('''
            //* nested accordion
            prth_nested_accordion.init();
            
            //* drag&drop
            prth_drag.init();
            
            //* charts
            prth_charts.pl_plot1();
            prth_charts.pl_plot3();
                      ''')
        
        return super().prerender(resultparams)
    
    def param(self):
        result = render('testproject:templates/params.pt', {'foo':1, 'bar':2})
        return result

