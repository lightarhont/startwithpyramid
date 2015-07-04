from testproject.models.common_func import activity_user
from pyramid.events import subscriber
from pyramid.events import NewResponse

@subscriber(NewResponse)
def add_global(event):
    if hasattr(event.request.matched_route, 'name'):
        rn = event.request.matched_route.name
        if rn != '__static/' and rn != 'debugtoolbar':
            if event.request.authenticated_userid:
                activity_user(event.request.authenticated_userid)
                