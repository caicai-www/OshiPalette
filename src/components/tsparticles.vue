<template>
  <vue-particles id="tsparticles" :options="particlesOptions" />
</template>

<script setup>
import { ref } from 'vue'
import { VueParticles } from 'vue3-particles'

const particlesOptions = ref({
  fullScreen: { enable: true },
  background: {
    color: '#f5f5f5',
  },
  particles: {
    number: { value: 100 },
    color: { value: ['#ff4c4c', '#ffaf4c', '#4cffaf', '#4cafff'] },
    shape: { type: 'circle' },
    opacity: { value: 0.5 },
    size: { value: { min: 2, max: 8 } },
    move: { enable: true, speed: 2 },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: 'bubble' } },
    modes: { bubble: { size: 10, opacity: 0.8 } },
  },
})
</script>
