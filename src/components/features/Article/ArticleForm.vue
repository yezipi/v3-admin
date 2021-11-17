<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-form-item label="标题" name="title" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.title" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item label="分类" name="subcolumn_id" :wrapperCol="wrapperCol">
        <column-select v-model:value="formState.subcolumn_id" :type="type" style="width: 100%"></column-select>
      </a-form-item>

      <a-form-item label="封面" :wrapperCol="wrapperCol">
        <yzp-upload
          v-model:value="formState.cover_thumb"
          :thumb="true"
          :clip="true"
          :width="800"
          dir="article_cover"
        >
        </yzp-upload>
      </a-form-item>

      <a-form-item label="关键字" name="keywords" :wrapperCol="wrapperCol">
        <a-textarea v-model:value="formState.keywords" rows="3" placeholder="请输入关键字，英文逗号隔开" />
      </a-form-item>

      <a-form-item label="描述" name="description" :wrapperCol="wrapperCol">
        <a-textarea v-model:value="formState.description" rows="3" placeholder="请输入描述" />
      </a-form-item>

      <a-form-item label="正文" name="content">
        <yzp-editor ref="editor" v-model="formState.content"></yzp-editor>
      </a-form-item>

      <a-form-item label="来源" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.author_name" placeholder="请输入文章来源" />
      </a-form-item>
      
      <a-form-item label="点赞" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.like" type="number" placeholder="请输入点赞数" />
      </a-form-item>
      
      <a-form-item label="浏览" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.view" type="number" placeholder="请输入浏览数" />
      </a-form-item>

      <a-form-item label="设置">
        <a-checkbox v-model:checked="formState.status">显示</a-checkbox>
        <a-checkbox v-model:checked="formState.open_comment">开启评论</a-checkbox>
        <a-checkbox v-model:checked="formState.recommend">设为推荐</a-checkbox>
        <a-checkbox v-model:checked="formState.top">置顶</a-checkbox>
      </a-form-item>
      
      <a-form-item :wrapper-col="{ offset: 2 }">
        <a-button type="primary" @click="onSubmit">{{ articleId ? '立即保存' : '立即发布' }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, onMounted } from 'vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRouter, useRoute  } from 'vue-router'
import ArticleApi from '@/api/article';

interface FormState {
  title: string,
  subcolumn_id: string | undefined,
  cover_thumb: string,
  cover_origin: string,
  keywords: string,
  description: string,
  content: string,
  author_name: string,
  like: number,
  view: number,
  status: boolean,
  open_comment: boolean,
  recommend: boolean,
  top: boolean,
}

export default defineComponent({

  props: {
    type: {
      type: String,
      default: 'article', // 文章类型，article,case
    }
  },

  setup(props) {
    const formRef = ref();

    let formState= ref<FormState>({
      title: '',
      subcolumn_id: undefined,
      cover_thumb: '',
      cover_origin: '',
      keywords: '',
      description: '',
      content: '',
      author_name: '',
      like: 0,
      view: 0,
      status: true,
      open_comment: true,
      recommend: false,
      top: false,
    });

    const rules = {
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 5, max: 50, message: '至少5个字哦， 最多50个字', trigger: 'blur' },
      ],
      content: [
        { required: true, message: '请输入正文内容', trigger: 'change' },
        { min: 5, message: '正文至少5个字哦', trigger: 'change' },
      ],
      subcolumn_id:[ { required: true, message: '请选择分类', trigger: 'blur' } ]
    };

    const { state } = useStore()
    const router = useRouter()
    const route = useRoute()
    const articleId: any = route.query.id

    // 获取详情
    const getDetail = async () => {
      if (!articleId) {
        return
      }
      const { data } = await ArticleApi.detail(articleId)
      data.subcolumn_id = String(data.subcolumn_id)
      formState.value = data
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          formState.value.cover_origin = formState.value.cover_thumb.replace('thumb_', 'origin_')
          console.log(toRaw(formState))
          const data = {
            ...toRaw(formState.value),
            type: props.type,
            user_id: state.user.id
          }
          const msg = articleId ? '保存成功' : '发布成功'
          if (!articleId) {
            await ArticleApi.create(data)
          } else {
            await ArticleApi.update(articleId, data)
          }
          message.success(msg, 1.5, () => {
            router.push({ name: 'ArticleList' })
          })
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    onMounted(() => {
      getDetail()
    })

    return {
      formRef,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      formState,
      rules,
      onSubmit,
      resetForm,
      articleId,
    };
  },
});
</script>