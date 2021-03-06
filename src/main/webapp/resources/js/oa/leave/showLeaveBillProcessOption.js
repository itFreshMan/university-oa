var PAGESIZE = 20;

/** ************LeaveBillForm*************************** */
LeaveBillForm = Ext.extend(Ext.ux.Form, {
	constructor : function() {
		this.title1 = new Ext.form.DisplayField({
    		fieldLabel:'事由说明',
    		value:title,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		this.creditName = new Ext.form.DisplayField({
			fieldLabel:'申请人',
			value:userName,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		this.orgId = new Ext.form.DisplayField({
    		fieldLabel:'所属项目',
    		value:orgName,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		this.begintime = new Ext.form.DisplayField({
    		fieldLabel:'开始时间',
    		value:beginTime,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		this.endtime = new Ext.form.DisplayField({
			fieldLabel:'结束时间',
			value:endTime,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		this.realtime = new Ext.form.DisplayField({
			fieldLabel:'实际时长(小时)',
			value:realTime,
			labelStyle:'background-color: #d4e1f2;',
			cls:'override_label'
		});
		this.remark = new Ext.form.DisplayField({
    		fieldLabel:'备注',
    		value:remark,
    		labelStyle:'background-color: #d4e1f2;',
    		cls:'override_label'
    	});
		
		LeaveBillForm.superclass.constructor.call(this, {
			anchor : '100%',
			 height:140,
			region:"north",
			labelWidth : 100,
			labelAlign : 'right',
			frame : false,
			bodyStyle:"border:none;",
			layout : 'form',
			items : [ 
			 			this.title1,
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .5,items:this.creditName},{layout:'form',columnWidth: .5,items:this.orgId}]
			 			},
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .5,items:this.begintime},{layout:'form',columnWidth: .5,items:this.endtime}]
			 			},
			 			{
			 				layout:'column',
			 				bodyStyle:"border:none;",
			 				items:[{layout:'form',columnWidth: .5,items:this.realtime}]
			 			},
			         this.remark
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
            {name:'actName'},{name:'userName'},{name:'optionName'},{name:'optionContent'},{name:'approveTime'}
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
            	{header:'环节',dataIndex:'actName',width:100,sortable: true},
            	{header:'审批人',dataIndex:'userName',width:160,sortable: true},
            	{header:'审批动作',dataIndex:'optionName',width:100,sortable: true},
            	{header:'审批意见',dataIndex:'optionContent',width:160,sortable: true},
            	{header:'审批时间',dataIndex:'approveTime',width:160,sortable: true}
            ]),
            tbar:[{xtype:'label',text:'历史审批意见'}],
            ds: this.store
        });
    }
});
/*********************onReady 组件渲染及处理**********************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';
	
    leaveBillForm = new LeaveBillForm();
    personMemberGrid = new PersonMemberGrid();
    var optionList = Ext.decode(optionJson);
    personMemberGrid.store.loadData(optionList);
    new Ext.Viewport({
    	layout: 'border',
    	height: Ext.getBody().getViewSize().height,
    	items:[leaveBillForm,personMemberGrid]
    });
});