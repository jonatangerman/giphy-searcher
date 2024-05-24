<template>
  <div class="page-wrapper">
    <div>
      <h1>Search on Giphy</h1>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchCriteria" @keyup.enter="reFetchData" />
      <button @click="clear">Clear</button>
    </div>
    <div class="search-results">
      <div class="no-results" v-if="isEmpty">No results :(</div>
      <div class="results-container" v-else>
        <div class="pagination-container">
          <p class="results title">
            Your are looking at results for: <strong>{{ currentSearch }}</strong>
          </p>
          <button
            :class="{ active: isActive(index) }"
            class="button"
            :key="index"
            v-for="index in totalPages"
            @click="goToPage(index)"
          >
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
  </div>
</template>

<script setup lang="ts">
import gifContainer from './../components/gifContainer.vue'
import { ref, computed } from 'vue'
import { fetchGifs } from './../services/giphy'

const limit = 50

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
const currentSearch = ref<string>('')
const currentPage = ref<number>(0)
const pagination = ref<Pagination>({ count: 0, offset: 0, total_count: 0 })

// Computed
const isEmpty = computed(() => {
  return gifs?.value?.length === 0
})

const totalPages = computed(() => {
  return Math.floor(pagination.value.total_count / limit)
})

// Methods

const reFetchData = () => {
  currentPage.value = 0
  offset.value = 0
  fetchData()
}

const fetchData = async () => {
  const q = searchCriteria.value || 'cheeseburger'
  const params = { q, limit, offset: offset.value }
  const response: any = await fetchGifs(params)
  pagination.value = response.pagination

  if (Array.isArray(response.data)) {
    gifs.value = response.data
  }

  currentSearch.value = q

  return gifs.value
}

const isActive = (index) => {
  return currentPage.value === index - 1
}

const goToPage = (i) => {
  const index = i - 1
  currentPage.value = index
  offset.value = index * limit

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
  margin-right: 5px;
  margin-bottom: 5px;
}

.search-results {
  width: 100%;
}

.search-bar,
.pagination-container {
  margin-bottom: 20px;
}

.page-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f0f4f8;
}

.search-results {
  width: 70%;
}

button {
  background-color: #3498db;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-bottom: 15px;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

button.active {
  background-color: #1c6ea4;
  transform: scale(1.2);
  margin-left: 5px;
  margin-right: 10px;
}

strong,
h1 {
  color: #2980b9;
}

input {
  margin-right: 20px;
  height: 30px;
  border: 1px solid #3498db;
  border-radius: 2px;
  padding-left: 10px;
  width: 200px;
}

.no-results {
  display: flex;
  justify-content: center;
  padding: 100px;
}
</style>
