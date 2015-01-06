//需要补充的空格
var BLANKSTR = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';   
var RUNNING_PROCESS_GRID_STORE_URL = '/oa/process/runningProcess/list';
var PAGESIZE=20;

/**************************RunningProcessGrid*******************************************/
RunningProcessGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: RUNNING_PROCESS_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
            		{name:'processDefinitionId'},{name:'processInstanceId'},{name:'businessKey'},{name:'activityId'},
            		{name:'suspensionState'},{name:'isEnded'},{name:'id'},{name:'activityName'},{name:'userName'},
            		{name:'processKey'},{name:'startTime'},{name:'title'},{name:'remark'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);

        var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true}); 
        RunningProcessGrid.superclass.constructor.call(this, {
        	renderTo:Ext.getBody(),
     //   	title: '运行中流程',
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
	            {header:'流程类型',dataIndex:'processKey',width:100,sortable: true,
	          		renderer:function(value, cellmeta, record){
	          			if(value == 'dispatchProcess') {
	          				return "<span style='color:#DB9370;font-weight:bold;'>出差派遣</span>";
	          			}else if(value == 'leaveProcess') {
	          				return "<span style='color:green;font-weight:bold;'>请假</span>";
	          			}else if(value == 'overTimeProcess') {
	          				return "<span style='color:red;font-weight:bold;'>加班</span>";
	          			}else if(value == 'paymentProcess') {
	          				return "<span style='color:blue;font-weight:bold;'>费用报销</span>";
	          			}else if(value == 'dispatchReturnProcess') {
	          				return "<span style='color:#800080;font-weight:bold;'>派遣返回流程</span>";
	          			}else if(value == 'borrowMoneyProcess') {
	          				return "<span style='color:#8A2BE2;font-weight:bold;'>出差借款流程</span>";
	          			}else {
	          				return value;
	          			}
	          		}
	            },               
                {header:'查看详情',dataIndex:'key',width:100,sortable: true,
                	renderer:function(value,metadata){
                		return '<a class="zlink" href="javascript:void(0)" onclick="runningProcessGrid.viewProcessDetails();">查看详情</a>';
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
            	{header:'流程实例ID',dataIndex:'processInstanceId',width:100,sortable: true, hidden:true},
            	{header:'流程启动人',dataIndex:'userName',width:100,sortable: true},
                {header:'流程启动时间',dataIndex:'startTime',width:140,sortable: true},
            	{header:'流程定义ID',dataIndex:'processDefinitionId',width:180,sortable: true, hidden:true},
            	{header:'当前节点',dataIndex:'activityName',width:140,sortable: true},
            	{header:'是否挂起',dataIndex:'suspensionState',width:80,sortable: true,
            		renderer:function(value, cellmeta, record){
            			if(value == false) {
                			return "<span style='color:green;font-weight:bold;'>正常</span>";
            			}else if(value == true) {
                			return "<span style='color:red;font-weight:bold;'>挂起</span>";
            			}else {
                			return value;
            			}
            		}
            	},
//            	{header:'操作',dataIndex:'opt',width:60,sortable: true,
//            		renderer:function(value, cellmeta, record){
//            			var suspensionState = record.data.suspensionState;
//            			if(suspensionState == true) {
//            				return '<a class="redlink" href="javascript:void(0)" onclick="runningProcessGrid.activate();">激活</a>';
//            			}else {
//            				return '<a class="zlink" href="javascript:void(0)" onclick="runningProcessGrid.hangUp();">挂起</a>';
//            			}
//            		}
//            	},
            	{header:'强制结束',dataIndex:'forceOver',width:60,sortable: true,
            		renderer:function(value, cellmeta, record){
            			return '<a class="zlink" href="javascript:void(0)" onclick="runningProcessGrid.forceOver();">强制结束</a>';
            		}
            	}
            ]),
            bbar: this.vbbar,
            ds: this.store
        });
    },
    activate: function() {//激活流程
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	Ext.Msg.confirm("提醒信息", "确定要激活流程实例【" + processInstanceId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/activateProcessInst',
			       	   method : 'POST', 
			       	   params: { processInstanceId: processInstanceId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "激活成功!" + BLANKSTR);
			               runningProcessGrid.vbbar.doLoad(runningProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "激活失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
    },
    hangUp: function() {//挂起流程
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	Ext.Msg.confirm("提醒信息", "确定要挂起流程实例【" + processInstanceId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/suspendProcessInst',
			       	   method : 'POST', 
			       	   params: { processInstanceId: processInstanceId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "挂起成功!" + BLANKSTR);
			               runningProcessGrid.vbbar.doLoad(runningProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "挂起失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
    },
    forceOver: function() {//强制结束流程
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	var processKey = record.data.processKey;
    	Ext.Msg.confirm("提醒信息", "确定要强制结束流程实例【" + processInstanceId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/forceOverProcess',
			       	   method : 'POST', 
			       	   params: { processKey:processKey, processInstanceId: processInstanceId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "强制结束成功!" + BLANKSTR);
			               runningProcessGrid.vbbar.doLoad(runningProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "强制结束失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
    },
    lookGraphTrace : function() {//查看流程图
    	var record = this.selectedRecord();
    	var processInstanceId = record.data.processInstanceId;
    	window.open("/oa/process/showProcessTrack?hisFlag=0&processInstanceId=" + processInstanceId);
    },
    lookApproveTrace: function() {//查看申请信息及审批意见
    	var record = this.selectedRecord();
    	var businessKey = record.data.businessKey;
    	window.open("/oa/process/showProcessOption/" + businessKey);   
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
		if(key == 'dispatchProcess') {
			var url = "/oa/dispatch/showDispatchProcessOption?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("出差流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}else if(key == 'leaveProcess') {
			var url = "/oa/holiday/holidayView?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("请假流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}else if(key == 'overTimeProcess') {
			var url = "/oa/overtime/showOvertimeProcessOption?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("加班流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}else if(key == 'dispatchReturnProcess') {
			var url = "/oa/dispatch/showReturnProcessOption?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("出差返回流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}else if(key == 'paymentProcess'){
			var url = "/oa/costBaoXiao/showPaymentProcessOption?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("费用报销流程"+businessKey+"---详情 ");
			DETAILS_VIEW_WINDOW.html = html;
			DETAILS_VIEW_WINDOW.show();
		}else if(key == 'borrowMoneyProcess'){
			var url = "/oa/borrow/borrowView?businessKey="+businessKey;
			var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
			DETAILS_VIEW_WINDOW = new ProcessDetailsViewWindow();
			DETAILS_VIEW_WINDOW.setTitle("出差借款流程"+businessKey+"---详情 ");
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
    
    runningProcessGrid = new RunningProcessGrid(Ext.getBody().getViewSize().height, Ext.getBody().getViewSize().width);
    runningProcessGrid.store.load({params:{start:0,limit:PAGESIZE}});  
});