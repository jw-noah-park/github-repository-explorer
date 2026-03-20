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
  <div>
    <h1>Favorites</h1>

    <p v-if="favorites.length === 0">No favorite repositories yet.</p>

    <ul v-else>
      <li v-for="repo in favorites" :key="repo.id">
        <h2 :to="`/repo/${repo.owner.login}/${repo.name}`">
          <RouterLink>
            {{ repo.name }}
          </RouterLink>
        </h2>
        <h5>Owner: {{ repo.owner.login }}</h5>
        <p>{{ repo.description || "No description provided." }}</p>
        <p>Stars: {{ repo.stargazers_count }}</p>
        <p>Language: {{ repo.language || "Not specified" }}</p>
        <p>Last updated: {{ formatDate(repo.updated_at) }}</p>
      </li>
    </ul>
  </div>
</template>
