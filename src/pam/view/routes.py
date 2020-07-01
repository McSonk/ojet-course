
def includeme(config):
    # static components
    config.add_static_view(name='/css', path='../../web/css')
    config.add_static_view(name='/js', path='../../web/js')
    config.add_static_view(name='/img', path='../../web/img')
    config.scan('.')
