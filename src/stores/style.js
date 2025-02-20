import { defineStore } from 'pinia'
import { computed } from 'vue'
import bgImage from '@/assets/bg.jpg'

export const useThemeStore = defineStore('theme', () => {
  const colors = ['#ffa6a6', '#f9a8d4', '#decfff', '#cff9ff', '#b9ffb3', '#fffcaf', '#ffbf95']

  function getRandomColors(num) {
    const shuffledColors = [...colors]
    for (let i = shuffledColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]]
    }
    return shuffledColors.slice(0, num)
  }

  const randomGradient = computed(() => {
    const numColors = Math.floor(Math.random() * 6) + 2
    const selectedColors = getRandomColors(numColors)
    const degree = Math.floor(Math.random() * 360)
    return `linear-gradient(${degree}deg, ${selectedColors.join(', ')})`
  })

  const containerStyle = computed(() => ({
    backgroundImage: `url(${bgImage}), ${randomGradient.value}`,
    backgroundSize: 'cover',
    backgroundBlendMode: 'hard-light',
    backgroundPosition: 'center',
  }))

  return { containerStyle }
})
