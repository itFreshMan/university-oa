Ext.namespace("ST.base");

ST.base.schemaVersionView = Ext.extend(ST.ux.ViewGrid, {
	isShowqueryForm:false,
	displayTopButton:true,
	displayBottomButton:false,
	dlgWidth: 360,
	dlgHeight: 260,
	urlGridQuery: '/schemaVersion/pageQuerySchemaVersions.json',
    gridTitle: "数据库sql版本列表",
	girdColumns: [
	            {header: '版本号', width: 150, sortable: true, dataIndex: 'version'},
	            {header: '描述', width: 150, sortable: true, dataIndex: 'description',id:'descn'},
	            {header: '类型', width: 100, sortable: true, dataIndex: 'type'},
	            {header: 'script', width: 200, sortable: true, dataIndex: 'script'},
	            {header: 'installedBy', width: 100, sortable: true, dataIndex: 'installedBy',fontColor:'loginStatus,SUCCESS,green,FAILURE,red'},
	            {header: 'installedOn', width: 175, sortable: true, dataIndex: 'installedOn'},
	            {header: 'executionTime', width: 175, sortable: true, dataIndex: 'executionTime'},
	            {header: 'success', width: 175, sortable: true, dataIndex: 'success'}
	        ],

    addButtonOnToolbar: function(toolbar, index) {
    	var condition = new Ext.form.TextField({
			id:"id-condition",
			emptyText:'请输入版本号',
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
	    		text:"刷新",
	    		iconCls: 'refresh', 
	    		id:'id-refresh'
			})
    	);
    },
    
   logQuery:function(){
    	var condition = Ext.getCmp("id-condition").getValue();
    	this.grid.store.baseParams = {
			'version' : condition
		};
    	this.grid.store.load({
            params:{start:0, limit:this.grid.getBottomToolbar().pageSize}
        });
    },
    
	constructor: function() {
		ST.base.schemaVersionView.superclass.constructor.call(this, {});
		//查询
        btn = Ext.getCmp("id-search");
        btn.on("click", function(){
        	this.logQuery();
        }, this);

      //刷新
        btn = Ext.getCmp("id-refresh");
        btn.on("click", function(){
        	this.grid.store.reload();
        }, this);
	}
});