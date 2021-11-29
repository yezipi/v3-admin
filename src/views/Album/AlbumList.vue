<template>
  <div class="album-manage">
    <div class="am-top">
      <div class="am-filter"></div>
      <a-button type="primary" @click="toCreate">新建相册</a-button>
    </div>

    <div v-if="list.length" class="album-list">
      <ul>
        <li v-for="(item, k) in list" :key="k" class="al-item">
          <div class="al-cover">
            <div class="cover-bg" :style="{ background: `url(${item.cover || defaultPic}) center` }"></div>
            <img class="cover-default" :src="defaultPic" />
            <div class="al-todo">
              <EyeOutlined class="todo-icon" @click="toDetail(item)"/>
              <EditOutlined class="todo-icon" @click="toEdit(item.id)" />
              <DeleteOutlined class="todo-icon" @click="toDelete(item)" />
            </div>
          </div>
          <div class="al-text">
            <span style="color: #999999">{{ item.picture_count }} 张</span>
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>

    <a-empty v-else style="margin-top: 20%" />

    <album-edit v-model:visible="drawVisible" :id="currId" @finish="getList"></album-edit>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import AlbumApi from '@/api/album'
import confirm from '@/utils/confirm'

export default defineComponent({
  components: {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  setup() {
    const drawVisible = ref(false)
    const currId = ref()
    const list = ref<any>([])

    const toCreate = () => {
      currId.value = undefined
      drawVisible.value = true
    }

    const toEdit = (id: string) => {
      currId.value = id
      drawVisible.value = true
    }
    const toDelete = (item: any) => {
      confirm(`确定删除【${item.title}】吗？`, async () => {
        await AlbumApi.destory(item.id)
        getList()
      })
    }
    const toDetail = (e: any) => {}
    const getList = async () => {
      const { data } = await AlbumApi.getList()
      list.value = data.rows
    }

    onMounted(() => {
      getList()
    })

    return {
      defaultPic: '/src/assets/img/nopic.jpg',
      drawVisible,
      list,
      currId,
      toDetail,
      toEdit,
      toDelete,
      toCreate,
      getList
    }
  }
})
</script>

<style scoped lang="less">
.album-list {
  margin-top: 20px;
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      width: 180px;
      text-align: center;
      margin-right: 10px;
      .al-cover {
        height: 100px;
        position: relative;
        border-radius: 3px;
        overflow: hidden;
        &:hover {
          .al-todo {
            display: flex;
          }
        }
        .cover-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-size: cover!important;
          z-index: 1;
        }
        .cover-default {
          width: 100%;
          height: 100%;
        }
        .al-todo {
          position: absolute;
          background: rgba(0, 0, 0, 0.5);
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: none;
          justify-content: space-around;
          align-items: center;
          z-index: 2;
          .todo-icon {
            font-size: 26px;
            cursor: pointer;
            color: #ffffff;
            &:hover {
              opacity: 0.5;
            }
          }
        }
        img {
          display: block;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      span {
        display: block;
        font-size: 12px;
        color: #555555;
        margin-top: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .al-text {
        line-height: 12px;
        span {
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
.album-img {
  width: 148px;
  height: 85px;
  position: relative;
  background: #eeeeee;
  border-radius: 3px;
  overflow: hidden;
  &:hover {
    i {
      display: flex;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    display: none;
    font-size: 24px;
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>

<style scoped lang="less">
.am-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>