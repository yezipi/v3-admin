<script lang="ts" setup>
import { computed, ref, watch, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue';
import UserApi from '@/api/user'
import RoleApi from '@/api/role'
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
const emit = defineEmits(['finish', 'update:visible'])
const initForm = {
  name: '',
  nickname: '',
  password: undefined,
  status: true,
  role_id: undefined,
  avatar: ''
}
const labelCol = { style: { width: '100px' } }
const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref({ ...initForm })
const Store = useStore()
const user = computed(() => Store.state.user)
const roles = ref<Array<any>>([])

const rules = reactive({
  nickname: [{ message: '昵称必须', required: true, trigger: 'blur' }],
  name: [{ message: '账号必须', required: true, trigger: 'blur' }],
  password: [{ message: '密码必须', required: true, trigger: 'blur' }],
})

const isSuper = computed(() => roles.value.some((e: any) => e.id === ruleForm.value.role_id && e.type === 'super'))

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  ruleForm.value = { ...initForm }
})

watch(() => props.id, (val: any) => {
  if (val) {
    getInfo(val)
  }
  rules.password[0].required = !val
})

const getRole = async () => {
  const { data } = await RoleApi.getList()
  roles.value = data.rows
}

const getInfo = async (id: any) => {
  try {
    wrapLoading.value = true
    const { data } = await UserApi.getDetail(id)
    ruleForm.value = data
  } catch (e) {
    console.log(e)
  } finally {
    wrapLoading.value = false
  }
}

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      btnLoading.value = true
      try {
        if (!props.id) {
          await UserApi.create(ruleForm.value)
        } else {
          await UserApi.update(props.id as any, ruleForm.value)
          const { password } = ruleForm.value
          if (password && props.id === user.value.id) {
            Modal.warning({
              title: '温馨提示',
              content: '您已更改当前登录账号密码，请重新登录',
              centered: true,
              onOk: () => {
                Store.dispatch('clearUser')
                useRouter().replace({ name: 'Login' })
              }
            })
          }
          if (!password && props.id === user.value.id) {
            Store.commit('updateUser', { ...user.value, ...ruleForm.value })
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

onMounted(() => {
  getRole()
})
</script>

<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑用户' : '添加用户'" @hide="closeDraw">
    <template #content>
      <a-spin :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form
        v-if="!wrapLoading"
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
      >
        <a-form-item label="头像">
          <yzp-upload v-model:value="ruleForm.avatar" clip :width="100" :height="100" dir="user"></yzp-upload>
        </a-form-item>

        <a-form-item label="昵称" name="nickname">
          <a-input
            v-model:value="ruleForm.nickname"
            autocomplete="off"
            :maxlength="20"
            placeholder="请填写昵称"
          ></a-input>
        </a-form-item>

        <a-form-item label="账号" name="name">
          <a-input
            v-model:value="ruleForm.name"
            autocomplete="off"
            :maxlength="20"
            placeholder="请填写账号, 数字或者英文"
          ></a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input
            v-model:value="ruleForm.password"
            autocomplete="off"
            :placeholder="id ? '请填写密码, 为空则不更改' : '请输入密码'"
          ></a-input>
        </a-form-item>

        <a-form-item label="角色">
          <a-radio-group v-model:value="ruleForm.role_id">
            <template v-for="(item, index) in roles">
              <a-radio
              :key="index"
              :value="item.id"
              v-if="!isSuper && item.type !== 'super'" 
            >
              {{ item.name }}
            </a-radio>
            </template>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
            v-model:checked="ruleForm.status"
            :disabled="isSuper"
            checked-children="正常"
            un-checked-children="禁用"
          ></a-switch>
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