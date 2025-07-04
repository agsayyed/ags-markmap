// This file contains default parameters for the ags-markmap module
// which can be overridden in the site's config

import { defineConfig } from '../utils/config'

// Define the type for our module configuration
interface AgsMarkmapConfig {
  enable: boolean
  placement: 'top' | 'shortcode'
  height: string
  autoFit: boolean
  duration: number
}

// Export the default configuration
export default defineConfig<AgsMarkmapConfig>({
  enable: true,
  placement: 'top',
  height: '400px',
  autoFit: true,
  duration: 400
})
