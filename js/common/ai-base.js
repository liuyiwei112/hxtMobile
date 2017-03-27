/**
 *基本工具类及原型方法
 *require 
 *author liuyw
 */

function bs(){
	
	this.jsLib = {
		'flex':'js/common/flexible/flexible.js',
		'au':'js/common/ai-ui.js',
		'dt':'js/common/ai-date.js',
		'mt':'js/common/ai-maps.js',
		'circle':'js/common/circle-progress.js',
		'rotate':'js/common/jquery.rotate.js',
		'md5':'js/common/md5.js',
		'string':'js/common/string.js',
		'swiper':'js/common/swiper/js/swiper.min.js',
		'spinner':'js/common/spinner/jquery.spinner.js',
		'jroll':'js/common/jroll/jroll.js',
		'jroll-infinite':'js/common/jroll/jroll-infinite.js',
		'jroll-pull':'js/common/jroll/jroll-pulldown.js',
		'picker':'js/mui/mui.picker.min.js',
		'indexedlist':'js/mui/mui.indexedlist.js'
	}
}

bs.baseScript = ['flex','au'];

/**
 * 自动加载JS脚本，抽取共用部分，减少界面多次调用
 * @param {Object} _base 基本路径
 * @param {Object} extra 需要额外调用的JS
 */
bs.loadScript = function(_base,extra){
	var _bs = new bs();
	var scriptArray = bs.baseScript.merge(extra);
	for(var i=0;i<scriptArray.length;i++){
		$.ajax({type:'GET',url:_base+_bs.jsLib[scriptArray[i]],async:false,dataType:'script'});
	}
}

Array.prototype.merge = function(_barr){
	for(var i=0;i<_barr.length;i++){
		this.push(_barr[i]);
	}
	return this;
}

