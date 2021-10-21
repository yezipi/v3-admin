import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export interface ConfirmConfig {
  title?: string,
  content?: string,
  okText?: string,
  cancelText?: string,
}

/**
 * 封装ant-design-vue的confim
 * @version 2021-10-21 zzc
 * @param { Object | string } params 参数对象, 可以为string, 是content值
 * @param { Function } callback 回调
 */
export default (params: string | ConfirmConfig, callback: Function) => {
  const {
    title = '提示',
    content = '确定删除吗',
    okText = '确定',
    cancelText = '取消',
  } = typeof params === 'string' ? {} : params

  Modal.confirm({
    title: () => title,
    content: () => typeof params === 'string' ? params : content,
    okType: 'danger',
    okText: () => okText,
    cancelText: () => cancelText,
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      callback && callback()
    },
  });

}
