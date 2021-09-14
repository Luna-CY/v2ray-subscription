import {ActionContext, createStore} from 'vuex'
import {USER_TOKEN_KEY} from "@/constant"

export class StoryStateToken {

  public token = ""

  public expired = 0
}

export class StoryStateLocal {

  public is_default_key = false

  public is_default_remove_key = false
}

class StoryState {

  /**
   * 登录用户凭据
   */
  public token: StoryStateToken = new StoryStateToken()

  /**
   * 本地临时缓存的数据
   */
  public local: StoryStateLocal = new StoryStateLocal()
}

export default createStore({
  state: new StoryState(),
  getters: {
    token(state: StoryState) {
      return state.token
    },
    local(state: StoryState) {
      return state.local
    },
  },
  mutations: {
    token(state: StoryState, payload: StoryStateToken) {
      state.token = payload

      sessionStorage.setItem(USER_TOKEN_KEY, JSON.stringify(payload))
    },
    local(state: StoryState, payload: StoryStateLocal) {
      state.local = payload
    },
  },
  actions: {
    logout(context: ActionContext<StoryState, StoryState>) {
      context.state.token = new StoryStateToken()

      sessionStorage.removeItem(USER_TOKEN_KEY)
    },
    load(context: ActionContext<StoryState, StoryState>) {
      const tokenJsonData = sessionStorage.getItem(USER_TOKEN_KEY)
      if (null != tokenJsonData) {
        // @ts-ignore
        const timestamp = Date.parse(new Date()) / 1000
        const token = JSON.parse(tokenJsonData) as StoryStateToken;
        if (token.expired < timestamp) {
          return false
        }

        context.state.token = token

        return true
      }

      return true
    },
  },
  modules: {}
})
