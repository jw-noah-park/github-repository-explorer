<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { getFavorites } from "../utils/favorites";
import { formatDate } from "../utils/formatters";

const favorites = ref([]);

onMounted(() => {
  favorites.value = getFavorites();
});
</script>

<template>
  <div class="favorites-page">
    <div class="favorites-header">
      <h1>Favorites</h1>
      <p>Saved repositories will appear here.</p>
    </div>

    <p v-if="favorites.length === 0" class="status-message">
      No favorite repositories yet.
    </p>

    <ul v-else class="favorites-list">
      <li v-for="repo in favorites" :key="repo.id">
        <RouterLink
          :to="`/repo/${repo.owner.login}/${repo.name}`"
          class="favorite-card-link"
        >
          <div class="favorite-card card">
            <div class="favorite-main">
              <h2>{{ repo.name }}</h2>
              <p class="favorite-description">
                {{ repo.description || "No description provided." }}
              </p>
            </div>

            <div class="favorite-meta">
              <div class="meta-item">
                <span class="meta-label">Owner</span>
                <span>{{ repo.owner.login }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Stars</span>
                <span>{{ repo.stargazers_count }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Language</span>
                <span>{{ repo.language || "Not specified" }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Updated</span>
                <span>{{ formatDate(repo.updated_at) }}</span>
              </div>
            </div>
          </div>
        </RouterLink>
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

.favorite-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.favorite-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 22px 24px;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.favorite-card-link:hover .favorite-card {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.favorite-main {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.favorite-main h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--color-text);
}

.favorite-description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.5;
  font-size: 14px;
}

.favorite-meta {
  display: flex;
  gap: 28px;
  flex-shrink: 0;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 95px;
  text-align: left;
}

@media (max-width: 768px) {
  .favorites-header h1 {
    font-size: 26px;
  }

  .favorite-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .favorite-meta {
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }

  .meta-item {
    min-width: 120px;
  }
}
</style>
