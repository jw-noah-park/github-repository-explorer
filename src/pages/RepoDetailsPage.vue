<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<template>
  <div>
    <h1>Repo Details Page</h1>
    <p>Owner: {{ route.params.owner }}</p>
    <p>Repo: {{ route.params.name }}</p>
  </div>
</template>
