var ENTITY_URL_LIST = "/sto/StoCheckorderInfo/pageFindCheckorderInfo";
var ENTITY_URL_SAVE = "/sto/StoCheckorderInfo/save";
var ENTITY_URL_UPDATE = "/sto/StoCheckorderInfo/update";
var ENTITY_URL_DELETE = "/sto/StoCheckorderInfo/delete";
var PAGESIZE=50;
/*
 * sto_checkorder_info 
 * @author 
 * @date 2015-01-14
 */
OrderInfoDetailsViewWindow = Ext.extend(Ext.Window,{
    constructor: function(grid) {
    	OrderInfoDetailsViewWindow.superclass.constructor.call(this, {
            width: 700,
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

StoCheckorderInfo = Ext.extend(Ext.ux.Form,{
	constructor: function(){
		this.busiId = this.createHidden('ID', 'busiId', '95%');
		this.title2 = new Ext.form.ComboBox({
			valueField : "titleCode",
			displayField : "titleContent",
			mode : 'remote',
			resizable:true,
			listWidth : 260,
			forceSelection : true,
			blankText : '请选择...',
			emptyText : '请选择...',
			lastQuery: '',
			fieldLabel : '<font color="red">*</font>主题',
			editable : false,
			submitValue : true,
			triggerAction : 'all',
			allowBlank : false,
			anchor : '95%',
			pageSize:10,
			store : new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : '/sto/StoCheckorderTitle/pageFindCheckorderTitles',
					method : 'POST'
				}),
				autoLoad:false,
			reader: new Ext.data.JsonReader({totalProperty:'total',root:'rows'},[
			                    {name:'titleContent'},
					            {name:'titleCode'}
					 ])
			})
		});
		this.title2.store.load({params:{start:0,limit:this.title2.pageSize}});
		
		this.content = this.createTextArea('内容', 'content',60, '95%');
		this.receiverName = this.createTextField('<font color="red">*</font>收货人','receiverName','95%','',null,255,'长度超过不能255');
		this.telNo = this.createTextField('<font color="red">*</font>联系电话','telNo','95%','',null,16,'长度超过不能16');
		this.orderNum = this.createTextField('<font color="red">*</font>订单号','orderNum','95%','',null,16,'长度超过不能16');
		this.address =this.createTextArea('地址', 'address',45, '95%');
		this.postcode = this.createTextField('邮政编码','postcode','95%','',null,6,'长度超过不能6');
		
		this.content.allowBlank = true;
		this.address.allowBlank = true;
		this.postcode.allowBlank = true;
		thiz = this;
		this.checkOrderNumButton = new Ext.Button({
											text: "查看订单",  
											iconCls:'query',
							                minWidth: 100,  
							                handler: function(){  
							                	var thizOrderNum = thiz.orderNum.getValue();
							                	if(thizOrderNum == null || thizOrderNum == '' || thizOrderNum.length < 12){
							                		Ext.Msg.alert("系统提示：","填写的订单号错误,必须大于等于12位");
							                		return ;
							                	}
//							                	thizOrderNum = '968646983513';
							                	window.open(stoSearchRootUrl+thizOrderNum);
							                }
						                });
        StoCheckorderInfo.superclass.constructor.call(this, {
	            anchor: '100%',
	            autoHeight:true,
	            labelWidth: 90,
	            labelAlign :'right',
	            frame: true,
	            bodyStyle:"padding: 5px 5px 0",
	            layout : 'form',
	            items:[
                    {
			        	layout : 'tableform',
			 			layoutConfig : {
			 				columns : 2
			 			},
			 			items:[	this.title2]
			         },
	                   	
					 {
			        	layout : 'tableform',
			 			layoutConfig : {
			 				columns : 2
			 			},
			 			items:[	this.orderNum,this.checkOrderNumButton,this.receiverName,this.telNo]
			         },
			        
			         this.content,
			         this.address,
			         {
			        	layout : 'tableform',
			 			layoutConfig : {
			 				columns : 2
			 			},
			 			items:[ this.postcode]
			         },
			        
			         this.busiId
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
			 var title2 = this.title2.getValue();
			this.getForm().submit({
				waitMsg: '正在提交数据...',
				url: ENTITY_URL_SAVE,
				params:{title:title2},
				method: 'POST',
				success: function(form,action){
					Ext.Msg.alert("系统提示：","添加成功！");
					stoCheckorderInfoGrid.store.load({params:{start:0,limit:PAGESIZE}});
					stoCheckorderInfoGrid.stoCheckorderInfoWindow.hide();
					
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
					stoCheckorderInfoGrid.stoCheckorderInfoUpdateWindow.hide();
					stoCheckorderInfoGrid.vbbar.doLoad(stoCheckorderInfoGrid.vbbar.cursor);
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",action.result.message);
				}
			});
		}
	},
	//关闭
    onCloseClick: function(){
    	if(stoCheckorderInfoGrid.stoCheckorderInfoUpdateWindow)
    	stoCheckorderInfoGrid.stoCheckorderInfoUpdateWindow.stoCheckorderInfo.getForm().reset();
        this.ownerCt.hide();
    },
  //清空
    resetFormClick: function() {        
        this.getForm().reset();
    }, 
  //重置
    onResumeClick: function() {        
    	stoCheckorderInfoGrid.onModifyClick();
    }
	
});

/**************StoCheckorderInfoWindow*********************/
StoCheckorderInfoWindow = Ext.extend(Ext.Window,{
	
	constructor: function(grid){
		this.stoCheckorderInfo = new StoCheckorderInfo();
		StoCheckorderInfoWindow.superclass.constructor.call(this,{
			title: '新增',
			 width: 700,
			 anchor: '100%',
			autoHeight:true,
			resizable : false, //可变尺寸的；可调整大小的
			 plain: true,
			 modal: true,
			closeAction: 'hide',
			items:[this.stoCheckorderInfo]
		});
	}
});

/********************StoCheckorderInfoUpdateWindow组件*************************/
StoCheckorderInfoUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.stoCheckorderInfo = new StoCheckorderInfo();
    	this.stoCheckorderInfo.buttons[0].hide();   //隐藏添加按钮
    	this.stoCheckorderInfo.buttons[1].show();   //显示修改按钮
    	StoCheckorderInfoUpdateWindow.superclass.constructor.call(this, {
			title: '修改',
			width: 700,
			anchor: '100%',
			autoHeight: true,
			resizable: false,
			plain: true,
			modal: true,
			closeAction: 'hide',
            items: [this.stoCheckorderInfo]
        });
    }
});

var outterStartDate = null;
var outterEndDate = null;
var outterTitle = null;
var outterStatus = null;
var outterOrderNum = null;
var outterReceiverName = null;
var outterTelNum = null;
/****************StoCheckorderInfoGrid***********************/
StoCheckorderInfoGrid = Ext.extend(UxGrid,{
	constructor: function(height,width){
		this.store = new Ext.data.Store({
			
			proxy: new Ext.data.HttpProxy({url:ENTITY_URL_LIST,method:'POST'}),
			reader: new Ext.data.JsonReader({totalProperty:'total',root:'rows'},[
		            {name:'busiId'},
		            {name:'titleContent'},
		            {name:'titleCode'},
		            {name:'content'},
		            {name:'receiverName'},
		            {name:'telNo'},
		            {name:'orderNum'},
		            {name:'address'},
		            {name:'postcode'},
		            {name:'quickMsg'},
		            {name:'createTime'},
		            {name:'createUser'},
		            {name:'checkTime'},
		            {name:'checkUser'},
		            {name:'status'},
		            {name:'delFlag'},
		            {name:'expirationDays'},
		            {name:'expirationFlag'}
					 ]),
			 listeners: {
	                "load": { fn:function(){
	                	 outterStartDate = Ext.getCmp('Search_startDate').getValue();
	                	 outterEndDate = Ext.getCmp('Search_endDate').getValue();
	                	 outterTitle = Ext.getCmp('Search_titleComobo').getValue();
	                	 outterStatus = Ext.getCmp('Search_statusCombo').getValue();
	                	 outterOrderNum = Ext.getCmp('Search_orderNum').getValue();
	                	 outterReceiverName = Ext.getCmp('Search_receiverName').getValue();;
//	                	 outterTelNum = null;
	                }, scope: this}
	            }
		});
		
		var titleComobo = new Ext.form.ComboBox({
			id:'Search_titleComobo',
			valueField : "titleCode",
			displayField : "titleContent",
			mode : 'remote',
			resizable:true,
			listWidth : 260,
			width:90,
			forceSelection : true,
			blankText : '请选择...',
			emptyText : '请选择...',
			lastQuery: '',
			fieldLabel : '<font color="red">*</font>主题',
			editable : false,
			submitValue : true,
			triggerAction : 'all',
			anchor : '95%',
			pageSize:10,
			store : new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : '/sto/StoCheckorderTitle/pageFindCheckorderTitles',
					method : 'POST'
				}),
				autoLoad:false,
			reader: new Ext.data.JsonReader({totalProperty:'total',root:'rows'},[
			                    {name:'titleContent'},
					            {name:'titleCode'}
					 ])
			})
		});
		titleComobo.store.load({params:{start:0,limit:titleComobo.pageSize}});
		
		var statusCombo=new Ext.form.ComboBox({
			id:'Search_statusCombo',
	  	      name:'status',
	  	      store:new Ext.data.SimpleStore({
		  	       fields:['value','text'],
		  	       data:[
	  	             	['-1','- -全部- -'],
	  	             	['0','新建'],
	  	             	['1','检查'],
	  	             	['2','加急'],
	  	             	['3','异常故障'],
	  	             	['4','正常']]
	  	         }),
		  	      mode:'local',
		  	      triggerAction:'all',
		  	      hideTrigger:false,
//		  	      listWidth:100,
		  	      width:75,
		  	      editable:false,
		  	      valueField:'value',
		  	      displayField:'text'
	  	     });
		statusCombo.setValue('-1');
		
		var queryDateStart =  new Ext.form.DateField({
			id:'Search_startDate',
 			fieldLabel: '开始日期',
 			format: 'Y-m-d',
 			anchor: '100%',
 			editable:false,//不能手动输入
 			blankText: '请选择开始日期'
 		});
		
		var queryDateEnd =  new Ext.form.DateField({
			id:'Search_endDate',
 			fieldLabel: '结束日期',
 			format: 'Y-m-d',
 			anchor: '100%',
 			editable:false,//不能手动输入
 			blankText: '请选择结束日期'
 		});
		this.vtbar = new Ext.Toolbar({
			items: [
//			       '-',{xtype:'button',text:'添加',iconCls:'add',handler:this.onAddClick,scope:this}, 
//			       '-',{xtype:'button',text:'修改',iconCls:'edit',handler:this.onModifyClick,scope:this}, 
//			       '-',{xtype:'button',text:'删除',iconCls:'delete',handler:this.onDeleteClick,scope:this},
			       '-',{xtype:'label', text:'开始日期：'},queryDateStart,
			       '-',{xtype:'label', text:'结束日期：'},queryDateEnd,
			       '-',{xtype:'label',text:'主题'},titleComobo,
					'-',{xtype:'label',text:'状态'},statusCombo,
					'-',{xtype:'label',text:'订单号'},{xtype:'textfield',id:'Search_orderNum'},
					'-',{xtype:'label',text:'收货人'},{xtype:'textfield',id:'Search_receiverName'},
//					'-',{xtype:'label',text:'联系电话'},{xtype:'textfield',id:'Search_telNo'},
			       '-',{xtype:'button',text:'查询',iconCls:'query',handler:function(){
			       			var params = {};
			       			var status = statusCombo.getValue();
			       			if(status == -1){
			       				status = '';
			       			}
			       			params['status'] = status;
			       			
			       			var orderNum = Ext.getCmp('Search_orderNum').getValue();
			       			params['orderNum'] = orderNum;
			       			
			       			var receiverName = Ext.getCmp('Search_receiverName').getValue();
			       			params['receiverName'] = receiverName;
			       			
			       			var title = titleComobo.getValue();
			       			params['title'] = title;
			       			
			       		
			       			var startDate = queryDateStart.getValue();
			       			var endDate = queryDateEnd.getValue();
			       			if(startDate != null && startDate != '' && endDate != null && endDate != ''){
			       				if(startDate > endDate){
			       					Ext.MessageBox.alert("系统提示：",'开始时间>结束时间');
			       					return ;
			       				}
			       			}
			       			params['startDate'] = startDate;
			       			params['endDate'] = endDate;
//			       			params['telNo'] = Ext.getCmp('Search_telNo').getValue();
	    	   				stoCheckorderInfoGrid.store.baseParams= params;
	    	   				stoCheckorderInfoGrid.store.load({params:{start:0,limit:PAGESIZE}});
	    	   			}
	       			},
					'-',{xtype:'button',text:'重置',iconCls:'refresh',handler:function(){
						stoCheckorderInfoGrid.vtbar.items.each(function(item,index,length){   
							if((""+item.getXType()).indexOf("field") != -1) {
								item.setValue('');
							}
						  }); 
						
						statusCombo.setValue(-1);
						titleComobo.setValue('');
    	   			}},
    	   			'-',{xtype:'button',text:'导出',iconCls:'excel',handler:function(){
    	   				
		       			var fileName = "查单信息明细.xls";
		       			var url = '/sto/StoCheckorderInfo/xls?title='+outterTitle+ '&status='+outterStatus
	   			 				 +'&orderNum='+outterOrderNum+'&receiverName='+outterReceiverName +'&fileName='+fileName;
		       			
		   			  	if(outterStartDate != null && outterStartDate != ''){
		   			  		url += '&startDate='+outterStartDate
		   			  	}
		   			  	if(outterEndDate != null && outterEndDate != ''){
	 	   			  		url += '&endDate='+outterEndDate
	 	   			  	}	 
	    	   			  
		   			  	url = encodeURI(url);
		       			url = encodeURI(url);
	        	    	window.open(url);
    	   			}}
			]
		});
		
		this.vbbar =  new Ext.Toolbar({
			items: [
			           this.createPagingToolbar(PAGESIZE),
				       '-',{xtype:'button',text:'添加',iconCls:'add',handler:this.onAddClick,scope:this}, 
				       '-',{xtype:'button',text:'删除',iconCls:'delete',handler:this.onDeleteClick,scope:this}
				]
			});

		this.vsm = new Ext.grid.CheckboxSelectionModel();
		this.vcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		             this.vsm,
		            {header:'BUSI_ID',dataIndex:'busiId',width:100,sortable:true,hidden:true},
		            {header:'订单号',dataIndex:'orderNum',width:100,sortable:true,hidden:false,renderer:function(value,metadata,record){
		            	metadata.attr = 'ext:qtitle="" ext:qtip=查看订单(' +value+')详情' ;       
		            	var html = '<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.viewCheckOrderInfoAndDetails();">'+value+'</a>';
		            	return html;
		            }},
		            {header:'主题',dataIndex:'titleContent',width:100,sortable:true,hidden:false},
		            {header:'状态',dataIndex:'status',width:80,sortable:true,hidden:false,
			      		renderer:function(value, cellmeta, record){
			      			if(value == 0) {
			      				return "<span style='color:#DB9370;font-weight:bold;'>新建</span>";
			      			}else if(value == 1) {
			      				return "<span style='color:green;font-weight:bold;'>检查</span>";
			      			}else if(value == 2) {
			      				return "<span style='color:red;font-weight:bold;'>加急</span>";
			      			}else if(value == 3) {
			      				return "<span style='color:blue;font-weight:bold;'>异常故障</span>";
			      			}else if(value == 4) {
			      				return "<span style='color:#800080;font-weight:bold;'>正常</span>";
			      			}else {
			      				return value;
			      			}
			      		}
			        },
			        {header:'操作',dataIndex:'status',width:140,sortable:true,hidden:false,align:'center',
			      		renderer:function(value, cellmeta, record){
			      			var url = '';
			      			if(value == 0) {
				            	url += '<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.checkNowByStoUserFunc(1);">检查</a>';
			      			}else if(value == 1 || value == 2) {
			      				url += '<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.checkNowByStoUserFunc(2);">加急</a>&nbsp;';
			      				url += '&nbsp;<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.checkNowByStoUserFunc(3);">异常故障</a>&nbsp;';
			      				url += '&nbsp;<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.checkNowByStoUserFunc(4);">正常</a>&nbsp;';
			      			}else if(value == 3){
			      				url += '&nbsp;<a class="zlink" href="javascript:void(0);" onclick="stoCheckorderInfoGrid.checkNowByStoUserFunc(4);">正常</a>&nbsp;';
			      			}			      			
			      			return url;
			      		}
			        },	
		            {header:'主题(编码)',dataIndex:'titleCode',width:100,sortable:true,hidden:true},
		            {header:'收货人',dataIndex:'receiverName',width:100,sortable:true,hidden:false},
		            {header:'联系电话',dataIndex:'telNo',width:100,sortable:true,hidden:false},
		            {header:'创建时间',dataIndex:'createTime',width:140,sortable:true,hidden:false},
		            {header:'内容',dataIndex:'content',width:160,sortable:true,hidden:false},
		            {header:'地址',dataIndex:'address',width:200,sortable:true,hidden:false,
	                	renderer:function(value,metadata){
	                		if(value != null) {
	                    		var svalue = value.replace(/\s+/g,"");
	                    		metadata.attr = 'ext:qtitle="" ext:qtip=' + svalue;                			
	                		}
	                		return value;
	                	}
		            },
		            {header:'邮政编码',dataIndex:'postcode',width:80,sortable:true,hidden:false},
//		            {header:'快速回复',dataIndex:'quickMsg',width:100,sortable:true,hidden:false},
		            {header:'创建人',dataIndex:'createUser',width:80,sortable:true,hidden:false},
		            {header:'检查时间',dataIndex:'checkTime',width:120,sortable:true,hidden:false},
		            {header:'检查人',dataIndex:'checkUser',width:80,sortable:true,hidden:false}
		           ]);
		StoCheckorderInfoGrid.superclass.constructor.call(this,{
			region: 'center',
			frame: true,
			height: height,
			viewConfig : {
				forceFit : false,  
                getRowClass : function(record,rowIndex,rowParams,store){  
                	var expirationFlag = record.get('expirationFlag');
                	var cssStr = '';
                	if(expirationFlag == 1 || status == 2){
                		cssStr = 'x-grid-record-color2';  
                	}	
                   
                    return cssStr;  
                }
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
    	if(!this.stoCheckorderInfoWindow)
    		this.stoCheckorderInfoWindow = new StoCheckorderInfoWindow();
    	var win = this.stoCheckorderInfoWindow;
		win.show();
		win.stoCheckorderInfo.getForm().reset();
    },
    onModifyClick: function() {
    	var records = this.getSelectionModel().getSelections();
   		if(records.length > 0) {
   			if(records.length == 1){
   				vrecord = records[0];
   				
   				if(!this.stoCheckorderInfoUpdateWindow)
					this.stoCheckorderInfoUpdateWindow = new StoCheckorderInfoUpdateWindow();
   				
   		    	var win = this.stoCheckorderInfoUpdateWindow;
				var winForm = win.stoCheckorderInfo;
				
				win.show();
							
   		    	winForm.busiId.setValue(vrecord.data['busiId']);
				winForm.title.setValue(vrecord.data.title);
				winForm.content.setValue(vrecord.data.content);
				winForm.receiverName.setValue(vrecord.data.receiverName);
				winForm.telNo.setValue(vrecord.data.telNo);
				winForm.orderNum.setValue(vrecord.data.orderNum);
				winForm.address.setValue(vrecord.data.address);
				winForm.postcode.setValue(vrecord.data.postcode);
				winForm.quickMsg.setValue(vrecord.data.quickMsg);
				winForm.createTime.setValue(vrecord.data.createTime);
				winForm.createUser.setValue(vrecord.data.createUser);
				winForm.checkTime.setValue(vrecord.data.checkTime);
				winForm.checkUser.setValue(vrecord.data.checkUser);
				winForm.status.setValue(vrecord.data.status);
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
    		if(records[i].get('status') > 4){
    			return Ext.Msg.alert('系统提示','只能删除状态<4的记录');
    		}
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
    						stoCheckorderInfoGrid.vbbar.doLoad(stoCheckorderInfoGrid.vbbar.cursor);
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
    },
    viewCheckOrderInfoAndDetails : function(){
    	//
    	var records=this.getSelectionModel().getSelections();
    	var vrecord = records[0];
    	var busiId = vrecord.get('busiId');
    	var orderNum = vrecord.get('orderNum');
    	var url = '/sto/StoCheckorderInfo/viewDetails?busiId='+busiId;
		var html = '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';    		
		DETAILS_VIEW_WINDOW = new OrderInfoDetailsViewWindow();
		DETAILS_VIEW_WINDOW.setTitle("订单"+orderNum+"---详情 ");
		DETAILS_VIEW_WINDOW.html = html;
		DETAILS_VIEW_WINDOW.show();
    },
    //1:检查,2:加急检查;
    checkNowByStoUserFunc : function(checkType){
    	var records=this.getSelectionModel().getSelections();
    	var vrecord = records[0];
    	var checkorderId = vrecord.get('busiId');
    	var checkTypeStr = '';
    	var winTitleStr = '';
    	var contentStr = '主题:'+vrecord.get('titleContent')+',收货人:'+vrecord.get('receiverName')+',电话:'+vrecord.get('telNo')+',运单号:'+vrecord.get('orderNum');
		
    	if(checkType == 1){
    		checkTypeStr = '检查';
    		winTitleStr = '新增检查';
    		
//    		contentStr += '最终结果:检查处理';
    	}else if(checkType == 2){
    		checkTypeStr = '加急检查';
    		winTitleStr = '新增加急检查';
    		
//    		contentStr += '最终结果:加急处理';
    	}else if(checkType == 3){
    		checkTypeStr = '异常故障';
    		winTitleStr = '异常故障';
    		
    		contentStr += '最终结果:异常故障';
    	}else if(checkType == 4){
    		checkTypeStr = '正常';
    		winTitleStr = '正常';
    		contentStr += ',最终结果:正常';
    	}else{
    		Ext.Msg.alert('系统提示','传递的checkType不为1,2,3,4！');
    		return ;
    	}
    	if(!this.stoCheckorderDetailsWindow)
    		this.stoCheckorderDetailsWindow = new StoCheckorderDetailsWindow();
    	var win = this.stoCheckorderDetailsWindow;
    	win.setTitle(winTitleStr);
		win.show();
		var winForm = win.stoCheckorderDetails;
		winForm.getForm().reset();
		
		winForm.checkorderId.setValue(vrecord.get('busiId'));
		winForm.checkType.setValue(checkType);
		winForm.checkTypeStr.setValue(checkTypeStr);
		winForm.checkContent.setValue(contentStr);
    }
    
});


/**********************************/
StoCheckorderDetails = Ext.extend(Ext.ux.Form,{
	constructor: function(){
		this.checkorderId =this.createHidden('ID', 'checkorderId', '95%');
		this.checkType = this.createHidden('ID', 'checkType', '95%');
		this.checkTypeStr = this.createTextField('检查类型','checkTypeStr','95%','',null,512,'长度超过不能512');
		this.checkContent = this.createTextArea('检查问题', 'checkContent',80, '95%');
		this.checkReply = this.createTextArea('回应信息', 'checkReply',60, '95%');
		
		this.checkTypeStr.allowBlank = false;
		this.checkTypeStr.readOnly = true;
		this.checkContent.allowBlank = true;
		this.checkReply.allowBlank = true;
        
        StoCheckorderDetails.superclass.constructor.call(this, {
	            anchor: '100%',
	            autoHeight:true,
	            labelWidth: 90,
	            labelAlign :'right',
	            frame: true,
	            bodyStyle:"padding: 5px 5px 0",
	            layout: 'form',
//	            layout: 'tableform',
//	            layoutConfig: {columns: 2},
	            items:[
					this.checkTypeStr,
					this.checkContent,
//					this.checkReply,
					this.checkorderId,
					this.checkType
	            ],
	            buttonAlign :'center',
	            buttons: [
	               {text: '保存', width: 20,iconCls: 'save', hidden: false,handler:this.addFormClick,scope:this},
	               {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
	            ]
	        });
	},
	addFormClick: function(){
		if(this.getForm().isValid()){
			this.getForm().submit({
				waitMsg: '正在提交数据...',
				url: '/sto/StoCheckorderInfo/checkNowByStoUser',
				method: 'POST',
				success: function(form,action){
					Ext.Msg.alert("系统提示：","添加成功！");
					stoCheckorderInfoGrid.store.load({params:{start:0,limit:PAGESIZE}});
					stoCheckorderInfoGrid.stoCheckorderDetailsWindow.hide();
					
				},
				failure: function(form,action){
					Ext.MessageBox.alert("系统提示：",action.result.message);
				}
			});
		}
	},
	//关闭
    onCloseClick: function(){
    	if(stoCheckorderInfoGrid.stoCheckorderDetailsUpdateWindow)
    	stoCheckorderInfoGrid.stoCheckorderDetailsUpdateWindow.stoCheckorderDetails.getForm().reset();
        this.ownerCt.hide();
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


/*************onReady组件渲染处理***********************/
Ext.onReady(function(){
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    
    stoCheckorderInfoGrid = new StoCheckorderInfoGrid(Ext.getBody().getViewSize().height);
    stoCheckorderInfoGrid.store.load({params:{start:0,limit:PAGESIZE}});
	new Ext.Viewport({
		layout: 'border',
		items: [
		        stoCheckorderInfoGrid   
		]
	});
});

