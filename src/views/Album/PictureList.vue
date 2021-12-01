<script lang="ts" setup>
import { onMounted, ref, reactive, toRaw } from 'vue'
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/index'
import AlbumApi from '@/api/album'
import PictureApi from '@/api/picture'
import confirm from '@/utils/confirm'


const drawVisible = ref(false)
const currId = ref()
const list = ref<Array<any>>([])
const albums = ref<Array<any>>([])
const total = ref(0)
const condition = reactive({
  album_id: undefined,
  page: 1,
  size: 20,
})
const defaultPic = 'src/assets/img/nopic.jpg'
const loadEnd = ref(false)
const modalVisible = ref(false)
const viewPath = ref('')
const Route = useRoute()

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

// 获取相册列表
const getAlbums = async () => {
  const { data } = await AlbumApi.getList({ page: 1, size: 100, loading: false })
  albums.value = data.rows.map((e: any) => {
    return {
      label: e.title,
      value: String(e.id),
    }
  })
}

const getList = async () => {
  try {
    const { data: { rows, count } } = await PictureApi.getList(toRaw(condition))
    list.value = rows
    total.value = count
  } catch (e) {
    console.log(e)
  } finally {
    loadEnd.value = true
  }
}

const toView = (path: string) => {
  modalVisible.value = true
  viewPath.value = path
}

const onPageChange = (res: any) => {
  const { page, size } = res
  condition.page = page
  condition.size = size
  getList()
}

onMounted(() => {
  if (Route.query.album_id) {
    condition.album_id = Route.query.album_id as any
  }
  getAlbums()
  getList()
})
</script>

<template>
  <div class="album-manage">
    <div class="am-top">
      <div class="am-filter">
        <a-select
          v-model:value="condition.album_id"
          :allow-clear="true"
          :options="albums"
          style="width: 200px"
          placeholder="全部"
          @change="getList"
        ></a-select>
        <div style="margin-left: 10px">共 {{ total }} 张</div>
      </div>
      <a-button type="primary" @click="toCreate">新建图片</a-button>
    </div>

    <div v-if="list.length" class="album-list">
      <ul>
        <li v-for="(item, k) in list" :key="k" class="al-item">
          <div class="al-cover">
            <div
              class="cover-bg"
              :style="{ background: `url(${item.thumb_path || defaultPic}) center` }"
            ></div>
            <img class="cover-default" :src="defaultPic" />
            <div class="al-todo">
              <EyeOutlined class="todo-icon" @click="toView(item.origin_path)" />
              <EditOutlined class="todo-icon" @click="toEdit(item.id)" />
              <DeleteOutlined class="todo-icon" @click="toDelete(item)" />
            </div>
          </div>
          <div class="al-info">
            <div class="al-text">
              <span class="al-title">{{ item.title }}</span>
              <div class="al-count">
                <span style="color: red">{{ item.picture_count }}</span>
                <span>张</span>
              </div>
            </div>
            <div class="al-text" style="font-size: 12px;margin-top: 5px;">
              <span>浏览：{{ item.view }}</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <a-empty v-if="loadEnd && !list.length" style="margin-top: 20%" />

    <picture-edit v-model:visible="drawVisible" :albums="albums" :album_id="condition.album_id" :id="currId" @finish="getList"></picture-edit>

    <yzp-pagintion v-if="loadEnd && total" :total="total" :size="condition.size" @change="onPageChange"></yzp-pagintion>

    <a-modal
      v-model:visible="modalVisible"
      title="查看图片"
      width="100%"
      wrap-class-name="full-modal"
    >
      <div class="picture-view">
        <img :src="viewPath" style="max-width: 50%;" />
      </div>
    </a-modal>

  </div>
</template>

<style scoped lang="less">
.am-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.am-filter {
  display: flex;
  align-items: center;
}
.picture-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}
.album-list {
  margin-top: 15px;
  overflow: hidden;
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-right: -2%;
    li {
      width: 18%;
      margin-right: 2%;
      box-shadow: 0 0 15px rgba(0,0,0,.25);
      margin-bottom: 20px;
      .al-cover {
        height: 150px;
        position: relative;
        border-radius: 6px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        overflow: hidden;
        background: none;
        &:hover {
          .al-todo {
            display: flex;
            transform: translateY(0);
          }
        }
        .cover-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-size: cover !important;
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
          transform: translateY(-200px);
          justify-content: space-around;
          align-items: center;
          z-index: 2;
          transition: transform 0.3s;
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
      .al-info {
        padding: 10px;
        background-color: rgba(255,255,255,0.5);
        border-radius: 6px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        overflow: hidden;
      }
      .al-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .al-title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-right: 5px;
          overflow: hidden;
        }
        .al-count {
          color: #999999;
          flex-shrink: 0;
          span {
            display: inline-block;
            margin-right: 3px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .album-list ul li .al-cover {
    height: 100px;
  }
}
</style>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>