<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SettingsApi, { PersonalizeSettingsConfig } from '@/api/settings'
import AlbumApi from '@/api/album'
import PictureApi from '@/api/picture'
import type { Rule } from 'ant-design-vue/es/form'

const formRef = ref()
const labelCol = { style: { width: '100px' } }
const styleOptions = ref([
  { label: '简约', value: 'simple' },
  { label: '小清新', value: 'fresh' },
  { label: '暗黑', value: 'dark' },
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' },
])

const fontOptions = ref([
  { label: '微软雅黑', value: 'Microsoft YaHei' },
])

const modalVisible = ref(false)
const picturePage = ref(1)
const pictureTotal = ref(0)

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
const currPicture = ref<any>({})

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
  getPictures()
}

const getPictures = async () => {
  const { data: res2 } = await PictureApi.getList({ page: picturePage.value, size: 10, album_id: currAlbumId.value })
  pictureTotal.value = res2.count || 0
  pictures.value = res2.rows || []
}

const onAlbumSelect = (album_id: any) => {
  currAlbumId.value = album_id
  picturePage.value = 1
  getPictures()
}

const onPageChange = () => {
  getPictures()
}

const chooseImg = (item: any) => {
  currPicture.value = item
}

const onModalOk = () => {
  console.log(currPicture.value)
  formState.value.background = currPicture.value.origin_path
  modalVisible.value = false
}

const onBgTypeChange = (res: any) => {
  if (res.target.value === 2) {
    getAlbums()
  }
}

const rules: Record<string, Rule[]> = {}

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
        <div style="margin-top: 10px;">
          <div style="width: 170px;height:90px;margin-bottom: 10px;">
            <yzp-upload
              v-model:value="formState.background"
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
          <a-button type="primary" plain @click="modalVisible = true" style="width: 170px">从相册选择</a-button>
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

    <a-modal
      v-model:visible="modalVisible"
      :ok-button-props="{ disabled: !currPicture.id }"
      @ok="onModalOk"
      title="选择图片"
    >
      <div>
        <a-select v-model:value="currAlbumId" :options="albums" style="width: 100%" @change="onAlbumSelect"></a-select>
        
        <ul v-if="pictures.length" class="bglist">
          <li
            v-for="(item, index) in pictures"
            :key="index"
            :class="{ active: currPicture.id === item.id }"
            @click="chooseImg(item)"
          >
            <img :src="item.thumb_path" />
          </li>
        </ul>

        <a-empty v-else />

        <a-pagination v-if="pictures.length" v-model:current="picturePage" size="small" :total="pictureTotal" show-less-items @change="onPageChange" />
      </div>
    </a-modal>

  </div>
</template>

<style lang="less" scoped>
.bglist {
  margin-left: -10px;
  margin-top: 10px;
  max-height: 500px;
  overflow-y: auto;
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
    &:hover {
      opacity: 0.7;
    }
    &.active {
      img {
        border: 2px solid #ff6700;
        opacity: 0.5;
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
