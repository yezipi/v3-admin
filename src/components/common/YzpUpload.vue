<template>
  <div class="yzp-upload">
    <a-upload
      v-model:file-list="fileList"
      name="file"
      :list-type="isButton ? undefined : 'picture-card'"
      :accept="fileAccept"
      :class="{ withParentWith }"
      :show-upload-list="!!multiple"
      :before-upload="beforeUpload"
      :customRequest="startUpload"
      :multiple="multiple"
    >
      <template v-if="!isButton">
        <template v-if="imageUrl && !multiple" >
          <img class="yzp-upload-img-privew" :src="imageUrl" />
          <close-circle-outlined class="yzp-upload-img-remove" @click.stop="imageUrl = ''" />
        </template>
        <div v-else class="yzp-upload-tips">
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="yzp-upload-text"></div>
        </div>
      </template>
      <template v-else>
        <a-button :loading="loading" class="yzp-upload-btn" type="primary">选择文件</a-button>
      </template>
    </a-upload>

    <!--图片裁剪-->
    <a-modal
      v-if="clip && !isButton"
      v-model:visible="cropperState.visible"
      :width="width > 500 ? (Number(width) + 48) : 500"
      :centered="true"
      title="裁剪图片"
      ok-text="确认"
      cancel-text="取消"
      @ok="confirmClip"
    >
      <div class="yzp-upload-cropper-dialog" style="height: 350px;">
        <a-spin :spinning="loading" tip="正在上传中..."></a-spin>
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
import { defineComponent, ref, watch, reactive, computed } from 'vue'
import { PlusOutlined, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { VueCropper }  from 'vue-cropper'
import { message, Upload } from 'ant-design-vue'
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
    CloseCircleOutlined,
    VueCropper,
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    /**
     * 按钮类型：button, picture
     */
    type: {
      type: String,
      default: 'picture'
    },
    /**
     * 文件接受类型
     */
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/png'
    },
    /**
     * 存放的目录
     */
    dir: {
      type: String,
      default: ''
    },
    /**
     * 是否生成缩略图
     */
    thumb: {
      type: Boolean,
      default: false,
    },
    /**
     * 水印
     */
    watermark: {
      type: Boolean,
      default: false,
    },
    /**
     * 文件名
     */
    filename: {
      type: String,
      default: '',
    },
    /**
     * 预览的时候自动到父级的宽度
     */
    withParentWith: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否需要裁剪
     */
    clip: {
      type: Boolean,
      default: false
    },
    /**
     * 图片高
     */
    width:  {
      type: [Number, String],
      default: ''
    },
    /**
     * 图片宽
     */
    height: {
      type: [Number, String],
      default: ''
    },
    /**
     * 是否压缩
     */
    compress: {
      type: Boolean,
      default: false
    },
    /**
     * 是否批量上传
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 最大传多少张
     */
    count: {
      type: Number,
      default: 1
    },
  },
  setup(props, { emit }) {
    const fileList = ref<any>([])
    const loading = ref<boolean>(false)
    const imageUrl = ref<any>(props.value)
    const cropperRef = ref()
    const cropperState = reactive({
      url: '' as any,
      visible: false
    })
    const currFile = ref<any>({})
    const fileAccept = ref(props.accept)
    const isButton = computed(() => props.type === 'button')

    const vals = ref<any>([]) // 批量上传用来保存的

    watch(() => props.accept, (val: string) => {
      fileAccept.value = val
    })

    watch(() => props.value, (val: string | Array<any>) => {
      imageUrl.value = val
      if (Array.isArray(val)) {
        fileList.value = fileList.value.map((e: FileItem, index: number) => {
          e.url = val[index]
          return e
        })
        console.log(val)
      }
    })

    const beforeUpload = (file: FileItem) => {
      if (fileList.value.length >= props.count && props.multiple) {
        message.error(`不能超过${props.count}张`)
        return false
      }
      const isInType = fileAccept.value.indexOf(file.type as any) > -1
      if (!isInType) {
        message.error('不符合上传的文件类型')
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('不能超过5m大小哦!')
      }
      return (isInType && isLt5M) || Upload.LIST_IGNORE
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
    const doUpload = async (file: File) => {
      if (vals.value.length + 1 >= props.count && props.multiple) {
        const msg = `不能超过${props.count}张`
        throw { msg }
      }
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

      const fileSuffix = file.name.split('.')

      formData.append('filename', `${props.filename || fileSuffix[0]}.${fileSuffix[fileSuffix.length - 1]}`)
      formData.append('files', file)
      formData.append('thumb', props.thumb ? '1' : '0')
      formData.append('watermark', props.watermark ? '1' : '0')
      formData.append('compress', props.compress ? '1' : '0')
      if (props.width) {
        formData.append('maxWidth', String(props.width))
      }

      try {
        const { data } = await CommonApi.uploadImg(formData, config)
        const path = data.path || data.thumbPath
        fileList.value  = fileList.value.map((e: FileItem) => {
          e.status = 'done'
          return e
        })
        if (props.multiple) {
          vals.value.push(path);
          emit('update:value', vals.value)
          emit('input', vals.value)
        } else {
          emit('update:value', path)
          emit('input', path)
          imageUrl.value = path
        }
        message.success('上传成功！')
        if (props.clip) {
          cropperState.visible = false
        }
      } catch (e: any) {
        console.log(e)
        message.error(e.msg || '上传失败！')
      } finally {
        loading.value = false
      }
    }

    return {
      fileAccept,
      isButton,
      fileList,
      loading,
      imageUrl,
      cropperState,
      cropperRef,
      beforeUpload,
      startUpload,
      confirmClip,
      onCropperImgLoad,
    };
  },
});
</script>

<style scoped lang="less">
:deep(.ant-upload.ant-upload-select-picture-card > .ant-upload) {
  padding: 0;
}

:deep(.ant-upload-select-picture-card i) {
  font-size: 32px;
  color: #999;
}

.yzp-upload {
  position: relative;
  height: 100%;
  display: flex;
  :deep(.withParentWith .ant-upload.ant-upload-select-picture-card) {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yzp-upload-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 34px;
    color: #999999;
  }
  .yzp-upload-img-privew {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .yzp-upload-img-remove {
    color: red;
    position: absolute;
    font-size: 20px;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
  }
  .withParentWith {
    display: block;
    height: 100%;
  }
  .withParentWith .yzp-upload-img-privew{
    width: 100%;
    height: 100%;
  }
}


  .yzp-upload-cropper-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
