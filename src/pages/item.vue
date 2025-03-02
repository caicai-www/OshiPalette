<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";

const showText = ref(false);

onMounted(() => {
  const path = document.querySelector("#heartPath");
  const pathLength = path.getTotalLength();

  gsap.fromTo(
    path,
    { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 0.5 },
    {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 3,
      ease: "power2.out",
      onComplete: () => {
        showText.value = true;
        gsap.fromTo("#popupText",
          { opacity: 0, scale: 0.5, rotate: -10 },
          { opacity: 1, scale: 1.2, rotate: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }
        );
      }
    }
  );
});
</script>

<template>
  <div class="container">
    <svg viewBox="0 0 120 120">
      <!-- 定義水彩效果 -->
      <defs>
        <!-- 模糊邊緣 -->
        <filter id="blurFilter">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        <!-- 水彩漸變填充 -->
        <linearGradient id="watercolorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff758c" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#ff7eb3" stop-opacity="0.7" />
        </linearGradient>

        <!-- 文字用的水彩漸變 -->
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff758c" />
          <stop offset="50%" stop-color="#ff7eb3" />
          <stop offset="100%" stop-color="#ff92d3" />
        </linearGradient>
      </defs>

      <!-- 愛心路徑 -->
      <path id="heartPath"
            d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
               c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
               C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
               L59.609,103.9l48.083-48.083L107.551,55.676z"
            fill="url(#watercolorGradient)"
            stroke="#e63946" stroke-width="2" stroke-linecap="round"
            filter="url(#blurFilter)"
            stroke-dasharray="4,2" />

    </svg>

    <!-- 彈出 "Oshipalette" 文字 -->
    <div v-if="showText" id="popupText" class="popup-text">Oshipalette</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #fffaf0;
  position: relative;
}

svg {
  width: 50vw;
  height: 50vh;
}

/* 彈出的文字樣式 */
.popup-text {
  font-size: 28px;
  font-weight: bold;
  font-family: "Dancing Script", cursive;
  color: transparent;
  background-image: linear-gradient(45deg, #ff758c, #ff7eb3, #ff92d3);
  background-clip: text;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
