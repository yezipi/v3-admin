import User from './user'
import Article from './article'
import Settings from './settings'
import Commoni from './common'

export interface ApiConfig {
  User: object,
  Article: object,
  Settings: object,
  Commoni: object,
}

export default {
  User,
  Article,
  Settings,
  Commoni,
}
