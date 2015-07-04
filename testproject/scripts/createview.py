
import sys
import os
import shutil
from pyramid.path import AssetResolver

def main(argv=sys.argv):
    
    def tplpath():
        a = AssetResolver('testproject')
        resolver = a.resolve('scripts')
        return resolver.abspath()
    
    ptplpath = '/tplblank/views/'
    
    if len(argv) < 3:
        sourcepath = tplpath() + ptplpath + 'default.py'
    else:
        sourcepath = tplpath() + ptplpath + argv[2] +'.py'
        if not os.path.isfile(sourcepath):
            raise 'Нет такого шаблона!'
    
    pwd = os.getenv("PWD", os.getcwd())
    
    distpath = pwd + '/' + argv[1]+'.py'
    
    try:
        shutil.copy(sourcepath, distpath)
    except:
        status = 'Копирование не удалось!'
    else:
        status = 'Сделано!'
    
    print(status)