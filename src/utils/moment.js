// 日期转换
function dataTransform (time) {
  if (time !== '') {
    let thatDate = new Date()
    // let thathours = thatDate.getHours()
    let Month = (thatDate.getMonth() + 1).toString().length === 1 ? '0' + (thatDate.getMonth() + 1) : thatDate.getMonth() + 1
    let mydate = thatDate.getFullYear() + '-' + Month + '-' + thatDate.getDate() // 当前时间
    let jobDate = time.split(' ') // 工作发布时间
    let hours = jobDate[1].split(':') // [11, 54, 10] = [时，分，秒]
    let dataArr = jobDate[0].split('-')
    let jobYear = { // 参数的时间
      year: dataArr[0],
      Month: dataArr[1],
      day: dataArr[2]
    }
    let thisYear = { // 当前的时间
      year: thatDate.getFullYear() + '',
      Month: Month,
      day: thatDate.getDate() + ''
    }
    if (jobDate[0] === mydate) {
      return hours[0] + ':' + hours[1]
    } else if (jobYear.year === thisYear.year && jobYear.Month === thisYear.Month) {
      if (thisYear.day - jobYear.day === 1) {
        return '昨天'
      } else {
        return jobDate[0]
      }
      // thisYear.day - jobYear.day + '天前'
    } else {
      return jobDate[0]
    }
  }
}

function reloadPubdate(string) {
    var re = /^(\d{2,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    if (re.test(string)) {
        var t = string.match(re);
        var d = new Date(t[1], t[2] - 1, t[3], t[4], t[5], t[6]);
        var c = new Date();
        var s = (c.getTime() - d.getTime()) / 1000;
        var m = Math.floor(s / 60);
        var h = Math.floor(s / 3600);
        var d = Math.floor(s / 86400);
        var n = Math.floor(s / (86400 * 30));
        var y = Math.floor(s / (86400 * 365));
        if (y > 0) return y + "年前";
        if (n > 0) return n + "个月前";
        if (d > 0) return d + "天前";
        if (h > 0) return h + "小时前";
        if (m > 0) return m + "分钟前";
    }
    return "刚刚";
}

module.exports = {
  timeHandle: dataTransform,
	reloadPubdate: reloadPubdate
}
