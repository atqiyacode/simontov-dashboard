<script setup>
defineProps({
  label: String,
  styleLabel: String,
});
</script>
<template>
  <li
    class="
      flex flex-column
      md:flex-row md:align-items-center md:justify-content-center
      mb-4
    "
  >
    <div class="mt-2 md:mt-0 ml-0 flex align-items-center capitalize">
      <span class="font-medium" :class="styleLabel">
        {{ label }}
      </span>
    </div>
  </li>
</template>
