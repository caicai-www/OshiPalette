<template>
  <!-- <div id="app">
    <v-card height="500px"
      ><vue-particles
        id="tsparticles"
        url="http://foo.bar/particles.json"
        @particles-loaded="particlesLoaded" />

      <vue-particles id="tsparticles" :options="dynamicOptions" @particles-loaded="particlesLoaded"
    /></v-card>
  </div> -->

  <!-- https://vuetifyjs.com/en/components/sheets/#color -->

  <v-container class="bg-info mt-5" fluid>
    <v-row class="flex-child justify-center">
      <v-col cols="12" md="4" class="d-flex">
        <v-row class="ma-n3">
          <!-- 第一欄 照片-->
          <v-col v-for="(item, index) in firstColItems" :key="index" cols="3">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
            </v-sheet>
          </v-col>

          <v-col v-for="(item, index) in thirdColItems" :key="index" cols="12">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="400"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <!-- 第二欄  -->
      <v-col cols="12" md="4" class="d-flex">
        <v-row class="ma-n3">
          <v-col v-for="(item, index) in secondColItems" :key="index" cols="3">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
            </v-sheet>
          </v-col>

          <v-col v-for="(item, index) in fourthColItems" :key="index" cols="12">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="400"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4" class="d-flex ma-n3">
        <v-col cols="12">
          <v-sheet class="d-flex" color="bg-blue" height="574">
            <sheet-footer> #1: (3r x 2c) </sheet-footer>
          </v-sheet>
        </v-col>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row class="flex-child text-subtitle-2">
      <v-col class="d-flex" cols="12" md="4">
        <v-sheet class="d-flex" color="grey-lighten-3" height="424">
          <sheet-footer> #1: (3r x 2c) </sheet-footer>
        </v-sheet>
      </v-col>

      <v-col class="d-flex" cols="12" md="4">
        <v-row class="ma-n3">
          <v-col cols="6">
            <v-sheet class="d-flex" color="green-lighten-3" height="150">
              <sheet-footer> #2: (1r x 1c) </sheet-footer>
            </v-sheet>
          </v-col>

          <v-col cols="6">
            <v-sheet class="d-flex" color="yellow-lighten-3" height="150">
              <sheet-footer> #3: (1r x 1c) </sheet-footer>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-sheet class="d-flex" color="red-lighten-3" height="250">
              <sheet-footer> #5: (2r x 2c) </sheet-footer>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6" md="2">
        <v-sheet class="d-flex" color="teal-lighten-3" height="300">
          <sheet-footer> #4: (2r x 1c) </sheet-footer>
        </v-sheet>
      </v-col>

      <v-col class="d-flex" cols="6" md="2">
        <v-sheet class="d-flex mt-auto" color="purple-lighten-3" height="300">
          <sheet-footer> #6: (2r x 1c) </sheet-footer>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>

  <div class="watercolor-box">
    <svg class="watercolor-bg" viewBox="0 0 300 200">
      <defs>
        <filter id="watercolor">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="lightblue" filter="url(#watercolor)" />
    </svg>
    <p class="watermark">Watermark</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAxios } from '@/composables/axios'

const { api } = useAxios()
const posts = ref([])

const getPosts = async () => {
  try {
    const { data } = await api.get('/post/random')
    posts.value.push(...data.result)
  } catch (error) {
    console.log(error)
  }
}

getPosts()
console.log(posts.value[0])

const colors = ['#ffa6a6', '#f9a8d4', '#decfff', '#cff9ff', '#b9ffb3', '#fffcaf', '#ffbf95']

// 隨機生成 items 陣列
// const items = computed(() => {
//   if (posts.value.length > 0) {
//     const images = posts.value.map((post) => post.image)
//     const usedColors = new Set()
//     const usedImages = new Set()
//     const generatedItems = []
//     for (let i = 0; i < 4; i++) {
//       const isImage = Math.random() > 0.5 // 50% 機率
//       if (isImage) {
//         let randomImage
//         do {
//           randomImage = images[Math.floor(Math.random() * images.length)]
//         } while (usedImages.has(randomImage))
//         usedImages.add(randomImage)
//         generatedItems.push({
//           type: 'image',
//           value: randomImage,
//         })
//       } else {
//         let randomColor
//         do {
//           randomColor = colors[Math.floor(Math.random() * colors.length)]
//         } while (usedColors.has(randomColor))
//         usedColors.add(randomColor)
//         generatedItems.push({
//           type: 'color',
//           value: randomColor,
//         })
//       }
//     }
//     return generatedItems
//   } else {
//     return []
//   }
// })

// 隨機生成 items 陣列
const generateItems = (count, usedImages) => {
  const images = posts.value.map((post) => post.image)
  const generatedItems = []
  for (let i = 0; i < count; i++) {
    const isImage = Math.random() > 0.2 // 50% 機率
    if (isImage && images.length > usedImages.size) {
      let randomImage
      do {
        randomImage = images[Math.floor(Math.random() * images.length)]
      } while (usedImages.has(randomImage))
      usedImages.add(randomImage)
      generatedItems.push({
        type: 'image',
        value: randomImage,
      })
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      generatedItems.push({
        type: 'color',
        value: randomColor,
      })
    }
  }
  return generatedItems
}

const usedImages = new Set()

const firstColItems = computed(() => generateItems(4, usedImages))
const secondColItems = computed(() => generateItems(4, usedImages))
const thirdColItems = computed(() => generateItems(1, usedImages))
const fourthColItems = computed(() => generateItems(1, usedImages))

// const items = computed(() => {
//   if (posts.value.length > 0) {
//     return [
//       {
//         type: 'image',
//         value: posts.value[0].image, // 正確存取 posts 的第一個元素
//         label: '#1: (3r x 2c)',
//       },
//       { type: 'color', value: 'green-lighten-3', label: '#2: (1r x 1c)' },
//       { type: 'color', value: 'yellow-lighten-3', label: '#3: (1r x 1c)' },
//       { type: 'color', value: 'purple-lighten-3', label: '#4: (1r x 1c)' },
//     ]
//   } else {
//     return []
//   }
// })
</script>

<style scoped>
.watercolor-box {
  width: 300px;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.watercolor-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.watermark {
  font-size: 24px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.3);
  mix-blend-mode: multiply;
  position: absolute;
}
</style>
