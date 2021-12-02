<!--友链管理，2021-12-02-->
<script lang="ts" setup>
import api from '@/api/blogroll'
</script>

<template>
  <div class="page-list">
    <comments-list :api="api" type="blogroll"></comments-list>
  </div>
</template>
