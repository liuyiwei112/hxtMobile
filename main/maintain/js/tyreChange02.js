var storage = window.localStorage;

bs.loadScript('../../', ['picker', 'mt', 'spinner']);

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	$('.date-panel .flex-element-no-padding').on('tap', function() {
		$(this).parent().find('.date-selected').removeClass('date-selected');
		$(this).addClass('date-selected');
	})

	$('.spinner').spinner({
		'afterChange': function(_obj) {
			$('.total-now-price,.all-total').html(_obj.parent().parent().parent().find('.now-price').html() * 1 * _obj.val());
			$('.all-pre-price').html(_obj.parent().parent().parent().find('.pre-price').html() * 1 * _obj.val())
		}
	});

	loadMap();

	//	var dtpicker = new mui.DtPicker({
	//		type: "time"
	//	})
	//	var beginTime = '08:30',endTime;
	//	$('.mui-pciker-list li').each(function(k,v){
	//		
	//	})
	//	dtpicker.show(function(e) {
	//		console.log(e);
	//	})

})

function loadMap() {
	mt.loadMap(function() {
		var mapObj = new AMap.Map('map_area', {
			zoom: 14,
			center: ['118.7412075967', '32.0332437435'],
			dragEnable: true,
			resizeEnable: true
		});

		mapObj.plugin(['AMap.ToolBar'], function() {
			//设置地位标记为自定义标记
			var toolBar = new AMap.ToolBar();
			mapObj.addControl(toolBar);
		});

		var marker = new AMap.Marker({
			map: mapObj,
			position: ['118.7412075967', '32.0332437435'],
			icon: new AMap.Icon({
				image: '../../images/obd/obd_safe_icon4.png',
				size: new AMap.Size(45, 62)
			})
		});
	})
}