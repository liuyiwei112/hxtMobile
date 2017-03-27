/**
 *自定义的地图常用工具类及原型方法
 *require 
 * 	
 *author liuyw
 */

//maptools
function mt(){
	
}

mt.mapUrl = 'http://webapi.amap.com/maps?v=1.3&key=1a7e2aec7f2a1b21b38ee9c88d652adb';

/**
 * 加载高德地图方法，若加载失败，延迟1秒在次加载
 * @param {Object} fn
 */
mt.loadMap = function(fn){
	//动态加载地图
	var oHead = document.getElementsByTagName('HEAD').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";
	oScript.src = mt.mapUrl;
	oHead.appendChild(oScript);
	oScript.onload = function() {
		if(window.AMap && window.AMap.Map) {
			fn();
		}else{
			//解决加载了但无法创建地图问题
			setTimeout(function() {
				mt.loadMap(fn);
			}, 1000)
		}
	}	
}

/**
 * 经纬度 高德（火星坐标系） 转 百度（BD－09） ； return [lat,lng]
 * @param {Object} gd_lat 高德地图纬度
 * @param {Object} gd_lng 高德地图经度
 * @return [Array] 百度地图坐标系
 */
mt.bd_decrypt = function(gd_lat, gd_lng) {
	var x = gd_lat,
		y = gd_lng;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
	var a = [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006]
	return a;
}

/**
 * 将m转换为km
 * @param {Object} _d
 */
mt.toKm = function(_d) {
	if(_d < 1000) {
		return _d + ' m';
	} else {
		return(_d / 1000).toFixed(2) + ' km';
	}
}

/**
 * 高德地图使用的参数为[经度、纬度]，若经纬度反了使用此方法调整
 * @param {Object} pointList 数组，元素为［纬度，经度］
 */
mt.changeLatLng = function(pointList) {
	var newPointList = [];
	for(var i = 0; i < pointList.length; i++) {
		var pointArray = [pointList[i][1], pointList[i][0]];
		newPointList.push(pointArray);
	}
	return newPointList;
}
//alert(mt.mapUrl);
//alert(mt.bd_decrypt('32.333','18.111'));
//alert(mt.toKm(23201) +'@@@'+ mt.toKm(201));
//alert(mt.changeLatLng([['32.333','18.111'],['32.332','18.110']]));
