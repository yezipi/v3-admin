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
            <a-image :width="100" :src="record.cover || defaultPic" />
          </div>
        </template>

        <template v-if="dataIndex === 'sort'">
          <a v-if="!record.showSortInput" class="sort-wrap" @click="showSortInput(record)">
            <span>{{ record.sort }}</span>
            <EditOutlined />
          </a>
          <div v-else class="sort-wrap">
            <a-input-number
              v-model:value="record.sort"
              class="sort-input"
              size="small"
              placeholder="请输入数字"
              @pressEnter="confirmSortChange(record)"
            />
            <a @click="confirmSortChange(record)"><CheckOutlined /></a>
          </div>
        </template>

        <template v-if="dataIndex === 'target'">
          <a-link v-if="record.article">《{{ record.article.title }}》</a-link>
          <a-link v-else-if="record.url">{{ record.url }}</a-link>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :default-checked="record.status" @change="changeStatus(record, $event)" />
        </template>

        <!-- <template v-if="dataIndex === 'action'">
          <span>
            <a @click="toEdit(record.id)">编辑</a>
            <a-divider direction ="vertical" />
            <a @click="confirmDelete(record)">删除</a>
          </span>
        </template> -->
        <template v-if="dataIndex === 'action'">
          <a-button size="mini" @click="toEdit(record.id)">编辑</a-button>
          <a-button size="mini" status="danger" @click="confirmDelete(record)" style="margin-left: 10px;">删除</a-button>
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
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 100,
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
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        format: 'YYYY-MM-DD',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 150,
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
