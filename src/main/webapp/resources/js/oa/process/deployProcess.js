var DEPLOY_PROCESS_GRID_STORE_URL = '/oa/process/getDeployProcessList';
var PAGESIZE=20;

/***************************************DeployForm组件***************************************************/
DeployForm = Ext.extend(Ext.ux.Form,{
	consName : null,
	consCode : null,
	queryButton : null,
    resetButton : null,
    
	constructor: function(){
		this.fileDesc = this.createLabel('<span style="color:blue;font-weight:bold;">支持文件格式</span>：<font color="red">zip、bar、bpmn、bpmn20.xml</font>');
		this.deploymentName = this.createTextField('<font color="red">*</font>流程名称:', 'deploymentName', '89%','流程名称');
		this.file = this.createFileUpload();
           	    
        DeployForm.superclass.constructor.call(this,{
        	fileUpload: true, //允许上传文件
            layout: 'tableform',
	        layoutConfig: {columns: 1},
	        autoWidth:true,
            height: 160,
            labelWidth: 75,
            frame: true,
            bodyStyle:"padding: 5px 5px 0",
            items:[
                   this.fileDesc,
                   this.deploymentName,
                   this.file
 			],
            buttonAlign :'center',
            buttons: [
               {text: '部署', width: 20,iconCls: 'save', hidden: false, handler: this.deployClick, scope: this},
               {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
            ]
		});
	},
	reset:function(){
	 	this.getForm().reset();
	},
    onCloseClick: function(){           //关闭
        this.ownerCt.hide();
    },
    createFileUpload: function() {
        var ta = new Ext.ux.form.FileUploadField({
            anchor:'100%',
            id: 'upload',
            allowBlank: false,
            blankText: '请选择一个流程文件...',
            emptyText: '请选择..',
            fieldLabel: '<font color="red">*</font>流程文件:',
            name: 'attachMentFile',
            buttonCfg: {
                text: '浏览'
            }
        });
        return ta;
    },
    createLabel: function(html) {
    	var label = new Ext.form.Label({
            width: 90,
            height: 40,
            html: html
        });
        return label;
    },	
	deployClick:function(){
        if(this.getForm().isValid()) {
            this.getForm().submit({
                waitMsg: '正在提交数据...',
                url: '/oa/process/deployProcess', 
                method: 'POST',
                success: function(form, action) { 
                    Ext.MessageBox.alert("系统提示:", BLANKSTR + "部署成功!" + BLANKSTR);
                    deployProcessGrid.deployWindow.hide();
                    deployProcessGrid.vbbar.doLoad(deployProcessGrid.vbbar.cursor);
                },
                failure: function(form, action) {
                    Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!原因：" + action.result.message + BLANKSTR);
                }
            });
        }		
	}
});

/***************************************DeployWindow组件**************************************************/
DeployWindow = Ext.extend(Ext.Window,{
	deployForm : null,
    constructor: function(grid) {
        this.deployForm = new DeployForm();
        DeployWindow.superclass.constructor.call(this, {
            title: "部署流程",
            width: 450,
            anchor: '100%',
            autoHeight:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.deployForm]
        });
    }
});



/**************************DeployProcessGrid*******************************************/
DeployProcessGrid = Ext.extend(UxGrid, {
	pageSizeCombo: null,
	vtbar:null,				//面板顶部的工具条	
	vbbar:null,				//面板底部的工具条
    store:null,
    constructor: function(height, width){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: DEPLOY_PROCESS_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'}, [
            		{name:'deploymentId'},{name:'key'},{name:'version'},{name:'category'},
            		{name:'resourceName'},{name:'description'},{name:'diagramResourceName'},{name:'suspensionState'},
            		{name:'deploymentTime'},{name:'processDefId'},{name:'name'}
            ])
        });
    	
    	this.vbbar= this.createPagingToolbar(PAGESIZE);
    	this.vtbar = new Ext.Toolbar({
            items:[
                '-',{text:'部署流程',iconCls: 'add',handler:this.onDeployClick,scope:this}
            ]
        });  	
    	this.deployWindow = new DeployWindow();  
        DeployProcessGrid.superclass.constructor.call(this, {
        	region:'center',
        	renderTo:Ext.getBody(),
        //	title: '部署流程列表',
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
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                {header:'流程定义ID',dataIndex:'processDefId',width:150,sortable: true},
                {header:'key',dataIndex:'key',width:150,sortable: true},
                {header:'deploymentId',dataIndex:'deploymentId',width:100,sortable: true,hidden:true},
            	{header:'名称',dataIndex:'name',width:150,sortable: true},
            	{header:'版本号',dataIndex:'version',width:50,sortable: true},
            	{header:'XML',dataIndex:'resourceName',width:150,sortable: true, 
                    renderer:function(value, cellmeta, record){
                    	var deploymentId = record.data.deploymentId;
                    	return '<a target="_blank" href="/oa/process/resource/read?deploymentId=' + deploymentId + '&name='+value+'">' + value + '</a>';
                    }
            	},
            	{header:'流程图',dataIndex:'diagramResourceName',width:150,sortable: true, 
                    renderer:function(value, cellmeta, record){
                    	var deploymentId = record.data.deploymentId;
                    	return '<a target="_blank" href="/oa/process/resource/read?deploymentId=' + deploymentId + '&name='+value+'">' + value + '</a>';
                    }
            	},
            	{header:'部署时间',dataIndex:'deploymentTime',width:140,sortable: true},
            	{header:'是否挂起',dataIndex:'suspensionState',width:80,sortable: true,  align:'center',
                    renderer:function(value){
                        if(value == true) {
                            return "<span style='color:red;font-weight:bold;'>挂起</span>";
                        }else if(value == false) {
                            return "<span style='color:blue;font-weight:bold;'>正常</span>";
                        }else{
                            return value;
                        }
                    }
            	},
            	{header:'操作',dataIndex:'opt',width:80,sortable: true, align:'center',
                    renderer:function(value, cellmeta, record){
                    	var suspensionState = record.data.suspensionState;
                    	var operations = '';
                        if(suspensionState == true) {
                        	operations = '<a class="redlink" href="javascript:void(0)" onclick="deployProcessGrid.activate();">激活</a>';
                        }else if(suspensionState == false) {
                        	operations =  '<a class="zlink" href="javascript:void(0)" onclick="deployProcessGrid.hangUp();">挂起</a>';
                        }
                        
//                        var delOperation =  '<a class="zlink" href="javascript:void(0)" onclick="deployProcessGrid.deleteProcessDefinition();"><font color="red">删除</font></a>';
//                        operations += '&nbsp;' +delOperation;
                        return operations
                    }
            	}
            ]),
            tbar: this.vtbar,
            bbar: this.vbbar,
            ds: this.store
        });
    },
    onDeployClick: function() {//部署流程
    	var win = this.deployWindow;
    	win.deployForm.getForm().reset();
    	win.show();
    },
    activate: function() {//激活流程
    	var record = this.selectedRecord();
    	var processDefinitionId = record.data.processDefId;
    	Ext.Msg.confirm("提醒信息", "确定要激活流程定义【" + processDefinitionId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/activateProcessDefinition',
			       	   method : 'POST', 
			       	   params: { processDefinitionId: processDefinitionId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "激活成功!" + BLANKSTR);
			               deployProcessGrid.vbbar.doLoad(deployProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "激活失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
    },
    hangUp: function() {//挂起流程
    	var record = this.selectedRecord();
    	var processDefinitionId = record.data.processDefId;
    	Ext.Msg.confirm("提醒信息", "确定要挂起流程定义【" + processDefinitionId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/suspendProcessDefinition',
			       	   method : 'POST', 
			       	   params: { processDefinitionId: processDefinitionId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "挂起成功!" + BLANKSTR);
			               deployProcessGrid.vbbar.doLoad(deployProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "挂起失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
    },
    deleteProcessDefinition: function() {//删除流程定义
    	var record = this.selectedRecord();
    	var processDefinitionId = record.data.processDefId;
    	Ext.Msg.confirm("提醒信息", "确定要删除流程定义【" + processDefinitionId + "】吗？",function(btn){
			if (btn == 'yes') {
		       	Ext.Ajax.request({
			       	   url:'/oa/process/deleteProcessDefinition',
			       	   method : 'POST', 
			       	   params: { processDefinitionId: processDefinitionId},
		               success: function(form, action) { 
			               Ext.MessageBox.alert("系统提示:", BLANKSTR + "删除成功!" + BLANKSTR);
			               deployProcessGrid.vbbar.doLoad(deployProcessGrid.vbbar.cursor);		               },
		               failure: function(form, action) {
		            	   Ext.MessageBox.alert("系统提示:", BLANKSTR + "挂起失败!" + BLANKSTR);
		               }
			       	});					
			}
    	});	
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


/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    
    deployProcessGrid = new DeployProcessGrid(Ext.getBody().getViewSize().height, Ext.getBody().getViewSize().width);
    deployProcessGrid.store.load({params:{start:0, limit:PAGESIZE}});
   
});