from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import os
import time

def createhtml(slug):
    cap = dict(DesiredCapabilities.PHANTOMJS)
    cap["phantomjs.page.settings.userAgent"] = ('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36')
    driver = webdriver.PhantomJS(executable_path='/home/mikhail/node_modules/phantomjs/lib/phantom/bin/phantomjs', desired_capabilities=cap)
    try:
        driver.get('http://127.0.0.1:5000/#'+slug)
    except TimeoutException as e:
        print(e)
    else:
        time.sleep(5)
        htmldir = '/mnt/webserver/pythonproject/testproject/testproject/static/public/html/'
        path = os.path.dirname(slug)
        if path != '':
            for e in  path.split('/'):
                htmldir = htmldir+e+'/'
                os.mkdir(htmldir)
        with open(htmldir+os.path.basename(slug)+'.html', 'tw', encoding='utf-8') as f:
            f.write(driver.page_source + '\n')
    finally:
        driver.quit()
        
#createhtml('blog/Backbone-js-pridaet-structuru')

