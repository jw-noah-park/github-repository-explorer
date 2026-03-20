<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "../utils/formatters";

const route = useRoute();
const repo = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const issues = ref([]);
const issuesLoading = ref(false);
const issuesError = ref("");

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

onMounted(() => {
  fetchRepository();
  fetchIssues();
});
</script>

<template>
  <div>
    <h1>Repository Details</h1>

    <p v-if="isLoading">Loading...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else-if="repo">
      <h2>{{ repo.full_name }}</h2>
      <p>{{ repo.description || "No description provided." }}</p>
      <p>Owner: {{ repo.owner.login }}</p>
      <p>Stars: {{ repo.stargazers_count }}</p>
      <p>Language: {{ repo.language || "Not specified" }}</p>
      <p>Forks: {{ repo.forks_count }}</p>
      <p>Open issues: {{ repo.open_issues_count }}</p>
      <p>Last updated: {{ formatDate(repo.updated_at) }}</p>
      <p>
        <a :href="repo.html_url" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </p>

      <section>
        <h2>Open Issues</h2>

        <p v-if="issuesLoading">Loading issues...</p>
        <p v-else-if="issuesError">{{ issuesError }}</p>
        <p v-else-if="issues.length === 0">No open issues found.</p>

        <ul v-else>
          <li v-for="issue in issues" :key="issue.id">
            <a :href="issue.html_url" target="_blank" rel="noopener noreferrer">
              {{ issue.title }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
