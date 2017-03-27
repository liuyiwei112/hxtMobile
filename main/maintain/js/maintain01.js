var storage = window.localStorage;

bs.loadScript('../../',['picker']);

$(function() {
	
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
	}
	
	//初始化时间控件
	var dtpicker = new mui.DtPicker({
		"type": "month"
	})
	
	$('.first-register-label,.first-register-date').on('tap',function() {
		dtpicker.show(function(e) {
			$('.first-register-date').html(e+'');
		})
	})
	$('.last-update-date-label,.last-update-date-date').on('tap',function() {
		dtpicker.show(function(e) {
			$('.last-update-date-date').html(e+'');
		})
	})
	
	$('.chart-wrap').css('width', $('.plan-progress').length * 2 + 'rem')
	$('.plan-progress-car').css('margin-left', 1.95 * 3 + 'rem')

	$('.repair-product-details-wrap').each(function(k, v) {
		$(v).css('width', $(v).find('.repair-product-detail').length * 4 + 'rem')
	})

	//绑定事件
	//商品展开隐藏事件
	$('.repair-item-array-down,.repair-item-price,.repair-item-cycle').click(function() {
			$(this).parent().parent().parent().parent().parent().find('.repair-product-type-name,.repair-product-details').toggle();
			$(this).parent().find('.repair-item-array-down').toggleClass('repair-item-array-up');
		})
	//服务项勾选取消事件
	$('.repair-item-check,.repair-item-name-label').click(function() {
		$(this).parent().find('.repair-item-check').toggleClass('repair-item-checked');
	})

	$('.next-step').click(function() {
		au.toUrl('maintain02.html');
	})
	
	//商品类别选中事件
	$('.repair-product-detail').on('tap',function(){
		var cc = 'repair-product-detail-checked';
		if(!$(this).hasClass(cc)){
			$(this).parent().find('.'+cc).removeClass(cc);
			$(this).addClass(cc);
		}
	})

})

