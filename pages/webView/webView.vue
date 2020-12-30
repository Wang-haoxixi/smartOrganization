<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad(res) {
			console.log(res)
			if (res.type == 'agreement') {
				this.url = 'https://h5.woneng.net?type=agreement'
			} else if (res.type == 'privacy') {
				this.url = 'https://h5.woneng.net?type=privacy'
			} else if (res.type == 'redness') {
				this.url = 'https://h5.woneng.net?type=preview'
			} else if (res.type == 'userFaith') {
				this.url = 'https://h5.woneng.net?type=userFaith'
			} else if (res.type == 'questionnaireLogic') {
				this.url = 'https://woneng.net/questionnaire_edit/'+ res.id +'/h5?token=' + uni.getStorageSync('userinfo').access_token
			}
		}
	}
</script>

<style lang="scss"></style>
