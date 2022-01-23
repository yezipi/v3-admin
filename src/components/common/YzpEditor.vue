<template>
  <editor
    id="tinymce"
    v-model="val"
    placeholder="写点什么把..."
    :init="initEditor"
    @input="onEditorInput"
  >
  </editor>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import CommonApi from '@/api/common'

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
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/paste'
  
export default defineComponent({

  components: { Editor },

  props: {
    content: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const val = ref('')
    const initEditor = {
      selector: '#tinymce',
      language_url: '/tinymce/langs/zh_CN.js',
      language: 'zh_CN',
      skin_url: '/tinymce/skins/ui/oxide',
      height: 500,
      branding: false,
      plugins: 'link lists image codesample code table wordcount media fullscreen preview pagebreak insertdatetime hr paste', // 插件
      toolbar: 'codesample image bold italic underline alignleft aligncenter alignright alignjustify | forecolor backcolor | fontselect | fontsizeselect | formatselect |  bullist numlist | outdent indent blockquote | removeformat| undo redo | link unlink media insertdatetime table  hr pagebreak | fullscreen preview | strikethrough', // 工具条
      font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun;  微软雅黑=Microsoft Yahei; Impact=impact,chicago;', // 字体
      fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', // 文字大小
      paste_data_images: true,
      codesample_languages: [
        { text: 'JavaScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'Java', value: 'java' },
        { text: 'C++', value: 'cpp' },
        { text: 'HTML/XML', value: 'markup' },
      ],
      // 图片上传回调
      images_upload_handler: (blobInfo: any, success: any) => {
        const file = blobInfo.blob()
        uploadFiles(file).then((url: any) => {
          success(url)
        })
      },
    }

    const Store = useStore()

    const onEditorInput = () => {
      emit('input', val.value)
    }

    const setContent = (content: string) => {
      val.value = content
    }

    const uploadFiles = async (file: any) => {
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

    onMounted(() => {
      tinymce.init({})
      val.value = props.content
    })

    return {
      val,
      initEditor,
      onEditorInput,
      setContent,
    }
  }

})
</script>

<style lang="less" scoped></style>