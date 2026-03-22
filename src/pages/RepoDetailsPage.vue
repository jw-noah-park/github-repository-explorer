<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, formatNumber } from "../utils/formatters";
import { isFavorite, toggleFavorite } from "../utils/favorites";

const route = useRoute();
const router = useRouter();

const repo = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const issues = ref([]);
const issuesLoading = ref(false);
const issuesError = ref("");

const favorite = ref(false);

const fetchRepository = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${route.params.owner}/${route.params.name}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch repository details");
    }

    const data = await res.json();
    repo.value = data;
    favorite.value = isFavorite(data.id);
  } catch (error) {
    console.error("Details fetch failed:", error);
    errorMessage.value = "Could not load repository details";
    repo.value = null;
  } finally {
    isLoading.value = false;
  }
};

const fetchIssues = async () => {
  issuesLoading.value = true;
  issuesError.value = "";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${route.params.owner}/${route.params.name}/issues`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch issues");
    }

    const data = await res.json();
    issues.value = data.filter((item) => !item.pull_request).slice(0, 10);
  } catch (error) {
    console.error("Issues fetch failed:", error);
    issuesError.value = "Could not load open issues.";
    issues.value = [];
  } finally {
    issuesLoading.value = false;
  }
};

const repoMetaItems = computed(() => {
  if (!repo.value) return [];

  return [
    { label: "Owner", value: repo.value.owner.login },
    { label: "Stars", value: formatNumber(repo.value.stargazers_count) },
    { label: "Language", value: repo.value.language },
    { label: "Forks", value: formatNumber(repo.value.forks_count) },
    { label: "Open issues", value: formatNumber(repo.value.open_issues_count) },
    { label: "Updated", value: formatDate(repo.value.updated_at) },
  ];
});

const handleFavoriteToggle = () => {
  if (!repo.value) return;

  favorite.value = toggleFavorite(repo.value);
};

const handleBack = () => {
  router.back();
};

onMounted(() => {
  fetchRepository();
  fetchIssues();
});
</script>

<template>
  <div class="details-page">
    <div class="details-topbar">
      <button class="back-btn" @click="handleBack">← Back</button>

      <div class="topbar-actions">
        <span v-if="favorite" class="favorite-badge">★</span>

        <a
          class="github-link"
          :href="repo.html_url"
          target="_blank"
          rel="noopener noreferrer"
          v-if="repo"
        >
          View on GitHub
        </a>

        <button v-if="repo" class="favorite-btn" @click="handleFavoriteToggle">
          {{ favorite ? "Remove from favorites" : "Add to Favorites" }}
        </button>
      </div>
    </div>

    <p v-if="isLoading" class="status-message">Loading...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-else-if="repo" class="details-card card">
      <div class="details-header">
        <div class="details-title-group">
          <p class="details-label">Repository Details</p>
          <h2>{{ repo.full_name }}</h2>
          <p class="details-description">
            {{ repo.description || "No description provided." }}
          </p>
        </div>
      </div>

      <div class="details-meta">
        <div
          v-for="item in repoMetaItems"
          :key="item.label"
          class="meta-box card"
        >
          <span class="meta-label"> {{ item.label }}</span>
          <span>{{ item.value }}</span>
        </div>
      </div>

      <section class="issues-section">
        <h2>Open Issues</h2>

        <p v-if="issuesLoading" class="status-message">Loading issues...</p>
        <p v-else-if="issuesError" class="error-message">{{ issuesError }}</p>
        <p v-else-if="issues.length === 0" class="status-message">
          No open issues found.
        </p>

        <ul v-else class="issues-list">
          <li v-for="issue in issues" :key="issue.id" class="issue-item card">
            <a :href="issue.html_url" target="_blank" rel="noopener noreferrer">
              {{ issue.title }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.details-page {
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}

.details-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.topbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.back-btn,
.favorite-btn,
.github-link {
  margin-bottom: 20px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.back-btn:hover,
.github-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.favorite-btn {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
}

.favorite-btn:hover {
  opacity: 0.92;
}

.details-card {
  padding: 28px;
}

.details-header {
  margin-bottom: 24px;
}

.details-title-group {
  min-width: 0;
}

.details-label {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-header h2 {
  margin: 0 0 12px;
  font-size: 34px;
  line-height: 1.15;
  color: var(--color-text);
}

.details-description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.details-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.meta-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
}

.issues-section h2 {
  margin: 0 0 16px;
  font-size: 20px;
  color: var(--color-text);
}

.issues-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  padding: 14px 16px;
}

.issue-item a {
  color: var(--color-text);
}

.issue-item a:hover {
  color: var(--color-primary);
}

.favorite-badge {
  margin-bottom: 20px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--color-primary);
  color: var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

@media (max-width: 768px) {
  .details-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .details-card {
    padding: 20px;
  }

  .details-header h2 {
    font-size: 28px;
  }

  .details-meta {
    grid-template-columns: 1fr;
  }
}
</style>
