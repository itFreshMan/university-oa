Ext.namespace("ST.base");
var DeptField = Ext.extend(Ext.ux.TreeCombo, {
	rootVisible : false,
	url : '/org/queryOrgs.json',
	allowBlank : false,
	hiddenName : 'org_Id',
	rootName : '机构'
});
Ext.reg('deptfield', DeptField);

Ext.reg('genderField', ST.ux.ExtField.ComboBox);

ST.base.userView = Ext.extend(ST.ux.ViewGrid, {
	dlgWidth: 360,
	dlgHeight: 300,
	//资源列表查询URL
	urlGridQuery: '/user/pageQueryUsers.json',
	urlAdd: '/user/insertUser.json',
	urlEdit: '/user/updateUser.json',
	urlLoadData: '/user/loadUser.json',
	urlRemove: '/user/deleteUsers.json',
	addTitle: "增加用户",
    editTitle: "更新用户",
    gridTitle: "用户数据",
    displayEast: true,
    autoExpandColumn: 3,
	girdColumns: [
				{header: 'ID', width: 150, dataIndex: 'id', hideGrid: true, hideForm: 'all'},
	            {header: '用户名称', width: 100, dataIndex: 'userName', allowBlank:false},
	            {header: '登录账号' , width: 100, dataIndex: 'userCode', allowBlank: false,vtype : "alphanum", hideGrid: true, hideForm:'add', readOnly:true},
	            {header: '登录账号' , width: 100, dataIndex: 'userCode', allowBlank: false,vtype : "alphanum",hideGrid: true, hideForm:'edit',id:'userCodeVali'},
                {header: '登录账号' , width: 100, dataIndex: 'userCode', allowBlank: false, hideForm: 'all'},
	            {header: '所属机构', width: 100, fieldtype:'deptfield', dataIndex: 'orgName', allowBlank:false},
	            {header: '所属机构', width: 100, dataIndex: 'orgId', hideGrid: true, inputType:"hidden", id:"org_Id"},
	            {header: '性别', width: 50, hideGrid: true, dataIndex: 'gender', hiddenName: 'gender', dictTypeCode: "CORE.GENDER", allowBlank:false, showAll:false, fieldtype:'genderField'},
	            {header: '性别', width: 50, dataIndex: 'gender_Name', hideForm: 'all'},
	            {header: '电话号码', width: 100, dataIndex: 'phoneNo'},
	            {header: '移动号码', width: 100, dataIndex: 'mPhoneNo'},
	            {header: '邮箱', width: 150, dataIndex: 'email'},
	            {header: '出生日期', width: 150, dataIndex: 'birthday',fieldtype:'datefield',format:'Y-m-d'},
	            {header: '上次登录时间', width: 150, dataIndex: 'lastLogin', allowBlank:false, hideForm:"all"},
	            {header: '上次登录IP', width: 150, dataIndex: 'ipAddress', hideForm:"all", allowBlank:false}
	        ],
	        
	eastWidth: 250,
	eastGridTitle: '用户绑定的角色',
	urlEastGridQuery: '/user/queryRoles4User.json',
	eastGridColumn: [{header: "角色名称", width: 120, dataIndex: 'name', name: 'name'},
            {header: "角色编码", width: 125, dataIndex: 'code', name: 'code'}],
	
	queryFormItms: [{ 
				layout: 'tableform',
	            layoutConfig: {
	           		columns: 3,
	            	columnWidths: [0.33, 0.33, 0.33]
	            },           
		        items:[{xtype:'textfield', fieldLabel: '登陆账号', name: 'userCode', id: 'userCode', anchor:'90%' },
		        	{xtype:'textfield', fieldLabel: '用户名称', name: 'userName', id: 'userName', anchor:'90%' },
		            {xtype:'deptfield', fieldLabel: '机构', name: 'orgId', anchor:'90%' }]
		    }],
    
	addButtonOnToolbar: function(toolbar, index) {
    	toolbar.insertButton(index++,new Ext.Button({text:"授予角色",iconCls: 'authorization', id:'authRole'}));
    },
    
    authRoleDiag: function() {
    	if(!this.checkOne())
    		return;
    	
    	var grid = new ST.ux.PlainGrid({
    		btnText: '授予',
    		params: {operatorId: this.grid.getSelectionModel().selections.items[0].data.id},
	    	urlPagedQuery: '/user/pageQueryRoles4User.json',
	    	urlBind: '/user/bindRole.json',
	    	urlUnBind: '/user/unBindRole.json',
	    	autoExpandColumn:5,
	        columConfig:[{header:"角色名称",width: 100,name:"name"},
	        	{header:"角色编码",width: 100,name:"code", renderer:this.renderType},
	        	{header:"是否授予",width: 60,name:"counter", renderer:this.authReder},
	        	{header:"角色描述",name:"descn"}]
	    }); 
    	var win = ST.util.genWindow({
            id: 'userSelectWindow',
            title    : '授权角色 -- ' + this.grid.getSelectionModel().selections.items[0].data.userName,
            width    : 700,
            height   : 320,
            items    : [grid],
            border   : true
        });
    },
    
    authReder: function(value, p, record) {
    	if(record.data['counter'] == 0) {
            return String.format("<b><font color=red>未授予</font></b>");
        } else if(record.data['counter'] == 1) {
            return String.format("<b><font color=green>授予</font></b>");
        }
    },
    
    /**
     * Center 区域 Grid的行click事件调用方法
     */
    rowclickFn: function(grid, rowIndex, e) {
    	var data = grid.getStore().getAt(rowIndex).data;
		this.east.store.load({
            params:{operatorId: data.id}
        });
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
                      {text: '确定', scope: this, handler:this.userCodeVali},
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
     
    userCodeVali: function(){
    	if(flag == 'add'){
    		if(!this.addFormPanel.getForm().isValid())	return;
    		var id = -1;
    	}
    	else if(flag == 'edit'){
    		if(!this.editFormPanel.getForm().isValid())	return;
    		var id = Ext.getCmp('grid').getSelectionModel().selections.items[0].id;
    	}
        var userCode = Ext.getCmp('userCodeVali').getValue();
        Ext.Ajax.request({
        	url: '/user/isExistUser',
            method: 'POST',
            params:{'id':id, 'userCode':userCode},
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
                	Ext.Msg.alert('系统提示','登陆账号已存在');
                }
              },
              failure: function(response, options){
            	  Ext.Msg.alert( "提示", "响应失败，请联系管理员" );
              }
        });
      },

    
	constructor: function() {
		ST.base.userView.superclass.constructor.call(this, {});
		this.grid.id = 'userGrid';
		//授权资源
        btn = Ext.getCmp("authRole");
        btn.on("click", function(){
        	this.authRoleDiag();
        }, this);
	}
});