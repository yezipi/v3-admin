<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="Banner.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 创建轮播图</a-button>
      </template>

      <template #bodyCell="{ scope: { column: { dataIndex }, record } }">

        <template v-if="dataIndex === 'cover'">
          <div class="article-cover">
            <img :src="record.cover || defaultPic" style="width: 100px;object-fit: cover" />
          </div>
        </template>

        <template v-if="dataIndex === 'sort'">
          <a v-if="!record.showSortInput" class="sort-wrap" @click="showSortInput(record)">
            <span>{{ record.sort }}</span>
            <EditOutlined />
          </a>
          <div v-else class="sort-wrap">
            <a-input
              v-model:value="record.sort"
              class="sort-input"
              size="small"
              type="number"
              placeholder="请输入数字"
              @pressEnter="confirmSortChange(record)"
            />
            <a @click="confirmSortChange(record)"><CheckOutlined /></a>
          </div>
        </template>

        <template v-if="dataIndex === 'target'">
          <span v-if="record.article">《{{ record.article.title }}》</span>
          <a v-else-if="record.url">{{ record.url }}</a>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :checked="record.status" @change="changeStatus(record, $event)" />
        </template>

        <template v-if="dataIndex === 'action'">
          <span>
            <a @click="toEdit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a @click="confirmDelete(record)">删除</a>
          </span>
        </template>

      </template>
      
    </yzp-table>

    <banner-edit v-model:visible="drawVisible" :id="currId" @finish="initList"></banner-edit>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { EditOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import BannerApi from '@/api/banner'
import confirm from '@/utils/confirm'

export default defineComponent({
  components: {
    EditOutlined,
    CheckOutlined,
  },
  setup() {
    const columns = reactive([
      {
        title: '封面',
        dataIndex: 'cover',
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'type',
        dict: {
          1: '文章',
          2: '案例',
          3: '链接',
          0: '无跳转'
        }
      },
      {
        title: '目标',
        dataIndex: 'target',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        format: true
      },
      {
        title: '操作',
        dataIndex: 'action',
      },
    ])

    const tableRef = ref()
    const currId = ref()
    const drawVisible = ref(false)
    const defaultPic = '/src/assets/img/nopic.jpg'

    // 隐藏显示
    const changeStatus = async (item: any, checked: boolean) => {
      const { status, id } = item
      try {
        await BannerApi.update(id, { status: checked })
        item.status = checked
      } catch (e) {
        item.status = !status
      }
    }

    const toEdit = (id: string) => {
      currId.value = id
      drawVisible.value = true
    }

    const toCreate = () => {
      currId.value = ''
      drawVisible.value = true
    }

    // 删除
    const confirmDelete = (item: any) => {
      const { name, id } = item
      confirm(`确定删除【${name}】这个账号吗？`, async () => {
        await BannerApi.destory(id)
        initList()
      })
    }

    const showSortInput = (e: any) => {
      e.showSortInput = true
    }

    const confirmSortChange = async (e: any) => {
      if (typeof Number(e.sort) !== 'number') {
        message.error('请输入数字')
        return
      }
      await BannerApi.update(e.id, { sort: e.sort })
      e.showSortInput = false
      tableRef.value.init()
    }

    const initList = () => {
      tableRef.value.init()
    }

    return {
      columns,
      tableRef,
      currId,
      drawVisible,
      defaultPic,
      changeStatus,
      confirmDelete,
      toEdit,
      toCreate,
      initList,
      confirmSortChange,
      showSortInput
    }
  }
})
</script>

<style scoped lang="less">
.article-cover {
  object-fit: cover;
  height: 38px;
  width: 80px;
  position: relative;
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
}
.sort-wrap {
  display: flex;
  align-items: center;
  .sort-input {
    width: 50px;
    margin-right: 10px;
    text-align: center;
    padding: 0!important;
  }
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
