log.debug('index.ts: starting importing modules one by one');
import './types/markmap.types';
import './config/configuration';
import './utils/logger';
import './content/contentParser';
import './content/nodeFactory';
import './content/treeBuilder';
import './rendering/dependencyLoader';
import './rendering/svgRenderer';
import './core/agsMarkmap';
import log from './utils/logger';
import './markmapMain';

log.debug(
  '/types/markmap.types loaded\n' +
    '/config/configuration loaded\n' +
    '/utils/logger loaded\n' +
    '/content/contentParser loaded\n' +
    '/content/nodeFactory loaded\n' +
    '/content/treeBuilder loaded\n' +
    '/rendering/dependencyLoader loaded\n' +
    '/rendering/svgRenderer loaded\n' +
    '/core/agsMarkmap loaded\n' +
    '/markmapMain loaded\n'
);

log.separator('index.ts: Finish Module importing');
