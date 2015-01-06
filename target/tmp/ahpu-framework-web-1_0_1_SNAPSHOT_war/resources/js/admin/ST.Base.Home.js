Ext.namespace('Home');

Home.Logout = function() {
	Ext.MessageBox.confirm('退出系统', "您确认退出系统吗？", function(a,b,c){
		if(a == 'yes'){
			var casProfile = document.getElementById("casPorfile").value;
			if(casProfile == "cas"){
				window.location.href = "/j_spring_cas_security_logout";
			}else{
				window.location.href = "/j_spring_security_logout";
			}	
		}			
	});
};
Home.ClickNode = function(node) {
	if (!node.leaf) {
		return;
	}
	Home.ClickTopTab(node);
};
Home.ClickTopTab = function(node) {
	var b = Ext.getCmp("centerTabPanel");
	var panelId = "HomePanel_" + node.id;
	var d = b.getItem(panelId);
	var src = node.attributes.resource.action;

	if (d == null) {
		var panelItem = new Ext.Panel({
			id:panelId,
			title:node.attributes.text,
			html:"<iframe frameborder='no' border='0' width='100%' height='100%' noresize='noresize' src='" + src + "'>"
		});
		d = b.add(panelItem);
		b.activate(d);
	} else {
		b.activate(d);
	}
	var title = node.ownerTree.title+" -> ";
	var parentNode = "";
	var text = node.attributes.text;
	for(var i =1; i<6 ; i++){
		parentNode = node.parentNode.attributes.text;
		if(typeof(parentNode)=="undefined"){
			break;
		}else{
			node = node.parentNode;
			title += parentNode+" -> ";
		}
	}
	Ext.getCmp("centerPanel").setTitle(title+text);
	Ext.getCmp(panelId).path = title+text;
};

//添加页面到tab
Home.AddTab = function(id, name, action) {
	var b = Ext.getCmp("centerTabPanel");
	var path = b.getActiveTab().path;
	var panelId = "HomePanel_" + id;
	var d = b.getItem(panelId);
	if (d == null) {
		var panelItem = new Ext.Panel({
			id:panelId,
			title:name,
			html:"<iframe frameborder='no' border='0' width='100%' height='100%' noresize='noresize' src='" + action + "'>"
		});
		d = b.add(panelItem);
		b.activate(d);
	} else {
		b.activate(d);
	}	
	Ext.getCmp("centerPanel").setTitle(path+" -> "+name);
	Ext.getCmp(panelId).path = path+" -> "+name;
};

//根据页面ID关闭此页面
Home.closeTab = function(id) {
	var panelId = "HomePanel_" + id;
	var b = Ext.getCmp("centerTabPanel");
	var d = b.getItem(panelId);
	if (d != null) {
		b.remove(d);
	}
};

var onLineWin = null;
var gridAA = null;
Home.OpenOnLineWin = function() {
	if(onLineWin == null) {
		var fields = [
	             {name: 'userCode'},
	             {name: 'userName'},
	             {name: 'lastLoginTime'}];
		var store = new Ext.data.Store({
            proxy  : new Ext.data.HttpProxy({url: "./security/findOnlineUsers.json"}),
            reader : new Ext.data.JsonReader({
                root          : "",
                totalProperty : "totalCount",
                idProperty    : "id",
                fields        : fields
            })
        });
		var grid = new Ext.grid.GridPanel({
			store: store,
			columns: [
			  {id:'userCode',header: '用户账号', width: 80, sortable: true, dataIndex: 'userCode'},
              {header: '用户名称', width: 80, sortable: true, dataIndex: 'userName'},
              {header: '最近登录时间', width: 130, sortable: true, dataIndex: 'lastLoginTime'}
			  ],
			stripeRows: true,
			tbar : [{
	            text    : '刷新',
	            iconCls : 'refresh',
	            handler : function() {store.load();}
	        }]
		});
		gridAA = grid;
		onLineWin = new Ext.Window({
	        closable : true,
	        border   : false,
	        width    : 400,
	        height   : 300,
	        title	 : "当前在线用户",
	        modal    : true,
	        plain    : true,
	        maximizable: true,
	        items:   [grid],
	        closeAction: 'hide',
	        layout:'fit'
	    });
		onLineWin.show();
		onLineWin.center();
		
		store.load();
	} else {
		gridAA.store.load();
		onLineWin.show();
		onLineWin.center();
	}
};

var HomePage = Ext.extend(Ext.Viewport, {
	north: new Ext.Panel({
        region: 'north',
        height: 65,
        border: false,
        frame: true,
        contentEl: "app-header",
        id: "north-Panel"
    }),
	center: null,
	west: new Ext.ux.AccordionPanel({
		region: 'west',
        id : 'west-panel', 
        title: '导航菜单',
        split: true,
        animate: true,
        width: 200,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
		plugins: [Ext.ux.PanelCollapsedTitle],
        margins: '0 0 0 2',
        items: []
	}),
	south: new Ext.Panel({
		region: "south",
		id: 'south-panel',
		border: false,
		margins: '0 0 0 2'
		/*bbar: [{
			text: "退出系统",
			iconCls: "btn-logout",
			handler: function() {
				Home.Logout();
			}
		}, "-", {
			text: "在线用户",
			iconCls: "btn-onlineUser",
			hide:true,
			handler: function() {
				Home.OpenOnLineWin();
			}
		}, "-", {
			text: "个人设置",
			id: "personConfig",
			iconCls: "setting",
			handler: function() {
				ST.base.PersonConfig.showWin("personConfig");
			}
		}, "->", {
			xtype: "tbfill"
		}, {
			xtype: "tbseparator"
		}, /*new Ext.Toolbar.TextItem('技术支持 <a href=http://www.starit.com.cn target="_blank">苏州科大恒星信息技术有限公司</a>'), {
			xtype: "tbseparator"
		},{
			pressed: false,
			text: "与我们联系",
			handler: function() {
				Ext.ux.Toast.msg("联系我们", " 电话：0551-5396784<br/>网址：http://www.starit.com.cn");
			}
		}, "-", {
			text: "收展",
			iconCls: "btn-expand",
			handler: function() {
				var a = Ext.getCmp("north-Panel");
				var b = Ext.getCmp("west-panel");
				if (a.collapsed) {
					b.expand(true);
					a.expand(true);
				} else {
					b.collapse(true);
					a.collapse(true);
				}
			}
		}]*/
	}),
	constructor: function() {
		var tabPanel = new Ext.TabPanel({
			id: "centerTabPanel",
			deferredRender: true,
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				autoScroll: true,
				closable: true
			},
			items: [{
	                title: '我的工作台',
	                path :'主页 -> 我的工作台',
	                closable: false,
	                iconCls: 'home',
	                autoScroll: true,
                  	frame:true,  
                  	html:"<iframe frameborder='no' border='0' width='100%' height='100%' noresize='noresize' src='/home/index'>"
	            }],
			plugins: new Ext.ux.TabCloseMenu(),
			listeners: {
				"tabchange": function(p){
					if(typeof(p.activeTab.path)!=undefined){
						Ext.getCmp("centerPanel").setTitle(p.activeTab.path);
					}
				}
			}
		});
		this.center = new Ext.Panel({
			id:'centerPanel',
			title:'主页 -> 我的工作台',
			region:'center',
			layout:'fit',
			items:[tabPanel]
		});
		HomePage.superclass.constructor.call(this, {
			layout: "border",
			layoutConfig:{animate:true},
			items: [this.north, this.west, this.center, this.south]
		});
		this.afterPropertySet();
		this.loadWestMenu();
	},
	afterPropertySet: function() {
		//
	},
	loadWestMenu: function() {
		var westPanel = Ext.getCmp("west-panel");
		Ext.Ajax.request({
			url: "/menu/queryMenus4User.json",
			success: function(response, options) {
				var arr = eval(response.responseText);
				for (var i = 0; i < arr.length; i++) {
					var root = arr[i];
					var panel = new Ext.tree.TreePanel({
						id: root.id,
						title: root.text,
						iconCls: (root.iconCls == null || root.iconCls == '' ||root.iconCls.trim().length == 0)?"picture" : root.iconCls,
						layout: "fit",
						animate: true,
						border: false,
						expandable:true,
						autoScroll: true,
						loader: new Ext.tree.TreeLoader({
					    	url:"/menu/queryMenus4User.json"
					    }),
						root: new Ext.tree.AsyncTreeNode({
							id: root.id,
							hidden: true
						}),
						listeners: {
							"click": Home.ClickNode
						},
						rootVisible: false
					});
					westPanel.add(panel);
//					panel.on("expand", function(p) {
//						//alert();
//					});
				}
				westPanel.doLayout();
			}
		});
	}
});

/***风格转换****************/
function changeStyle(style) {
    Ext.util.CSS.swapStyleSheet("theme", "resources/css/" + style + ".css");
}

Ext.onReady(function(){
    new HomePage();
    Ext.select("#south-panel .x-panel-body").hide();
});