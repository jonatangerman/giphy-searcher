<template>
  <img :src="src" :alt="alt" />
</template>

<script lang="ts" setup>
defineProps({
  src: String,
  alt: String
})
</script>

<style scoped>
.gif-container img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
