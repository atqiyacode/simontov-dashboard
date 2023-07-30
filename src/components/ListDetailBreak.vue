<script setup>
defineProps({
  label: String,
  value: String,
  styleValue: String,
  styleLabel: String,
});
</script>
<template>
  <li class="mb-4">
    <p class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize" :class="styleLabel">
      {{ label }}
    </p>
    <p class="font-medium" :class="styleValue">
      {{ value ? value : "-" }}
    </p>
  </li>
</template>
