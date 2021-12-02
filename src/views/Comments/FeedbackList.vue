<!--评论管理，2021-12-03-->
<script lang="ts" setup>
import api from '@/api/feedback'
</script>

<template>
  <div class="page-list">
    <comments-list :api="api" type="feedback"></comments-list>
  </div>
</template>
