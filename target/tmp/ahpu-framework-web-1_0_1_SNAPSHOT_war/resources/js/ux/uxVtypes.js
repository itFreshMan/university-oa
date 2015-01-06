//判断手机号码的表单验证
Ext.apply(Ext.form.VTypes, {
    mobilePhone: function(val, field){
    	var reg =/^0{0,1}(13[0-9]|15[0-3]|15[0-9]|18[0-9])[0-9]{8}$/;
		if (reg.exec(field.getValue()))
          return true;
    },
    mobilePhoneText: '手机号码格式不正确,正确格式如：13811111111或者013811111111'
});

//判断固定电话验证
Ext.apply(Ext.form.VTypes, {
    fixPhone: function(val, field){
    	var reg =/^0(([1-9]{1}\d{1,2}\-{1})|([3-9]\d{2}))\d{7,8}$/;
		if (reg.exec(field.getValue()))
          return true;
    },
    fixPhoneText: '固定电话格式不正确'
});

//纯数字正则表达式校验
Ext.apply(Ext.form.VTypes, {
    numberCheck: function(val, field){
    	var reg =/^[0-9]*$/;
		if (reg.exec(field.getValue()))
          return true;
    },
    numberCheckText: '只能输入数字!'
});