
def userroles(user, full=False):
    roles = []
    i = 0
    s = len(user.roles)
    while i<s:
        if full==False:
            roles.append(user.roles[i].id)
            i += 1
        else:
            roles.append((user.roles[i].id, user.roles[i].name, user.roles[i].rolesgroup, user.roles[i].description))
            i += 1
    return roles