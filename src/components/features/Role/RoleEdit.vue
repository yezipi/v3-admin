<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue'
import RoleApi from '@/api/role'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import state from '@/store/state'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'finish'])

const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref({
  name: '',
  type: undefined,
  permissions: [] as Array<any>
})
const labelCol = { style: { width: '100px' } }
const fieldNames = { children: 'children', title: 'meta', key: 'name' }
const treeData = ref<Array<any>>([])

const rules = {
  name: [{ message: '名称必须', required: true, trigger: 'blur' }],
  cover: [{ message: '封面必须', required: true, trigger: 'change' }],
}
const store = useStore()
const user = computed(() => store.state.user)
const router = useRouter()
const routes = [ ...router.options.routes ]

treeData.value = routes.map((e: any) => {
  return {
    disableCheckbox: state.user.role.type === 'super' || e.meta.noMenu || e.name === 'Home',
    ...e,
  }
})

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  if (!props.id) {
    ruleForm.value = {
      name: '',
      type: undefined,
      permissions: []
    }
  }
})

watch(() => props.id, (val: any) => {
  if (val) {
    getInfo(val)
  }
})

const getInfo = async (id: any) => {
  try {
    wrapLoading.value = true
    const { data } = await RoleApi.getDetail(id)
    ruleForm.value = data
    
    // 如果是超级管理员，默认全选, 否则默认选择其他几个
    if (data.type === 'super') {
      const allRoutesName: Array<string> = []
      routes.forEach((e: any) => {
        allRoutesName.push(e.name)
        if (e.children) {
         e.children.forEach((i: any) => {
           allRoutesName.push(i.name)
         }) 
        }
      })
      console.log(allRoutesName)
      ruleForm.value.permissions = allRoutesName
    } else {
      ruleForm.value.permissions = routes.filter((e: any) => e.meta.noAuth || e.name === 'Home').map((e: any) => e.name)
    }
  } catch (e) {
    console.log(e)
  } finally {
    wrapLoading.value = false
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    btnLoading.value = true
    try {
      if (props.id) {
        await RoleApi.update(props.id as any, ruleForm.value)
        // 如果是当前登录用户，需要更新用户权限信息
        if (user.value.id === props.id) {
          const permissions = ruleForm.value.permissions
          store.commit('updateUser', { ...state.user, role: { ...state.user.role, permissions } })
        }
      }
      closeDraw()
      emit('finish', true)
    } catch (e) {
      console.log(e)
    } finally {
      btnLoading.value = false
    }
  })
}

const closeDraw = () => {
  drawState.value = false
  emit('update:visible', false)
}

</script>
<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑角色' : '添加角色'" @hide="closeDraw">
    <template #content>
      <a-spin class="center-spin" :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form
        v-if="!wrapLoading"
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
      >
        <a-form-item label="名称" name="name">
          <a-input
            v-model:value="ruleForm.name"
            autocomplete="off"
            :maxlength="20"
            placeholder="请填写角色名称"
          ></a-input>
        </a-form-item>

        <a-form-item label="类型" name="type">
          <a-input v-model:value="ruleForm.type" disabled></a-input>
        </a-form-item>

        <a-form-item label="权限设置" name="permission">
          <a-tree
            v-model:checkedKeys="ruleForm.permissions"
            checkable
            :fieldNames="fieldNames"
            :tree-data="treeData"
          >
            <template #title="{ meta }">
              <span>{{ meta.title }}</span>
            </template>
          </a-tree>
        </a-form-item>
      </a-form>
    </template>
    <template v-if="!wrapLoading" #footer>
      <a-button style="flex: 1;margin-right: 10px" @click="closeDraw">取消</a-button>
      <a-button
        :loading="btnLoading"
        style="flex: 1"
        type="primary"
        @click="onSubmit"
      >{{ id ? '立即保存' : '立即添加' }}</a-button>
    </template>
  </yzp-draw>
</template>
