const getLocalTime = (nS) => {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
const isEmpty = (item) => {
	if (item == undefined || item == '' || item == null) {
		return true;
	} else {
		return false;
	}
}
const previewImage = (imgs, index) => {
	imgs.forEach((item, index) => {
		if (item.substring(0, 2) == '//') {
			imgs[index] = 'https:' + item;
		}
	})
	uni.previewImage({
		urls: imgs,
		current: index,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function(data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function(err) {
				console.log(err.errMsg);
			}
		}
	});
}

const imageError = (item, oss) => {
	if(item.substring(0, 10) == 'http:https'){
		if (oss) {
			item = oss + 'icon_avatar_df.png';
			return item
		}
	}else if (item.substring(0, 2) == '//'){
		if (oss) {
			item = oss + 'icon_avatar_df.png';
			return item
		}
	}else if (item.substring(item.length - 4) == '.gif' ||item.substring(item.length - 4) == '.GIF' ||item.substring(item.length - 4) == '.jpg' || item.substring(item.length -
			4) == '.png' || item.substring(item.length - 4) == '.JPG' || item.substring(item.length - 4) == '.PNG' || item.substring(
			item.length - 5) == '.jpeg' || item.substring(item.length - 4) == '/132' || item.substring(item.length - 4) ==
		'/100') {
		return item
	} else {
		if (oss) {
			item = oss + 'icon_avatar_df.png';
			return item
		}
	}
}

const avatarValid = item => {
	if (!item) {
		return false
	}
	if (item.substring(item.length - 4) == '.jpg' || item.substring(item.length -
			4) == '.png' || item.substring(item.length - 4) == '.JPG' || item.substring(item.length - 4) == '.PNG' || item.substring(
			item.length - 5) == '.jpeg' || item.substring(item.length - 4) == '/132' || item.substring(item.length - 4) ==
		'/100') {
		return item
	} else {
		return false
	}
}
const getDateDiff = time => {
	var result = ''
	var minute = 1000 * 60
	var hour = minute * 60
	var day = hour * 24
	var month = day * 30
	var now = new Date().getTime()
	//2020-11-24 00:00:02 如果time是这种格式，需要把“-”转换成 “/” str.replace(/-/g,"/"),兼容IOS安卓
	var lastTime = new Date(time.replace(/-/g, "/")).getTime()
	var diffValue = now - lastTime
	if (diffValue < 0) return
	var monthC = diffValue / month
	var weekC = diffValue / (7 * day)
	var dayC = diffValue / day
	var hourC = diffValue / hour
	var minC = diffValue / minute
	if(dayC >= 7){
		result = "" + time.substring(0,10)
	}else if (dayC >= 1 && dayC < 7) {
		result = "" + parseInt(dayC) + "天前"
		// result = "" + time
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前"
	} else if (minC >= 5) {
		result = "" + parseInt(minC) + "分钟前"
	} else {
		result ="刚刚"
	}
	// console.log(result)
	return result
}
export {
	isEmpty,
	previewImage,
	imageError,
	avatarValid,
	getLocalTime,
	getDateDiff
}
