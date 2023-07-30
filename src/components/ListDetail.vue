<script setup>
defineProps({
  label: String,
  value: String,
  styleValue: String,
  styleLabel: String,
});
</script>
<template>
  <li class="
        flex flex-column
        md:flex-row md:align-items-center md:justify-content-between
        mb-4
      ">
    <div>
      <span class="text-gray-500 font-bold mr-2 mb-1 md:mb-0 capitalize" :class="styleLabel">
        {{ label }}
      </span>
    </div>
    <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
      <span class="font-medium" :class="styleValue">
        {{ value ? value : "-" }}
      </span>
    </div>
  </li>
</template>
