<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { formatDate } from "../utils/formatters";

const searchQuery = ref("");
const repositories = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const hasSearched = ref(false);
const page = ref(1);
const hasMore = ref(false);

const fetchRepositories = async (pageToLoad = 1) => {
  if (!searchQuery.value.trim()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery.value)}&page=${pageToLoad}&per_page=10`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const data = await res.json();

    if (pageToLoad === 1) {
      repositories.value = data.items || [];
    } else {
      repositories.value = [...repositories.value, ...(data.items || [])];
    }

    hasMore.value = (data.items || []).length === 10;
  } catch (error) {
    console.error("Search failed", error);
    errorMessage.value = "Something went wrong. Please try again";
    if (pageToLoad === 1) {
      repositories.value = [];
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    repositories.value = [];
    errorMessage.value = "";
    hasSearched.value = false;
    return;
  }

  hasSearched.value = true;
  page.value = 1;
  await fetchRepositories(1);
};

const handleLoadMore = async () => {
  page.value += 1;
  await fetchRepositories(page.value);
};
</script>

<template>
  <div>
    <h1>GitHub Repository Explorer</h1>

    <form @submit.prevent="handleSearch">
      <label for="search">Search repository: </label>
      <input
        type="text"
        id="search"
        v-model="searchQuery"
        placeholder="Enter a repo name"
      />
      <button type="submit">Search</button>
    </form>

    <p v-if="isLoading && repositories.length === 0">Loading...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="hasSearched && repositories.length === 0">
      No repositories found.
    </p>

    <ul v-if="repositories.length > 0">
      <li v-for="repo in repositories" :key="repo.id">
        <RouterLink :to="`/repo/${repo.owner.login}/${repo.name}`">
          <h2>{{ repo.name }}</h2>
        </RouterLink>
        <h5>Owner: {{ repo.owner.login }}</h5>
        <p>{{ repo.description || "No description provided." }}</p>
        <p>Stars: {{ repo.stargazers_count }}</p>
        <p>Language: {{ repo.language || "Not specified" }}</p>
        <p>Last updated: {{ formatDate(repo.updated_at) }}</p>
      </li>
    </ul>

    <button
      v-if="repositories.length > 0 && hasMore && !isLoading"
      @click="handleLoadMore"
    >
      Load More
    </button>

    <p
      v-if="
        hasSearched && !isLoading && !errorMessage && repositories.length === 0
      "
    >
      No repositories found.
    </p>
  </div>
</template>
