<script lang="ts" setup>
import { ref, computed } from 'vue'
import config from '@/config'
import { message } from 'ant-design-vue'
import CommonApi from '@/api/common'

const loading = ref(false)
const sitemapUrl = ref('')
  
const createSitemap = async () => {
  loading.value = true
  try {
    const { data } = await CommonApi.createSitemap()
    console.log(data)
    sitemapUrl.value = data
    message.success('生成成功！')
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const url = computed(() => config.REQ_URL + sitemapUrl.value.replace('/public', 'public'))
  
 </script>
  
 <template>
  <div class="yzp-create-sitemap">
    <a v-if="sitemapUrl" :href="url" target="_blank">{{ url }}</a>
    <a-button type="primary" :loading="loading" @click="createSitemap" style="margin-top: 20px">生成sitemap</a-button>
  </div>
</template>

<style scoped lang="less">
  .yzp-create-sitemap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
  