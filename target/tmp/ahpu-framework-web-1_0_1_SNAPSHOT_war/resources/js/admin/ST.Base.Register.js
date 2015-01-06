Ext.namespace("ST.base");
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Ext.apply(Ext.form.VTypes, {
    password: function(val, field){
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText: '密码不匹配'
});

ST.base.RegisterConfig = function () {
	var win = null;
	var basicFormPanel;
    return  {   
		showWin: function(id) {
    		if(win == null)
    			this.createWin();
    		win.show(Ext.get(id));
		},
		
		createBasicFormPanel: function() {
			basicFormPanel = new Ext.FormPanel({
		        labelWidth: 80,
		        url: './user/registerUser.json',
		        method: 'POST',
		        frame: true,
		        width: 460,
		        title: '用户基本信息',
		        defaultType: 'textfield',
		        buttonAlign: 'center',
		        items: [{
		            fieldLabel: '用户名称',
		            width: 150,
		            maxLength: 20,
		            id:'userName',
		            name: 'userName',
		            allowBlank: false,
		            blankText: '用户名称不能为空'
		        },{
		            fieldLabel: '登录账号',
		            width: 150,
		            maxLength: 20,
		            id:'userCode',
		            name: 'userCode',
		            allowBlank: false,
		            vtype : "alphanum",
		            blankText: '登录账号不能为空'
		        }, {
		            id: 'pass',
		            fieldLabel: '密码',
		            width: 150,
		            name: 'password',
		            minLength: 6,
		            maxLength: 20,
		            inputType: 'password',
		            allowBlank: false,
		            blankText: '密码不能为空'
		        }, {
		            fieldLabel: '确认密码',
		            width: 150,
		            id:'pass-cfrm',
		            name: 'pass-cfrm',
		            minLength: 6,
		            maxLength: 20,
		            inputType: 'password',
		            vtype: 'password',
		            initialPassField: 'pass',
		            allowBlank: false
		        }, {
		            fieldLabel: '邮箱',
		            width: 200,
		            maxLength: 50,
		            name: 'email',
		            vtype: 'email',
		            allowBlank: false,
		            blankText: '邮箱不能为空'
		        }/*, {
		            fieldLabel: '电话号码',
		            width: 150,
		            maxLength: 50,
		            name: 'phoneNo'
		        }, {
		            fieldLabel: '移动号码',
		            width: 150,
		            maxLength: 50,
		            name: 'mPhoneNo'
		        }*/]
		    });
			return basicFormPanel;
		},
		
		createWin: function() {
			win = new Ext.Window({
		        width: 400,
		        height: 360,
		        frame:true,
		        layout: 'fit',
		        resizable: false,
		        closable:false,
		        modal: true,
		        buttonAlign : 'center',
		        buttons: [{
		            text: '提交',
		            handler: function(){
		            	if (basicFormPanel.getForm().isValid()) {
			            	Ext.Ajax.request({
			                    url : './user/isExistUser.json',
			                    async : false,//同步执行
			                    params : {
			                        'userCode' : Ext.getDom('userCode').value
			                    },
			                    success : function(_response, _options) {
			                       var flag = Ext.decode(_response.responseText).success;
			                       if(!flag) {
			   		                    basicFormPanel.getForm().submit({
			   		                        waitMsg : '正在处理，请稍等...',
			   	                            success: function() {
			   	                                Ext.MessageBox.alert("提示", "注册成功");
			   	                                win.close();
			   	                            },
			   	                            failure: function(a, b) {
			   	                            	Ext.MessageBox.alert("提示", b.result.message);
			   	                            }
			   		                    });
			                       } else {
			                    	   Ext.MessageBox.alert("提示", "该登录账号已经存在！");
			                    	   Ext.getCmp('userCode').setValue("");
			                       }
			                    }
			                });
		            	}
		            }
		        },{
		            text: '取消',
		            handler: function() {
		        		win.hide();
		            }
		        }],
		        items: this.createBasicFormPanel()
		    });
		}
    };   
}();  