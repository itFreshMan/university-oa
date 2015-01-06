Ext.namespace('Ext.ux');

Ext.ux.LoginWindow = function(config) {
    Ext.apply(this, config);
    var css = "#login-logo .x-plain-body {background:#f9f9f9 url('"
            + this.basePath + "/" + this.winBanner + "') no-repeat;}"
            + "#login-form  {background: " + this.formBgcolor + " none;}"
            + ".ux-auth-header-icon {background: url('" + this.basePath
            + "/locked.gif') 0 4px no-repeat !important;}"
            + ".ux-auth-form {padding:10px;}"
            + ".ux-auth-login {background-image: url('" + this.basePath
            + "/key.gif') !important}"
            + ".ux-auth-close {background-image: url('" + this.basePath
            + "/close.gif') !important}";

    console.info(css);
    
    Ext.util.CSS.createStyleSheet(css, this._cssId);
    this.addEvents( {
        'show' : true,
        'reset' : true,
        'submit' : true
    });
    Ext.ux.LoginWindow.superclass.constructor.call(this, config);
    Ext.Ajax.on('beforerequest', this.onBeforerequest, this);

    this._logoPanel = new Ext.Panel( {
        baseCls : 'x-plain',
        id : 'login-logo',
        region : 'center'
    });

    this.usernameId = Ext.id();
    this.passwordId = Ext.id();
    this.jcapatchId = Ext.id();
    this.themeId = Ext.id();
    this.winModeId = Ext.id();
    this._loginButtonId = Ext.id();
    this._registButtonId = Ext.id();
    this._resetButtonId = Ext.id();
    this.cp = new Ext.state.CookieProvider({
        expires: new Date(new Date().getTime()+(1000*60*60*24*30)) //30 dias
    });
   
    Ext.state.Manager.setProvider(this.cp);
    this._formPanel = new Ext.form.FormPanel( {
        region : 'south',
        border : false,
        bodyStyle : "padding: 5px;",
        baseCls : 'x-plain',
        id : 'login-form',
        waitMsgTarget : true,
        labelWidth : 80,
        defaults : {
            width : 330
        },
        baseParams : {
            task : 'login'
        },
        height : 160,
        items:[{
        	 autoHeight: true,  
             autoWidth: true,  
             frame:true,
             border: false,  
             items: [{
               	layout:'form',
             	border: false,  
             	defaults: {anchor: '90%'},
             	items:[
                 	{xtype : 'textfield',id : this.usernameId,name : "j_username",fieldLabel : "用户名",vtype : "alphanum",validateOnBlur : false,allowBlank : false}, 
                 	{xtype : 'textfield',inputType : 'password',id : this.passwordId,name : "j_password",fieldLabel : "密码",vtype : "alphanum",validateOnBlur : false,allowBlank : false},
                 	{xtype : 'winModeField',id : this.winModeId,fieldLabel : "窗口模式",validateOnBlur : false,allowBlank : false}, 
                 	{xtype: 'checkbox',name: '_spring_security_remember_me',boxLabel: '自动登录',hidden:autoLogin}
                 ]
                 }
            ]
         }
        ]
    });
    /*
    {
        xtype : 'themeTypeField',
        id : this.themeId,
        fieldLabel : "主题",
        validateOnBlur : false,
        allowBlank : false
    }
    */
    var buttons = [ {
        id : this._loginButtonId,
        text : "登录",
        handler : this.submit,
        scale : 'medium',
        scope : this
    },{
    	id : this._registButtonId,
        text : "注册",
        hidden:true,
        handler : this.submit,
        scale : 'medium',
        handler: function() {
			ST.base.RegisterConfig.showWin(this._registButtonId);
		},
        scope : this
    } ];
    var keys = [ {
        key : [ 10, 13 ],
        handler : this.submit,
        scope : this
    } ];

    if (typeof this.resetButton == 'string') {
        buttons.push( {
            id : this._resetButtonId,
            text : this.resetButton,
            handler : this.reset,
            scale : 'medium',
            scope : this
        });
        keys.push( {
            key : [ 27 ],
            handler : this.reset,
            scope : this
        });
    }
    //Cria a janela principal de login
    this._window = new Ext.Window( {
        width : 440,
        height : 360,
        closable : false,
        resizable : false,
        draggable : true,
        modal : this.modal,
        iconCls : 'ux-auth-header-icon',
        title : "认证",
        layout : 'border',
        bodyStyle : 'padding:5px;',
        buttons : buttons,
        buttonAlign : 'center',
        keys : keys,
        plain : false,
        items : [ this._logoPanel, this._formPanel ]
    });

    this._window.on('show', function() {
        this.fireEvent('show', this);
    }, this);
};

Ext.extend(Ext.ux.LoginWindow, Ext.util.Observable, {
    Passwordtitle : '',
    resetButton : '清除',
    url : '',
    locationUrl : '',
    basePath : 'img',
    winBanner : '',
    formBgcolor : '',
    modal : false,
    _cssId : 'ux-LoginWindow-css',
    _logoPanel : null,
    _formPanel : null,
    _window : null,
     
    show : function(el) {
        this._window.show(el);
        (function(){
        	if(Ext.getCmp(this.usernameId).getValue() != "")
        		Ext.getCmp(this.passwordId).focus();
        	else
        		Ext.getCmp(this.usernameId).focus();
       }).defer(1000, this);
    },

    reset : function() {
        if (this.fireEvent('reset', this)) {
            Ext.getDom(this.usernameId).value = '';
            Ext.getDom(this.passwordId).value = '';
            Ext.select('#errorMsg').remove();
        }
    },

    submit : function() {
        var form = this._formPanel.getForm();

        if (form.isValid()) {
            if (this.fireEvent('submit', this, form.getValues())) {
                form.submit( {
                    url : this.url,
                    method : "POST",
                    waitMsg : "发送数据中...",
                    success : this.onSuccess,
                    failure : this.onFailure,
                    scope : this
                });
            }
        }
    },
    
    onBeforerequest : function() {
        Ext.select('#errorMsg').remove();
    },

    onSuccess : function(form, action) {
    	Ext.state.Manager.set('username', Ext.getCmp(this.usernameId).getValue());
        if (action && action.result) {
        	if(Ext.getCmp(this.winModeId).getValue() == "default")
           		window.location = "./";
        	else {
        		var height = window.screen.height;
        		var width = window.screen.width;
        		if(window.name != "StarFrameWin") {
        			window.open ('./',"StarFrameWin",'height='+height+',width='+width+',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no');
        			window.open ('', '_self', ''); //避免出现关闭提示窗口
	        		//window.close();
        		} else {
        			window.location = "./";
        		}
        	}
        }
    },

    onFailure : function(form, action) { // enable buttons
        Ext.getCmp(this._loginButtonId).enable();
        if (Ext.getCmp(this._resetButtonId)) {
            Ext.getCmp(this._resetButtonId).enable();
        }
        if(action.result == undefined){
        	if(action.response.responseText.indexOf("NO Auth!") >=0)
        		var html = '<div id="errorMsg" style="text-align:center;padding-top:10px;color:red;">'+"用户无权限"+'</div>';
        }else{
        	if(action.result.type == "UsernameNotFound") {
        		Ext.getCmp(this.usernameId).focus(true,true);
        		Ext.getDom(this.passwordId).value = '';
        	} else if(action.result.type == "BadCredentials") {
        		Ext.getDom(this.passwordId).value = '';
        		Ext.getCmp(this.passwordId).focus();
        	} 
        	var html = '<div id="errorMsg" style="text-align:center;padding-top:10px;color:red;">'+action.result.message+'</div>';
        }
        Ext.select('.x-form-clear-left').each(function(o,g,i){
            if (i==3)
            	o.insertSibling(html,'after');
        });
    }
});


Ext.onReady( function() {
    Ext.QuickTips.init();
    var LoginWindow = new Ext.ux.LoginWindow( {
        modal : true,
        //formBgcolor:'#f0edce',
        basePath : './resources/images/core/login',
        winBanner : 'login.png',
        url : 'j_spring_security_check',
        locationUrl : 'main.action'
    });
    LoginWindow.show();
    
    if(Ext.state.Manager.get('username')){
        Ext.getCmp(LoginWindow.usernameId).setValue(Ext.state.Manager.get('username'));
    }else{
        Ext.getCmp(LoginWindow.usernameId).emptyText = '请输入登录账号';
    }
    
    //存储窗口模式信息到Cookie中
    if(Ext.ux.Cookie('SF_WINMODE') == null) {
    	Ext.getCmp(LoginWindow.winModeId).setValue(winModeStore.getAt(0).get('key'));
    	Ext.ux.Cookie('SF_WINMODE', Ext.getCmp(LoginWindow.winModeId).getValue(), {expires: 30});
    } else {
    	Ext.getCmp(LoginWindow.winModeId).setValue(Ext.ux.Cookie('SF_WINMODE'));
    }
    
    Ext.getCmp(LoginWindow.winModeId).on('change', function(field, newValue, oldValue) {
    	Ext.ux.Cookie('SF_WINMODE', newValue, {expires: 30});
    });
});

//---------------------------------------------------
var winModeStore = new Ext.data.ArrayStore({
    fields: ['key', 'text'],
    data : [['default','默认'], ['allWin','全屏窗口']]
});
var WinModeCombo = Ext.extend(Ext.form.ComboBox, {
    store: winModeStore,
    hiddenName: 'winMode',
    editable : false,
    valueField: 'key',
    displayField:'text',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    selectOnFocus:true
});
Ext.reg('winModeField', WinModeCombo);