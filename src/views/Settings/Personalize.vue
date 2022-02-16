<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import SettingsApi, { PersonalizeSettingsConfig } from '@/api/settings'
import CONFIG from '@/config';

const formRef = ref()
const styleOptions = ref([
  { label: '简约', value: 'simple' },
  { label: '小清新', value: 'fresh' },
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' },
])

const fontOptions = ref([
  { label: '微软雅黑', value: 'Microsoft YaHei' },
])

const bgOptions = ref([
  { label: '从相册选择', value: 'album' },
  { label: '本地上传', value: 'local' },
])

const imgs = ref<any>([])

const formState = ref<PersonalizeSettingsConfig>({
  style: 'simple',
  font: 'Microsoft YaHei',
  bg: '',
  current: '',
  auto: false,
})

const uploadSuccess = (path: any) => {
  console.log(path)
  imgs.value.push(path)
}

const deleteImg = (item: any, index: number) => {
  console.log(item, index)
}

const chooseImg = (item: any) => {
  formState.value.current = item
}

const rules = {}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getPersonalizeSettings()
  if (data) {
    formState.value = data
    imgs.value = data.bg.split(',')
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    formState.value.bg = imgs.value.join()
    const rawValue = toRaw(formState.value)
    await SettingsApi.savePersonalizeSettings(rawValue)
    message.success('保存成功')
  })
    .catch((error: ValidateErrorEntity<PersonalizeSettingsConfig>) => {
      console.log('error', error)
    })
}


onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" size="large" auto-label-width :model="formState" :rules="rules">
      <a-form-item label="风格选择">
        <a-select v-model="formState.style" :options="styleOptions"></a-select>
      </a-form-item>

      <a-form-item v-if="formState.style === 'fresh'" label="背景选择" >
        <ul class="bglist">
          <li
            v-for="(item, index) in imgs"
            :key="index"
            :class="{ active: formState.current === item }"
            @click="chooseImg(item)"
          >
            <img :src="CONFIG.REQ_URL + item" />
            <CloseCircleOutlined
              v-if="formState.current !== item"
              class="icon"
              @click.stop="deleteImg(item, index)"
            />
          </li>
          <li v-if="imgs.length < 5">
            <yzp-upload
              class="list-upload-btn"
              :with-parent-with="true"
              :thumb="false"
              :clip="false"
              :width="1366"
              :filename="imgs.length"
              dir="webbg"
              @input="uploadSuccess"
            ></yzp-upload>
          </li>
        </ul>
      </a-form-item>

      <a-form-item label="字体选择">
        <a-select v-model="formState.font" :options="fontOptions"></a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.bglist {
  margin: 0;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  .list-upload-btn {
    width: 150px;
    height: 85px;
  }
  li {
    margin-bottom: 10px;
    width: 150px;
    margin-left: 10px;
    height: 85px;
    float: left;
    position: relative;
    img {
      cursor: pointer;
      width: 100%;
      height: 100%;
      object-fit: cover;
      box-sizing: border-box;
      border-radius: 5px;
    }
    .icon {
      position: absolute;
      top: -8px;
      right: -8px;
      border-radius: 50%;
      background: #ffffff;
      z-index: 1;
      text-align: center;
      cursor: pointer;
      font-size: 24px;
      color: #ff0000;
    }
    &.active {
      img {
        border: 2px solid #ff6700;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 40px;
        height: 40px;
        bottom: 0;
        right: 0;
        background: url("~@/assets/img/success.png") no-repeat center;
        background-size: 100%;
      }
    }
  }
}
</style>
