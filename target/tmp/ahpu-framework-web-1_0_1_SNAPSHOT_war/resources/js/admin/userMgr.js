Ext.BLANK_IMAGE_URL = "/resources/js/ext/resources/images/default/s.gif";
//需要补充的空格
var BLANKSTR = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';   

var DEPT_TREE_COMBO_STORE = '/org/queryOrgs.json'; //机构下拉树
var USER_GRID_STORE_URL = '/user/pageQueryUsers.json'; //用户列表
var USER_ROLE_GRID_STORE_URL = '/user/queryRoles4User.json';//根据用户信息查询该用户所属角色
var USER_ROLE_RELATION_STORE_URL = '/user/pageQueryRoles4User.json';//用户授予角色时显示的角色关系列表
var PAGESIZE=20;
/***************************************ConditionForm组件***************************************************/
ConditionForm = Ext.extend(Ext.ux.Form,{
	
	queryButton : null,
    resetButton : null,
    
	constructor: function(){
		this.userCode= this.createTextField('登陆帐号:', 'userCode', '93%');
		this.userName= this.createTextField('用户名称:', 'userCode', '93%');
        this.orgName 	= this.createTreeCombo('所属机构:', '机构', 'orgName', DEPT_TREE_COMBO_STORE, '93%');
		this.queryButton=this.createButton('查询',"query", this.onQuery,this);
        this.resetButton=this.createButton('重置',"refresh", this.reset,this);
            
        this.userCode.allowBlank = true;
        this.userName.allowBlank = true;
        this.orgName.allowBlank = true;
	    
		ConditionForm.superclass.constructor.call(this,{
		 	region:'north',
        	title: '查询条件',
        	collapsible: true,
            layout: 'tableform',
	        layoutConfig: {columns: 3},
	        autoWidth:true,
            height: 100,
            labelWidth: 60,
            frame: true,
            bodyStyle:"padding: 5px 5px 0",
            items:[
                   this.userCode,
                   this.userName,
                   this.orgName
 			],
 			buttonAlign:'center',
 			buttons:[
				   this.queryButton,
				   this.resetButton
 			]
		});
	},
	reset:function(){
	 	this.getForm().reset();
	},	
	onQuery:function(){
		if(!this.getForm().isValid()){
			return;
		}
		var userCode	= this.userCode.getValue();
		var userName	= this.userName.getValue();
		var orgId     = this.orgName.getValue();
		userGrid.store.baseParams = {userCode:userCode, userName:userName,orgId:orgId}; 
		userGrid.store.load({params: {start: 0, limit: PAGESIZE}});
		bindRoleGrid.store.removeAll();
	},
	createButton: function(text,iconCls,fn,scope) {
    	var btn = new Ext.Button({
    		align: 'left',
    		text: text,
    		iconCls: iconCls,
    		handler: fn,
    		scope: scope
    	});
    	return btn;
    },
	createDateFieldX: function(fieldLabel, name, format, anchor, minText, value) {
    	var df =  new Ext.form.DateField({
			fieldLabel: fieldLabel,
			name: name,
			value : value,
			anchor: anchor,
			minText: minText,
			format: format,
			allowBlank: false,
			blankText: '请选择时间'
		});
		return df;
    }
});

/***************************************UserInfoForm组件**************************************************/
UserInfoForm = Ext.extend(Ext.ux.Form, {
  
    constructor: function() {
    	this.idHidden = this.createHidden('ID','id');
    	this.userName = this.createTextField('<font color="red">*</font>用户名称:', 'userName', '95%');
        this.userCode = this.createTextField('<font color="red">*</font>登录账号:', 'userCode', '95%', '登录账号不能为空！', 'alphanum');
        this.orgName    = this.createTreeCombo('<font color="red">*</font>所属机构:', '机构', 'orgName', DEPT_TREE_COMBO_STORE, '95%');
        this.gender   = this.createDictCombo('<font color="red">*</font>性别:','gender', '95%', 'CORE.GENDER', false);
        this.phoneNo  = this.createTextField('电话号码:', 'phoneNo', '95%','', 'fixPhone');
        this.mPhoneNo = this.createTextField('移动号码:', 'mPhoneNo', '95%','', 'mobilePhone');  
        this.email    = this.createTextField('邮箱:', 'email', '95%', '', 'email');
        this.birthday =this.createDateField('出生日期', 'birthday', 'Y-m-d', '95%');
        
        this.phoneNo.allowBlank = true;
        this.mPhoneNo.allowBlank = true;
        this.email.allowBlank = true;
        this.birthday.allowBlank = true;
        
        UserInfoForm.superclass.constructor.call(this, {
            anchor: '100%',
            autoHeight:true,
            labelWidth: 60,
            labelAlign :'right',
            frame: true,
            bodyStyle:"padding: 5px 5px 0",
            layout: 'tableform',
	        layoutConfig: {columns: 1},
            items:[
                   	this.userName,this.userCode,this.orgName,this.gender,
                   	this.phoneNo,this.mPhoneNo,this.email,this.birthday,this.idHidden	            
            ],
            buttonAlign :'center',
            buttons: [
               {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},
               {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
               {text: '重置', width: 20,iconCls:'redo', hidden: true, handler: this.onResumeClick, scope: this},               
               {text: '清空', width: 20, iconCls:'redo',  handler: this.resetFormClick, scope: this},
               {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
            ]
        });
     },
     addFormClick: function() {
    	 var userCode = this.userCode.getValue();
     	 var orgId = this.orgName.getValue();
     	 var thisForm = this.getForm();
    	 //校验userCode是否存在
     	 if(userCode == "") {
     		Ext.Msg.alert('系统提示',BLANKSTR + '登陆账号不能为空！' + BLANKSTR);
     		return;
     	 }
         Ext.Ajax.request({
         	url: '/user/isExistUser',
             method: 'POST',
             params:{'id':-1, 'userCode':userCode},
             success: function(response, options){
             	var res = Ext.decode(response.responseText);
                 if(res.success == true){//不重复，表单提交
                  	Ext.Msg.alert('系统提示',BLANKSTR + '登陆账号已存在' + BLANKSTR);
                 	return;              	 
                 }else {
                	 if(thisForm.isValid()) {
                		 thisForm.submit({
                             waitMsg: '正在提交数据...',
                             url: '/user/insertUser.json', 
                             params:{orgId:orgId},
                             method: 'POST',
                             success: function(form, action) { 
                             	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
                             	userGrid.userInfoInsertWindow.hide();
                             	userGrid.vbbar.doLoad(userGrid.vbbar.cursor);
                             },
                             failure: function(form, action) {
                             	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!" + BLANKSTR);
                             }
                     	});
                     }
                 }
               },
               failure: function(response, options){
             	  Ext.Msg.alert( "提示", "操作失败!,请联系管理员" );
             	  return;
               }
        });        
    },
    updateFormClick: function() {       //修改
    	var orgId = this.orgName.getValue();
        if(this.getForm().isValid()) {
        	this.getForm().submit({
                waitMsg: '正在提交数据...',
                url: '/user/updateUser.json', 
                params:{orgId:orgId},
                method: 'POST',
                success: function(form, action) { 
                	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
                	userGrid.userInfoUpdateWindow.hide();
                	userGrid.vbbar.doLoad(userGrid.vbbar.cursor);
                },
                failure: function(form, action) {
                	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
                }
        	});
        }
    },   
    onResumeClick: function() { 		//重置
    	
    },
    resetFormClick: function() {        //清空
        this.getForm().reset();
    },
    onCloseClick: function(){ 			//关闭
        this.ownerCt.hide();
    }
    
});

/***************************************UserInfoInsertWindow组件**************************************************/
UserInfoInsertWindow = Ext.extend(Ext.Window,{
	userInfoForm : null,
    constructor: function(grid) {
        this.userInfoForm = new UserInfoForm();
        UserInfoInsertWindow.superclass.constructor.call(this, {
            title: "新增用户",
            width: 380,
            anchor: '100%',
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.userInfoForm]
        });
    }
});

/***************************************UserInfoUpdateWindow组件**************************************************/
UserInfoUpdateWindow = Ext.extend(Ext.Window, {
	userInfoForm : null,
    constructor: function() {
    	this.userInfoForm = new UserInfoForm();
    	this.userInfoForm.buttons[0].hide();   //隐藏添加按钮
    	this.userInfoForm.buttons[1].show();   //显示修改按钮
    	this.userInfoForm.buttons[2].hide();   //隐藏清空按钮
    	this.userInfoForm.buttons[3].show();   //显示重置按钮
    	UserInfoUpdateWindow.superclass.constructor.call(this, {
        	title: "修改用户",
            width: 380,
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.userInfoForm]
        });
    }
});

/***********************UserRoleRelationGrid组件**************************
 *author        ：zhuzengpeng
 *description   : 用户管理--用户角色关联关系列表组件
 *date          : 2013-08-12
******************************************************************/
UserRoleRelationGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: USER_ROLE_RELATION_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'id'},{name:'name'},{name:'code'},{name:'counter'},{name:'descn'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'授予',iconCls: 'bind',handler:this.onGrantClick,scope:this},
            	'-',{text:'取消授予',iconCls: 'unbind',handler:this.onCancelGrantClick,scope:this}
            ]
        });
        
    	var sm = new Ext.grid.CheckboxSelectionModel();
    	UserRoleRelationGrid.superclass.constructor.call(this, {
        	stripeRows: true,
        	autoExpandColumn:5,
            frame: true,
            height: 300,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'	
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
                {header:'角色名称',dataIndex:'name',width:100,sortable: true},
            	{header:'角色编码',dataIndex:'code',width:100,sortable: true},
            	{header:'是否授予',dataIndex:'counter',width:60,sortable: true, 
                    renderer:function(value){
                        if(value == '0') {
                        	return String.format("<b><font color=red>未授予</font></b>");
                        }else if(value == '1') {
                        	return String.format("<b><font color=green>授予</font></b>");
                        }else{
                            return value;
                        }
                    }
            	},
            	{header:'角色描述',dataIndex:'descn',width:60,sortable: true}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    onGrantClick: function() {
    	var userId = userGrid.selectedRecord().data.id;
    	var grid = userGrid.userRoleRelationWindow.userRoleRelationGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/user/bindRole.json',
		       	   method : 'POST', 
		       	   params: {operatorId: userId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
	               	bindRoleGrid.store.load({params:{operatorId : userId}});
	               },
	               failure: function(form, action) {
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权失败!" + BLANKSTR);
	               }
		    });	
    	}else{
    		 Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
         	return;
    	}
    },    
    onCancelGrantClick: function() {
    	var userId = userGrid.selectedRecord().data.id;
    	var grid = userGrid.userRoleRelationWindow.userRoleRelationGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/user/unBindRole.json',
		       	   method : 'POST', 
		       	   params: {operatorId: userId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "取消授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
	               	bindRoleGrid.store.load({params:{operatorId : userId}});
	               },
	               failure: function(form, action) {
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "取消授权失败!" + BLANKSTR);
	               }
		    });	
    	}else{
    		 Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
         	return;
    	}    	
    },
    selectedRecord: function() {
        var record = this.getSelectionModel().getSelected();
        return record;
    },
    refresh: function(){
        this.getView().refresh();
    },
    remove:function(record){
        this.getStore().remove(record);
    }
});

/***************************************UserRoleRelationWindow组件**************************************************/
UserRoleRelationWindow = Ext.extend(Ext.Window,{
	userRoleRelationGrid : null,
    constructor: function(grid) {
        this.userRoleRelationGrid = new UserRoleRelationGrid();
        UserRoleRelationWindow.superclass.constructor.call(this, {
            title: "授权角色",
            width: 700,
            anchor: '100%',
            height:340,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.userRoleRelationGrid]
        });
    }
});

/**************************UserGrid*******************************************/
UserGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: USER_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'id'},{name:'userName'},{name:'userCode'},{name:'orgId'},{name:'orgName'},
            		{name:'gender'},{name:'gender_Name'},{name:'phoneNo'},{name:'mPhoneNo'},{name:'email'},
            		{name:'birthday'},{name:'lastLogin'},{name:'ipAddress'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'添加',iconCls: 'add',handler:this.onAddClick,scope:this},
            	'-',{text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},
            	'-',{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this},
            	'-',{text:'授予角色',iconCls: 'authorization',handler:this.onAuthoriteClick,scope:this},
            	'-',{text:'重置密码',iconCls: 'setting',handler:this.onResetPwdClick,scope:this}
            ]
        });
    	
        this.userInfoInsertWindow = new UserInfoInsertWindow();       
        this.userInfoUpdateWindow = new UserInfoUpdateWindow();
        this.userRoleRelationWindow = new UserRoleRelationWindow();
        
    	var sm = new Ext.grid.CheckboxSelectionModel();
    	UserGrid.superclass.constructor.call(this, {
        	region:'center',
        	title: '用户数据',
        	stripeRows: true,
            frame: true,
            width:  width,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
                {header:'ID',dataIndex:'id',width:100,sortable: true,hidden:true},
                {header:'用户名称',dataIndex:'userName',width:120,sortable: true},
            	{header:'登陆帐号',dataIndex:'userCode',width:120,sortable: true},
            	{header:'所属机构',dataIndex:'orgName',width:120,sortable: true},
            	{header:'性别',dataIndex:'gender_Name',width:60,sortable: true},
            	{header:'电话号码',dataIndex:'phoneNo',width:100,sortable: true},
            	{header:'移动号码',dataIndex:'mPhoneNo',width:100,sortable: true},
            	{header:'邮箱',dataIndex:'email',width:160,sortable: true},
            	{header:'出生日期',dataIndex:'birthday',width:100,sortable: true},
            	{header:'上次登陆时间',dataIndex:'lastLoginTime',width:100,sortable: true},
            	{header:'上次登陆IP',dataIndex:'ipAddress',width:100,sortable: true}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store,
            listeners: {
                "dblclick": { fn: this.onDblclickClick, scope: this} 		//响应双击事件
            }
        });
    },
    onAddClick: function() {
    	var win = this.userInfoInsertWindow;
    	win.userInfoForm.getForm().reset();
    	win.userInfoForm.userCode.readOnly = false;
    	win.show();
    },
    onModifyClick: function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   		    	var win = this.userInfoUpdateWindow;
   		    	win.userInfoForm.getForm().reset();
   		    	win.userInfoForm.userCode.readOnly = true;
   		    	win.show();
   		    	win.userInfoForm.getForm().loadRecord(vrecord);
   			}else{
   				Ext.Msg.alert('系统提示', BLANKSTR + '不能修改多条记录..' + BLANKSTR);
   			}
   		}else{
   			Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
   		}    	
    },
    onDeleteClick: function() {
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	    	Ext.Msg.confirm("提醒信息", "确定要删除这 " + records.length + " 条信息吗",function(btn){
				if (btn == 'yes') {
			       	Ext.Ajax.request({
				       	   url:'/user/deleteUsers.json',
				       	   method : 'POST', 
				       	   params: { ids: valueStr},
			               success: function(form, action) { 
			               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除成功!" + BLANKSTR);
			               	userGrid.vbbar.doLoad(userGrid.vbbar.cursor);
			               },
			               failure: function(form, action) {
			               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
			               }
				       	});					
				}
	    	});	
    	}else{
    		 Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
         	return;
    	}
    },   
    onAuthoriteClick:function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length>0) {
   			if(records.length == 1){
   				var uesrId = records[0].data.id;
   				var win = this.userRoleRelationWindow;
   				win.userRoleRelationGrid.store.baseParams = {operatorId:uesrId};
   				win.userRoleRelationGrid.store.load({params:{start:0,limit:10}});
   				win.show();
   			}else{
   				Ext.Msg.alert('系统提示', BLANKSTR + '不能选择多条记录..' + BLANKSTR);
   			}
   		}
    },
    onResetPwdClick: function() {//重置密码
    	var records=this.getSelectionModel().getSelections();
   		if(records.length>0) {
   			if(records.length == 1){
   				var userId = records[0].data.id;
   		    	Ext.Msg.confirm("提醒信息", "确定要重置此用户密码吗?(重置成000000)",function(btn){
   					if (btn == 'yes') {
   				       	Ext.Ajax.request({
   					       	   url:'/user/resetPwd',
   					       	   method : 'POST', 
   					       	   params: { userId: userId},
   				               success: function(form, action) { 
   				               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "重置成功!" + BLANKSTR);
   				               },
   				               failure: function(form, action) {
   				               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "重置失败!" + BLANKSTR);
   				               }
   					    });					
   					}
   		    	});   				
   			}else{
   				Ext.Msg.alert('系统提示', BLANKSTR + '不能选择多条记录..' + BLANKSTR);
   			}
   		}    	
    },
    onDblclickClick: function() {
    	var record = this.selectedRecord();
    	bindRoleGrid.store.load({params:{operatorId : record.data.id}});
    },
    sheetNoChange: function(value) {
    	return '<a href="javascript:void(0)" onclick=javascript:clickSheetNo('+value+')><b><font color=red>'+ value + '</font></b></a>';
    },
    selectedRecord: function() {
        var record = this.getSelectionModel().getSelected();
        return record;
    },
    refresh: function(){
        this.getView().refresh();
    },
    remove:function(record){
        this.getStore().remove(record);
    }
});


/**************************BindRoleGrid*******************************************/
BindRoleGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: USER_ROLE_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader(
            		{fields:[{name:'name'},{name:'code'}]
            })
        });
    	  	
    	BindRoleGrid.superclass.constructor.call(this, {
        	region:'east',
        	title: '用户绑定的角色',
        	collapsible: true,
        	stripeRows: true,
        	autoExpandColumn: 'bindRoleGrid_roleName',
        	width:width,
            frame: true,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                {header:'角色名称',dataIndex:'name',width:120,sortable: true,id:'bindRoleGrid_roleName'},
            	{header:'角色编码',dataIndex:'code',width:125,sortable: true}
            ]),
            ds: this.store
        });
    },
    sheetNoChange: function(value) {
    	return '<a href="javascript:void(0)" onclick=javascript:clickSheetNo('+value+')><b><font color=red>'+ value + '</font></b></a>';
    },
    selectedRecord: function() {
        var record = this.getSelectionModel().getSelected();
        return record;
    },
    refresh: function(){
        this.getView().refresh();
    },
    remove:function(record){
        this.getStore().remove(record);
    }
});
/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    Ext.override(Ext.Component, {
        stateful: false
    });    
    conditionForm = new ConditionForm();
    userGrid = new UserGrid();
    bindRoleGrid = new BindRoleGrid('', 280);
    userGrid.store.load({params:{start:0,limit:PAGESIZE}});
    new Ext.Viewport({
    	layout: 'border',
    	items:[
		conditionForm,
		userGrid,
		bindRoleGrid
    	]
    });
   
});