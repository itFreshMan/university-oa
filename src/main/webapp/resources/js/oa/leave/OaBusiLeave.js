var PAGESIZE = 20;

/** ************LeaveForm*************************** */
LeaveForm = Ext.extend(Ext.ux.Form, {
	constructor : function() {
		this.title1 = this.createTextField('<font color="red">*</font>事由说明', 'title', '95%');
		this.beginTime = new Ext.ux.form.DateTimeField({
			 dateFormat: 'Y-m-d',
		     timeFormat: 'H',
		     fieldLabel: '<font color="red">*</font>开始时间:',
			name: 'beginTime',
			anchor: '95%',
			allowBlank: false,
			editable:false,//不能手动输入
			listeners: {
                "change": { fn: this.timeChange, scope: this}
            },
			blankText: '请选择时间'
		});
		this.endTime = new Ext.ux.form.DateTimeField({
			 dateFormat: 'Y-m-d',
		     timeFormat: 'H',
		     fieldLabel: '<font color="red">*</font>结束时间:',
			name: 'endTime',
			anchor: '95%',
			allowBlank: false,
			editable:false,//不能手动输入
			listeners: {
                "change": { fn: this.timeChange, scope: this}
            },
			blankText: '请选择时间'
		});
		this.realtime = this.createNumberField('<font color="red">*</font>实际时长(小时):', 'realTime', '95%',0);
		this.remark = this.createTextArea('备注', 'remark',60, '96%');
		
		this.realtime.allowBlank = false;
		this.title1.allowBlank = false;
		LeaveForm.superclass.constructor.call(this, {
			anchor : '100%',
			// height:200,
			region:"center",
			height: Ext.getBody().getViewSize().height,
            width:Ext.getBody().getViewSize().width,
			labelWidth : 100,
			labelAlign : 'right',
			frame : true,
			bodyStyle : "padding: 5px 5px 0",
			layout : 'form',
//			layoutConfig : {
//				columns : 2
//			},
			items : [ 
			         this.title1,
			         {
			        	 layout : 'tableform',
			 			layoutConfig : {
			 				columns : 2
			 			},
			 			items:[this.beginTime,this.endTime,this.realtime]
			         },
			         this.remark
//			         this.busiId
			],
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				width : 20,
				iconCls : 'save',
				hidden : false,
				handler : this.addFormClick,
				scope : this
			}, {
				text : '清空',
				width : 20,
				iconCls : 'redo',
				handler : this.resetFormClick,
				scope : this
			}, {
				text : '关闭',
				width : 20,
				iconCls : 'delete',
				handler : this.onCloseClick,
				scope : this
			} ]
		});

	},
	timeChange: function(){
		var beginTime = this.beginTime.getValue();
		var endTime = this.endTime.getValue();
		if(beginTime !=null && beginTime !='' && endTime !=null && endTime !=''){
			if(beginTime > endTime){
				Ext.MessageBox.alert("系统提示：",BLANKSTR+"开始时间不能大于结束时间！"+BLANKSTR);
				return;
			}
			var hours = (endTime-beginTime)/(1000*60*60);
			if(hours <=8){
				this.realtime.setValue(hours);
			}else if(hours >8 && hours <=24){
				this.realtime.setValue(8);
			}else{
				var h = parseInt(hours/24);
				var hs = hours%24;
				if(hs ==0){
					this.realtime.setValue(h*8);
				}else{
					if(hs <8){
						this.realtime.setValue((h*8+hs));
					}else{
						this.realtime.setValue((h*8+8));
					}
				}
			}
		}
	},
	addFormClick : function() {
		if (this.getForm().isValid()) {
			var beginTime = this.beginTime.getValue();
			var endTime = this.endTime.getValue();
			if(beginTime > endTime){
				Ext.MessageBox.alert("系统提示：",BLANKSTR+"开始时间不能大于结束时间！"+BLANKSTR);
				return;
			}
			var thiz = this;
			this.getForm().submit({
				waitMsg : '正在提交，请稍后...',
				url : '/oa/leave/addBusiLeave',
				method : 'POST',
				success : function() {
					Ext.Msg.show({   
		               title : '系统提示',   
		               msg : BLANKSTR +'保存成功！' + BLANKSTR,   
		               buttons: Ext.Msg.OK,   
		               fn: function() {  
		            	   thiz.onCloseClick();;
		               },   
		               closable: false   
		          	}); 
				},
				failure : function() {
					Ext.MessageBox.alert("系统提示：", BLANKSTR + "添加失败！" + BLANKSTR);
				}
			});
		}
	},
	// 关闭
	onCloseClick : function() {
//		this.ownerCt.close();
		var b =parent.Ext.getCmp("centerTabPanel");
    	var panelId = b.getActiveTab().id;
    	var d = b.getItem(panelId);
    	if (d != null) {
    		b.remove(d);
    	}
	},
	// 清空
	resetFormClick : function() {
		this.getForm().reset();
	}

});

/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';
	
    leaveForm = new LeaveForm();
    new Ext.Viewport({
    	layout: 'border',
    	items:leaveForm
    });
});
