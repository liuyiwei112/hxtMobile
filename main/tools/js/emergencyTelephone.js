var storage = window.localStorage;

bs.loadScript('../../', []);

$(function() {
	
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	var dataUrl = '../../data/roadsideAssistance.json';
//	var dataUrl = _tl.api+'alerm/alermCount?carId='+carId;
	$.getJSON(dataUrl, function(data) {
		var b = $('.x-panel-content');
		var listItem = '<div class="list-item">'+$('.list-item-model').html()+'</div>';
		for(var i=0;i<data.length;i++){
			var lv1 = data[i];
			//第一层循环，新增标题栏
			b.append('<div class="list-title">'+lv1.itemName+'</div>')
			b.append('<div class="list-items"></div>');
			for(var j=0;j<lv1.crmRoadsideAssistanceVOs.length;j++){
				var mb = lv1.crmRoadsideAssistanceVOs[j];
				b.find('.list-items:last').append(listItem);
				if(mb.companyPic){
					b.find('.list-item:last .item-name').css('backgroundImage','url('+mb.companyPic+')');
				}
				b.find('.list-item:last .mobile-name').html(mb.companyName);
				b.find('.list-item:last .mobile-desc').html(mb.mobileDesc);
				b.find('.list-item:last .list-right-array').attr('mobile',mb.mobile);
			}
		}
		
		$('.list-right-array').on('tap',function(){
			var mobile = $(this).attr('mobile');
			au.phone(mobile);
		})
		
	})	

})
