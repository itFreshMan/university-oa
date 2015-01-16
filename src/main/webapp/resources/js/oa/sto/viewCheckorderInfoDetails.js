var PAGESIZE = 20;

/** ************CheckOrderInfoForm*************************** */
CheckOrderInfoForm = Ext.extend(Ext.ux.Form, {
	constructor : function() {
		this.orderNum = new Ext.form.DisplayField({
    		fieldLabel:'订单号',
    		value:orderNum,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		this.title1 = new Ext.form.DisplayField({
    		fieldLabel:'主题',
    		value:title,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		if(status == 0) {
			status= "<span style='color:#DB9370;font-weight:bold;'>新建</span>";
		}else if(status == 1) {
			status= "<span style='color:green;font-weight:bold;'>检查</span>";
		}else if(status == 2) {
			status="<span style='color:red;font-weight:bold;'>加急</span>";
		}else if(status == 3) {
			status= "<span style='color:blue;font-weight:bold;'>异常故障</span>";
		}else if(status == 4) {
			status= "<span style='color:#800080;font-weight:bold;'>正常</span>";
		}
		this.status  = new Ext.form.DisplayField({
    		fieldLabel:'状态',
    		value:status,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		this.content = new Ext.form.DisplayField({
			fieldLabel:'内容',
			value:content,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.receiverName = new Ext.form.DisplayField({
			fieldLabel:'收货人',
			value:receiverName,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		this.telNo = new Ext.form.DisplayField({
			fieldLabel:'联系电话',
			value:telNo,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.postcode = new Ext.form.DisplayField({
			fieldLabel:'邮编',
			value:postcode,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.address = new Ext.form.DisplayField({
			fieldLabel:'地址',
			value:address,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		this.createTime = new Ext.form.DisplayField({
			fieldLabel:'创建时间',
			value:createTime,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.createUser = new Ext.form.DisplayField({
			fieldLabel:'创建人',
			value:createUser,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.checkTime = new Ext.form.DisplayField({
			fieldLabel:'检查时间',
			value:checkTime,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		
		this.checkUser = new Ext.form.DisplayField({
			fieldLabel:'检查人',
			value:checkUser,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		CheckOrderInfoForm.superclass.constructor.call(this, {
			anchor : '100%',
			 height:166,
			region:"north",
			labelWidth : 100,
			labelAlign : 'right',
			frame : false,
			bodyStyle:"border:none;",
			layout : 'form',
			items : [ 
			 			
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .3,items:this.orderNum},{layout:'form',columnWidth: .4,items:this.title1},{layout:'form',columnWidth: .3,items:this.status}]
			 			},
			 			this.content,
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .3,items:this.receiverName},{layout:'form',columnWidth: .4,items:this.telNo},{layout:'form',columnWidth: .3,items:this.postcode}]
			 			},
			 			this.address,
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .3,items:this.createTime},{layout:'form',columnWidth: .5,items:this.createUser}]
			 			},
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .3,items:this.checkTime},{layout:'form',columnWidth: .5,items:this.checkUser}]
			 			}
			]
		});

	},
	addFormClick : function() {},
	updateFormClick : function() {},
	// 关闭
	onCloseClick : function() {},
	// 清空
	resetFormClick : function() {
		this.getForm().reset();
	}

});
	
/**************************PersonMemberGrid 共同借款人表格*******************************************/
PersonMemberGrid = Ext.extend(UxGrid, {
    store:null,
    constructor: function(){
    	this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: '', method: 'POST'}),
            reader: new Ext.data.JsonReader({},[
            {name:'checkTime'},{name:'checkUser'},{name:'checkType'},{name:'checkContent'},{name:'checkApply'}
            ])
        });
    	this.store.on('load', function(store, records, options) {
    		var totalLength = store.data.length;
    		if(store.data.length==0) {
    			personMemberGrid.height=70;
    		} else{
    			personMemberGrid.height=totalLength*21+50;
    		}
    	   
    	});
        PersonMemberGrid.superclass.constructor.call(this, {
//        	title:'家庭成员信息',
            frame:false,
            region:'center',
//            autoHeight:true,
            viewConfig: {
                forceFit: true
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            	{header:'检查时间',dataIndex:'checkTime',width:80,sortable: true},
            	{header:'检查人',dataIndex:'checkUser',width:80,sortable: true},
            	{header:'检查类型',dataIndex:'checkType',width:60,sortable: true,
		      		renderer:function(value, cellmeta, record){
		      		if(value == 1) {
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
            	{header:'检查问题',dataIndex:'checkContent',width:260,sortable: true}
//            	,{header:'回应信息',dataIndex:'checkApply',width:260,sortable: true}
            ]),
            tbar:[{xtype:'label',text:'检查记录'}],
            ds: this.store
        });
    }
});
/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';
	
    checkOrderInfoForm = new CheckOrderInfoForm();
    personMemberGrid = new PersonMemberGrid();
    var optionList = Ext.decode(optionJson);
    personMemberGrid.store.loadData(optionList);
    new Ext.Viewport({
    	layout: 'border',
    	height: Ext.getBody().getViewSize().height,
    	items:[checkOrderInfoForm,personMemberGrid]
    });
});