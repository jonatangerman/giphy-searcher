<template>
  <img :src="src" :alt="alt" />
</template>

<script lang="ts" setup>
defineProps({
  src: String,
  alt: String
})
</script>
