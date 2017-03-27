var storage = window.localStorage;

bs.loadScript('../../',[]);

$(function() {
	
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
	}
	
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
		au.toUrl('battary02.html');
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