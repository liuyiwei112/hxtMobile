//自定义日期类及原型方法
//require jquery
//author liuyw

//datetools
function dt() {
	
}

//日期类公用方法
//传参:Date对象，及返回值类型
dt.getDateStr = function(_dateObj, type) {
//	alert(_dateObj+'@@'+type);
	var availType = ['yyyy-mm-dd','yyyymmdd','yyyymmddhhmmss','yyyy-mm','yyyymm','yy-mm','hh:mm:ss','mm-dd'];
	if(availType.indexOf(type)==-1){
		alert('日期格式不支持');return;
	}
	var d = _dateObj
	if(!d) {
		d = new Date();
	}
	var year = d.getFullYear(),
		day = addZero(d.getDate());
	var month = addZero(d.getMonth() + 1);
	var hour = addZero(d.getHours()),
		minute = addZero(d.getMinutes()),
		second = addZero(d.getSeconds());
	if(type == 'yyyy-mm-dd') {
		return year + '-' + month + '-' + day;
	} else if(type == 'yyyymmdd') {
		return year + '' + month + '' + day;
	} else if(type == 'yyyymmddhhmmss') {
		return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	} else if(type=='yyyy-mm'){
		return year + '-' + month;
	} else if(type=='yyyymm'){
		return year + '' + month;
	} else if(type=='yy-mm'){
		return (year+'').substr(2,2)+'-'+month;
	} else if(type=='hh:mm:ss'){
		return hour + ':' + minute + ':' + second;
	}else if(type=='mm-dd'){
		return month + '-' + day;
	}
}

//将'yyyy-mm-dd'，'yyyymmdd'，'yyyymmddhhmmss'改变文本格式
dt.changeDataStr = function(_dstr,nowType,toType){
	var availType1 = ['yyyy-mm-dd','yyyymmdd','yyyymmddhhmmss'];
	var availType2 = ['yyyy-mm-dd','yyyymmdd','yyyymmddhhmmss','yyyy-mm','yyyymm','yy-mm'];
	if(availType1.indexOf(nowType)==-1){
		alert('不支持将要转换的日期格式');
		return;
	}
	if(availType2.indexOf(toType)==-1){
		alert('不支持转换后的日期格式');
		return;
	}
	return dt.getDateStr(dt.toDate(_dstr,nowType),toType);
}

//传参方式2016-01-01
dt.toDate = function(_date, type) {
	if(type == 'yyyy-mm-dd') {
		var a = _date.split('-');
		return new Date(a[0], a[1] - 1, a[2]);
	} else if(type == 'yyyymmdd') {
		return new Date(dt.getYear(_date), dt.getMonth(_date) - 1, dt.getDay(_date));
	} else if(type == 'yyyymmddhhmmss'){
		return new Date(dt.getYear(_date), dt.getMonth(_date) - 1, dt.getDay(_date),dt.getHH(_date),dt.getMM(_date),dt.getSS(_date));
	}
}

//获取年
dt.getYear = function(dateStr) {
	return dateStr.substring(0, 4);
}
//获取月
dt.getMonth = function(dateStr) {
	return dateStr.substring(4, 6);
}
//获取日
dt.getDay = function(dateStr) {
	return dateStr.substring(6, 8);
}
//获取时
dt.getHH = function(dateStr) {
	return dateStr.substring(8, 10);
}
//获取分
dt.getMM = function(dateStr) {
	return dateStr.substring(10, 12);
}
//获取秒
dt.getSS = function(dateStr) {
	return dateStr.substring(12, 14);
}

//获取系统当前日期
dt.getNowStr = function(type){
	return dt.getDateStr(new Date(),type);
}
//获取指定日期的前一天
//传入日期对象，日期格式
dt.getPreDayStr = function(nowDate,type){
	var preDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);
	return dt.getDateStr(preDate, type);
}
//获取指定日期的前一天
//传入日期对象，日期格式
dt.getNextDayStr = function(nowDate,type){
	var nextDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);
	return dt.getDateStr(nextDate, type);
}

addZero = function(_a){
	if(_a < 10) {
		_a = '0' + _a;
	}
	return _a;
}

//test
//alert(dt.getDateStr(dt.toDate('20160301120344','yyyymmddhhmmss'),'yyyy-mm-dd'));
//alert(dt.changeDataStr('2016-09-09','yyyy-mm-dd','yyyymmdd'));
//alert(dt.getNowStr('yyyy-mm-dd'));