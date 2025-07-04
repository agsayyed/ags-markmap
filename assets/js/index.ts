import log from '../utils/logger'

log.separator('index.ts: starting importing modules one by one')

// Import module components
import './types/ags-markmap.types'
import './config/ags-markmap.config'
// Import other components as needed

log.debug('Module components loaded')

log.separator('index.ts: Finish Module importing')
