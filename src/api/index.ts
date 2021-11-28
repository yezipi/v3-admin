import User from './user'
import Article from './article'
import Settings from './settings'
import Commoni from './common'
import Column from './column'
import Tags from './tags'
import Banner from './banner'
export interface ApiConfig {
  User: object,
  Article: object,
  Settings: object,
  Commoni: object,
  Column: object,
  Tags: object,
  Banner: object,
}

export default {
  User,
  Article,
  Settings,
  Commoni,
  Column,
  Tags,
  Banner,
}
