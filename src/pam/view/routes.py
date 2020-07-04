
def includeme(config):
    # static components
    config.add_static_view(name='/css', path='../../web/css')
    config.add_static_view(name='/js', path='../../web/js')
    config.add_static_view(name='/img', path='../../web/img')

    config.add_route('home', '/index.html')
    config.add_route('personas', '/persona/')
    config.add_route('get_persona_info', '/persona/{id_persona}/')
    config.scan('.')
