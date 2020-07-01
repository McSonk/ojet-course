import logging

from pyramid.config import Configurator

logger = logging.getLogger(__name__)

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        logger.debug('Setting routes...')
        config.include('.view.routes')
        logger.debug('Done!')
    logger.debug('Serving the app...')
    return config.make_wsgi_app()
