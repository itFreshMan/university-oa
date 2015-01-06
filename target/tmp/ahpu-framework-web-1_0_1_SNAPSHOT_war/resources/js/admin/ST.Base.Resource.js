Ext.namespace("ST.base");

Ext.reg('resourceTypeField', Ext.extend(ST.ux.ExtField.ComboBox, {
	store : new Ext.data.JsonStore({  //填充的数据
    	url : "/dict/queryDictEntries",
    	fields : new Ext.data.Record.create( ['code', 'name'])
 	})
}));
Ext.reg('enabledField', Ext.extend(ST.ux.ExtField.ComboBox, {
	store : new Ext.data.JsonStore({  //填充的数据
    	url : "/dict/queryDictEntries",
    	fields : new Ext.data.Record.create( ['code', 'name'])
 	})
}));
Ext.reg('moduleField', Ext.extend(ST.ux.ExtField.ComboBox, {
	store : new Ext.data.JsonStore({  //填充的数据
    	url : "/dict/queryDictEntries",
    	fields : new Ext.data.Record.create( ['code', 'name'])
 	})
}));

ST.base.resourceView = Ext.extend(ST.ux.ViewGrid, {
	dlgWidth: 360,
	dlgHeight: 360,
	//资源列表查询URL
	urlGridQuery: '/resource/pageQueryResources.json',
	urlAdd: '/resource/insertResource.json',
	urlEdit: '/resource/updateResource.json',
	urlLoadData: '/resource/loadResource.json',
	urlRemove: '/resource/deleteResources.json',
	addTitle: "增加资源",
    editTitle: "更新资源",
    gridTitle: "资源数据",
    displayEast: true,
	girdColumns: [
				{header: 'ID', width: 150, dataIndex: 'id', hideGrid: true, hideForm: 'all'},
				{header: '模块名称', width: 75, hideGrid: true, showAll:false, sortable: true, hiddenName: 'module', dictTypeCode: 'CORE.MODULE', fieldtype:'moduleField', dataIndex: 'module'},
				{header: '模块名称', width: 130, dataIndex: 'module_Name', hideForm: 'all'},
	            {header: '资源名称', width: 150, dataIndex: 'name', allowBlank:false},
	            {header: '资源路径', width: 200, dataIndex: 'action', allowBlank:false},
	            {header: '资源类型', width: 75, hideGrid: true, showAll:false, sortable: true, hiddenName: 'type', dictTypeCode: 'CORE.RESOURCE.TYPE', fieldtype:'resourceTypeField', dataIndex: 'type'},
	            {header: '资源类型', width: 75, dataIndex: 'type_Name', hideForm: 'all'},
	            {header: '有效性', width: 75, hideGrid: true, showAll:false, sortable: true, hiddenName: 'enabled', dictTypeCode: 'CORE.ENABLED', fieldtype:'enabledField', dataIndex: 'enabled'},
	            {header: '有效性', width: 75, dataIndex: 'enabled_Name', hideForm: 'all', fontColor:'enabled,Y,green,N,red'},
	            {header: '优先级', width: 60, sortable: true, dataIndex: 'priority', allowBlank:false,regex:/[0-9]+/,regexText:"请输入数字"},
	            {id:'descn',header: '描述', width: 250, dataIndex: 'descn', fieldtype:'textarea'}
	        ],
	eastWidth: 250,
	eastGridTitle: '资源绑定的角色',
	urlEastGridQuery: '/resource/queryRoles4Res.json',
	eastGridColumn: [{header: "角色名称", width: 120, dataIndex: 'name', name: 'name'},
            {header: "角色编码", width: 125, dataIndex: 'code', name: 'code'}],
	
    queryFormHeight: 120,
	queryFormItms: [{ 
		        layout: 'tableform',
	            layoutConfig: {
	           		columns: 2,
	            	columnWidths: [0.5, 0.5]
	            },           
		        items:[
		               {xtype:'moduleField', hiddenName: 'module',dictTypeCode: 'CORE.MODULE',fieldLabel: '模块名称',anchor:'80%', allowBlank:true },
		               {xtype:'textfield', fieldLabel: '资源名称', name: 'name', id: 'name', anchor:'80%' },
		               {xtype:'resourceTypeField',hiddenName: 'type',dictTypeCode: 'CORE.RESOURCE.TYPE', fieldLabel: '资源类型',anchor:'80%', allowBlank:true },
		               {xtype:'enabledField', hiddenName: 'enabled',dictTypeCode: 'CORE.ENABLED',fieldLabel: '有效性',anchor:'80%', allowBlank:true }]
		    }],
		    
	addButtonOnToolbar: function(toolbar, index) {
    	toolbar.insertButton(index++,new Ext.Button({text:"授予角色",iconCls: 'authorization', id:'authRole'}));
    },
    
    authRoleDiag: function() {
    	if(!this.checkOne())
    		return;
    	
    	var grid = new ST.ux.PlainGrid({
    		btnText: '授予',
    		params: {resId: this.grid.getSelectionModel().selections.items[0].data.id},
	    	urlPagedQuery: '/resource/pageQueryRoles4Res.json',
	    	urlBind: '/resource/bindRole.json',
	    	urlUnBind: '/resource/unBindRole.json',
	    	autoExpandColumn:5,
	        columConfig:[{header:"角色名称",width: 100,name:"name"},
	        	{header:"角色编码",width: 100,name:"code", renderer:this.renderType},
	        	{header:"是否授予",width: 60,name:"counter", renderer:this.authReder},
	        	{header:"角色描述",name:"descn"}]
	    }); 
    	var win = ST.util.genWindow({
            id: 'userSelectWindow',
            title    : '授权角色 -- ' + this.grid.getSelectionModel().selections.items[0].data.name,
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
     * Center 区域 Grid的行rowdblclick事件调用方法
     */
    rowclickFn: function(grid, rowIndex, e) {
    	var data = grid.getStore().getAt(rowIndex).data;
		this.east.store.load({
            params:{resId: data.id}
        });
    },
    
	constructor: function() {
		ST.base.resourceView.superclass.constructor.call(this, {});
		
		//授权资源
        btn = Ext.getCmp("authRole");
        btn.on("click", function(){
        	this.authRoleDiag();
        }, this);
	}
});