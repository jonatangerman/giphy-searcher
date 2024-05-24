<template>
  <div>
    <h1>Search on Giphy</h1>
  </div>
  <div class="search-bar">
    <input type="text" v-model="searchCriteria" @keyup.enter="fetchData" />
    <button @click="clear">Clear</button>
  </div>
  <div class="search-results">
    <div v-if="isEmpty">No results</div>
    <div v-else>
      <div class="pagination-container">
        <button :key="index" v-for="index in totalPages" @click="goToPage(index)">
          {{ index }}
        </button>
      </div>
      <div class="gifs-wrapper">
        <div class="gif-container" :key="gif.slug" v-for="gif in gifs">
          <gif-container :src="gif.images.preview_gif.url" :alt="gif.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gifContainer from './../components/gifContainer.vue'
import { ref, computed } from 'vue'
import { fetchGifs } from './../services/giphy'

// Types
type Pagination = {
  count: number
  offset: number
  total_count: number
}

// Data
const searchCriteria = ref<string>('')
const gifs = ref<any[] | undefined>()
const offset = ref<number>(0)

// Computed
const pagination = ref<Pagination>({ count: 0, offset: 0, total_count: 0 })
const isEmpty = computed(() => {
  return gifs?.value?.length === 0
})

const totalPages = computed(() => {
  return Math.floor(pagination.value.total_count / 50)
})

// Methods
const fetchData = async () => {
  const q = searchCriteria.value || 'cheeseburger'
  const params = { q, limit: 50, offset: offset.value }
  const response: any = await fetchGifs(params)
  pagination.value = response.pagination

  if (Array.isArray(response.data)) {
    gifs.value = response.data
  }

  return gifs.value
}

const goToPage = (i) => {
  const index = i - 1
  offset.value = index * 50
  fetchData()
}

const clear = function () {
  gifs.value = []
}

// First Data fetch
fetchData()
</script>

<style scoped>
.gifs-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.gif-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.gif-container img {
  width: 100%;
}

.search-results {
  width: 100%;
}

.search-bar,
.pagination-container {
  margin-bottom: 20px;
}
</style>
