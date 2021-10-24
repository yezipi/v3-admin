<template>
  <div class="article-save">
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
        <column-select v-model:value="formState.subcolumn_id" type="article" style="width: 100%"></column-select>
      </a-form-item>

      <a-form-item label="封面" :wrapperCol="wrapperCol">
        <yzp-upload
          v-model="formState.cover_thumb"
          :thumb="true"
          :clip="true"
          :height="250"
          :width="500"
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

      <a-form-item label="设置">
        <a-checkbox v-model:checked="formState.status">是否显示</a-checkbox>
        <a-checkbox v-model:checked="formState.open_comment">开启评论</a-checkbox>
        <a-checkbox v-model:checked="formState.recommend">设为推荐</a-checkbox>
        <a-checkbox v-model:checked="formState.top">置顶</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 2 }">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts">
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from 'vue';
import { useStore } from 'vuex';
import { useRouter  } from 'vue-router'
import ArticleApi from '../../api/article';

interface FormState {
  title: string,
  subcolumn_id: string | undefined,
  cover_thumb: string,
  cover_origin: string,
  keywords: string,
  description: string,
  content: string,
  status: boolean,
  open_comment: boolean,
  recommend: boolean,
  top: boolean,
}

export default defineComponent({
  setup() {
    const formRef = ref();

    const formState: UnwrapRef<FormState> = reactive({
      title: '',
      subcolumn_id: undefined,
      cover_thumb: '',
      cover_origin: '',
      keywords: '',
      description: '',
      content: '',
      status: true,
      open_comment: true,
      recommend: false,
      top: false,
    });

    const fileList = ref([])
    const imageUrl = ref('')

    const rules = {
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 5, max: 50, message: '至少5个字哦， 最多50个字', trigger: 'blur' },
      ],
      content: [
        { required: true, message: '请输入正文内容', trigger: 'change' },
        { min: 5, message: '正文至少5个字哦', trigger: 'change' },
      ],
      subcolumn_id:[ { required: true, message: '请选择分类', trigger: 'change' } ]
    };

    const { state } = useStore()
    const router = useRouter()

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          const data = {
            ...toRaw(formState),
            user_id: state.user.id
          }
          await ArticleApi.create(data)
          router.push('/ArticleList')
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      formState,
      rules,
      fileList,
      imageUrl,
      onSubmit,
      resetForm,
    };
  },
});
</script>