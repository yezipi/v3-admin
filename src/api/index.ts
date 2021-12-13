import User from './user'
import Article from './article'
import Settings from './settings'
import Commoni from './common'
import Column from './column'
import Tags from './tags'
import Banner from './banner'
import Mood from './mood'
import Album from './album'
import Picture from './picture'
import Blogroll from './blogroll'
import Feedback from './feedback'
import Comment from './comment'
import ChangeLogs from './changeLogs'
import Role from './role'

export interface ApiFn {
  create?: any,
  update?: any,
  destory?: any,
  getList?: any,
  getDetail?: any,
}

export interface ApiConfig {
  User: ApiFn,
  Article: ApiFn,
  Settings: any,
  Commoni: ApiFn,
  Column: ApiFn,
  Tags: ApiFn,
  Banner: ApiFn,
  Mood: ApiFn,
  Album: ApiFn,
  Picture: ApiFn,
  Blogroll: ApiFn,
  Feedback: ApiFn,
  Comment: ApiFn,
  ChangeLogs: ApiFn
  Role: ApiFn,
}

export default {
  User,
  Article,
  Settings,
  Commoni,
  Column,
  Tags,
  Banner,
  Mood,
  Album,
  Picture,
  Blogroll,
  Feedback,
  Comment,
  ChangeLogs,
  Role
}
