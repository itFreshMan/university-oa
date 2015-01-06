Ext.namespace("ST.base");

ST.base.attachmentView = Ext.extend(ST.ux.ViewGrid, {
	isShowqueryForm:false,
	displayTopButton:true,
	displayBottomButton:false,
	dlgWidth: 360,
	dlgHeight: 260,
	urlGridQuery: '/attachment/pageQueryAttachments.json',
    gridTitle: "文件列表",
	girdColumns: [
	            {header: '文件ID', width: 100, sortable: true, dataIndex: 'dataId', allowBlank:false},
	            {header: '标题', width: 150, dataIndex: 'fileName'},
	            {header: '大小', width: 100, sortable: true, dataIndex: 'fileSize', allowBlank:false},
	            {header: '类型', width: 100, sortable: true, dataIndex: 'attachmentType', allowBlank:false},
	            {header: '存储路径', width: 250, sortable: true, dataIndex: '', allowBlank:false},
	            {id:'descn',header: '描述', width: 250, dataIndex: 'descn', fieldtype:'textarea'}
	        ],

    addButtonOnToolbar: function(toolbar, index) {
    /*	this.grid.getTopToolbar().insertButton(index++,'-');*/
    	var condition = new Ext.form.TextField({
			id:"id-condition",
			emptyText:'请输入文件标题',
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
    
    attachmentQuery:function(){
    	var condition = Ext.getCmp("id-condition").getValue();
    	this.grid.store.baseParams = {
			'fileName' : condition
		};
    	this.grid.store.load({
            params:{start:0, limit:this.grid.getBottomToolbar().pageSize}
        });
    },
	constructor: function() {
		ST.base.attachmentView.superclass.constructor.call(this, {});
		//查询
        btn = Ext.getCmp("id-search");
        btn.on("click", function(){
        	this.attachmentQuery();
        }, this);
        
      //刷新
        btn = Ext.getCmp("id-refresh");
        btn.on("click", function(){
        	this.grid.store.reload();
        }, this);
        
	}
});