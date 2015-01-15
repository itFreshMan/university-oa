var ENTITY_URL_LIST = "/sto/StoCheckorderTitle/pageFindCheckorderTitles";
var ENTITY_URL_SAVE = "/sto/StoCheckorderTitle/save";
var ENTITY_URL_UPDATE = "/sto/StoCheckorderTitle/update";
var ENTITY_URL_DELETE = "/sto/StoCheckorderTitle/delete";
var PAGESIZE=50;
/*
 * sto_checkorder_title 
 * @author 
 * @date 2015-01-14
 */
StoCheckorderTitle = Ext.extend(Ext.ux.Form,{
	constructor: function(){
		this.busiId = this.createHidden('ID', 'busiId', '95%');
		this.titleCode = this.createTextField('<font color="red">*</font>编码','titleCode','95%','',null,8,'长度超过不能8');
		this.titleContent = this.createTextField('<font color="red">*</font>名称','titleContent','95%','',null,32,'长度超过不能32');
        
		this.expirationDays = this.createNumberField('<font color="red">*</font>过期日期(天)', 'expirationDays', '95%',2,'长度超过不能2');
		this.expirationDays.allowBlank = false;
		this.expirationDays.allowNegative = false;//只允许正数
        StoCheckorderTitle.superclass.constructor.call(this, {
	            anchor: '100%',
	            autoHeight:true,
	            labelWidth: 90,
	            labelAlign :'right',
	            frame: true,
	            bodyStyle:"padding: 5px 5px 0",
//	            layout: 'tableform',
	            items:[
					this.titleCode,
					this.titleContent,
					this.expirationDays,
					this.busiId,
	            ],
	            buttonAlign :'center',
	            buttons: [
	               {text: '保存', width: 20,iconCls: 'save', hidden: false,handler:this.addFormClick,scope:this},
	               {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
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
					stoCheckorderTitleGrid.store.load({params:{start:0,limit:PAGESIZE}});
					stoCheckorderTitleGrid.stoCheckorderTitleWindow.hide();
					
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
					stoCheckorderTitleGrid.stoCheckorderTitleUpdateWindow.hide();
					stoCheckorderTitleGrid.vbbar.doLoad(stoCheckorderTitleGrid.vbbar.cursor);
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",action.result.message);
				}
			});
		}
	},
	//关闭
    onCloseClick: function(){
    	if(stoCheckorderTitleGrid.stoCheckorderTitleUpdateWindow)
    	stoCheckorderTitleGrid.stoCheckorderTitleUpdateWindow.stoCheckorderTitle.getForm().reset();
        this.ownerCt.hide();
    },
  //清空
    resetFormClick: function() {        
        this.getForm().reset();
    }, 
  //重置
    onResumeClick: function() {        
    	stoCheckorderTitleGrid.onModifyClick();
    }
	
});

/**************StoCheckorderTitleWindow*********************/
StoCheckorderTitleWindow = Ext.extend(Ext.Window,{
	
	constructor: function(grid){
		this.stoCheckorderTitle = new StoCheckorderTitle();
		StoCheckorderTitleWindow.superclass.constructor.call(this,{
			title: '新增',
			 width: 450,
			 anchor: '100%',
			autoHeight:true,
			resizable : false, //可变尺寸的；可调整大小的
			 plain: true,
			 modal: true,
			closeAction: 'hide',
			items:[this.stoCheckorderTitle]
		});
	}
});

/********************StoCheckorderTitleUpdateWindow组件*************************/
StoCheckorderTitleUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.stoCheckorderTitle = new StoCheckorderTitle();
    	this.stoCheckorderTitle.buttons[0].hide();   //隐藏添加按钮
    	this.stoCheckorderTitle.buttons[1].show();   //显示修改按钮
    	
    	StoCheckorderTitleUpdateWindow.superclass.constructor.call(this, {
			title: '修改',
			width: 450,
			anchor: '100%',
			autoHeight: true,
			resizable: false,
			plain: true,
			modal: true,
			closeAction: 'hide',
            items: [this.stoCheckorderTitle]
        });
    }
});

/****************StoCheckorderTitleGrid***********************/
StoCheckorderTitleGrid = Ext.extend(UxGrid,{
	constructor: function(height,width){
		this.store = new Ext.data.Store({
			
			proxy: new Ext.data.HttpProxy({url:ENTITY_URL_LIST,method:'POST'}),
			reader: new Ext.data.JsonReader({totalProperty:'total',root:'rows'},[
		            {name:'busiId'},
		            {name:'titleCode'},
		            {name:'titleContent'},
		            {name:'expirationDays'},
		            {name:'delFlag'}
					 ])
		});
		this.vtbar = new Ext.Toolbar({
			items: [
			       '-',{xtype:'button',text:'添加',iconCls:'add',handler:this.onAddClick,scope:this}, 
			       '-',{xtype:'button',text:'修改',iconCls:'edit',handler:this.onModifyClick,scope:this}, 
			       '-',{xtype:'button',text:'删除',iconCls:'delete',handler:this.onDeleteClick,scope:this},
					'-',{xtype:'label',text:'编码'},{xtype:'textfield',id:'Search_titleCode'},
					'-',{xtype:'label',text:'名称'},{xtype:'textfield',id:'Search_titleContent'},
			       '-',{xtype:'button',text:'查询',iconCls:'query',handler:function(){
			       			var params = {};
			       			var titleCode = Ext.getCmp('Search_titleCode').getValue();
			       			params['titleCode'] = titleCode;
			       			var titleContent = Ext.getCmp('Search_titleContent').getValue();
			       			params['titleContent'] = titleContent;
	    	   				stoCheckorderTitleGrid.store.baseParams= params;
	    	   				stoCheckorderTitleGrid.store.load({params:{start:0,limit:PAGESIZE}});
	    	   			}
	       			},
					'-',{xtype:'button',text:'重置',iconCls:'refresh',handler:function(){
						stoCheckorderTitleGrid.vtbar.items.each(function(item,index,length){   
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
		            {header:'BUSI_ID',dataIndex:'busiId',width:100,sortable:true,hidden:true},
		            {header:'编码',dataIndex:'titleCode',width:100,sortable:true,hidden:false},
		            {header:'名称',dataIndex:'titleContent',width:100,sortable:true,hidden:false},
		            {header:'过期日期',dataIndex:'expirationDays',width:100,sortable:true,hidden:false}
		           ]);
		StoCheckorderTitleGrid.superclass.constructor.call(this,{
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
    	if(!this.stoCheckorderTitleWindow)
    		this.stoCheckorderTitleWindow = new StoCheckorderTitleWindow();
    	var win = this.stoCheckorderTitleWindow;
    	var winForm = win.stoCheckorderTitle;
		win.show();
		win.stoCheckorderTitle.getForm().reset();
		
		winForm.expirationDays.setValue(5);
    },
    onModifyClick: function() {
    	var records = this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   				
   				if(!this.stoCheckorderTitleUpdateWindow)
					this.stoCheckorderTitleUpdateWindow = new StoCheckorderTitleUpdateWindow();
   				
   		    	var win = this.stoCheckorderTitleUpdateWindow;
				var winForm = win.stoCheckorderTitle;
				
				win.show();
							
   		    	winForm.busiId.setValue(vrecord.data['busiId']);
				winForm.titleCode.setValue(vrecord.data.titleCode);
				winForm.titleCode.setReadOnly(true);
				winForm.titleContent.setValue(vrecord.data.titleContent);
				winForm.expirationDays.setValue(vrecord.data.expirationDays);
   		    	
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
    						stoCheckorderTitleGrid.vbbar.doLoad(stoCheckorderTitleGrid.vbbar.cursor);
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
    
    stoCheckorderTitleGrid = new StoCheckorderTitleGrid(Ext.getBody().getViewSize().height);
    stoCheckorderTitleGrid.store.load({params:{start:0,limit:PAGESIZE}});
	new Ext.Viewport({
		layout: 'border',
		items: [
		        stoCheckorderTitleGrid   
		]
	});
});

