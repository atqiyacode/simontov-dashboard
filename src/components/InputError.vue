<script setup>
defineProps(["message"]);
</script>

<template>
  <div v-if="message">
    <p class="text-sm p-error">
      {{ message[0] }}
    </p>
  </div>
</template>
