<template>
  <div class="album-manage">
    <a-button type="primary" @click="showDialog">新建相册</a-button>

    <div class="album-list">
      <ul>
        <li v-for="(item, k) in list" :key="k" class="al-item">
          <div class="al-cover">
            <img :src="'/api'+item.path" alt=""/>
            <div class="al-todo">
              <i class="a-icon-view" @click=""></i>
              <i class="a-icon-edit" @click="editAlbum(item)"></i>
              <i class="a-icon-delete" @click="deleteAlbum(item)"></i>
            </div>
          </div>
          <div class="al-text">
            <span style="color: #999999"> {{ item.picture_count }} 张 </span>
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>

    <a-modal
      v-model:visible="dialogVisible"
      :title="ruleForm.id ? '编辑相册' : '新建相册'"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :centered="true"
      width="500px">
      <a-form ref="ruleForm" :model="ruleForm" :rules="rules" :label-col="{ style: { width: '80px' } }" class="demo-ruleForm">
        <a-form-item label="图片" prop="cover">
          <yzp-upload v-model:value="ruleForm.cover" dir="album"></yzp-upload>
        </a-form-item>
        <a-form-item label="标题" prop="name">
          <a-input v-model:value="ruleForm.name" placeholder="填写相册标题" :maxlength="30"></a-input>
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea type="textarea" :rows="3" v-model:value="ruleForm.description" placeholder="填写相册描述" :maxlength="100"></a-textarea>
        </a-form-item>
        <a-form-item label="开启评论">
          <a-switch v-model:checked="ruleForm.comment_open"></a-switch>
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="dialogVisible = false">取 消</a-button>
          <a-button type="primary" @click="submit">{{ ruleForm.id ? '保存' : '创建' }}</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent ,ref } from 'vue'
export default defineComponent({
  setup() {
    const dialogVisible = ref(false)
    const ruleForm = ref({
      id: undefined,
      name: undefined,
      cover: undefined,
      description: undefined,
      comment_open: true,
    })
    const rules = {
      name: [{ message: '名称必须', required: true, trigger: 'blur' }],
      cover: [{ message: '封面必须', required: true, trigger: 'change' }],
    }

    const list = ref<any>([])

    const showDialog = () => {
      dialogVisible.value = true
    }
    const submit = () => {}
    const editAlbum = (e: any) => {}
    const deleteAlbum = (e: any) => {}
    return {
      dialogVisible,
      ruleForm,
      rules,
      list,
      showDialog,
      submit,
      editAlbum,
      deleteAlbum
    }
  }
})
</script>

<style scoped lang="less">
  .album-list {
    margin-top: 20px;
    ul {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 180px;
        text-align: center;
        margin-right: 10px;
        .al-cover {
          height: 100px;
          position: relative;
          border-radius: 3px;
          overflow: hidden;
          &:hover {
            .al-todo {
              display: flex;
            }
          }
          .al-todo {
            position: absolute;
            background: rgba(0,0,0,0.5);
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: none;
            justify-content: space-around;
            align-items: center;
            i {
              font-size: 26px;
              cursor: pointer;
              color: #ffffff;
              &:hover {
                opacity: 0.5;
              }
            }
          }
          img {
            display: block;
            object-fit: cover;
            width: 100%;
            height: 100%;
          }
        }
        span {
          display: block;
          font-size: 12px;
          color: #555555;
          margin-top: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .al-text {
          line-height: 12px;
          span {
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
.album-img {
  width: 148px;
  height: 85px;
  position: relative;
  background: #eeeeee;
  border-radius: 3px;
  overflow: hidden;
  &:hover {
    i {
      display: flex;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    display: none;
    font-size: 24px;
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0, 0.5);
    cursor: pointer;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>