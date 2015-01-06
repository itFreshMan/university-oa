UxGrid = Ext.extend(Ext.grid.GridPanel, {
	stateful: false,
    frame: true,
    viewConfig: {
        forceFit: true
    },
    loadMask: {
        msg : '正在载入数据,请稍候...'
    },
    initComponent: function() {
        UxGrid.superclass.initComponent.call(this);
    },
    initEvents : function(){
        UxGrid.superclass.initEvents.call(this);
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
    },
    createCombo: function(id,name,url,width) {    //生成一个通用的ComboBox
        var combo = new Ext.form.ComboBox({
            emptyText: '请选择...',
            isFormField: true,
            mode: 'local',
            triggerAction: 'all',
            width: width,
            //readOnly: true,
            forceSelection: true,
            displayField:name,
            valueField:id,
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({url: url, method: 'POST'}),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:id},{name:name}]))
            })
        });
        return combo;
    },
    createMemoryCombo: function(fieldLabel,id,name,width,jsonData) {
    	 var combo = new Ext.form.ComboBox({
            fieldLabel: fieldLabel,
            emptyText: '请选择...',
            isFormField: true,
            width: width,
            mode: 'local',
            name: id,
            forceSelection: true,
            triggerAction: 'all',
            displayField:name,
            valueField:id,
            store: new Ext.data.Store({
                proxy: new Ext.data.MemoryProxy(jsonData),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:id},{name:name}]))
            }),
            readOnly: true
        });
        return combo;
    },
    createTextFiled: function(name,width) {    //生成一个通用的TextField
        var tf = new Ext.form.TextField({
            name: name,
            xtype: 'textfield',
            readOnly: false,
            width: width,
            blankText: '该选项为必填项,请输入内容...'
        });
        return tf;
    },
    createPagingToolbar: function(PAGESIZE) {
    	var pageSizeCombo = new Ext.form.ComboBox({
         	allowBlank : false,
        	mode : 'local',
         	triggerAction : 'all',
         	editable : false,
         	width: 70,
         	anchor : '90%',
         	store : new Ext.data.SimpleStore({
               fields : ['text', 'value'],
               data : [['10条/页', '10'], ['20条/页', '20'], ['50条/页', '50'], ['100条/页', '100']]
         	}),
         	value: PAGESIZE,  
         	valueField : 'value',
         	displayField : 'text',
         	listeners: {
				'select' : function(comboBox, recored, index) {
					var comboValue = comboBox.getValue();
					comboBox.ownerCt.pageSize  =  parseInt(comboValue);
					this.store.reload({params:{start:0,limit:comboValue}}); 
		    	}.createDelegate(this)
		    }	
	    });
    	var bbar=new Ext.PagingToolbar({
            pageSize: PAGESIZE,
            store: this.store,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
            emptyMsg: "没有记录",
            scope:this,
            plugins: [new Ext.ux.ProgressBarPager()],
            items:[
                '-', pageSizeCombo]
        });
    	return bbar;
    }
});
    