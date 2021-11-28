<template>
  <div class="yzp-upload">
    <a-upload
      v-model:file-list="fileList"
      name="file"
      list-type="picture-card"
      :class="{ withParentWith }"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="startUpload"
    >
      <img v-if="imageUrl" class="img-privew" :src="imageUrl" />
      <div v-else class="upload-tips">
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text"></div>
      </div>
    </a-upload>

    <!--图片裁剪-->
    <a-modal
      v-if="clip"
      v-model:visible="cropperState.visible"
      :width="width > 500 ? (Number(width) + 48) : 500"
      :centered="true"
      title="裁剪图片"
      ok-text="确认"
      cancel-text="取消"
      @ok="confirmClip"
    >
      <div class="cropper-dialog" style="height: 350px;">
        <a-spin :spinning="loading"></a-spin>
        <vue-cropper
          v-if="!loading"
          ref="cropperRef"
          :autoCropWidth="width ? Number(width) : undefined"
          :autoCropHeight="height ? Number(height) : undefined"
          :img="cropperState.url"
          @imgLoad="onCropperImgLoad"
        >
        </vue-cropper>
      </div>
    </a-modal>
    <!--end 图片裁剪-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { VueCropper }  from 'vue-cropper'
import { message } from 'ant-design-vue'
import CommonApi from '@/api/common'
import 'vue-cropper/dist/index.css'

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size?: any;
  originFileObj?: any;
}

export default defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined,
    VueCropper,
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    dir: {
      type: String,
      default: ''
    },
    thumb: {
      type: Boolean,
      default: false,
    },
    watermark: {
      type: Boolean,
      default: false,
    },
    filename: {
      type: String,
      default: '',
    },
    // 预览的时候自动到父级的宽度
    withParentWith: {
      type: Boolean,
      default: false,
    },
    // 是否需要裁剪
    clip: {
      type: Boolean,
      default: true
    },
    width:  {
      type: [Number, String],
      default: ''
    },
    height: {
      type: [Number, String],
      default: ''
    }
  },
  setup(props, { emit }) {
    const fileList = ref([])
    const loading = ref<boolean>(false)
    const imageUrl = ref<any>('')
    const cropperRef = ref()
    const cropperState = reactive({
      url: '' as any,
      visible: false
    })
    const currFile = ref<any>({})

    watch(() => props.value, (val) => {
      imageUrl.value = val
    })

    const beforeUpload = (file: FileItem) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传图片哦！')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('不能超过2m大小哦!')
      }
      return isJpgOrPng && isLt2M
    }

    // 确定开始执行裁剪
    const confirmClip = () => {
      cropperRef.value.getCropBlob((blob: Blob) => {
        const file = new File([blob], `${props.filename || new Date().getTime()}.jpg`, {
          type: currFile.value.type,
          lastModified: Date.now(),
        })
        doUpload(file)
      })
    }

    // base64图片加载完成回调
    const onCropperImgLoad = () => {
      cropperRef.value.goAutoCrop()
    }

    // 上传前置操作，clip为true则进行裁剪
    const startUpload = async ({ file }: any) => {
      currFile.value = file
      if (!props.clip) {
        doUpload(file)
      } else {
        const reader = new FileReader()
        reader.onload = (res: any) => {
          console.log(res)
          cropperState.url = res.target.result
          cropperState.visible = true
        }
        reader.readAsDataURL(file)
      }
    }

    // 开始执行上传
    const doUpload = async (file: File | Blob) => {
      console.log(file)
      loading.value = true
      const formData = new FormData()
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
  
      if (props.dir) {
        formData.append('dir', props.dir)
      }

      formData.append('filename', `${props.filename || new Date().getTime()}.jpg`)
      formData.append('files', file)
      formData.append('thumb', props.thumb ? '1' : '0')
      formData.append('maxWidth', String(props.width))
      formData.append('watermark', props.watermark ? '1' : '0')

      try {
        const { data } = await CommonApi.uploadImg(formData, config)
        const path = data.path || data.thumbPath
        emit('update:value', path)
        emit('input', path)
        imageUrl.value = path
        message.success('上传成功！')
        if (props.clip) {
          cropperState.visible = false
        }
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      fileList,
      loading,
      imageUrl,
      cropperState,
      cropperRef,
      beforeUpload,
      startUpload,
      confirmClip,
      onCropperImgLoad
    };
  },
});
</script>

<style scoped lang="less">

:deep(.ant-upload.ant-upload-select-picture-card > .ant-upload) {
  padding: 0;
}
.upload-tips {
  font-size: 34px; color: #999999
}
.img-privew {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
:deep(.ant-upload-select-picture-card i) {
  font-size: 32px;
  color: #999;
}

:deep(.ant-upload-text) {
  margin-top: 8px;
  color: #666;
}
.cropper-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
