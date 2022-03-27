<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SettingsApi, { PersonalizeSettingsConfig } from '@/api/settings'
import AlbumApi from '@/api/album'
import CONFIG from '@/config'

const formRef = ref()
const labelCol = { style: { width: '100px' } }
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

// const bgOptions = ref([
//   { label: '从相册选择', value: 'album' },
//   { label: '本地上传', value: 'local' },
// ])

const imgs = ref<any>([])

const formState = ref<PersonalizeSettingsConfig>({
  style: 'simple',
  font: 'Microsoft YaHei',
  background: '',
  auto: false,
  gray: false,
})

const bgType = ref(1)

const uploadSuccess = (path: any) => {
  console.log(path)
  imgs.value.push(path)
}


const chooseImg = (item: any) => {
  formState.value.background = item
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

const onSubmit = async () => {
  await formRef.value.validate()
  const rawValue = toRaw(formState.value)
  await SettingsApi.savePersonalizeSettings(rawValue)
  message.success('保存成功')
}


onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <a-form-item label="风格选择">
        <a-select v-model:value="formState.style" :options="styleOptions"></a-select>
      </a-form-item>

      <a-form-item v-if="formState.style === 'fresh'" label="背景选择">
        <a-radio-group v-model:value="bgType">
          <a-radio :value="1">选择图片</a-radio>
          <a-radio :value="2">从相册选择</a-radio>
        </a-radio-group>
        <div style="margin-top: 10px;">
          <div v-if="bgType === 1" style="width: 170px;height:90px">
            <yzp-upload
              class="list-upload-btn"
              :with-parent-with="true"
              :thumb="false"
              :clip="false"
              :width="1366"
              :filename="imgs.length"
              dir="webbg"
              @input="uploadSuccess"
            >
            </yzp-upload>
            <ul v-if="bgType === 1" class="bglist">
              <li
                v-for="(item, index) in imgs"
                :key="index"
                :class="{ active: formState.background === item }"
                @click="chooseImg(item)"
              >
                <img :src="CONFIG.REQ_URL + item" />
              </li>
            </ul>
          </div>
        </div>
      </a-form-item>

      <a-form-item label="字体选择">
        <a-select v-model:value="formState.font" :options="fontOptions"></a-select>
      </a-form-item>

      <a-form-item label="网站置灰">
        <a-switch v-model:checked="formState.gray"></a-switch>
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
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
