<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :customRequest="startUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref, watch } from 'vue';
import CommonApi from '@/api/common'

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
    value: String,
    dir: String,
    thumb: Boolean,
    watermark: Boolean,
    filename: String,
    width: Number,
  },
  setup(props, { emit }) {
    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const imageUrl = ref<string | undefined>('');

    watch(() => props.value, (val) => {
      imageUrl.value = val
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
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };

    const startUpload = async (file: any) => {

    const formData = new FormData();
    const thumb: any = props.thumb
    const dir: any = props.dir
    const watermark: any = props.watermark

    formData.append('filename', props.filename || `${new Date().valueOf()}.jpg`);
    formData.append('file', file);
    formData.append('dir', dir);
    formData.append('thumb', thumb);
    formData.append('maxWidth', String(props.width));
    formData.append('watermark', watermark);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const { data } = await CommonApi.uploadImg(formData, config);
      const path = data.path || data.thumb_path
      console.log(path)
      emit('input', '/' + path);
      message.success('上传成功~');
    } catch (e) {
      console.log(e);
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
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
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
