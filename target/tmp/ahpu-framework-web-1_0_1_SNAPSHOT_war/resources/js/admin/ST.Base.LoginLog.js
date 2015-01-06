Ext.namespace("ST.base");

ST.base.logView = Ext.extend(ST.ux.ViewGrid, {
	isShowqueryForm:false,
	displayTopButton:true,
	displayBottomButton:false,
	dlgWidth: 360,
	dlgHeight: 260,
	urlGridQuery: '/loginLog/pageQueryLogs.json',
    gridTitle: "日志列表",
	girdColumns: [
	            {header: 'ID', width: 150, dataIndex: 'id', hideGrid: true, hideForm: 'add', readOnly: true},
	            {header: '机构名称', width: 150, sortable: true, dataIndex: 'orgName'},
	            {header: '登录账号', width: 150, sortable: true, dataIndex: 'userCode'},
	            {header: '客户端类型', width: 100, sortable: true, dataIndex: 'clientType'},
	            {header: '登录IP', width: 200, sortable: true, dataIndex: 'ip'},
	            {header: '操作状态', width: 100, sortable: true, dataIndex: 'loginStatus',fontColor:'loginStatus,SUCCESS,green,FAILURE,red'},
	            {header: '登录时间', width: 175, sortable: true, dataIndex: 'loginDate'},
	            {header: '退出时间', width: 175, sortable: true, dataIndex: 'logoutDate',id:"descn"}
	        ],

    addButtonOnToolbar: function(toolbar, index) {
    	var condition = new Ext.form.TextField({
			id:"id-condition",
			emptyText:'请输入登录账号',
			margin :'0px 0px  0px 500px',
			width : 150,
			length : 10
		});	
    	toolbar.add(condition);
    	toolbar.insertButton(index++,new Ext.Button({
    			text:"查询",
    			iconCls: 'query',
    			id:'id-search'
    		})
    	);
    	toolbar.insertButton(index++,new Ext.Button({
				text:"导出",
				iconCls: 'excel',
				id:'id-export'
			})
    	);
    	toolbar.insertButton(index++,new Ext.Button({
	    		text:"刷新",
	    		iconCls: 'refresh', 
	    		id:'id-refresh'
			})
    	);
    },
    
    logQuery:function(){
    	var condition = Ext.getCmp("id-condition").getValue();
    	this.grid.store.baseParams = {
			'userCode' : condition
		};
    	this.grid.store.load({
            params:{start:0, limit:this.grid.getBottomToolbar().pageSize}
        });
    },
    exportLog: function(){
    	var userCode = Ext.getCmp("id-condition").getValue();
		window.location="/loginLog/export.xls?userCode="+userCode;
    },
	constructor: function() {
		ST.base.logView.superclass.constructor.call(this, {});
		//查询
        btn = Ext.getCmp("id-search");
        btn.on("click", function(){
        	this.logQuery();
        }, this);
        
      //导出
        btn = Ext.getCmp("id-export");
        btn.on("click", function(){
        	this.exportLog();
        }, this);
        
      //刷新
        btn = Ext.getCmp("id-refresh");
        btn.on("click", function(){
        	this.grid.store.reload();
        }, this);
	}
});