<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    list-type="picture-card"
    class="yzp-uploader"
    :class="{ autoWidth }"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :customRequest="startUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" />
    <div v-else style="font-size: 34px; color: #999999">
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text"></div>
    </div>
  </a-upload>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import CommonApi from '@/api/common';
import CONFIG from '@/config';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
export default defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined,
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
      type: [String, Number],
      default: String(new Date().getTime()),
    },
    autoWidth: {
      type: Boolean,
      default: false,
    },
    width: Number,
  },
  setup(props, { emit }) {
    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string | undefined>('');

    watch(() => props.value, (val) => {
      imageUrl.value = CONFIG.REQ_URL + val
    })

    const handleChange = (info: FileInfo) => {
      if (info.file.status === 'uploading') {
        loading.value = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }
      if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
      }
    };

    const beforeUpload = (file: FileItem) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传图片哦！');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('不能超过2m大小哦!');
      }
      return isJpgOrPng && isLt2M;
    };

    const startUpload = async (data: any) => {

      console.log(data.file);

    const formData = new FormData();
 
    if (props.dir) {
      formData.append('dir', props.dir);
    }

    formData.append('filename', `${props.filename}.jpg` || `${new Date().valueOf()}.jpg`);
    formData.append('files', data.file);
    formData.append('thumb', props.thumb ? '1' : '0');
    formData.append('maxWidth', String(props.width));
    formData.append('watermark', props.watermark ? '1' : '0');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    };

    try {
      const { data } = await CommonApi.uploadImg(formData, config);
      const path = data.path || data.thumbPath
      emit('update:value', path)
      emit('input', path)
      message.success('上传成功！')
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
      handleChange,
      beforeUpload,
      startUpload,
    };
  },
});
</script>
<style scoped lang="less">
.yzp-uploader > .ant-upload {
  width: 128px;
  height: 128px;
  margin: 0;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
