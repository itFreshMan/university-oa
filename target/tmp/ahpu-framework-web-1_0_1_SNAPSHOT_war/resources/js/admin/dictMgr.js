var DICT_GRID_STORE_URL = '/dict/pageQueryDictTypes';
var DICT_ENTRY_GRID_STORE_URL = '/dict/pageQueryDictEntries';
var PAGESIZE=20;

/***************************************DictTypeForm组件**************************************************/
DictTypeForm = Ext.extend(Ext.ux.Form, {
	
    constructor: function() {
        this.module = this.createDictCombo('<font color="red">*</font>模块名称:','module','95%','CORE.MODULE',false);
        this.module.allowBlank = false;
        this.name = this.createTextField('<font color="red">*</font>字典类型名称:', 'name', '95%','','',64,'最大字符数64！');
        this.code = this.createTextField('<font color="red">*</font>字典类型编码:', 'code', '95%','','',64,'最大字符数64！');
        this.memo = new Ext.form.TextArea({
            fieldLabel: '描述:',
            name: 'memo',
            readOnly: false,
            anchor: '95%',
            height:80,
            maxLength: 256,
            maxLengthText: '最大字符数256！'
        });
        

        DictTypeForm.superclass.constructor.call(this, {
        	anchor: '100%',
        	autoHeight:true,
        	layout:"tableform",
        	layoutConfig: {columns: 1},
        	labelWidth: 90,
            labelAlign :'right',
            frame:true,
            bodyStyle:"padding: 5px 5px 0",
            width: '100%',
            items: [
            	this.module,
            	this.name,
            	this.code,
            	this.memo
            ],
            buttonAlign :'center',
            buttons: [
                      {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},  
                      {text:'修改',iconCls: 'edit',handler:this.updateFormClick,scope:this},
                      {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
              ]
        });
     },
     addFormClick: function() {
         if(this.getForm().isValid()) {
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/dict/insertDictType', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
                 	dictTypeGrid.constructionInsertWindow.hide();
                 	dictTypeGrid.vbbar.doLoad(dictTypeGrid.vbbar.cursor);
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!" + BLANKSTR);
                 }
         	});
         }
     },
     updateFormClick: function() {       //修改
         if(this.getForm().isValid()) {
         	var record = dictTypeGrid.getSelectionModel().getSelections();
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/dict/updateDictType', 
                 method: 'POST',
                 params:{
                 	id:record[0].get('id')
                 },
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
                 	dictTypeGrid.constructionUpdateWindow.hide();
                 	dictTypeGrid.vbbar.doLoad(dictTypeGrid.vbbar.cursor);
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
                 }
         	});
         }
     },
     onCloseClick: function(){ 			//关闭
         this.ownerCt.hide();
     }
});


/***************************************DictTypeInsertWindow组件**************************************************/
DictTypeInsertWindow = Ext.extend(Ext.Window,{
	constructionForm : null,
    constructor: function(grid) {
        this.constructionForm = new DictTypeForm();
        this.constructionForm.buttons[0].show();   //隐藏添加按钮
    	this.constructionForm.buttons[1].hide();   //显示修改按钮
        DictTypeInsertWindow.superclass.constructor.call(this, {
            title: "添加字典类型",
            width: 400,
            anchor: '100%',
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});

/***************************************DictTypeUpdateWindow组件**************************************************/
DictTypeUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.constructionForm = new DictTypeForm();
    	this.constructionForm.buttons[0].hide();   //隐藏添加按钮
    	this.constructionForm.buttons[1].show();   //显示修改按钮
    	DictTypeUpdateWindow.superclass.constructor.call(this, {
        	title: "修改字典类型",
            width: 400,
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});
/**************************DictTypeGrid*******************************************/
DictTypeGrid = Ext.extend(UxGrid, {
	pageSizeCombo: PAGESIZE,
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
    module_name:null,
    type_name:null,
    constructor: function(height, width){
    	var thiz = this;
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: DICT_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'id'},{name:'module'},{name:'module_Name'},{name:'name'},{name:'code'},{name:'memo'}
            ])
        });
        this.module_name = new ST.ux.ExtField.ComboBox({
        	dictTypeCode: 'CORE.MODULE',
            fieldLabel: '模块名称',
            allowBlank: true,
            width:120,
            hiddenName :'module',
            name:'module',
            showAll:false
        });
		this.type_name = new Ext.form.TextField({
            fieldLabel: '字典类型名称',
            width:120,
            name:'name'
        });
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
    	this.vtbar = new Ext.Toolbar({
            items:[
                {text:'添加',iconCls: 'add',handler:this.onAddClick,scope:this},'-',
                {text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},'-',
            	{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this},'->',
            	new Ext.form.Label({text:'模块名称:'}),
            	thiz.module_name,'-',
            	new Ext.form.Label({text:'字典类型名称:'}),
            	thiz.type_name,'-',
            	{text:'查询',iconCls: 'query',handler:this.onQueryClick,scope:this}
            ]
        });	
        this.constructionInsertWindow = new DictTypeInsertWindow();       
        this.constructionUpdateWindow = new DictTypeUpdateWindow();
        var sm = new Ext.grid.CheckboxSelectionModel(); 
        DictTypeGrid.superclass.constructor.call(this, {
        	region:'center',
        	title: '业务字典数据',
        	stripeRows: true,
            frame: true,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                                          sm,
                {header: 'ID', width: 150, dataIndex: 'id', hidden: true},
				{header: '模块名称', width:100, dataIndex: 'module',hidden: true},
		        {header: '模块名称', width:100, dataIndex: 'module_Name', sortable: true},
	            {header: '字典类型名称', width: 100, dataIndex: 'name', sortable: true},
	            {header: '字典类型编码', width: 150, dataIndex: 'code', sortable: true},
	            {id:'descn',header: '描述', width: 250, dataIndex: 'memo', sortable: true}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store,
            listeners: {
                //"dblclick": { fn: this.onModifyClick, scope: this}, 		//响应双击事件
                //"rowcontextmenu": {fn: this.onRightMenuClick, scope: this}  //响应右击事件
            	'click':function(){
            		var records=this.getSelectionModel().getSelections();
            		var id = records[0].get('id');
            		var name = records[0].get('name');
            		dictEntryGrid.setTitle(name+'对应的字典项');
            		dictEntryGrid.dictTypeId = id;
            		dictEntryGrid.store.baseParams = {
			    		limit:PAGESIZE,
			    		dictTypeId:id
			    	};
			    	dictEntryGrid.store.load({params:{start:0}});
            	}
            }
        });
    },
//    onRightMenuClick: function(grid, rowIndex, e) {//右键菜单
//        this.getSelectionModel().selectRow(rowIndex);
//        e.preventDefault();
//        this.rightMenu.showAt(e.getXY());
//    },
    onAddClick: function() {
    	var win = this.constructionInsertWindow;
    	win.show();
    	win.constructionForm.getForm().reset();
    },
    onModifyClick: function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   		    	var win = this.constructionUpdateWindow;
   		    	win.constructionForm.getForm().reset();
   		    	win.show();
   		    	win.constructionForm.getForm().loadRecord(vrecord);
   			}else{
   				Ext.Msg.alert('系统提示', '不能修改多条记录..');
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
				       	   url:'/dict/deleteDictTypes',
				       	   method : 'POST', 
				       	   params: { ids: valueStr},
			               success: function(form, action) { 
				               Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除成功!" + BLANKSTR);
				               dictTypeGrid.store.reload();
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
    onQueryClick:function(){
    	dictTypeGrid.store.baseParams = {
    		limit:dictTypeGrid.vbbar.pageSize,
    		module:this.module_name.getValue(),
    		name:this.type_name.getValue()
    	};
    	dictTypeGrid.store.load({params:{start:0}});
    },
    sheetNoChange: function(value) {
    	return '<a href="javascript:void(0)" onclick=javascript:clickSheetNo('+value+')><b><font color=red>'+ value + '</font></b></a>';
    },
    clickSheetNo: function() {
    	alert(11);
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
    formatTime : function(val) {
    		var valStr = val.constructor == Date ? Ext.util.Format.date(val, 'Y-m-d H:i:s') : formatDate(new Date(val["time"]),"yyyy-MM-dd HH:mm:ss");    		
    		var valArr = valStr.split('-');
    		var valDate = new Date(valArr[0], valArr[1] - 1, valArr[2]);
    		return valStr;
    }
});

/***************************************DictEntryForm组件**************************************************/
DictEntryForm = Ext.extend(Ext.ux.Form, {
	
    constructor: function() {
        this.name = this.createTextField('<font color="red">*</font>字典项名称:', 'name', '95%','','',64,'最大字符数64！');
        this.code = this.createTextField('<font color="red">*</font>字典项编码:', 'code', '95%','','',64,'最大字符数64！');
        this.orderIndex = this.createNumberField('<font color="red">*</font>索引顺序:','orderIndex','95%',0);
        this.dictTypeId = this.createHidden('字典类型id', 'dictType.id');
        this.dictEntryId = this.createHidden('字典项id', 'id');
        DictEntryForm.superclass.constructor.call(this, {
        	anchor: '100%',
        	autoHeight:true,
        	layout:"tableform",
        	layoutConfig: {columns: 1},
        	labelWidth: 75,
            labelAlign :'right',
            frame:true,
            bodyStyle:"padding: 5px 5px 0",
            width: '100%',
            items: [
            	this.name,
            	this.code,
            	this.orderIndex,
            	this.dictTypeId,
            	this.dictEntryId
            ],
            buttonAlign :'center',
            buttons: [
                      {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},  
                      {text:'修改',iconCls: 'edit',handler:this.updateFormClick,scope:this},
                      {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
              ]
        });
     },
     addFormClick: function() {
         if(this.getForm().isValid()) {
         	this.dictTypeId.setValue(dictEntryGrid.dictTypeId);
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/dict/insertDictEntry', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
                 	dictEntryGrid.constructionInsertWindow.hide();
                 	dictEntryGrid.vbbar.doLoad(dictEntryGrid.vbbar.cursor);
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!" + BLANKSTR);
                 }
         	});
         }
     },
     updateFormClick: function() {       //修改
         if(this.getForm().isValid()) {
         	this.dictTypeId.setValue(dictEntryGrid.dictTypeId);
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/dict/updateDictEntry', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
                 	dictEntryGrid.constructionUpdateWindow.hide();
                 	dictEntryGrid.vbbar.doLoad(dictEntryGrid.vbbar.cursor);
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
                 }
         	});
         }
     },
     onCloseClick: function(){ 			//关闭
         this.ownerCt.hide();
     }
});


/***************************************DictEntryInsertWindow组件**************************************************/
DictEntryInsertWindow = Ext.extend(Ext.Window,{
	constructionForm : null,
    constructor: function(grid) {
        this.constructionForm = new DictEntryForm();
        this.constructionForm.buttons[0].show();   //隐藏添加按钮
    	this.constructionForm.buttons[1].hide();   //显示修改按钮
        DictEntryInsertWindow.superclass.constructor.call(this, {
            title: "添加字典项",
            width: 400,
            anchor: '100%',
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});

/***************************************DictEntryUpdateWindow组件**************************************************/
DictEntryUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.constructionForm = new DictEntryForm();
    	this.constructionForm.buttons[0].hide();   //隐藏添加按钮
    	this.constructionForm.buttons[1].show();   //显示修改按钮
    	DictEntryUpdateWindow.superclass.constructor.call(this, {
        	title: "修改字典项",
            width: 400,
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});
/**************************DictEntryGrid*******************************************/
DictEntryGrid = Ext.extend(UxGrid, {
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
	dictTypeId:'',
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: DICT_ENTRY_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'id'},{name:'enabled'},{name:'orderIndex'},{name:'name'},{name:'code'}
            ])
        });
    	this.vbbar= new Ext.PagingToolbar({
            pageSize: PAGESIZE,
            store: this.store,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
            emptyMsg: "没有记录",
            scope:this,
            plugins: [new Ext.ux.ProgressBarPager()]
        });
		this.vbbar.items.removeAt(10);
        this.vbbar.items.removeAt(9);

    	this.vtbar = new Ext.Toolbar({
            items:[
                {text:'添加',iconCls: 'add',handler:this.onAddClick,scope:this},'-',
                {text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},'-',
            	{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this}
            ]
        });	
        this.constructionInsertWindow = new DictEntryInsertWindow();       
        this.constructionUpdateWindow = new DictEntryUpdateWindow();
        var sm = new Ext.grid.CheckboxSelectionModel(); 
        DictEntryGrid.superclass.constructor.call(this, {
        	region:'east',
        	title: '字典类型对应的字典项',
        	collapsible: true,
        	stripeRows: true,
            frame: true,
            width:470,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                                          sm,
                {header: "ID", width: 120, dataIndex: 'id',hidden: true},
		        {header: "字典项名称", width: 120, dataIndex: 'name'},
		        {header: "字典项编码", width: 120, dataIndex: 'code'},
				{header: "索引顺序", width: 100, dataIndex: 'orderIndex'}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store,
            listeners: {
                //"dblclick": { fn: this.onModifyClick, scope: this}, 		//响应双击事件
                //"rowcontextmenu": {fn: this.onRightMenuClick, scope: this}  //响应右击事件
            }
        });
    },
//    onRightMenuClick: function(grid, rowIndex, e) {//右键菜单
//        this.getSelectionModel().selectRow(rowIndex);
//        e.preventDefault();
//        this.rightMenu.showAt(e.getXY());
//    },
    onAddClick: function() {
    	if(this.dictTypeId ==null || this.dictTypeId ==''){
    		Ext.MessageBox.alert("提示", "请选择一条的记录！");
    		return false;
    	}
    	var win = this.constructionInsertWindow;
    	win.show();
    	win.constructionForm.getForm().reset();
    },
    onModifyClick: function() {
    	var records=this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   		    	var win = this.constructionUpdateWindow;
   		    	win.constructionForm.getForm().reset();
   		    	win.show();
   		    	win.constructionForm.getForm().loadRecord(vrecord);
   			}else{
   				Ext.Msg.alert('系统提示', '不能修改多条记录..');
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
				       	   url:'/dict/deleteDictEntries',
				       	   method : 'POST', 
				       	   params: { ids: valueStr},
			               success: function(form, action) { 
				               Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除成功!" + BLANKSTR);
				               dictEntryGrid.store.reload();
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
    sheetNoChange: function(value) {
    	return '<a href="javascript:void(0)" onclick=javascript:clickSheetNo('+value+')><b><font color=red>'+ value + '</font></b></a>';
    },
    clickSheetNo: function() {
    	alert(11);
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
    formatTime : function(val) {
    		var valStr = val.constructor == Date ? Ext.util.Format.date(val, 'Y-m-d H:i:s') : formatDate(new Date(val["time"]),"yyyy-MM-dd HH:mm:ss");    		
    		var valArr = valStr.split('-');
    		var valDate = new Date(valArr[0], valArr[1] - 1, valArr[2]);
    		return valStr;
    }
});

/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';
    //conditionForm = new ConditionForm();
    dictTypeGrid = new DictTypeGrid(Ext.getBody().getViewSize().height-160, Ext.getBody().getViewSize().width);
    dictTypeGrid.store.load({params:{start:0,limit:PAGESIZE}});
    
    dictEntryGrid = new DictEntryGrid(Ext.getBody().getViewSize().height-160, Ext.getBody().getViewSize().width);
//    constructionGridValue.store.load({params:{start:0,limit:PAGESIZE}});
    new Ext.Viewport({
    	layout: 'border',
    	items:[
		dictTypeGrid,
		dictEntryGrid
    	]
    });
    dictTypeGrid.constructionInsertWindow.show();
    dictTypeGrid.constructionInsertWindow.hide();
   
});