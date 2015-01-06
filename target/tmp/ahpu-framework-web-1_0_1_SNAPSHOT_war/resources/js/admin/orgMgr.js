Ext.BLANK_IMAGE_URL = "/resources/js/ext/resources/images/default/s.gif";
//需要补充的空格
var BLANKSTR = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';   

var ORG_TREE_LOADER = '/org/queryOrgs.json'; //机构树
var USER_GRID_STORE_URL = '/org/queryUsers4CascadeOrg.json';//根据用户信息查询该用户所属角色
var USER_ROLE_RELATION_STORE_URL = '/user/pageQueryRoles4User.json';//用户授予角色时显示的角色关系列表
var PAGESIZE=20;
var selNode;//当前节点

/***************************************OrgNodeForm组件**************************************************/
OrgNodeForm = Ext.extend(Ext.ux.Form, {
	
    constructor: function() {
        this.name = this.createTextField('<font color="red">*</font>机构名称:', 'name', '95%','','',64,'最大字符数64！');
        this.areaCode = this.createDictCombo('<font color="red">*</font>所属区域:','areaCode','95%','CORE.ORG.AREA',false);
        this.areaCode.allowBlank = false;
        this.theSort = this.createNumberField('<font color="red">*</font>顺序:','theSort','95%',0);
        this.theSort.maxLength = 10;
        this.theSort.maxLengthText = '最大字符数10！';
        this.descn = new Ext.form.TextArea({
            fieldLabel: '描述:',
            name: 'descn',
            readOnly: false,
            anchor: '95%',
            height:80,
            maxLength: 256,
            maxLengthText: '最大字符数256！'
        });
        
        this.level = this.createHidden('层级', 'level');
        this.parentId = this.createHidden('父节点id', 'parentId');
        this.orgSeq = this.createHidden('序列', 'orgSeq');
        this.orgId = this.createHidden('id', 'id');

        OrgNodeForm.superclass.constructor.call(this, {
        	anchor: '100%',
        	autoHeight:true,
        	layout:"tableform",
        	layoutConfig: {columns: 1},
        	labelWidth: 60,
            labelAlign :'right',
            frame:true,
            bodyStyle:"padding: 5px 5px 0",
            width: '100%',
            items: [
            	this.name,
            	this.areaCode,
            	this.theSort,
            	this.descn,
            	this.level,
            	this.parentId,
            	this.orgSeq,
            	this.orgId
            ],
            buttonAlign :'center',
            buttons: [
                      {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},  
                      {text:'修改',iconCls: 'edit',handler:this.updateFormClick,scope:this},
                      {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
              ]
        });
     },
     addFormClick: function() {
         if(this.getForm().isValid()) {
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/org/insertOrg.json', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
                 	orgTree.constructionInsertWindow.hide();
                 	if(this.parentId.getValue() == selNode.id){
                 		selNode.reload();
                 	}else{
	                 	selNode.parentNode.reload();
                 	}
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!" + BLANKSTR);
                 },
                 scope:this
         	});
         }
     },
     updateFormClick: function() {       //修改
         if(this.getForm().isValid()) {
         	this.getForm().submit({
                 waitMsg: '正在提交数据...',
                 url: '/org/updateOrg', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
                 	orgTree.constructionUpdateWindow.hide();
                 	selNode.parentNode.reload();
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
                 }
         	});
         }
     },
     onCloseClick: function(){ 			//关闭
         this.ownerCt.hide();
     }
});
/***************************************OrgNodeInsertWindow组件**************************************************/
OrgNodeInsertWindow = Ext.extend(Ext.Window,{
	constructionForm : null,
    constructor: function(a) {
        this.constructionForm = new OrgNodeForm();
        this.constructionForm.buttons[0].show();   //隐藏添加按钮
    	this.constructionForm.buttons[1].hide();   //显示修改按钮
        OrgNodeInsertWindow.superclass.constructor.call(this, {
            title: "添加机构",
            width: 400,
            anchor: '100%',
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});

/***************************************OrgNodeUpdateWindow组件**************************************************/
OrgNodeUpdateWindow = Ext.extend(Ext.Window, {
	constructionForm : null,
    constructor: function() {
    	this.constructionForm = new OrgNodeForm();
    	this.constructionForm.buttons[0].hide();   //隐藏添加按钮
    	this.constructionForm.buttons[1].show();   //显示修改按钮
    	OrgNodeUpdateWindow.superclass.constructor.call(this, {
        	title: "修改机构",
            width: 400,
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});

/***************************************UserForm组件**************************************************/
UserForm = Ext.extend(Ext.ux.Form, {
	
    constructor: function() {
        this.idHidden = this.createHidden('ID','id');
    	this.userName = this.createTextField('<font color="red">*</font>用户名称:', 'userName', '95%');
        this.userCode = this.createTextField('<font color="red">*</font>登录账号:', 'userCode', '95%', '登录账号不能为空！', 'alphanum');
        this.gender   = this.createDictCombo('<font color="red">*</font>性别:','gender', '95%', 'CORE.GENDER', false);
        this.phoneNo  = this.createTextField('电话号码:', 'phoneNo', '95%','', 'fixPhone');
        this.mPhoneNo = this.createTextField('移动号码:', 'mPhoneNo', '95%','', 'mobilePhone');  
        this.email    = this.createTextField('邮箱:', 'email', '95%', '', 'email');
        this.birthday =this.createDateField('出生日期:', 'birthday', 'Y-m-d', '95%');
        
        this.gender.allowBlank = false;
        this.phoneNo.allowBlank = true;
        this.mPhoneNo.allowBlank = true;
        this.email.allowBlank = true;
        this.birthday.allowBlank = true;
        
        this.orgName    = this.createHidden('orgName','orgName');
        this.orgId    = this.createHidden('orgId','orgId');

        UserForm.superclass.constructor.call(this, {
        	anchor: '100%',
        	autoHeight:true,
        	layout:"tableform",
        	layoutConfig: {columns: 1},
        	labelWidth: 60,
            labelAlign :'right',
            frame:true,
            bodyStyle:"padding: 5px 5px 0",
            width: '100%',
            items: [
            	this.userName,this.userCode,this.gender,this.phoneNo,this.mPhoneNo,
                this.email,this.birthday,this.orgName,this.orgId,this.idHidden	 
            ],
            buttonAlign :'center',
            buttons: [
                      {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},  
                      {text:'修改',iconCls: 'edit',handler:this.updateFormClick,scope:this},
                      {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
              ]
        });
     },
     addFormClick: function() {
     	 var userCode = this.userCode.getValue();
     	 var thisForm = this.getForm();
    	 //校验userCode是否存在
     	 if(userCode == "") {
     		Ext.Msg.alert('系统提示',BLANKSTR + '登陆账号不能为空！' + BLANKSTR);
     		return;
     	 }
         Ext.Ajax.request({
         	url: '/user/isExistUser',
             method: 'POST',
             params:{'id':-1, 'userCode':userCode},
             success: function(response, options){
             	var res = Ext.decode(response.responseText);
                 if(res.success == true){//不重复，表单提交
                  	Ext.Msg.alert('系统提示',BLANKSTR + '登陆账号已存在' + BLANKSTR);
                 	return;              	 
                 }else {
                	 if(thisForm.isValid()) {
                		 thisForm.submit({
                             waitMsg: '正在提交数据...',
                             url: '/user/insertUser.json', 
                             method: 'POST',
                             success: function(form, action) { 
                             	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加成功!" + BLANKSTR);
                             	orgTree.addUserWindow.hide();
                             	orgUserGrid.store.baseParams = {orgId:selNode.id}; 
								orgUserGrid.store.load({
						            params:{start:0, limit:PAGESIZE}
						        });
                             },
                             failure: function(form, action) {
                             	Ext.MessageBox.alert("系统提示:", BLANKSTR + "添加失败!" + BLANKSTR);
                             }
                     	});
                     }
                 }
               },
               failure: function(response, options){
             	  Ext.Msg.alert( "提示", "操作失败!,请联系管理员" );
             	  return;
               }
        }); 
     },
//     updateFormClick: function() {       //修改
//         if(this.getForm().isValid()) {
//         	this.getForm().submit({
//                 waitMsg: '正在提交数据...',
//                 url: '/org/updateOrg', 
//                 method: 'POST',
//                 success: function(form, action) { 
//                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改成功!" + BLANKSTR);
//                 	orgTree.constructionUpdateWindow.hide();
//                 	selNode.parentNode.reload();
//                 },
//                 failure: function(form, action) {
//                 	Ext.MessageBox.alert("系统提示:", BLANKSTR + "修改失败!" + BLANKSTR);
//                 }
//         	});
//         }
//     },
     onCloseClick: function(){ 			//关闭
         this.ownerCt.hide();
     }
});
/***************************************UserInsertWindow组件**************************************************/
UserInsertWindow = Ext.extend(Ext.Window,{
	constructionForm : null,
    constructor: function(a) {
        this.constructionForm = new UserForm();
        this.constructionForm.buttons[0].show();   //隐藏添加按钮
    	this.constructionForm.buttons[1].hide();   //显示修改按钮
        UserInsertWindow.superclass.constructor.call(this, {
            title: "添加用户",
            width: 400,
            anchor: '100%',
            autoHeight:true,
            constrainHeader:true,
            resizable : false,
            plain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: [this.constructionForm]
        });
    }
});
/***********************OrgTree组件**************************
 *author        ：zhuzengpeng
 *description   : 机构管理--机构树
 *date          : 2013-08-12
******************************************************************/
OrgTree  = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(width, height) {
		this.rightMenu = new Ext.menu.Menu({
			items : [ {
				text : '添加同级节点',
				iconCls : 'add',
				handler : this.onAddSiblingNode,
				scope : this
			}, '-', {
				text : '添加子节点',
				iconCls : 'add',
				handler : this.onAddChildNode,
				scope : this
			}, '-', {
				text : '修改节点',
				iconCls : 'edit',
				handler : this.onUpdateNode,
				scope : this
			}, '-', {
				text : '删除节点',
				iconCls : 'delete',
				handler : this.onDeleteNode,
				scope : this
			}, '-', {
				text : '保存排序',
				iconCls : 'save',
				handler : this.onSaveOrder,
				scope : this
			}, '-', {
				text : '展开节点',
				iconCls : 'expand',
				handler : this.onExpandNode,
				scope : this
			}, '-', {
				text : '合拢节点',
				iconCls : 'collapse',
				handler : this.onCollapseNode,
				scope : this
			}, '-', {
				text : '刷新节点',
				iconCls : 'refresh',
				handler : this.onRefreshNode,
				scope : this
			}, '-', {
				text : '添加用户',
				iconCls : 'user_add',
				handler : this.onAddUser,
				scope : this
			}]
		});
		
		this.constructionInsertWindow = new OrgNodeInsertWindow();       
        this.constructionUpdateWindow = new OrgNodeUpdateWindow();
        this.addUserWindow = new UserInsertWindow();
		
		OrgTree.superclass.constructor.call(this, {
			title : '机构树',
			region:'west',
			collapsible :true,
			autoScroll : true,
			enableDD : true,//是否支持拖拽效果
			containerScroll : true,//是否支持滚动条
			width : width,
			height : height,
			border : true,
			frame : false,
			rootVisible : false,//是否显示根节点
			margins : '0 0 0 0',
			loader : new Ext.tree.TreeLoader({
				dataUrl : ORG_TREE_LOADER + "?id=0"
			}),
			root : new Ext.tree.AsyncTreeNode({
				id: "0",
				level: "0",
				hidden: false
			}),
			listeners : {
				'beforedblclick':{fn: this.beforedblClick, scope: this},
				'contextmenu' : {
					fn : this.onRightMenuClick,
					scope : this
				 },				
				'beforeload' : {//在节点加载之前触发，返回false取消操作
					fn : this.onBeforeLoad,
					scope : this
				}
			},
			tbar : new Ext.Toolbar({
				items : [ {
					iconCls : "refresh",
					text : "刷新",
					handler : function() {
						orgTree.root.reload();
					}
				}, {
					text : "展开",
					iconCls : "expand",
					handler : function() {
						orgTree.expandAll();
					}
				}, {
					text : "收起",
					iconCls : "collapse",
					handler : function() {
						orgTree.collapseAll();
					}
				} ]
			})
		});
	},
	onAddSiblingNode:function(){
		var win = this.constructionInsertWindow;
		win.show();
		win.constructionForm.getForm().reset();
		win.constructionForm.level.setValue(selNode.attributes.level);
		win.constructionForm.parentId.setValue(selNode.attributes.parentId);
	},
	onAddChildNode:function(){
		var win = this.constructionInsertWindow;
		win.show();
		win.constructionForm.getForm().reset();
		var level = Number(selNode.attributes.level)+Number(1);
		win.constructionForm.level.setValue(level);
		win.constructionForm.parentId.setValue(selNode.attributes.id);
	},
	onUpdateNode:function(){
		var win = this.constructionUpdateWindow;
		win.show();
		win.constructionForm.name.setValue(selNode.attributes.text);
		win.constructionForm.areaCode.setValue(selNode.attributes.areaCode);
		win.constructionForm.theSort.setValue(selNode.attributes.theSort);
		win.constructionForm.descn.setValue(selNode.attributes.descn);
		win.constructionForm.level.setValue(selNode.attributes.level);
		win.constructionForm.parentId.setValue(selNode.attributes.parentId);
		win.constructionForm.orgSeq.setValue(selNode.attributes.orgSeq);
		win.constructionForm.orgId.setValue(selNode.attributes.id);
	},
	onDeleteNode:function(){
		//先展开选择的节点
    	selNode.expand(false, true, function() {
    		if(!selNode.leaf && selNode.childNodes.length > 0) {
        		Ext.Msg.alert('提示', "选择的节点包含子节点，请先删除所有子节点。");
        		return
        	}
            Ext.Msg.confirm("提示", "是否确定删除？", function(btn, text) {
                if (btn == 'yes') {                  
                    this.body.mask('提交数据，请稍候...', 'x-mask-loading');

                    Ext.Ajax.request({
			            url     : '/org/deleteOrg',
			            params  : {id: selNode.id},
			            success : function() {
			                this.body.unmask();
			                Ext.MessageBox.alert('提示', '操作成功！');
			                selNode.parentNode.reload();
			            },
			            failure : function(){
			            	this.body.unmask();
			                Ext.MessageBox.alert('提示', '操作失败！');
			            },
			            scope   : this
			        });
                }
            }, this);
    	}, this);
	},
	onSaveOrder:function(){
		var thiz = this;
		selNode.expand(false, true, function() {
			if(selNode.childNodes.length ==0){
				Ext.MessageBox.alert('提示', selNode.text+'机构下没有子机构，无需排序!');
				return ;
			}
			var childs = [];
	    	for (var i = 0; i < selNode.childNodes.length; i++) {
	            var child = selNode.childNodes[i];
	            childs.push(child.id);
	        }
	    	thiz.body.mask('提交数据，请稍候...', 'x-mask-loading');
	        Ext.Ajax.request({
	            url     : "/org/saveOrgOrder.json",
	            params  : {childIds: childs.join(","), parentId: selNode.id},
	            success : function() {
	            	thiz.body.unmask();
	                Ext.MessageBox.alert('提示', '操作成功！');
	            },
	            failure : function(){
	            	thiz.body.unmask();
	                Ext.MessageBox.alert('提示', '操作失败！');
	            },
	            scope   : this
	        });
			
		});
	},
	onExpandNode:function(){
        if (selNode == null) {
            this.getRootNode().eachChild(function(n) {
                n.expand(false, true);
            });
        } else {
            selNode.expand(false, true);
        }
	},
	onCollapseNode:function(){
        if (selNode == null) {
            this.getRootNode().eachChild(function(n) {
                n.collapse(true, true);
            });
        } else {
            selNode.collapse(true, true);
        }
	},
	onRefreshNode:function(){
		if(selNode == null){
    		this.getRootNode().reload();
    		return;
    	}
    	if(selNode.leaf) {
    		selNode.parentNode.reload();
    	} else {
    		selNode.reload();
    		selNode.expand(false, true);
    	}
	},
	onAddUser:function(){
		var win = this.addUserWindow;
		win.show();
		win.constructionForm.orgId.setValue(selNode.attributes.id);
		win.constructionForm.orgName.setValue(selNode.attributes.text);
	},
	onRightMenuClick: function(node, e) {
		selNode = node;
		this.rightMenu.showAt(e.getXY());
	},
	beforedblClick: function(node, e) {
		orgUserGrid.store.baseParams = {orgId:node.id}; 
		orgUserGrid.store.load({
            params:{start:0, limit:PAGESIZE}
        });
		return false;
	},
	onBeforeLoad : function(node, e) {
		var pid = node.attributes.id;
		this.loader.dataUrl = ORG_TREE_LOADER + '?id=' + pid; //定义子节点的Loader
	}
});

/***********************OrgUserGrid组件**************************
 *author        ： zhuzengpeng
 *description   : 机构管理--用户列表
 *date          : 2013-08-12
******************************************************************/
OrgUserGrid = Ext.extend(UxGrid, {
    pageSizeCombo: null,
    vtbar:null,             //面板顶部的工具条  
    vbbar:null,             //面板底部的工具条
    store:null,
    constructor: function(height, width){
        this.store = new Ext.data.Store({          //Grid Store
            proxy: new Ext.data.HttpProxy({url: USER_GRID_STORE_URL, method: 'POST'}),
            reader: new Ext.data.JsonReader({totalProperty: 'total', root:'rows'},[
                    {name:'userName'},{name:'userCode'},{name:'orgId'},{name:'gender_Name'},
                    {name:'phoneNo'},{name:'mPhoneNo'},{name:'email'}
            ])
        });
        
        this.vbbar= this.createPagingToolbar(PAGESIZE);    
        
        OrgUserGrid.superclass.constructor.call(this, {
            region:'center',
            title: '用户列表',
            stripeRows: true,
         //  autoExpandColumn: 'remark',
            frame: true,
            height: height,
            viewConfig: {
                forceFit: false
            },
            loadMask: {
                msg : '正在载入数据,请稍候...'
            },
            sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
            cm: new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
                {header:'用户名称',dataIndex:'userName',width:100,sortable: true},
                {header:'登陆帐号',dataIndex:'userCode',width:120,sortable: true},
                {header:'所属机构',dataIndex:'orgId',width:120,sortable: true},
                {header:'性别',dataIndex:'gender_Name',width:60,sortable: true},
                {header:'电话号码',dataIndex:'phoneNo',width:100,sortable: true},
                {header:'移动号码',dataIndex:'mPhoneNo',width:120,sortable: true},
                {header:'邮箱',dataIndex:'email',width:160,sortable: true}
            ]),
            bbar: this.vbbar,
            ds: this.store
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
/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function() {
    Ext.QuickTips.init();                               //开启快速提示
    Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
    Ext.override(Ext.Component, {
        stateful: false
    });    
    orgTree = new OrgTree(280, "");
    orgUserGrid = new OrgUserGrid();
    new Ext.Viewport({
    	layout: 'border',
    	items:[
		orgTree,
		orgUserGrid
    	]
    });
   
});