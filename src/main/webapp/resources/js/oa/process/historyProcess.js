//需要补充的空格
var BLANKSTR = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';   
var HISTORY_PROCESS_GRID_STORE_URL = '/oa/process/historyProcess/list';
var PAGESIZE=20;

/**************************HistoryProcessGrid*******************************************/
HistoryProcessGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: HISTORY_PROCESS_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'processDefinitionId'},{name:'processInstanceId'},{name:'businessKey'},{name:'activityId'},
            		{name:'suspensionState'},{name:'isEnded'},{name:'id'},{name:'key'},{name:'title'},{name:'userName'},
            		{name:'remark'},{name:'activityName'},{name:'startTime'},{name:'endTime'},{name:'status'}
            ])
        });

    	var processKey = new Ext.form.ComboBox({
            fieldLabel: '流程类型',
            emptyText: '请选择...',
            width: 200,
            mode: 'local',
            name: 'code',
            forceSelection: true,
            triggerAction: 'all',
            displayField:'name',
            valueField:'code',
            editable:false,
            store: new Ext.data.Store({
                proxy: new Ext.data.MemoryProxy(PROCESS_KEY_QUERY),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:'code'},{name:'name'}]))
            })
        });
    	processKey.store.load();
    	this.vtbar = new Ext.Toolbar({
            items:[
            	{xtype : 'label', text : '流程类型：'},processKey,
            	'-',{text:'查询',iconCls: 'query',handler:function() {
            		historyProcessGrid.store.baseParams = {processKey:processKey.getValue()};
            		historyProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});
            	},scope:this}
            ]
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);

        var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true}); 
        HistoryProcessGrid.superclass.constructor.call(this, {
        	renderTo:Ext.getBody(),
        	//title: '历史流程',
        	stripeRows: true,
            frame: false,
            height: height,
            width:width,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: sm,
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                                          sm,
                {header:'流程类型',dataIndex:'key',width:100,sortable: true,
	          		renderer:function(value, cellmeta, record){
	          			if(value == 'leaveBill') {
	          				return "<span style='color:#DB9370;font-weight:bold;'>请假流程</span>";
	          			}else {
	          				return value;
	          			}
	          		}
	            },
                {header:'业务状态',dataIndex:'status',width:100,sortable: true,
	          		renderer:function(value, cellmeta, record){
	          			if(value == '0') {
	          				return "<span style='color:#DB9370;font-weight:bold;'>初始状态</span>";
	          			}else if(value == '1') {
	          				return "<span style='color:green;font-weight:bold;'>审批中</span>";
	          			}else if(value == '2') {
	          				return "<span style='color:blue;font-weight:bold;'>审批通过</span>";
	          			}else if(value == '3') {
	          				return "<span style='color:red;font-weight:bold;'>审批未通过</span>";
	          			}else if(value == '4') {
	          				return "<span style='color:#FF00FF;font-weight:bold;'>强制结束</span>";
	          			}else {
	          				return value;
	          			}
	          		}
                },               
                {header:'查看详情',dataIndex:'key',width:100,sortable: true,
                	renderer:function(value,metadata){
                		return '<a class="zlink" href="javascript:void(0)" onclick="historyProcessGrid.viewProcessDetails();">查看详情</a>';
                	}
                },
	            {header:'事由说明',dataIndex:'title',width:180,sortable: true,
	            	renderer:function(value,metadata){
                		if(value != null) {
                    		var svalue = value.replace(/\s+/g,"");
                    		metadata.attr = 'ext:qtitle="" ext:qtip=' + svalue;                			
                		}
	            		return value;
	            	}
	            },
	            {header:'备注',dataIndex:'remark',width:200,sortable: true,
	            	renderer:function(value,metadata){
                		if(value != null) {
                    		var svalue = value.replace(/\s+/g,"");
                    		metadata.attr = 'ext:qtitle="" ext:qtip=' + svalue;                			
                		}
	            		return value;
	            	}
	            },
	            {header:'流程启动人',dataIndex:'userName',width:100,sortable: true},
	        	{header:'流程实例ID',dataIndex:'processInstanceId',width:100,sortable: true},
	            {header:'流程启动时间',dataIndex:'startTime',width:140,sortable: true},
	        	{header:'流程结束时间',dataIndex:'endTime',width:140,sortable: true},            	
	        	{header:'流程定义ID',dataIndex:'processDefinitionId',width:180,sortable: true, hidden:true}
            ]),
            tbar:this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    lookGraphTrace : function() {//查看流程图
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	window.open("/cps/process/showProcessTrack?historyFlag=1&processInstanceId=" + processInstanceId);    	
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
    lookApproveTrace: function() {//查看申请信息及审批意见
    	var record = this.selectedRecord();
    	var businessKey = record.data.businessKey;
    	window.open("/cps/process/showProcessOption/" + businessKey);   
    },
    viewProcessDetails:function(){
    	var records=this.getSelectionModel().getSelections();
    	var vrecord = records[0];
    	var key = vrecord.get("key");
    	var businessKey = vrecord.get("businessKey");
    	if(key == 'leaveBill') {
			var url = "/oa/leave/showLeaveBillProcessOption?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("请假流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}
    }
});

ProcessDetailsViewWindow = Ext.extend(Ext.Window,{
    constructor: function(grid) {
    	ProcessDetailsViewWindow.superclass.constructor.call(this, {
            width: 800,
            anchor: '100%',
            maximized :true,
            height: 400,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'close',
            buttonAlign: 'center',
            buttons: [
                      { text: '关闭', handler:function(){
                    	  DETAILS_VIEW_WINDOW.close();
                      } }
                  ],
            html:'<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=""></iframe>'
        });
    }
});

/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    
    historyProcessGrid = new HistoryProcessGrid(Ext.getBody().getViewSize().height, Ext.getBody().getViewSize().width);
    historyProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});  
});