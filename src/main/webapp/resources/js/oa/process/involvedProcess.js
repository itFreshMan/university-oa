var INVOLVED_PROCESS_GRID_STORE_URL = '/oa/process/involvedProcess/list';
var PAGESIZE=20;

/**************************InvolvedProcessGrid*******************************************/
InvolvedProcessGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: INVOLVED_PROCESS_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'processDefinitionId'},{name:'processInstanceId'},{name:'businessKey'},{name:'activityId'},
            		{name:'activityName'},{name:'processFlag'},{name:'startTime'},{name:'endTime'},{name:'activityName'},
            		{name:'taskId'},{name:'title'},{name:'remark'},{name:'processKey'},{name:'status'},{name:'startUserName'}
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
            		involvedProcessGrid.store.baseParams = {processKey:processKey.getValue()};
            		involvedProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});
            	},scope:this}
            ]
        });
    	this.vbbar= this.createPagingToolbar(PAGESIZE);

        var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true}); 
        InvolvedProcessGrid.superclass.constructor.call(this, {
        	renderTo:Ext.getBody(),
        //	title: '已处理流程',
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
                {header:'业务主键',dataIndex:'businessKey',width:100,sortable: true, hidden:true},   
                {header:'流程类型',dataIndex:'processKey',width:100,sortable: true,
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
                {header:'申请人',dataIndex:'startUserName',width:90,sortable: true},  
                {header:'查看详情',dataIndex:'key',width:100,sortable: true,
                	renderer:function(value,metadata){
                		return '<a class="zlink" href="javascript:void(0)" onclick="involvedProcessGrid.viewProcessDetails();">查看详情</a>';
                	}
                },
                {header:'事由说明',dataIndex:'title',width:200,sortable: true},  
                {header:'备注',dataIndex:'remark',width:100,sortable: true}, 
                {header:'流程实例ID',dataIndex:'processInstanceId',width:100,sortable: true},               
                {header:'流程启动时间',dataIndex:'startTime',width:140,sortable: true},
            	{header:'流程结束时间',dataIndex:'endTime',width:140,sortable: true},
            	{header:'流程定义ID',dataIndex:'processDefinitionId',width:180,sortable: true,hidden:true},
            	{header:'当前节点',dataIndex:'activityName',width:140,sortable: true,
            		renderer:function(value, cellmeta, record){
            			var activityId = record.data.activityId;
            			if(activityId == null || activityId == "") {
            				return '<a class="redlink" title="点击查看流程图" href="javascript:void(0)" onclick="involvedProcessGrid.lookHisGraphTrace();">查看流程图</a>';
            			}else {
            				return '<a class="redlink" title="点击查看流程图" href="javascript:void(0)" onclick="involvedProcessGrid.lookGraphTrace();">' + value + '</a>';
            			}
            		}
            	},
            	{header:'流程状态',dataIndex:'processFlag',width:100,sortable: true,
            		renderer:function(value, cellmeta, record){
            			if(value == "1") {
            				return "<span style='color:green;font-weight:bold;'>流程已结束</span>";
            			}else if(value == "0") {
            				return "<span style='color:red;font-weight:bold;'>运行中</span>";
            			}else {
            				return value;
            			}
            		}
            	}            	
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    lookGraphTrace : function() {//查看流程图
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	window.open("/oa/process/showProcessTrack?historyFlag=0&processInstanceId=" + processInstanceId);    	
    },
    lookHisGraphTrace : function() {//查看历史流程图
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	window.open("/oa/process/showProcessTrack?historyFlag=1&processInstanceId=" + processInstanceId);    	    	
    },
    lookApproveTrace: function() {//查看申请信息及审批意见
    	var record = this.selectedRecord();
    	var businessKey = record.data.businessKey;
    	window.open("/oa/process/showProcessOption/" + businessKey);   
    },
    onQueryClick: function() {
		var customerId = Ext.getCmp("customerId_query").getValue();
		var custName = Ext.getCmp("custName_query").getValue();
		involvedProcessGrid.store.baseParams = {customerId:customerId, custName:custName};
		involvedProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});
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
    viewProcessDetails:function(){
    	var records=this.getSelectionModel().getSelections();
    	var vrecord = records[0];
    	var key = vrecord.get("processKey");
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
    
    involvedProcessGrid = new InvolvedProcessGrid(Ext.getBody().getViewSize().height, Ext.getBody().getViewSize().width);
    involvedProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});  
});