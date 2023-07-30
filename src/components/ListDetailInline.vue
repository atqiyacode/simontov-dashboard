<script setup>
defineProps({
  label: String,
  value: String,
  styleValue: String,
  styleLabel: String,
});
</script>
<template>
  <li
    class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
  >
    <div>
      <span
        class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize"
        :class="styleLabel"
      >
        {{ label }}
      </span>
      <span class="font-medium" :class="styleValue">
        {{ value }}
      </span>
    </div>
  </li>
</template>
