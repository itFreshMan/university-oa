Ext.BLANK_IMAGE_URL = "/resources/js/ext/resources/images/default/s.gif";

var ROLE_GRID_STORE_URL = '/role/pageQueryRoles'; //角色列表
var ROLE_RESOURCE_GRID_STORE_URL = '/role/queryResources4Role';//根据角色查询该角色赋予的资源
var ROLE_USER_GRID_STORE_URL = '/role/queryUsers4Role';//根据角色查询该角色下的用户
var PAGESIZE=20;
//判断角色编码格式的正则表达式
Ext.apply(Ext.form.VTypes, {
    roleCode: function(val, field){
    	var reg =/ROLE_[\w+]/;
		if (reg.exec(field.getValue()))
          return true;
    },
    roleCodeText: '用户编码不满足ROLE_格式'
});

/***************************************RoleForm组件**************************************************/
RoleForm = Ext.extend(Ext.ux.Form, {
  
    constructor: function() {
    	this.idHidden = this.createHidden('ID','id');
    	this.name = this.createTextField('<font color="red">*</font>角色名称:', 'name', '95%', '角色名称不能为空！');
        this.code = this.createTextField('<font color="red">*</font>角色编码:', 'code', '95%', '角色编码不能为空！', 'roleCode', '请以ROLE_开头');
        this.descn =this.createTextArea('描述', 'descn', '60', '95%');
        
        this.descn.allowBlank = true;
        
        RoleForm.superclass.constructor.call(this, {
            anchor: '100%',
            autoHeight:true,
            labelWidth: 60,
            labelAlign :'right',
            frame: true,
            bodyStyle:"padding: 5px 5px 0",
            layout: 'tableform',
	        layoutConfig: {columns: 1},
            items:[
                   	this.name,
                   	this.code,
                   	this.descn,
                   	this.idHidden	            
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
	   	 var roleCode = this.code.getValue();
	 	 var thisForm = this.getForm();
		 //校验userCode是否存在
	     Ext.Ajax.request({
	     	url: '/role/isExistRole',
	         method: 'POST',
	         params:{'id':-1, 'code':roleCode},
	         success: function(response, options){
	         	var res = Ext.decode(response.responseText);
	             if(res.success == true){//不重复，表单提交
	              	Ext.Msg.alert('系统提示',BLANKSTR + '角色编码已存在' + BLANKSTR);
	             	return;              	 
	             }else {
	            	 if(thisForm.isValid()) {
	            		 thisForm.submit({
	                         waitMsg: '正在提交数据...',
	                         url: '/role/insertRole', 
	                         params:{enabled:'Y'},
	                         method: 'POST',
	                         success: function(form, action) { 
	                         	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
	                         	roleGrid.roleInsertWindow.hide();
	                         	roleGrid.vbbar.doLoad(roleGrid.vbbar.cursor);
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
        if(this.getForm().isValid()) {
        	this.getForm().submit({
                waitMsg: '正在提交数据...',
                url: '/role/updateRole', 
                params:{enabled:'Y'},
                method: 'POST',
                success: function(form, action) { 
                	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
                	roleGrid.roleUpdateWindow.hide();
                	roleGrid.vbbar.doLoad(roleGrid.vbbar.cursor);
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
    },
    createTextField: function(fieldLabel, name, anchor, blankText, vtype, emptyText) {    //生成一个通用的TextField
        var tf = new Ext.form.TextField({
            fieldLabel: fieldLabel,
            name: name,
            xtype: 'textfield',
            readOnly: false,
            allowBlank: false,
            anchor: anchor,
            blankText: blankText,
            vtype: vtype,
            emptyText:emptyText
        });
        return tf;
    }
    
});

/***************************************RoleInsertWindow组件**************************************************/
RoleInsertWindow = Ext.extend(Ext.Window,{
	roleForm : null,
    constructor: function(grid) {
        this.roleForm = new RoleForm();
        RoleInsertWindow.superclass.constructor.call(this, {
            title: "添加角色",
            width: 380,
            anchor: '100%',
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.roleForm]
        });
    }
});

/***************************************RoleUpdateWindow组件**************************************************/
RoleUpdateWindow = Ext.extend(Ext.Window, {
	roleForm : null,
    constructor: function() {
    	this.roleForm = new RoleForm();
    	this.roleForm.buttons[0].hide();   //隐藏添加按钮
    	this.roleForm.buttons[1].show();   //显示修改按钮
    	this.roleForm.buttons[2].hide();   //隐藏清空按钮
    	this.roleForm.buttons[3].show();   //显示重置按钮
    	RoleUpdateWindow.superclass.constructor.call(this, {
        	title: "更新角色",
            width: 380,
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.roleForm]
        });
    }
});

/**************************AuthResourceGrid*******************************************/
AuthResourceGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: ROLE_RESOURCE_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader(
            		{totalProperty: 'total', root:'rows'},[{name:'id'},{name:'name'},{name:'type'},{name:'counter'},{name:'action'},{name:'descn'}]
            )
        });
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'授权',iconCls: 'bind',handler:this.onGrantClick,scope:this},
            	'-',{text:'取消授权',iconCls: 'unbind',handler:this.onCancelGrantClick,scope:this}
            ]
        });
    	this.vbbar= this.createPagingToolbar(10);
    	var sm = new Ext.grid.CheckboxSelectionModel();  	
    	AuthResourceGrid.superclass.constructor.call(this, {
        	stripeRows: true,
        	autoExpandColumn: 'descnId',
        	height: 320,
            frame: true,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
                {header:'资源名称',dataIndex:'name',width:120,sortable: true},
            	{header:'资源类型',dataIndex:'type',width:60,sortable: true,
                	renderer:function(value){
                		if(value == "url") {
                			return "URL";
                		}else if(value == "method") {
                			return "方法";                			
                		}else if(value == "menu") {
                			return "菜单";                			
                		}else {
                			return value;
                		}
                	}                    	
                },
            	{header:'是否授权',dataIndex:'counter',width:80,sortable: true,
                	renderer:function(value){
                		if(value == 0) {
                			return "<span style='color:red;font-weight:bold;'>未授权</span>";
                		}else if(value == 1) {
                			return "<span style='color:green;font-weight:bold;'>授权</span>";          			
                		}else {
                			return value;
                		}
                	}
                },
            	{header:'资源路径',dataIndex:'action',width:125,sortable: true},
            	{header:'资源描述',dataIndex:'descn',width:125,sortable: true, id:'descnId'}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    onGrantClick:function() {//角色授权资源
    	var roleId = roleGrid.selectedRecord().data.id;
    	var grid = roleGrid.authResourceWindow.authResourceGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/role/bindResource',
		       	   method : 'POST', 
		       	   params: {roleId: roleId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
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
    onCancelGrantClick:function() {//角色取消授权资源
    	var roleId = roleGrid.selectedRecord().data.id;
    	var grid = roleGrid.authResourceWindow.authResourceGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/role/unBindResource',
		       	   method : 'POST', 
		       	   params: {roleId: roleId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "取消授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
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

/***************************************AuthResourceWindow组件**************************************************/
AuthResourceWindow = Ext.extend(Ext.Window,{
	authResourceGrid : null,
    constructor: function(grid) {
        this.authResourceGrid = new AuthResourceGrid();
        AuthResourceWindow.superclass.constructor.call(this, {
            title: "授权资源",
            width: 700,
            anchor: '100%',
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.authResourceGrid]
        });
    }
});

/**************************AuthUserGrid*******************************************/
AuthUserGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: ROLE_USER_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader(
            		{totalProperty: 'total', root:'rows'},[{name:'ID'},{name:'USERNAME'},{name:'USERCODE'},{name:'ORGNAME'}
            		                                       ,{name:'ORGID'},{name:'GENDER'},{name:'COUNTER'}]
            )
        });
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'授权',iconCls: 'bind',handler:this.onGrantClick,scope:this},
            	'-',{text:'取消授权',iconCls: 'unbind',handler:this.onCancelGrantClick,scope:this},
            	'->',
            	'-',{xtype:'label', text:'用户名：'},{xtype:'textfield',id:'userNameQueryText'},
            	'-',{xtype:'label', text:'登陆帐号：'},{xtype:'textfield',id:'userCodeQueryText'},
            	'-',{xtype:'button', text:'查询',iconCls:'query',handler:function(){
            			var roleId = roleGrid.getSelectionModel().getSelections()[0].data.id;
            			var userName = Ext.getCmp("userNameQueryText").getValue();
            			var userCode = Ext.getCmp("userCodeQueryText").getValue();
            			var grid = roleGrid.authUserWindow.authUserGrid;
            			grid.store.baseParams = {roleId:roleId, userName:userName, userCode:userCode};
            			grid.store.load({params:{start:0,limit:10}});
            		}
            	}
            ]
        });
    	this.vbbar= this.createPagingToolbar(10);
    	var sm = new Ext.grid.CheckboxSelectionModel();
    	AuthUserGrid.superclass.constructor.call(this, {
        	stripeRows: true,
        	height: 320,
            frame: true,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
                {header:'用户名称',dataIndex:'USERNAME',width:120,sortable: true},
            	{header:'登录账号',dataIndex:'USERCODE',width:125,sortable: true},
            	{header:'所属机构',dataIndex:'ORGNAME',width:125,sortable: true},
            	{header:'性别',dataIndex:'GENDER',width:80,sortable: true},
            	{header:'是否授权',dataIndex:'COUNTER',width:60,sortable: true,
                	renderer:function(value){
                		if(value == 0) {
                			return "<span style='color:red;font-weight:bold;'>未授权</span>";
                		}else if(value == 1) {
                			return "<span style='color:green;font-weight:bold;'>授权</span>";          			
                		}else {
                			return value;
                		}
                	}
            	}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    onGrantClick:function() {//角色授权用户
    	var roleId = roleGrid.selectedRecord().data.id;
    	var grid = roleGrid.authUserWindow.authUserGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('ID'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/role/bindUser',
		       	   method : 'POST', 
		       	   params: {roleId: roleId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
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
    onCancelGrantClick:function() {//角色取消授权用户
    	var roleId = roleGrid.selectedRecord().data.id;
    	var grid = roleGrid.authUserWindow.authUserGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('ID'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/role/unBindUser',
		       	   method : 'POST', 
		       	   params: {roleId: roleId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "取消授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
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

/***************************************AuthUserWindow组件**************************************************/
AuthUserWindow = Ext.extend(Ext.Window,{
	authUserGrid : null,
    constructor: function(grid) {
        this.authUserGrid = new AuthUserGrid();
        AuthUserWindow.superclass.constructor.call(this, {
            title: "授权用户",
            width: 700,
            anchor: '100%',
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.authUserGrid]
        });
    }
});

/**************************RoleGrid*******************************************/
RoleGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: ROLE_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'id'},{name:'name'},{name:'code'},{name:'enabled'},{name:'descn'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'添加',iconCls: 'add',handler:this.onAddClick,scope:this},
            	'-',{text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},
            	'-',{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this},
            	'-',{text:'授权资源',iconCls: 'authorization',handler:this.onAuthResourceClick,scope:this},
            	'-',{text:'授权用户',iconCls: 'authorization',handler:this.onAuthUserClick,scope:this}
            ]
        });
    	
        this.roleInsertWindow   = new RoleInsertWindow();       
        this.roleUpdateWindow   = new RoleUpdateWindow();
        this.authResourceWindow = new AuthResourceWindow();//授权资源窗口
        this.authUserWindow 	= new AuthUserWindow();    //授权用户窗口
        
    	var sm = new Ext.grid.CheckboxSelectionModel();
    	RoleGrid.superclass.constructor.call(this, {
        	renderTo:Ext.getBody(),
        	title: '角色数据',
        	stripeRows: true,
        	autoExpandColumn: 'descnID',
            frame: true,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
                {header:'ID',dataIndex:'id',width:100,sortable: true,hidden:true},
                {header:'角色名称',dataIndex:'name',width:140,sortable: true},
            	{header:'角色编码',dataIndex:'code',width:160,sortable: true},
            	{header:'有效性',dataIndex:'enabled',width:60,sortable: true,
            		renderer:function(value, cellmeta, record){
            			if(value == 'Y') {
            				return "<span style='color:green;font-weight:bold;'>有效</span>";
            			}else if(value == 'N') {
            				return "<span style='color:red;font-weight:bold;'>无效</span>";
            			}else {
            				return value;
            			}
            		}
            	},
            	{header:'描述',dataIndex:'descn',width:120,sortable: true,id:'descnID'}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store,
            listeners: {
                "dblclick": { fn: this.onModifyClick, scope: this} 		//响应双击事件
            }
        });
    },
    onAddClick: function() {
    	var win = this.roleInsertWindow;
    	win.roleForm.getForm().reset();
    	win.roleForm.code.readOnly = false;
    	win.show();
    },
    onModifyClick: function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   		    	var win = this.roleUpdateWindow;
   		    	win.roleForm.getForm().reset();
   		    	win.roleForm.code.readOnly = true;
   		    	win.show();
   		    	win.roleForm.getForm().loadRecord(vrecord);
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
				       	   url:'/role/deleteRoles',
				       	   method : 'POST', 
				       	   params: { ids: valueStr},
			               success: function(form, action) { 
			               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除成功!" + BLANKSTR);
			               	roleGrid.vbbar.doLoad(roleGrid.vbbar.cursor);
			               },
			               failure: function(form, action) {
			               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除失败!" + BLANKSTR);
			               }
				       	});					
				}
	    	});	
    	}else{
    		 Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
         	return;
    	}
    },   
    onAuthResourceClick:function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length>0) {
   			if(records.length == 1){
   				var roleId = records[0].data.id;
   				var win = this.authResourceWindow;
   				win.authResourceGrid.store.baseParams = {roleId:roleId};
   				win.authResourceGrid.store.load({params:{start:0,limit:10}});
   				win.show();
   			}else{
   				Ext.Msg.alert('系统提示', BLANKSTR + '不能选择多条记录..' + BLANKSTR);
   			}
   		}
    },   
    onAuthUserClick:function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length>0) {
   			if(records.length == 1){
   				var roleId = records[0].data.id;
   				var win = this.authUserWindow;
   				win.authUserGrid.store.baseParams = {roleId:roleId};
   				win.authUserGrid.store.load({params:{start:0,limit:10}});
   				win.show();
   			}else{
   				Ext.Msg.alert('系统提示', BLANKSTR + '不能选择多条记录..' + BLANKSTR);
   			}
   		}
    },
    onDblclickClick: function() {
    	var record = this.selectedRecord();
    	bindRoleGrid.store.load({params:{operatorId : record.data.id}});
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
    
    roleGrid = new RoleGrid(Ext.getBody().getViewSize().height);
    roleGrid.store.load({params:{start:0,limit:PAGESIZE}});
//    new Ext.Viewport({
//    	layout: 'border',
//    	items:[
//		conditionForm,
//		roleGrid
//    	]
//    });
   
});