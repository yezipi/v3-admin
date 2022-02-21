<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import CommonApi from '@/api/common'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import config from '@/config'

import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/media'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/paste'

interface PropsConfig {
  value: string,
  id?: string
}

const props = withDefaults(defineProps<PropsConfig>(), {
  value: '',
  id: 'tinymce'
})

const emit = defineEmits(['update:value'])

const content = ref(props.value)

const editorConfig = {
  selector: '#' + props.id,
  language_url: config.BASE_URL + '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  skin_url: config.BASE_URL + '/tinymce/skins/ui/oxide',
  height: 500,
  branding: true,
  plugins: 'link lists image codesample code table wordcount media table fullscreen preview pagebreak insertdatetime hr paste', // 插件
  toolbar: 'codesample image bold italic underline alignleft aligncenter alignright alignjustify | forecolor backcolor | fontselect | fontsizeselect | formatselect |  bullist numlist | outdent indent blockquote | removeformat| undo redo | link unlink media insertdatetime table  hr pagebreak | fullscreen preview | strikethrough', // 工具条
  font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun;  微软雅黑=Microsoft Yahei; Impact=impact,chicago;', // 字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', // 文字大小
  paste_data_images: true,
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'Java', value: 'java' },
    { text: 'C++', value: 'cpp' },
  ],
  // 图片上传回调
  images_upload_handler: (blobInfo: any, success: Function) => {
    const file = blobInfo.blob()
    uploadImgsToServe(file).then((url: string) => {
      success(url)
    })
    console.log(file)
  },
}

const setContent = (res: string) => {
  content.value = res
}

const Store = useStore()

const uploadImgsToServe = async (file: any) => {
  Store.commit('showLoading', '上传中...')
  const formData = new FormData()
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  formData.append('filename', `${new Date().valueOf()}.jpg`)
  formData.append('file', file)
  formData.append('dir', 'article')
  formData.append('maxWidth', '750')
  formData.append('watermark', '1')
  try {
    const { data } = await CommonApi.uploadImg(formData, config)
    message.success('上传成功！')
    return data.path
  } catch (e) {
    console.log(e)
  } finally {
    Store.commit('hideLoading')
  }
}

watch(() => props.value, (value: string) => {
  content.value = value
})

watch(() => content.value, (value: string) => {
  emit('update:value', value)
})

onMounted(() => {
  tinymce.init(editorConfig)
  content.value = props.value
})

defineExpose({
  setContent
})

</script>

<template>
  <editor v-model="content" :id="id" :init="editorConfig" placeholer="说点什么吧..."></editor>
</template>

<style lang="less" scoped></style>