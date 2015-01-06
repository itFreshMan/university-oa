Ext.namespace("ST.base");

var DeptField = Ext.extend(Ext.ux.TreeCombo, {
	rootVisible : false,
	url : '/org/queryOrgs.json',
	allowBlank : false,
	hiddenName : 'org_Id',
	rootName : '机构'
});
Ext.reg('deptfield', DeptField);

Ext.reg('enabledField', ST.ux.ExtField.ComboBox);


Ext.apply(Ext.form.VTypes, {
    roleCode: function(val, field){
    	var reg =/ROLE_[\w+]/;
		if (reg.exec(field.getValue()))
          return true;
    },
    roleCodeText: '用户编码不满足ROLE_格式'
});

ST.base.roleView = Ext.extend(ST.ux.ViewGrid, {
	dlgWidth: 360,
	dlgHeight: 260,
	//资源列表查询URL
	urlGridQuery: '/role/pageQueryRoles.json',
	urlAdd: '/role/insertRole.json',
	urlEdit: '/role/updateRole.json',
	urlLoadData: '/role/loadRole.json',
	urlRemove: '/role/deleteRoles.json',
	addTitle: "增加角色",
    editTitle: "更新角色",
    gridTitle: "角色数据",
	girdColumns: [
				{header: 'ID', width: 150, dataIndex: 'id', hideGrid: true, hideForm: 'all'},
	            {header: '角色名称', width: 150, sortable: true, dataIndex: 'name', allowBlank:false},
	            {header: '角色编码', width: 150, sortable: true, dataIndex: 'code', allowBlank:false,hideForm:'all'},
	            {header: '角色编码', width: 150, sortable: true, dataIndex: 'code', allowBlank:false,hideGrid: true, hideForm:'add',readOnly:'true'},
	            {header: '角色编码', width: 150, sortable: true, dataIndex: 'code', allowBlank:false,hideGrid: true,hideForm:'edit',id:'roleCodeVali',emptyText:'请以ROLE_开头',vtype:'roleCode'},
	            {header: '有效性', width: 75, hideGrid: true,showAll:false, sortable: true,hiddenName: 'enabled', dictTypeCode: 'CORE.ENABLED', fieldtype:'enabledField', dataIndex: 'enabled'},
	            {header: '有效性', width: 75, dataIndex: 'enabled_Name', hideForm: 'all', fontColor:'enabled,Y,green,N,red'},
	            {id:'descn',header: '描述', width: 250, dataIndex: 'descn', fieldtype:'textarea'}
	        ],
	queryFormHeight:100,
	queryFormItms: [{ 
				layout: 'tableform',
	            layoutConfig: {
	           		columns: 2,
	            	columnWidths: [0.5, 0.5]
	            },           
		        items:[{xtype:'textfield', fieldLabel: '角色名称', name: 'name', id: 'name', anchor:'70%' },
		            {xtype:'enabledField', hiddenName: 'enabled', dictTypeCode: 'CORE.ENABLED', fieldLabel: '有效性',anchor:'70%', allowBlank:true }] 
		    }],
    
    addButtonOnToolbar: function(toolbar, index) {
    	this.grid.getBottomToolbar().insertButton(index++,'-');
    	toolbar.insertButton(index++,new Ext.Button({text:"授权资源",iconCls: 'authorization', id:'authRes'}));
    	toolbar.insertButton(index++,new Ext.Button({text:"授权用户",iconCls: 'authorization', id:'authUser'}));
    },
    
    authResDiag: function() {
    	if(!this.checkOne())
    		return;
    	
    	var grid = new ST.ux.PlainGrid({
    		btnText: '授权',
    		params: {roleId: this.grid.getSelectionModel().selections.items[0].data.id},
	    	urlPagedQuery: '/role/queryResources4Role.json',
	    	urlBind: '/role/bindResource.json',
	    	urlUnBind: '/role/unBindResource.json',
	    	autoExpandColumn:6,
	        columConfig:[{header:"资源名称",name:"name"},
	        	{header:"资源类型",width: 60,name:"type", renderer:this.renderType},
	        	{header:"是否授权",width: 60,name:"counter", renderer:this.authReder},
	        	{header:"资源路径",name:"action"},
	        	{header:"资源描述",name:"descn"}]
	    }); 
    	var win = ST.util.genWindow({
            id: 'userSelectWindow',
            title    : '授权资源 -- ' + this.grid.getSelectionModel().selections.items[0].data.name,
            width    : 700,
            height   : 320,
            items    : [grid],
            border   : true
        });
    },
   
  
    authUserDiag: function() {
    	if(!this.checkOne())
    		return;
    	
    	var grid = new ST.ux.PlainGrid({
    		region:'center',
    		btnText: '授权',
    		id: 'cgrid',
    		params: {roleId: this.grid.getSelectionModel().selections.items[0].data.id},
	    	urlPagedQuery: '/role/queryUsers4Role.json',
	    	urlBind: '/role/bindUser.json',
	    	urlUnBind: '/role/unBindUser.json',
	    	autoExpandColumn:6,
	       /* columConfig:[{header:"用户名称",width: 100,name:"USERNAME"},
	        	{header:"登录账号",width: 100,name:"USERCODE"},
	        	{header: '所属机构', width: 150, fieldtype:'deptfield', name: 'ORGNAME', allowBlank:false},
		        {header: '所属机构ID', width: 150, name: 'ORGID', hidden:true, id:"org_Id"},
	        	{header:"性别",width: 50,name:"GENDER",renderer:this.renderGender},
	        	{header:"是否授权",name:"COUNTER",renderer:this.authReder}]*/
	    	 columConfig:[{header:"用户名称",width: 100,name:"userName"},
	    		        	{header:"登录账号",width: 100,name:"userCode"},
	    		        	{header: '所属机构', width: 150, fieldtype:'deptfield', name: 'orgName', allowBlank:false},
	    			        {header: '所属机构ID', width: 150, name: 'orgId', hidden:true, id:"org_Id"},
	    		        	{header:"性别",width: 50,name:"gender",renderer:this.renderGender},
	    		        	{header:"是否授权",name:"counter",renderer:this.authReder}]
    		
	    }); 
    	
    	
    	//---------- for new function
    	var combo= new Ext.form.ComboBox({
    		id:'counter',
    		name:'counter',
    	    typeAhead: true,
    	    triggerAction: 'all',
    	    allowBlank: false,
    	    editable : false,
    	    selectOnFocus:true,
    	    mode: 'local',
    	    value:2,
    	    store: new Ext.data.ArrayStore({
    	        id: 0,
    	        fields: [
    	            'counter',
    	            'displayText'
    	        ],
    	        data: [[0, '未授权'], [1, '授权'],[2, '全部']]
    	    }),
    	    valueField: 'counter',
    	    displayField: 'displayText',
    	    fieldLabel:'是否授权',
    	    autoLoad:true,
    	    showAll:true,
    	    anchor:'90%'
    	});
    	
    	this.queryItms = [{ 
			layout: 'tableform',
            layoutConfig: {
           		columns: 5,
            	columnWidths: [0.24, 0.25, 0.25, 0.25, 0.01]
            },           
	        items:[{xtype:'textfield', fieldLabel: '登陆账号', name: 'userCode', id: 'userCode', anchor:'90%' },
	        	{xtype:'textfield', fieldLabel: '用户名称', name: 'userName', id: 'userName', anchor:'90%' },
	            {xtype:'deptfield', fieldLabel: '机构', name: 'orgId', anchor:'90%' },combo,
	            {xtype:'textfield',  name: 'flag', id: 'flag', value: 1,anchor:'90%', hidden:true}
	            ]
	    }]; 
    	
    	var query =  new Ext.form.FormPanel({ 
			region: 'north',
		    title: "", 
		    id: "query-panel",
		    frame : true,
		    collapsible: true,
		    buttonAlign: 'center',
		    height:100, 
		    bodyStyle:'padding:0 0 0 2', 
		    items: this.queryItms,
		    labelWidth:60,
		    plugins: [Ext.ux.PanelCollapsedTitle],
		    scope: this,
		    buttons: [{ 
				text: '查询', 
				type:'button', 
				id:'userQuery', 
				iconCls:'query',
				handler: function(){
					
					
					Ext.apply(Ext.getCmp('cgrid').store.baseParams, Ext.getCmp("query-panel").getForm().getFieldValues());
					Ext.getCmp('cgrid').store.reload({params:{start:0,limit:Ext.getCmp('cgrid').pageSize}});
			    },
				scope: this
			},{ 
				text: '重置', 
				type:'reset', 
				id:'clear', 
				iconCls:'redo',
				handler:function(){
					Ext.getCmp("query-panel").getForm().reset();
					//Ext.getCmp("counter").clearValue();
				},
				scope: this
			}]
		});//--------end
    	
    	
    	var win = ST.util.genWindow({
            id: 'userSelectWindow',
            title    : '授权用户 -- ' + this.grid.getSelectionModel().selections.items[0].data.name,
            width    : 700,
            height   : 320,  
            items    : [grid,query],
            border   : true,
    	    layout   : 'border'
        });
    },
    
    renderGender:function(value, p, record) {
    	  if(record.data['GENDER'] == 'F') {
    		  return "女";
    	  }else if(record.data['GENDER'] == 'M'){
    		  return "男";
    	  }else{
    		  return "未知";
    	  }
    },
    
    authReder: function(value, p, record) {
    	if(record.data['COUNTER'] == 0 || record.data['counter'] == 0) {
            return String.format("<b><font color=red>未授权</font></b>");
        } else if(record.data['COUNTER'] == 1 || record.data['counter'] == 1) {
            return String.format("<b><font color=green>授权</font></b>");
        }
    },
    
    renderType: function(value, p, record) {
        if(record.data['type'] == 'url') {
            return "URL";
        } else if(record.data['type'] == 'method') {
            return "方法";
        } else if(record.data['type'] == 'menu') {
            return "菜单";
        }
    },
    
    buildAddDialog : function() {
    	flag = "add";
        this.addFormPanel = new Ext.form.FormPanel({
        	defaultType: 'textfield',
            labelAlign: 'right',
            labelWidth: this.dialogLabelWidth,
            frame: true,
            id: "addFormPanelID",
            autoScroll: true,
            buttonAlign: 'center',
            url: this.urlAdd,
            items: this.buildItems( "add"),
            fileUpload: this.isFileUpload,
            scope: this,
            buttons: [
                      {text: '确定', scope: this, handler:this.roleCodeVali},
                      {
                    	  text: '取消',
                    	  scope: this,
                    	  handler: function() {
                    		  this.addDialog.close();
                    	  }
                      }]
          });
        
          this.addDialog = new Ext.Window({
        	  id:'addDialog',
              title: this.addTitle,
              modal: true,
              width: this.dlgWidth,
              height: this.dlgHeight,
              closeAction: 'close',
              items: [ this.addFormPanel]
          });
      },
    
   roleCodeVali: function(){
    	if(flag == 'add'){
    		if(!this.addFormPanel.getForm().isValid())	return;
    		var id = -1;
    	}
    	else if(flag == 'edit'){
    		if(!this.editFormPanel.getForm().isValid())	return;
    		var id = Ext.getCmp('grid').getSelectionModel().selections.items[0].id;
    	}
        var roleCode = Ext.getCmp('roleCodeVali').getValue();
        Ext.Ajax.request({
        	url: '/role/isExistRole',
            method: 'POST',
            params:{'id':id, 'code':roleCode},
            success: function(response, options){
            	var res = Ext.decode(response.responseText);
                if(res.success == false){//不重复，表单提交
                	if(flag == 'add'){
                		Ext.getCmp('addFormPanelID').getForm().submit({
                			waitMsg : '正在处理，请稍等...' ,
                			success: function(a, b) {
                				Ext.getCmp('addDialog').close();
                				Ext.getCmp('grid').store.reload();
                			},
                			failure: function(a, b) {
                				Ext.MessageBox.alert( "提示", b.result.message);
                			},
                			scope: this
                		});
                	}
                	else if(flag == 'edit'){
                		Ext.getCmp('editFormPanelID').getForm().submit({
                			waitMsg : '正在处理，请稍等...' ,
                			params: {id: Ext.getCmp('grid').getSelectionModel().selections.items[0].id},
                			success: function() {
                				Ext.getCmp('editDialog').close();
                				Ext.getCmp('grid').store.reload();
                			},
                			failure: function(a, b) {
                				Ext.MessageBox.alert( "提示", b.result.message);
                			},
                			scope: this
                		});
                	}
                } else{//重复
                	Ext.Msg.alert('系统提示','角色编码已存在');
                }
              },
              failure: function(response, options){
            	  Ext.Msg.alert( "提示", "响应失败，请联系管理员" );
              }
        });
      },
    
	constructor: function() {
		ST.base.roleView.superclass.constructor.call(this, {});
		//授权资源
        btn = Ext.getCmp("authRes");
        btn.on("click", function(){
        	this.authResDiag();
        }, this);
        
        //用户
        btn = Ext.getCmp("authUser");
        btn.on("click", function(){
        	this.authUserDiag();
        }, this);
	}
});