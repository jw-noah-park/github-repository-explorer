<script setup>
import { RouterLink } from "vue-router";
import { formatDate, formatNumber } from "../utils/formatters";

defineProps({
  repo: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="`/repo/${repo.owner.login}/${repo.name}`"
    class="repo-card-link"
  >
    <div class="repo-card card">
      <div class="repo-main">
        <h2>
          {{ repo.name }}
        </h2>
        <p class="repo-description">
          {{ repo.description || "No description provided." }}
        </p>
      </div>

      <div class="repo-meta">
        <div class="meta-item">
          <span class="meta-label">Owner: </span>
          <span>{{ repo.owner.login }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Stars: </span>
          <span>{{ formatNumber(repo.stargazers_count) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Language: </span>
          <span>{{ repo.language || "Not specified" }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">updated: </span>
          <span>{{ formatDate(repo.updated_at) }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.repo-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.repo-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 22px 24px;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.repo-card-link:hover .repo-card {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.repo-main {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.repo-main h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--color-text);
}

.repo-description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.5;
  font-size: 14px;
}

.repo-meta {
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
  .repo-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .repo-meta {
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }

  .meta-item {
    min-width: 120px;
  }
}
</style>
