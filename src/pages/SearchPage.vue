<script setup>
import { ref, computed } from "vue";
import RepoCard from "../components/RepoCard.vue";

const searchQuery = ref("");
const repositories = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const hasSearched = ref(false);
const page = ref(1);
const hasMore = ref(false);
const sortBy = ref("default");

const fetchRepositories = async (pageToLoad = 1) => {
  if (!searchQuery.value.trim()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery.value)}&page=${pageToLoad}&per_page=10`,
    );

    if (!res.ok) {
      throw new Error(`GitHub request failed with status ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || [];
    const linkHeader = res.headers.get("link") || "";

    if (pageToLoad === 1) {
      repositories.value = items;
    } else {
      repositories.value = [...repositories.value, ...items];
    }

    hasMore.value = linkHeader.includes('rel="next"');
  } catch (error) {
    console.error("Search failed", error);
    hasMore.value = false;

    if (pageToLoad === 1) {
      errorMessage.value = "Something went wrong. Please try again";
      repositories.value = [];
    }
  } finally {
    isLoading.value = false;
  }
};

const sortedRepositories = computed(() => {
  if (sortBy.value === "stars") {
    return [...repositories.value].sort(
      (a, b) => b.stargazers_count - a.stargazers_count,
    );
  }

  if (sortBy.value === "updated") {
    return [...repositories.value].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    );
  }

  return repositories.value;
});

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    repositories.value = [];
    errorMessage.value = "";
    hasSearched.value = false;
    hasMore.value = false;
    page.value = 1;
    return;
  }

  hasSearched.value = true;
  page.value = 1;
  await fetchRepositories(1);
};

const handleLoadMore = async () => {
  if (!hasMore.value || isLoading.value) return;

  page.value += 1;
  await fetchRepositories(page.value);
};
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <h1>GitHub Repository Explorer</h1>
      <p>Search repositories and explore their details.</p>
    </div>
    <form class="search-form" @submit.prevent="handleSearch">
      <label for="search" class="sr-only">Search repository: </label>
      <input
        type="text"
        id="search"
        v-model="searchQuery"
        placeholder="Enter a repo name"
      />
      <button type="submit" class="primary-btn">Search</button>
    </form>

    <p v-if="isLoading && repositories.length === 0" class="status-message">
      Loading...
    </p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p
      v-else-if="hasSearched && repositories.length === 0"
      class="status-message"
    >
      No repositories found.
    </p>

    <select v-if="repositories.length > 0" v-model="sortBy" class="sort-select">
      <option value="default">Default</option>
      <option value="stars">Stars</option>
      <option value="updated">Last updated</option>
    </select>

    <ul v-if="repositories.length > 0" class="results-list">
      <li v-for="repo in sortedRepositories" :key="repo.id">
        <RepoCard :repo="repo" />
      </li>
    </ul>

    <div
      class="load-more-wrapper"
      v-if="repositories.length > 0 && (hasMore || isLoading)"
    >
      <button
        v-if="hasMore && !isLoading"
        class="primary-btn"
        @click="handleLoadMore"
      >
        Load More
      </button>
      <p v-else class="status-message load-more-message">Loading more...</p>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  max-width: 1100px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0 8px;
}

.search-header h1 {
  margin: 0 0 12px;
  font-size: 42px;
  line-height: 1.1;
  color: var(--color-text);
}

.search-header p {
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.search-form {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.search-form input {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface);
  outline: none;
}

.search-form input:focus {
  border-color: var(--color-primary);
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.load-more-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.load-more-message {
  min-height: auto;
  margin: 0;
}

.sort-select {
  display: block;
  margin: 0 0 20px auto;
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}

@media (max-width: 768px) {
  .search-header h1 {
    font-size: 26px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form button {
    width: 100%;
  }
}
</style>
