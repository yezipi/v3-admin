<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

const startDate = ref(dayjs().subtract(1, 'week').format('YYYYMMDD'))
const endDate = ref(dayjs().subtract(1, 'day').format('YYYYMMDD'))
</script>

<template>
  <div class="baidu-overview" style="display: flex;">
    <area-map :startDate="startDate" :endDate="endDate"></area-map>
  </div>
</template>