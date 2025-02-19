/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// https://vuetifyjs.com/en/features/theme/#typescript
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          red: '#ffa6a6', // 自定義 red 顏色
          pink: '#f9a8d4', // 自定義 pink 顏色
          purple: '#decfff', // 自定義 purple 顏色
          blue: '#cff9ff', // 自定義 blue 顏色
          green: '#b9ffb3', // 自定義 green 顏色
          yellow: '#fffcaf', // 自定義 yellow 顏色
          orange: '#ffbf95', // 自定義 orange 顏色
          // 未設定其他顏色
          primary: '#FF4081', // 設定其他顏色
          secondary: '#6200EE',
          accent: '#FF5722',
          error: '#D32F2F',
          success: '#4CAF50',
          info: '#2196F3',
        },
      },
    },
  },
})
