<!--评论管理，2021-12-02-->
<script lang="ts" setup>
import api from '@/api/comment'
</script>

<template>
  <div class="page-list">
    <comments-list :api="api" type="comment"></comments-list>
  </div>
</template>
