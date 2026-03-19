<script setup>
import { ref } from 'vue';

const searchQuery = ref('')
const repositories = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    repositories.value = []
    errorMessage.value = ''
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery.value)}`
    )
    if (!res.ok) {
      throw new Error("Failed to fetch repositories")
    }

    const data = await res.json()
    repositories.value = data.items || []
  } catch (error) {
    console.error("Search failed:", error)
    errorMessage.value = "Something went wrong. Please try again"
    repositories.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>GitHub Repository Explorer</h1>

    <form @submit.prevent="handleSearch">
      <label for="search">Search repository: </label>
      <input type="text" id="search" v-model="searchQuery" placeholder="Enter a repo name" />
      <button type="submit">Search</button>
    </form>

    <p v-if="isLoading">Loading...</p>
    <p v-if="errorMessage"> {{ errorMessage }}</p>

    <ul v-if="repositories.length > 0">
      <li v-for="repo in repositories" :key="repo.id">
        <h2>{{ repo.full_name }}</h2>
        <p> {{ repo.description || 'No description provided.' }}</p>
      </li>
    </ul>
  </div>
</template>
