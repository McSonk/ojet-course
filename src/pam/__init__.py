import logging

from pyramid.config import Configurator

from pam.db.session import config_tm

logger = logging.getLogger(__name__)

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        logger.debug('Setting db session...')
        config_tm(config)
        logger.debug('Setting routes...')
        config.include('.view.routes')
        logger.debug('Done!')
    logger.debug('Serving the app...')
    return config.make_wsgi_app()
