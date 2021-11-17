import User from './user'
import Article from './article'
import Settings from './settings'
import Commoni from './common'
import Column from './column'
export interface ApiConfig {
  User: object,
  Article: object,
  Settings: object,
  Commoni: object,
  Column: object,
}

export default {
  User,
  Article,
  Settings,
  Commoni,
  Column,
}
