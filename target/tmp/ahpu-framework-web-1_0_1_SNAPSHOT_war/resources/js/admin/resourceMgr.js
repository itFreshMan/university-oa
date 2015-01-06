LOAD_RESOURCE_DATA_URL = '/resource/pageQueryResources.json';
EAST_GRID_QUERY_URL	= '/resource/queryRoles4Res.json';
var RESOURCE_ROLE_RELATION_STORE_URL = '/resource/pageQueryRoles4Res.json';//资源授予角色时显示的角色关系列表
var PAGESIZE = 20;

/***************增加资源Form************************/
ResourceForm = Ext.extend(Ext.ux.Form,{
	constructor: function(){
		this.ID = this.createHidden('ID', 'id', '95%');
		this.module = this.createDictCombo('模块名称:', 'module', '95%','CORE.MODULE');
		this.name = this.createTextField('<font color="red">*</font>资源名称:','name','95%','',null,50,'资源名称最大长度为50');
		this.action = this.createTextField('<font color="red">*</font>资源路径:', 'action', '95%','',null,50,'资源路径最大长度为50');
		this.type = this.createDictCombo('资源类型:', 'type', '95%','CORE.RESOURCE.TYPE');
		this.enabled = this.createDictCombo('有效性:', 'enabled', '95%','CORE.ENABLED');
		this.priority = this.createNumberField('<font color="red">*</font>优先级:', 'priority', '95%');
		this.descn = this.createTextArea('描述','descn',60,'95%',1);
		
		ResourceForm.superclass.constructor.call(this,{
			ahchor: '100%',
			autoHeight: true,
			labelWidth: 75,
			labelAlign: 'right',
			frame: true,
			bodyStyle: 'padding 5px 5px 0',
			layout: 'tableform',
			layoutConfig: {columns: 1},
			items: [
			     this.module,   
			     this.name,   
			     this.action, 
			     this.type,  
			     this.enabled,
			     this.priority,   
			     this.descn,
			     this.ID
			],
			buttonAlign: 'center',
			buttons: [
			    {text:'保存',width:20,iconCls:'save',hidden:false,handler:this.addFormClick,scope:this},      
			    {text:'修改',width:20,iconCls:'edit',hidden:true,handler:this.updateFormClick,scope:this},
			    {text:'重置',width:20,iconCls:'redo',hidden:true,handler:this.onResumeClick,scope:this},
			    {text:'清空',width:20,iconCls:'redo',handler:this.resetFormClick,scope:this},
			    {text:'关闭',width:20,iconCls:'delete',handler:this.onCloseClick,scope:this}
			]
		});
	},
	addFormClick: function(){
		if(this.getForm().isValid()){
			this.getForm().submit({
				waitMsg: '正在提交数据，请稍后...',
				url: '/resource/insertResource.json',
				method: 'POST',
				success: function(form,action){
					Ext.MessageBox.alert("系统提示：",BLANKSTR+"添加成功！"+BLANKSTR);
					resourceGrid.store.load({params:{start:0,limit:PAGESIZE}});
					resourceGrid.resourceInsertWindow.hide();
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",BLANKSTR+"添加失败！"+BLANKSTR);
				}
			});
		}
	},
	updateFormClick: function(){
		if(this.getForm().isValid()){
			this.getForm().submit({
				waitMsg: '正在提交，请稍后...',
				url: '/resource/updateResource.json',
				method: 'POST',
				success: function(form,action){
					Ext.MessageBox.alert("系统提示：",BLANKSTR+"修改成功！"+BLANKSTR);
					resourceGrid.resourceUpdateWindow.hide();
					resourceGrid.vbbar.doLoad(resourceGrid.vbbar.cursor);
//					resourceGrid.store.load();
				},
				failure: function(){
					Ext.MessageBox.alert("系统提示：",BLANKSTR+"修改失败！"+BLANKSTR);
				}
			});
		}
	},
	//关闭
    onCloseClick: function(){
//    	badloanGrid.badloanUpdateWindow.badloanForm.getForm().reset();
        this.ownerCt.hide();
    },
  //清空
    resetFormClick: function() {        
        this.getForm().reset();
    }, 
  //重置
    onResumeClick: function() {        
    	resourceGrid.onModifyClick();
    }
});

/************ResourceInsertWindow*******************/
ResourceInsertWindow = Ext.extend(Ext.Window,{
	constructor: function(){
		this.resourceForm = new ResourceForm();
		ResourceInsertWindow.superclass.constructor.call(this,{
			title: '增加资源',
			width: 300,
			anchor: '100%',
			autoHeight: true,
			resizable: true,
			plain: true, //渲染window body的背景为透明的背景，与边框元素融为一体， false表示为加入浅色的背景，使得在视觉上body元素与外围边框清晰地分辨出来（默认为false）。
			modal: true, //True 表示为当window显示时对其后面的一切内容进行遮罩
			closeAction: 'hide',
			items:[this.resourceForm]
		});
	}
});
/************ResourceUpdateWindow*******************/
ResourceUpdateWindow = Ext.extend(Ext.Window,{
	constructor: function(){
		this.resourceForm = new ResourceForm();
    	this.resourceForm.buttons[0].hide();   //隐藏添加按钮
    	this.resourceForm.buttons[1].show();   //显示修改按钮
    	this.resourceForm.buttons[2].show();   //显示重置按钮
    	this.resourceForm.buttons[3].hide();   //隐藏清空按钮
		ResourceUpdateWindow.superclass.constructor.call(this,{
			title: '修改资源',
			width: 300,
			anchor: '100%',
			autoHeight: true,
			resizable: true,
			plain: true, //渲染window body的背景为透明的背景，与边框元素融为一体， false表示为加入浅色的背景，使得在视觉上body元素与外围边框清晰地分辨出来（默认为false）。
			modal: true, //True 表示为当window显示时对其后面的一切内容进行遮罩
			closeAction: 'hide',
			items:[this.resourceForm]
		});
	}
});

/***********************UserRoleRelationGrid组件**************************
 *author        ：mengtao
 *description   : 资源管理--资源角色关联关系列表组件
 *date          : 2013-10-22
******************************************************************/
ResourceRoleRelationGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: RESOURCE_ROLE_RELATION_STORE_URL, method: 'POST'}),
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
    	ResourceRoleRelationGrid.superclass.constructor.call(this, {
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
    	var resourceId = resourceGrid.selectedRecord().data.id;
    	var grid = resourceGrid.resourceRoleRelationWindow.resourceRoleRelationGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/resource/bindRole.json',
		       	   method : 'POST', 
		       	   params: {resId: resourceId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
	               	bindRoleGrid.store.load({params:{resId : resourceId}});
	               },
	               failure: function(form, action) {
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "授权失败!" + BLANKSTR);
	               }
		    });	
    	}else{
    		 Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
    	}
    },    
    onCancelGrantClick: function() {
    	var resourceId = resourceGrid.selectedRecord().data.id;
    	var grid = resourceGrid.resourceRoleRelationWindow.resourceRoleRelationGrid;
    	var records=this.getSelectionModel().getSelections();
    	var valueStr=[];
   		if(records.length>0) {
	       	for(var i=0;i<records.length;i++){
	       		valueStr.push(records[i].get('id'));
    	 	}
	       	Ext.Ajax.request({
		       	   url:'/resource/unBindRole.json',
		       	   method : 'POST', 
		       	   params: {resId: resourceId, ids: valueStr},
	               success: function(form, action) { 
	               	Ext.MessageBox.alert("系统提示:", BLANKSTR + "取消授权成功!" + BLANKSTR);
	               	grid.vbbar.doLoad(grid.vbbar.cursor);
	               	bindRoleGrid.store.load({params:{resId : resourceId}});
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

/***************************************ResourceRoleRelationWindow组件**************************************************/
ResourceRoleRelationWindow = Ext.extend(Ext.Window,{
	resourceRoleRelationGrid : null,
    constructor: function(grid) {
        this.resourceRoleRelationGrid = new ResourceRoleRelationGrid();
        ResourceRoleRelationWindow.superclass.constructor.call(this, {
            title: "授权角色",
            width: 700,
            anchor: '100%',
            height:340,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.resourceRoleRelationGrid]
        });
    }
});

/***********资源数据Grid*********************/
ResourceGrid = Ext.extend(UxGrid,{
	
	constructor: function(height,width){
		this.store = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: LOAD_RESOURCE_DATA_URL, method:'POST'}),
			reader: new Ext.data.JsonReader({totalPropert:'total',root:'rows'},[
			       {name:'id'},{name:'module_Name'},{name:'module'},{name:'name'},
			       {name:'action'},{name:'type_Name'},{name:'type'},{name:'enabled_Name'},
			       {name:'enabled'},{name:'priority'},{name:'descn'}
			       ])
		});
        this.module_name = new ST.ux.ExtField.ComboBox({
        	dictTypeCode: 'CORE.MODULE',
        	id: 'tempId',
            fieldLabel: '模块名称',
            allowBlank: true,
            width:120,
            hiddenName :'module',
            name:'module',
            showAll:true
        });
		this.toolBar = new Ext.Toolbar({
			items: [
			     '-',{text:'添加',iconCls:'add',handler:this.onAddClick,scope:this},
			     {text:'修改',iconCls:'edit',handler:this.onModifyClick,scope:this},
			     {text:'删除',iconCls:'delete',handler:this.onDeleteClick,scope:this},
			     '-',{text:'授予角色',iconCls:'authorization',handler:this.onAuthoriteClick,scope:this},
			     '->',{xtype:'label',text:'模块名称'}, this.module_name,
			     '-',{xtype:'label',text:'资源名称'},{xtype:'textfield',id:'nameQueryText'},
			     '-',{xtype:'button',text:'查询',iconCls:'query',handler:function(){
			    	 var moduleName = Ext.getCmp('tempId').getValue();
			    	 var name = Ext.getCmp('nameQueryText').getValue();
			    	 resourceGrid.store.baseParams = {module:moduleName, name:name};
			    	 resourceGrid.store.load({params:{start:0,limit:PAGESIZE}});
			     }}   
			]
		});
		
		this.resourceInsertWindow = new ResourceInsertWindow();
		this.resourceUpdateWindow = new ResourceUpdateWindow();
		this.resourceRoleRelationWindow = new ResourceRoleRelationWindow();
		
		this.sm = new Ext.grid.CheckboxSelectionModel(); 
		this.vbbar= this.createPagingToolbar(PAGESIZE);
		this.columnModel = new Ext.grid.ColumnModel([
							 new Ext.grid.RowNumberer(),
							 this.sm,
                             {header:'ID',dataIndex:'id',hidden:true},            
     			             {header:'模块名称',dataIndex:'module_Name',width:75,sortable:true},            
     			             {header:'资源名称',dataIndex:'name',width:130,sortable:true},            
     			             {header:'资源路径',dataIndex:'action',width:150,sortable:true},            
     			             {header:'资源类型',dataIndex:'type_Name',width:75,sortable:true},            
     			             {header:'有效性',dataIndex:'enabled_Name',width:75,sortable:true},          
     			             {header:'优先级',dataIndex:'priority',width:60,sortable:true},          
     			             {header:'描述',dataIndex:'descn',width:250,sortable:true}        
		     			    ]);
		ResourceGrid.superclass.constructor.call(this,{
			title: '资源数据',
			region: 'center',
			height: height,
			stripRows: true,
			loadMsg: {
				msg : '正在载入数据，请稍后...'
			},
			ds: this.store,
			cm: this.columnModel,
			tbar: this.toolBar,
			bbar: this.vbbar,
			listeners: {
				"click": {fn:this.onClick, scope:this}
			}
			
		});
	},
	onClick: function() {
		var records=this.getSelectionModel().getSelections();
//		console.info(records[0].id);
		bindRoleGrid.store.load({
           params:{resId: records[0].id}
       });
   },
   onAddClick: function(){
	   var win = this.resourceInsertWindow;
	   win.show();
	   win.resourceForm.getForm().reset();
   },
   onModifyClick: function() {
   	var records = this.getSelectionModel().getSelections();
  		if(records.length > 0) {
  			if(records.length == 1){
  				vrecord = records[0];
  		    	var win = this.resourceUpdateWindow;
//  		    	win.badloanForm.getForm().reset();
  		    	win.resourceForm.getForm().loadRecord(vrecord);
  		    	win.show();
//  		    	console.info(vrecord.data.module);
  		    	win.resourceForm.module.setValue(vrecord.data.module);
  		    	win.resourceForm.type.setValue(vrecord.data.type);
  		    	win.resourceForm.enabled.setValue(vrecord.data.enabled);
  			}else{
  				Ext.Msg.alert('系统提示', BLANKSTR + '不能修改多条记录！' + BLANKSTR);
  			}
  		}else{
  			Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录！' + BLANKSTR);
  		}    	
   },
   onDeleteClick: function(){
   	var records = this.getSelectionModel().getSelections();
   	var valueStr = [];
   	for(var i=0;i<records.length;i++){
   		valueStr.push(records[i].get('id'));
   	}
   	if(records.length>0){
   		Ext.Msg.confirm('系统提示：',"确定删除这"+records.length+"条信息吗？",function(btn){
   			if(btn == 'yes'){
   				Ext.Ajax.request({
   					url: '/resource/deleteResources.json',
   					method: 'POST',
   					params: {ids: valueStr},
   					success: function(){
   						Ext.Msg.alert('系统提示',BLANKSTR+'删除成功！'+BLANKSTR);
   						resourceGrid.store.load({params:{start:0,limit:PAGESIZE}});
   					},
   					failure: function(){
   						Ext.Msg.alert('系统提示',+BLANKSTR+'删除失败！'+BLANKSTR);
   					}
   				});
   			}
   		});
   	}else{
   		Ext.Msg.alert('系统提示',BLANKSTR+'请选择一条记录！'+BLANKSTR);
   	}
   },
   onAuthoriteClick:function() {
   	var records=this.getSelectionModel().getSelections();
  		if(records.length>0) {
  			if(records.length == 1){
  				var resourceId = records[0].data.id;
//  				alert(resourceId);
  				var win = this.resourceRoleRelationWindow;
  				win.resourceRoleRelationGrid.store.baseParams = {resId:resourceId};
  				win.resourceRoleRelationGrid.store.load({params:{start:0,limit:10}});
  				win.show();
  			}else{
  				Ext.Msg.alert('系统提示', BLANKSTR + '不能选择多条记录..' + BLANKSTR);
  			}
  		}else{
   			Ext.Msg.alert('系统提示', BLANKSTR + '请选择一条记录' + BLANKSTR);
   		}  
   }
});
/*****************资源对应角色Grid*****************************/
BindRoleGrid = Ext.extend(UxGrid,{
	constructor: function(height,width){
		this.store = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({url: EAST_GRID_QUERY_URL, method:'POST'}),
			reader: new Ext.data.JsonReader({fields:[
			       {name:'name'},{name:'code'}
			       ]})
		});
		this.columnModel = new Ext.grid.ColumnModel([
//	                                         {header:'ID',dataIndex:'id',hidden:true},            
	                 			             {header:'角色名称',dataIndex:'name',width:120,sortable:true},            
	                 			             {header:'角色编码',dataIndex:'code',width:125,sortable:true}         
            		     			    ]);
		BindRoleGrid.superclass.constructor.call(this,{
			title: '资源绑定的角色',
			region: 'east',
			width: width, //在东边的时候必须指定宽度
			stripRows: true,
			collapsible: true,
			frame: true,
			loadMsg: {
				msg : '正在载入数据，请稍后...'
			},
			ds: this.store,
			cm: this.columnModel
			
		});
	}
});

/***********OnReady组件渲染********************/
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.form.Field.prototype.masTarget = 'side';
	resourceGrid = new ResourceGrid(Ext.getBody().getViewSize().height);
	resourceGrid.store.load({params:{start:0, limit:PAGESIZE}});
	bindRoleGrid = new BindRoleGrid("",250);
	
	new Ext.Viewport({
		layout: 'border',
		items: [resourceGrid,bindRoleGrid]
	});
});









