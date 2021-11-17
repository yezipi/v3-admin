<template>
  <editor
    id="tinymce"
    v-model="val"
    :init="initEditor"
    @input="onEditorInput"
  >
  </editor>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'

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
      height: 400,
      branding: false,
      plugins: 'link lists image codesample code table wordcount  media table fullscreen preview pagebreak insertdatetime hr paste', // 插件
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
      images_upload_handler: (blobInfo: any, success: any) => {
        const file = blobInfo.blob()
        // this.uploadToServe(file).then((url: any) => {
        //   success('/api' + url)
        // })
        console.log(file)
      },
    }

    const onEditorInput = () => {
      emit('input', val.value)
    }

    const setContent = (content: string) => {
      val.value = content
    }

    const uploadFiles = (file: any) => {
      // const ld = this.$loading({
      //   text: '图片上传中...',
      //   lock: true,
      //   spinner: 'el-icon-loading',
      // });
      // const formData = new FormData();
      // formData.append('filename', `${new Date().valueOf()}.jpg`);
      // formData.append('file', file);
      // formData.append('dir', 'article_content');
      // formData.append('maxWidth', '750');
      // formData.append('watermark', 'true');
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // };
      // try {
      //   const { result } = await this.$api.common.upload(formData, config);
      //   this.$message.success('上传成功~');
      //   return result.path
      // } catch (e) {
      //   console.log(e);
      // } finally {
      //   ld.close();
      // }
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