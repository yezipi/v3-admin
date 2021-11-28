<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑用户' : '添加用户'" @hide="closeDraw">
    <template #content>
      <a-spin :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form v-show="!wrapLoading" ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="头像">
          <yzp-upload v-model:value="ruleForm.avatar" :width="100" :height="100" dir="user"></yzp-upload>
        </a-form-item>

        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="ruleForm.nickname" autocomplete="off" :maxlength="20" placeholder="请填写昵称"></a-input>
        </a-form-item>

        <a-form-item label="账号" name="name">
          <a-input v-model:value="ruleForm.name" autocomplete="off" :maxlength="20" placeholder="请填写账号, 数字或者英文"></a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input v-model:value="ruleForm.password" autocomplete="off" :placeholder="id ? '请填写密码, 为空则不更改' : '请输入密码'"></a-input>
        </a-form-item>

        <a-form-item label="类型" name="role">
          <a-radio-group v-model:value="ruleForm.role">
            <a-radio v-if="!isSuper" value="admin">普通管理员</a-radio>
            <a-radio v-if="!isSuper" value="tourist">游客</a-radio>
            <a-radio v-if="isSuper" value="super" disabled>超级管理员</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="ruleForm.status" :disabled="isSuper" checked-children="正常" un-checked-children="禁用"></a-switch>
        </a-form-item>
      </a-form>
    </template>
    <template #footer>
      <div v-show="!wrapLoading" style="display: flex;flex: 1">
        <a-button :loading="btnLoading" style="flex: 1" type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即添加' }}</a-button>
        <a-button style="flex: 1;margin-left: 10px" @click="closeDraw">取消</a-button>
      </div>
    </template>
  </yzp-draw>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue';
import UserApi from '@/api/user'

export default defineComponent({

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  setup(props, { emit }) {

    const drawState = ref(false)
    const btnLoading = ref(false)
    const wrapLoading = ref(!!props.id)
    const formRef = ref()
    const ruleForm = ref({
      name: '',
      nickname: '',
      password: undefined,
      status: true,
      role: 'admin',
      avatar: ''
    })
    const Store = useStore()
    const user = computed(() => Store.state.user)

    const rules = reactive({
      nickname: [{ message: '昵称必须', required: true, trigger: 'blur' }],
      name: [{ message: '账号必须', required: true, trigger: 'blur' }],
      password: [{ message: '密码必须', required: true, trigger: 'blur' }],
    })

    const isSuper = computed(() => ruleForm.value.role === 'super')

    watch(() => props.visible, (val: boolean) => {
      drawState.value = val
    })

    watch(() => props.id, (val: any) => {
      if (val) {
        getInfo(val)
      } else {
        wrapLoading.value = false
        nextTick(() => {
          ruleForm.value = {
            name: '',
            nickname: '',
            password: undefined,
            status: true,
            role: 'admin',
            avatar: ''
          }
        })
      }
      rules.password[0].required = !val
    })

    const getInfo = async (id: any) => {
      try {
        wrapLoading.value = true
        const { data } = await UserApi.getDetail(id)
        ruleForm.value = data
      } catch(e) {
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
              Store.commit('updateUser', ruleForm.value)
            }
          }
          closeDraw()
          emit('finish', true)
          btnLoading.value = false
        })
    }

    const closeDraw = () => {
      drawState.value = false
      emit('update:visible', false)
    }

    return {
      formRef,
      ruleForm,
      rules,
      labelCol: { style: { width: '100px' } },
      drawState,
      btnLoading,
      wrapLoading,
      isSuper,
      onSubmit,
      closeDraw,
    }
  }
})
</script>