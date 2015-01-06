var BUSILOG_GRID_STORE_URL = '/busiLog/getBusiLogList';
var PAGESIZE=20;
var OPTTYPE_DATA = [{'id':'1', 'name':'增加'},{'id':'2', 'name':'修改'},{'id':'3', 'name':'删除'},{'id':'4', 'name':'查询'}]; 
/***************************************ConditionForm组件***************************************************/
ConditionForm = Ext.extend(Ext.ux.Form,{
	testName : null,
	email : null,
	queryButton : null,
    resetButton : null,
    
	constructor: function(){
		this.optType = this.createMemoryCombo('操作类型:','id','name','93%',OPTTYPE_DATA);
		this.optUser= this.createTextField('操作人:', 'optUser', '93%');
        this.startDate 	= this.createDateField('开始日期:', 'startDate', 'Y-m-d', '93%');
        this.endDate 	= this.createDateField('结束日期:', 'endDate', 'Y-m-d', '93%');
		this.queryButton=this.createButton('查询',"query", this.onQuery,this);
        this.resetButton=this.createButton('重置',"refresh", this.reset,this);
            
        this.optType.store.load();
	    this.optType.allowBlank = true;
        this.optUser.allowBlank = true;
        this.startDate.allowBlank = true;
        this.endDate.allowBlank = true;
	    
		ConditionForm.superclass.constructor.call(this,{
		 	region:'north',
        	title: '查询条件',
            layout: 'tableform',
	        layoutConfig: {columns: 2},
	        autoWidth:true,
            height: 125,
            labelWidth: 60,
            frame: true,
            bodyStyle:"padding: 5px 5px 0",
            items:[
                   this.optType,
                   this.optUser,
                   this.startDate,
                   this.endDate
 			],
 			buttonAlign:'center',
 			buttons:[
				   this.queryButton,
				   this.resetButton
 			]
		});
	},
	reset:function(){
	 	this.getForm().reset();
	},	
	onQuery:function(){
		if(!this.getForm().isValid()){
			return;
		}
		var testName			=this.testName.getValue();
		var email				=this.email.getValue();
		userGrid.store.baseParams = {testName:testName, email:email}; 
		userGrid.store.load({params: {start: 0, limit: PAGESIZE}});
	},
	createButton: function(text,iconCls,fn,scope) {
    	var btn = new Ext.Button({
    		align: 'left',
    		text: text,
    		iconCls: iconCls,
    		handler: fn,
    		scope: scope
    	});
    	return btn;
    },
	createDateFieldX: function(fieldLabel, name, format, anchor, minText, value) {
    	var df =  new Ext.form.DateField({
			fieldLabel: fieldLabel,
			name: name,
			value : value,
			anchor: anchor,
			minText: minText,
			format: format,
			allowBlank: false,
			blankText: '请选择时间'
		});
		return df;
    }
});

/**************************BusiLogGrid*******************************************/
BusiLogGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: BUSILOG_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'logId'},{name:'optType'},{name:'optContent'},{name:'userName'},{name:'optTime'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
  	
        BusiLogGrid.superclass.constructor.call(this, {
        	region:'center',
        	title: '业务日志列表',
        	stripeRows: true,
        	autoExpandColumn: 'optContent',
            frame: true,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                {header:'ID',dataIndex:'logId',width:100,sortable: true,hidden:true},
                {header:'操作人',dataIndex:'userName',width:100,sortable: true},
            	{header:'操作类型',dataIndex:'optType',width:80,sortable: true, 
                    renderer:function(value){
                        if(value == '1') {
                            return "<span style='color:blue;font-weight:bold;'>新增</span>";
                        }else if(value == '2') {
                            return "<span style='color:#9966CC;font-weight:bold;'>修改</span>";
                        }else if(value == '3') {
                            return "<span style='color:red;font-weight:bold;'>删除</span>";
                        }else if(value == '4') {
                            return "<span style='color:green;font-weight:bold;'>查询</span>";
                        }else{
                            return value;
                        }
                    }
                },
            	{header:'操作时间',dataIndex:'optTime',width:140,sortable: true},
            	{header:'操作内容',dataIndex:'optContent',width:100,sortable: true,id:'optContent',
                	renderer:function(value,metadata){
                		metadata.attr = 'ext:qtitle="" ext:qtip=' + value;
                		return value;
                	}
            	}
            ]),
            bbar: this.vbbar,
            ds: this.store
        });
    },
    sheetNoChange: function(value) {
    	return '<a href="javascript:void(0)" onclick=javascript:clickSheetNo('+value+')><b><font color=red>'+ value + '</font></b></a>';
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
    
    conditionForm = new ConditionForm();
    busiLogGrid = new BusiLogGrid();
    busiLogGrid.store.load({params:{start:0,limit:PAGESIZE}});
    new Ext.Viewport({
    	layout: 'border',
    	items:[
		conditionForm,
		busiLogGrid
    	]
    });
   
});