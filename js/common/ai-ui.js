/**
 *自定义的UI常用工具类及原型方法
 *require 
 *  mui.js
 * 	jquery.js
 *  jquery.rotate.js
 * 	base.css
 *author liuyw
 */

//asiainfo-ui
function au() {
	//test
}

au.api = 'http://115.28.22.146:9090/ytcrm/rest/';
//au.api = 'http://192.168.2.102:8080/ytcrm/rest/';

/**
 * mui界面新增,同名文件不再重复新增，直接显示
 * @param {Object} url 跳转的Url
 */
au.toUrl = function(url) {
	var pageName = url;
	if(url.indexOf('/')>-1){
		pageName = url.substring(url.lastIndexOf('/')+1,url.length);
//		console.log('pageName:'+pageName);
	}
	if(mui.os.plus){
		var flag = true;
		var view = plus.webview.all();
		for(var i=0;i<view.length;i++){
			var nUrl = view[i].getURL().toString();
			var nName = nUrl.substring(nUrl.lastIndexOf('/')+1,nUrl.length);
//			console.log('nName:'+nName);
			if(flag&&nName==pageName){
				view[i].show();
				flag = false;
				return;
			}
		}
//		console.log('flag:'+flag);
		if(flag){
			var webview = mui.openWindow({
				url: url,
				id: url
			});
		}
	}else{
		var webview = mui.openWindow({
			url: url,
			id: url
		});
	}
	console.log('new window:'+webview.id); //输出mui字符串
}

/**
 * 弹出拨号确认面板
 * @param {Object} num 即将拨打的号码
 */
au.phone = function(num) {
	var btnArray = ['否', '是'];
	mui.confirm('即将拨号:' + num + '，是否确认?', '', btnArray, function(e) {
		if(e.index == 1) {
			window.location.href = 'tel://' + num;
		}
	})
}

/**
  	从底部弹出选择框，比如拍照等
	传入数组({value:'1',text:'test'})及回调方法，
	回调传入点击的对象
 */
au.showSelect = function(_d, _fn) {
	$('body').append('<div class="pop-up hide pop-up-select"><div class="pop-up-panel"><div class="item-select-panel"></div><div class="item-cancel"><div class="button">取消</div></div></div><div class="pop-up-mask"></div></div>');
	for(var i = 0; i < _d.length; i++) {
		$('.pop-up-select').find('.item-select-panel').append('<div class="button" data="' + i + '">' + _d[i].text + '</div>')
	}
	$('.pop-up-select').fadeIn(200);
	//绑定事件
	$('.pop-up-select').find('.item-select-panel .button').on('tap', function() {
		var data = $(this).attr('data');
		_fn(_d[data]);
		$('.pop-up-select').remove();
	})
	$('.pop-up-select').find('.item-cancel').on('tap', function(e) {
		$('.pop-up-select').fadeOut(500, function() {
			$('.pop-up-select').remove();
		});
	})
}

/**
 * 显示转动的加载框
 */
au.showLoading = function() {
		$('body').append('<div class="pop-up pop-up-loading"><div class="pop-up-panel"><img src="../../images/loading2.gif"/></div><div class="pop-up-mask"></div></div>');
	}
	/**
	 * 隐藏转动的加载框
	 */
au.hideLoading = function() {
	$('body').find('.pop-up-loading').remove();
}

/**
 * 显示局部汽车动画的加载
 */
au.showCarLoading = function(_top,_text) {
	if(!_text) _text = '正在加载中...';
	if(!_top){
		_top = '5rem';
	}else{
		_top = _top + 'rem';
	}
	$('body').append('<div class="car-loading" style="top:'+_top+'"><span class="tip-text">' + _text + '</span></div>');
}

/**
 * 隐藏局部汽车动画的加载
 */
au.hideCarLoading = function() {
	$('body').find('.car-loading').remove();
}

/**
 * 显示汽车全屏的加载
 */
au.showCarLoadingFull = function(_text) {
	if(!_text) _text = '正在加载中...';
	$('body').append('<div class="car-loading-full"><span class="tip-text">' + _text + '</span></div>');
}

/**
 * 隐藏汽车全屏的加载
 */
au.hideCarLoadingFull = function() {
	$('body').find('.car-loading-full').remove();
}

/**
 * 显示带汽车的提示文本
 * @param {Object} _top 距离顶部高度
 * @param {Object} _text 提示的文字
 */
au.showCarTip = function(_top,_text){
	if(!_text) _text = '加载失败';
	if(!_top){
		_top = '5rem';
	}else{
		_top = _top + 'rem';
	}
	$('body').append('<div class="car-tip" style="top:'+_top+'"><span class="car-tip-text">' + _text + '</span></div>');
}

au.hideCarTip = function(){
	$('body').find('.car-tip').remove();
}

/**
 * 初始化转圈动画 
 * @requires circle-progress.js
 * @param {Object} c_id 元素的class
 * @param {Object} size 圆形的大小
 * @param {Object} value 圆形的当前值
 * @param {Object} maxValue 圆形的最大值
 * @param {Object} fillColor 填充的颜色，可使用多个颜色，对象{gradient: ["#ee762b"]}
 * @param {Object} thickness 画圈的粗细
 */
au.initCircle = function(c_id, size, value, maxValue, fillColor, thickness) {
	var circleValue = value / maxValue;
	$('.' + c_id).circleProgress({
		value: circleValue,
		size: size,
		fill: fillColor,
		startAngle: 4.7,
		thickness: thickness
	});
}

/**
 * 图片懒加载
 * @param {Object} src 目标源
 * @param {Object} imgObj 图片对象，需设置默认图片
 */
au.loadImg = function(src, imgObj) {
//	imgObj.attr('src','../../images/non-image.png');
	var img = new Image();
	img.onload = function() {
		img.onload = null;
		imgObj.attr('src', src);
	}
	img.src = src;
}

/**
 * 背景图片懒加载,加载后设置为backgroundImage
 * @param {Object} src 目标源
 * @param {Object} imgObj 容器对象
 */
au.loadBgImg = function(src, container) {
	var img = new Image();
	img.onload = function() {
		img.onload = null;
		container.css('backgroundImage', 'url(' + src + ')');
	}
	img.src = src;
}

/**
 * 图片自动旋转
 * @requires jquery.rotate.js
 * @param {Object} img 图片对象
 * @param {Object} speed 旋转速度
 * @param {Boolean} 是否默认开始旋转
 */
var rotateStop;
au.rotateImg = function(img, speed) {
	if(!speed) {
		speed = 1500;
	}
	rotateStop = false;
	var rotate = function() {
		img.animate({
			rotate: '360'
		}, speed, 'linear', function() {
			if(!rotateStop) {
				rotate();
			}
		});
	}
	rotate();
}
/**
 * 停止旋转
 * @param {Object} flag
 */
au.stopRotate = function() {
	rotateStop = true;
}

$(function() {
	//	var photoArray = [{
	//		'value': 'take',
	//		'text': '拍照'
	//	}, {
	//		'value': 'gallary',
	//		'text': '从相册库选取'
	//	}];
	//	au.showSelect(photoArray, function(selected) {
	//		//		alert(selected.value);

	//		au.showLoading();
	//		setTimeout(function(){
	//			au.hideLoading();
	//		},2000)

//	au.showCarLoadingFull('客官请稍等..');
//	setTimeout(function() {
//		au.hideCarLoadingFull();
//	}, 2000)
	
//	au.showCarLoading(7,'客官请稍等..');
//	setTimeout(function() {
//		au.hideCarLoading();
//	}, 2000)

//	$('body').append('<div class="testCircle" style="width:100%;height:2rem;position:absolute;top:2rem"></div>');
//	au.initCircle('testCircle',100,55,100,{gradient:['#fc3434']},10);

//	$('body').append('<div class="testCircle" style="width:100%;height:2rem;position:absolute;top:2rem"><img class="test-img" src="../../images/non-image.png"/></div>');
//	au.loadImg('http://img4.imgtn.bdimg.com/it/u=2291015098,628551162&fm=21&gp=0.jpg',$('.test-img'));

//	$('body').append('<div class="testCircle" style="width:100%;height:2rem;position:absolute;top:2rem"></div>');
//	au.loadBgImg('http://img4.imgtn.bdimg.com/it/u=2291015098,628551162&fm=21&gp=0.jpg',$('.testCircle'));

//	au.phone('110');

//	$('body').append('<div class="testCircle" style="width:100%;height:2rem;position:absolute;top:2rem"><img class="test-img" src="../../images/non-image.png"/></div>');
//	au.rotateImg($('.test-img'),2000);
//	setTimeout(function(){
//		au.stopRotate()
//	},6000);

})