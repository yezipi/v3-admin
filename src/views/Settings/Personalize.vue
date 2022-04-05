<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SettingsApi, { PersonalizeSettingsConfig } from '@/api/settings'
import AlbumApi from '@/api/album'
import PictureApi from '@/api/picture'
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
const albums = ref<any>([])
const currAlbumId = ref()
const pictures = ref<any>([])
const currPictureId = ref()

const uploadSuccess = (path: any) => {
  formState.value.background = path
}

const getAlbums = async () => {
  const { data: res1 } = await AlbumApi.getList()
  const albumRows = res1.rows || []
  currAlbumId.value = albumRows.length ? albumRows[0].id : undefined
  albums.value = albumRows.map((e: any) => {
    return {
      ...e,
      label: `${e.title}(${e.picture_count})张`,
      value: e.id,
    }
  })
  const { data: res2 } = await PictureApi.getList(currAlbumId.value)
  const pictureRows = res2.rows || []
  currPictureId.value = pictureRows.length ? pictureRows[0].id : undefined
  pictures.value = pictureRows
}

const chooseImg = (item: any) => {
  const curr = pictures.value.find((e: any) => e.id === item.id)
  currPictureId.value = item.id
  formState.value.background = curr.origin_path
}

const onBgTypeChange = (res: any) => {
  if (res.target.value === 2) {
    getAlbums()
  }
}

const rules = {}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getPersonalizeSettings()
  formState.value = data
  if (data.background) {
    bgType.value = 2
    onBgTypeChange({ target: { value: 2 } })
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
        <a-radio-group v-model:value="bgType" @change="onBgTypeChange">
          <a-radio :value="1">选择图片</a-radio>
          <a-radio :value="2">从相册选择</a-radio>
        </a-radio-group>
        <div style="margin-top: 10px;">
          <div v-show="bgType === 1" style="width: 170px;height:90px">
            <yzp-upload
              class="list-upload-btn"
              :with-parent-with="true"
              :thumb="false"
              :clip="false"
              :width="1366"
              filename="webbg"
              dir="webbg"
              @input="uploadSuccess"
            >
            </yzp-upload>
          </div>
          <div v-show="bgType === 2" >
            <a-select v-model:value="currAlbumId" :options="albums"></a-select>
            <ul class="bglist">
              <li
                v-for="(item, index) in pictures"
                :key="index"
                :class="{ active: currPictureId === item.id }"
                @click="chooseImg(item)"
              >
                <img :src="item.thumb_path" />
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
  margin-left: -10px;
  margin-top: 10px;
  &:after {
    content: "";
    display: block;
    clear: both;
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
        background: url("@/assets/img/success.png") no-repeat center;
        background-size: 100%;
      }
    }
  }
}
</style>
