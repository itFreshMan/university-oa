var ENTITY_URL_LIST = "/sto/StoCheckorderDetails/pager";
var ENTITY_URL_SAVE = "/sto/StoCheckorderDetails/save";
var ENTITY_URL_UPDATE = "/sto/StoCheckorderDetails/update";
var ENTITY_URL_DELETE = "/sto/StoCheckorderDetails/delete";
var PAGESIZE=50;
/*
 * sto_checkorder_details 
 * @author 
 * @date 2015-01-14
 */
StoCheckorderDetails = Ext.extend(Ext.ux.Form,{
	constructor: function(){
		this.busiId = new Ext.form.NumberField({
            fieldLabel: '<font color="red">*</font>BUSI_ID',
            name: 'busiId',
            allowBlank: false,
            allowNegative :false,
            maxLength:19,
            maxLengthText:'长度超过不能10', 
            anchor: '95%',
            cls:'forbiddenZH',
            blankText: '该选项为必填项,请输入内容...'
        });
		this.checkorderId = new Ext.form.NumberField({
            fieldLabel: '<font color="red">*</font>CHECKORDER_ID',
            name: 'checkorderId',
            allowBlank: false,
            allowNegative :false,
            maxLength:19,
            maxLengthText:'长度超过不能10', 
            anchor: '95%',
            cls:'forbiddenZH',
            blankText: '该选项为必填项,请输入内容...'
        });
		this.checkTime = this.createDateField('<font color="red">*</font>CHECK_TIME','checkTime','Y-m-d','95%');
		this.checkTime.value = new Date().format('Ymd');
		this.checkUser = this.createTextField('<font color="red">*</font>CHECK_USER','checkUser','95%','',null,64,'长度超过不能64');
		this.checkType = new Ext.form.NumberField({
            fieldLabel: '1:检查,2:.加急',
            name: 'checkType',
            allowBlank: false,
            allowNegative :false,
            maxLength:10,
            maxLengthText:'长度超过不能10', 
            anchor: '95%',
            cls:'forbiddenZH',
            blankText: '该选项为必填项,请输入内容...'
        });
		this.checkContent = this.createTextField('CHECK_CONTENT','checkContent','95%','',null,512,'长度超过不能512');
		this.checkReply = this.createTextField('CHECK_REPLY','checkReply','95%','',null,512,'长度超过不能512');
		this.delFlag = new Ext.form.NumberField({
            fieldLabel: '0:未删除,1:已删除',
            name: 'delFlag',
            allowBlank: false,
            allowNegative :false,
            maxLength:10,
            maxLengthText:'长度超过不能10', 
            anchor: '95%',
            cls:'forbiddenZH',
            blankText: '该选项为必填项,请输入内容...'
        });
		
		this.checkType.allowBlank = true;
		this.checkContent.allowBlank = true;
		this.checkReply.allowBlank = true;
		this.delFlag.allowBlank = true;
        
        StoCheckorderDetails.superclass.constructor.call(this, {
	            anchor: '100%',
	            autoHeight:true,
	            labelWidth: 90,
	            labelAlign :'right',
	            frame: true,
	            bodyStyle:"padding: 5px 5px 0",
	            layout: 'tableform',
	            layoutConfig: {columns: 2},
	            items:[
					this.busiId,
					this.checkorderId,
					this.checkTime,
					this.checkUser,
					this.checkType,
					this.checkContent,
					this.checkReply,
					this.delFlag
	            ],
	            buttonAlign :'center',
	            buttons: [
	               {text: '保存', width: 20,iconCls: 'save', hidden: false,handler:this.addFormClick,scope:this},
	               {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
	               {text: '重置', width: 20,iconCls:'redo', hidden: true, handler: this.onResumeClick, scope: this},               
	               {text: '清空', width: 20, iconCls:'redo',  handler: this.resetFormClick, scope: this},
	               {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
	            ]
	        });
	},
	addFormClick: function(){
		if(this.getForm().isValid()){
			this.getForm().submit({
				waitMsg: '正在提交数据...',
				url: ENTITY_URL_SAVE,
				method: 'POST',
				success: function(form,action){
					Ext.Msg.alert("系统提示：","添加成功！");
					stoCheckorderDetailsGrid.store.load({params:{start:0,limit:PAGESIZE}});
					stoCheckorderDetailsGrid.stoCheckorderDetailsWindow.hide();
					
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",action.result.message);
				}
			});
		}
	},
	updateFormClick: function(){
		if(this.getForm().isValid()){
			this.getForm().submit({
				waitMsg: '正在提交，请稍后...',
				url: ENTITY_URL_UPDATE,
				method: 'POST',
				success: function(form,action){
					Ext.MessageBox.alert("系统提示：","修改成功！");
					stoCheckorderDetailsGrid.stoCheckorderDetailsUpdateWindow.hide();
					stoCheckorderDetailsGrid.vbbar.doLoad(stoCheckorderDetailsGrid.vbbar.cursor);
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",action.result.message);
				}
			});
		}
	},
	//关闭
    onCloseClick: function(){
    	if(stoCheckorderDetailsGrid.stoCheckorderDetailsUpdateWindow)
    	stoCheckorderDetailsGrid.stoCheckorderDetailsUpdateWindow.stoCheckorderDetails.getForm().reset();
        this.ownerCt.hide();
    },
  //清空
    resetFormClick: function() {        
        this.getForm().reset();
    }, 
  //重置
    onResumeClick: function() {        
    	stoCheckorderDetailsGrid.onModifyClick();
    }
	
});

/**************StoCheckorderDetailsWindow*********************/
StoCheckorderDetailsWindow = Ext.extend(Ext.Window,{
	
	constructor: function(grid){
		this.stoCheckorderDetails = new StoCheckorderDetails();
		StoCheckorderDetailsWindow.superclass.constructor.call(this,{
			title: '新增',
			 width: 700,
			 anchor: '100%',
			autoHeight:true,
			resizable : false, //可变尺寸的；可调整大小的
			 plain: true,
			 modal: true,
			closeAction: 'hide',
			items:[this.stoCheckorderDetails]
		});
	}
});

/********************StoCheckorderDetailsUpdateWindow组件*************************/
StoCheckorderDetailsUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.stoCheckorderDetails = new StoCheckorderDetails();
    	this.stoCheckorderDetails.buttons[0].hide();   //隐藏添加按钮
    	this.stoCheckorderDetails.buttons[1].show();   //显示修改按钮
    	this.stoCheckorderDetails.buttons[2].show();   //显示重置按钮
    	this.stoCheckorderDetails.buttons[3].hide();   //隐藏清空按钮
    	
    	StoCheckorderDetailsUpdateWindow.superclass.constructor.call(this, {
			title: '修改',
			width: 700,
			anchor: '100%',
			autoHeight: true,
			resizable: false,
			plain: true,
			modal: true,
			closeAction: 'hide',
            items: [this.stoCheckorderDetails]
        });
    }
});

/****************StoCheckorderDetailsGrid***********************/
StoCheckorderDetailsGrid = Ext.extend(UxGrid,{
	constructor: function(height,width){
		this.store = new Ext.data.Store({
			
			proxy: new Ext.data.HttpProxy({url:ENTITY_URL_LIST,method:'POST'}),
			reader: new Ext.data.JsonReader({totalProperty:'total',root:'rows'},[
		            {name:'busiId'},
		            {name:'checkorderId'},
		            {name:'checkTime'},
		            {name:'checkUser'},
		            {name:'checkType'},
		            {name:'checkContent'},
		            {name:'checkReply'},
		            {name:'delFlag'}
					 ])
		});
		this.vtbar = new Ext.Toolbar({
			items: [
			       '-',{xtype:'button',text:'添加',iconCls:'add',handler:this.onAddClick,scope:this}, 
			       '-',{xtype:'button',text:'修改',iconCls:'edit',handler:this.onModifyClick,scope:this}, 
			       '-',{xtype:'button',text:'删除',iconCls:'delete',handler:this.onDeleteClick,scope:this},
					'-',{xtype:'label',text:'BUSI_ID'},{xtype:'textfield',id:'Q_busiId_L_EQ'},
					'-',{xtype:'label',text:'CHECKORDER_ID'},{xtype:'textfield',id:'Q_checkorderId_L_EQ'},
					'-',{xtype:'label',text:'CHECK_TIME'},{xtype:'datefield',format:'Ymd',id:'Q_checkTime_D_GT',editable : false,value:new Date().format('Ymd')},
					'-',{xtype:'label',text:'CHECK_USER'},{xtype:'textfield',id:'Q_checkUser_S_LK'},
					//'-',{xtype:'label',text:'1:检查,2:.加急'},{xtype:'textfield',id:'Q_checkType_N_EQ'},
					//'-',{xtype:'label',text:'CHECK_CONTENT'},{xtype:'textfield',id:'Q_checkContent_S_LK'},
					//'-',{xtype:'label',text:'CHECK_REPLY'},{xtype:'textfield',id:'Q_checkReply_S_LK'},
					//'-',{xtype:'label',text:'0:未删除,1:已删除'},{xtype:'textfield',id:'Q_delFlag_N_EQ'},
			       '-',{xtype:'button',text:'查询',iconCls:'query',handler:function(){
			       			var params = {};
			       			stoCheckorderDetailsGrid.vtbar.items.each(function(item,index,length){ 
		       					if((""+item.getXType()).indexOf("field") != -1 && item.getValue() != '') {
		       						if (item.getXType() == 'datefield') {
		       							params[item.getId()] = item.getValue().format(item.format);
		       						} else {
		       							params[item.getId()] = item.getValue();
		       						}
		       					}
							});
	    	   				stoCheckorderDetailsGrid.store.baseParams= params;
	    	   				stoCheckorderDetailsGrid.store.load({params:{start:0,limit:PAGESIZE}});
	    	   			}
	       			},
					'-',{xtype:'button',text:'重置',iconCls:'refresh',handler:function(){
						stoCheckorderDetailsGrid.vtbar.items.each(function(item,index,length){   
							if((""+item.getXType()).indexOf("field") != -1) {
								item.setValue('');
							}
						  });  
    	   			}}
			]
		});
		this.vbbar = this.createPagingToolbar(PAGESIZE);

		this.vsm = new Ext.grid.CheckboxSelectionModel();
		this.vcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		             this.vsm,
		            {header:'BUSI_ID',dataIndex:'busiId',width:100,sortable:true,hidden:false},
		            {header:'CHECKORDER_ID',dataIndex:'checkorderId',width:100,sortable:true,hidden:false},
		            {header:'CHECK_TIME',dataIndex:'checkTime',width:100,sortable:true,hidden:false},
		            {header:'CHECK_USER',dataIndex:'checkUser',width:100,sortable:true,hidden:false},
		            {header:'1:检查,2:.加急',dataIndex:'checkType',width:100,sortable:true,hidden:false},
		            {header:'CHECK_CONTENT',dataIndex:'checkContent',width:100,sortable:true,hidden:false},
		            {header:'CHECK_REPLY',dataIndex:'checkReply',width:100,sortable:true,hidden:false},
		            {header:'0:未删除,1:已删除',dataIndex:'delFlag',width:100,sortable:true,hidden:false}
		           ]);
		StoCheckorderDetailsGrid.superclass.constructor.call(this,{
			region: 'center',
			frame: true,
			height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: new Ext.LoadMask(document.body,{ 
				msg: '正在载入数据，请稍后...',
				store   : this.store
			}),
			sm: this.vsm,
			cm: this.vcm,
			tbar: this.vtbar,
			bbar: this.vbbar,
			ds: this.store
		});
	},
    onAddClick: function(){
    	if(!this.stoCheckorderDetailsWindow)
    		this.stoCheckorderDetailsWindow = new StoCheckorderDetailsWindow();
    	var win = this.stoCheckorderDetailsWindow;
		win.show();
		win.stoCheckorderDetails.getForm().reset();
    },
    onModifyClick: function() {
    	var records = this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   				
   				if(!this.stoCheckorderDetailsUpdateWindow)
					this.stoCheckorderDetailsUpdateWindow = new StoCheckorderDetailsUpdateWindow();
   				
   		    	var win = this.stoCheckorderDetailsUpdateWindow;
				var winForm = win.stoCheckorderDetails;
				
				win.show();
							
   		    	winForm.busiId.setValue(vrecord.data['busiId']);
				winForm.checkorderId.setValue(vrecord.data.checkorderId);
				winForm.checkTime.setValue(vrecord.data.checkTime);
				winForm.checkUser.setValue(vrecord.data.checkUser);
				winForm.checkType.setValue(vrecord.data.checkType);
				winForm.checkContent.setValue(vrecord.data.checkContent);
				winForm.checkReply.setValue(vrecord.data.checkReply);
				winForm.delFlag.setValue(vrecord.data.delFlag);
   		    	
   			}else{
   				Ext.Msg.alert('系统提示','不能修改多条记录！');
   			}
   		}else{
   			Ext.Msg.alert('系统提示','请选择一条记录！');
   		}    	
    },
    onDeleteClick: function(){
    	var records = this.getSelectionModel().getSelections();
    	var ids = {};
		var valueStr = [];
    	for(var i=0;i<records.length;i++){
    		valueStr.push(records[i].get('busiId'));
    	}
		ids['ids'] = valueStr;
		
    	if(records.length>0){
    		Ext.Msg.confirm('系统提示：',"确定删除这"+records.length+"条信息吗？",function(btn){
    			if(btn == 'yes'){
    				Ext.Ajax.request({
    					url: ENTITY_URL_DELETE,
    					method: 'POST',
    					params: ids,
    					success: function(form,action){
    						Ext.Msg.alert('系统提示','删除成功！');
    						stoCheckorderDetailsGrid.vbbar.doLoad(stoCheckorderDetailsGrid.vbbar.cursor);
    					},
    					failure: function(form,action){
							Ext.MessageBox.alert("系统提示：",action.result.message);
						}
    				});
    			}
    		});
    	}else{
    		Ext.Msg.alert('系统提示','请选择一条记录！');
    	}
    }
});

/*************onReady组件渲染处理***********************/
Ext.onReady(function(){
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    
    stoCheckorderDetailsGrid = new StoCheckorderDetailsGrid(Ext.getBody().getViewSize().height);
    stoCheckorderDetailsGrid.store.load({params:{start:0,limit:PAGESIZE}});
	new Ext.Viewport({
		layout: 'border',
		items: [
		        stoCheckorderDetailsGrid   
		]
	});
});

