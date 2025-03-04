<template>
  <router-link :to="'/post/' + _id" class="text-decoration-none">
    <v-card :class="['polaroid', colors, 'column-item']">
      <v-img :src="image" cover class="mx-5 mt-7 mb-2 photo"></v-img>
      <v-card-title>{{ title }}</v-card-title>
      <v-chip v-for="tag in tags" :key="tag" class="ma-2" size="s">{{ tag }}</v-chip>
    </v-card>
  </router-link>
</template>

<script setup>
defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  _id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
  colors: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.polaroid {
  backdrop-filter: blur(10px);
  border-radius: 10px;
}
.photo {
  border-radius: 10px;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.2);
}

.red {
  box-shadow: 0px 0px 15px 6px #ffa6a670;
}

.pink {
  box-shadow: 0px 0px 15px 6px #f9a8d470;
}

.purple {
  box-shadow: 0px 0px 15px 6px #decfff70;
}

.blue {
  box-shadow: 0px 0px 15px 6px #cff9ff70;
}

.yellow {
  box-shadow: 0px 0px 15px 6px #fffed570;
}

.green {
  box-shadow: 0px 0px 15px 6px #b9ffb370;
}

.orange {
  box-shadow: 0px 0px 15px 6px #ffbf9570;
}

.white {
  box-shadow: 0px 0px 15px 6px #ececec70;
}

.black {
  box-shadow: 0px 0px 15px 6px #33333370;
}

.column-item {
  width: 100%; /* 確保每個項目佔滿 Masonry 的列寬 */
  margin-bottom: 50px; /* 控制每個卡片的底部間距 */
}
.text-decoration-none {
  text-decoration: none;
}
</style>
