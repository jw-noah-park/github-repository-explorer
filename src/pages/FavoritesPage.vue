<script setup>
import { ref, onMounted } from "vue";
import { getFavorites } from "../utils/favorites";
import RepoCard from "../components/RepoCard.vue";

const favorites = ref([]);

onMounted(() => {
  favorites.value = getFavorites();
});
</script>

<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <h1>Your Repository Picks</h1>
      <p>Saved repositories will appear here.</p>
    </div>

    <p v-if="favorites.length === 0" class="status-message">
      No favorite repositories yet.
    </p>

    <ul v-else class="favorites-list">
      <li v-for="repo in favorites" :key="repo.id">
        <RepoCard :repo="repo" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.favorites-page {
  max-width: 1100px;
  margin: 0 auto;
}

.favorites-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0 8px;
}

.favorites-header h1 {
  margin: 0 0 12px;
  font-size: 42px;
  line-height: 1.1;
  color: var(--color-text);
}

.favorites-header p {
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.favorites-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .favorites-header h1 {
    font-size: 26px;
  }
}
</style>
