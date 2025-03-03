/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import VuetifyUseDialog from 'vuetify-use-dialog'
import VueFileAgentNext from '@boindil/vue-file-agent-next'

import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import '@/styles/index.css'

export function registerPlugins(app) {
  app

    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(Particles, {
      init: async (engine) => {
        await loadSlim(engine)
      },
    })
    .use(VueFileAgentNext)
    .use(VuetifyUseDialog, {
      snackbar: {
        showCloseButton: false,
        snackbarProps: {
          location: 'top',
          timeout: 1000,
          rounded: 'pill',
          multiLine: true,
          variant: 'tonal',
        },
      },
    })
}
