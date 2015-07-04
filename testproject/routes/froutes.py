broutes = {'blogs': 'blogs', 'blogstag': 'blogs/tag/{tag}', 'blog': 'blog/{slug}', 'logout': 'logout', 'login': 'login',
                  'registration': 'registration', 'useractivation': 'useractivation/{ticket}', 'userprofile': 'user/{param}',
                  'rememberpassword': 'rememberpassword'}

def froutes():
    result = {}
    for e in broutes.items():
        result[e[0]] = e[1].replace('}', '').replace('{', ':')
    return result