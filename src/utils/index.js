function formatNumber(n) {
	const str = n.toString()
	return str[1] ? str : `0${str}`
}

// 富文本过滤

function filterHtml(html) {
	html = html.replace(/\<img/g, '<img style="width:100%;height:auto;display:block;margin:10px 0;"')
	html = html.replace(/\<font/g, '<p>')
	html = html.replace(/\<\/font\>/g, '</p>')
	return html
}

export function formatTime(date, line) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	let t1
	if( line ){
		t1 = [year, month, day].map(formatNumber).join('-')
	}else{
		t1 = [year, month, day].map(formatNumber).join('/')
	}
	const t2 = [hour, minute, second].map(formatNumber).join(':')

	return `${t1} ${t2}`
}

export default {
	formatNumber,
	formatTime,
	filterHtml
}
