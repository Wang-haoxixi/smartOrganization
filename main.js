import Vue from 'vue'
import App from './App'
import tim from './common/tim/tim.js'
// import common from './common/common.js'
import {http} from '@/common/service.js'
import {isEmpty} from '@/common/utils.js'
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
import store from './store/index.js'

Vue.prototype.$tim = tim.tim  			//tim sdk 引入后生成的tim服务
Vue.prototype.$TIM = TIM				//tim 的状态/事件 常量
Vue.prototype.$store = store
// Vue.prototype.$common = common
Vue.prototype.$isEmpty = isEmpty
Vue.prototype.$http = http

Vue.prototype.$oss = 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/'
// Vue.prototype.$ossUrl = (suffix) => {
// 	return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/${suffix}`
// }
Vue.prototype.$ossUrl = (suffix) => {
	return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/${suffix}`
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
