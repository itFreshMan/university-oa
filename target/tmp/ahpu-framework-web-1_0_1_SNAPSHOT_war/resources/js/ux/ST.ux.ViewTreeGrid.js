Ext.namespace("ST.ux");
Ext.QuickTips.init();

ST.ux.ViewTreeGrid = Ext.extend(Ext.Viewport, {
	typeName: '节点',
	urlTreeQuery: "/",
    //checkbox扩展标识
    showToolBar: false,
    showContextMenu: true,
    beforedblclickFn: function(){},
    treeWidth : '280', //左边树的宽度
    
    urlGridQuery : "",  
	urlAdd: "/",
	urlEdit: "/",
	urlLoadData: "/",
	urlRemove: "/",
	dlgWidth: 400,
	dlgHeight: 300,
	girdColumns: [],
	queryFormItms: [],
    addTitle: "增加数据",
    editTitle: "更新数据",
    gridTitle: "数据列表",
    displayEast: false,
    autoExpandColumn: "descn",
    dialogLabelWidth: 70,
    addButtonOnToolbar: function(toolbar, index){},
    //加载combobox的时候对选项进行选择
    loadEditFormSucHandler: function() {},
    clickType: 'rowdblclick',
    rowclickFn: function(){},
    addMenuItem: function(items) {},
    //是否显示增删改按钮
    displayButton: true,
    //增加、更新表单是否支持上传文件
    isFileUpload: false,
    queryFormHeight: 92,
    eastGridColumn: [],
    
	createTree: function() {
		this.tree = new Ext.tree.TreePanel({
		    region: "west",
		    autoScroll: true,
		    animate: true,
		    width: this.treeWidth,
		    collapsible: (this.centerRegion=='center' ?  false : true),
		    split: true,
		    enableDD: false,
		    containerScroll: true,
		    border: false,
		    tbar: this.buildToolbar(),
		    loader: new Ext.tree.TreeLoader({
		    	url: this.urlTreeQuery
		    }),
			root: new Ext.tree.AsyncTreeNode({
				id: "0",
				level: "0",
				hidden: false
			}),
			rootVisible: false
		});
		
		this.tree.getRootNode().expand();
		this.tree.addListener("beforedblclick", this.beforedblclickFn, this);
	},
	
	buildToolbar: function() {
		if(!this.showToolBar)
			return null;
		
        var toolbar = [{
            text    : '展开',
            iconCls : 'expand',
            id		: 'expandId',
            tooltip : '展开' + this.typeName,
            handler : this.expandAll.createDelegate(this)
        }, {
            text    : '合拢',
            id		: 'collapseId',
            iconCls : 'collapse',
            tooltip : '合拢' + this.typeName,
            handler : this.collapseAll.createDelegate(this)
        }, {
            text    : '刷新',
            id		: 'refreshId',
            iconCls : 'refresh',
            tooltip : '刷新' + this.typeName,
            handler : this.refresh.createDelegate(this)
        }];
        return toolbar;
    },
    
    expandAll: function() {
    	var node = this.getSelectedNode();
        if (node == null) {
            this.tree.getRootNode().eachChild(function(n) {
                n.expand(false, true);
            });
        } else {
            node.expand(false, true);
        }
    },
    
    collapseAll: function() {
    	var node = this.getSelectedNode();
        if (node == null) {
            this.tree.getRootNode().eachChild(function(n) {
                n.collapse(true, true);
            });
        } else {
            node.collapse(true, true);
        }
    },
    
    refresh: function() {
    	var node = this.getSelectedNode();
    	if(node == null){
    		this.tree.getRootNode().reload();
    		return;
    	}
    	if(node.leaf) {
    		node.parentNode.reload();
    	} else {
    		node.reload();
    		node.expand(false, true);
    	}
    },
    
    // 返回当前选中的节点，可能为null
    getSelectedNode: function() {
        return this.tree.getSelectionModel().getSelectedNode();
    },
    
    prepareContextTree: function(node, e) {
        node.select();
        this.tree.contextMenu.showAt(e.getXY());
    },
    
    createForm : function() {
		this.queryForm = new Ext.form.FormPanel({ 
			region: 'north',
		    title: "查询条件", 
		    id: "form-panel",
		    frame : true,
		    collapsible: true,
		    margins : '0 0 0 0',
		    buttonAlign: 'center',
		    height:this.queryFormHeight, 
		    bodyStyle:'padding:0 0 0 2', 
		    items: this.queryFormItms, 
		    plugins: [Ext.ux.PanelCollapsedTitle],
		    scope: this,
		    buttons: [{ 
				text: '查询', 
				type:'button', 
				id:'login', 
				iconCls:'query',
				handler: this.queryData,
				scope: this
			},{ 
				text: '重置', 
				type:'reset', 
				id:'clear', 
				iconCls:'redo',
				handler: this.reset,
				scope: this
			}]
		});
	},
	// 初始化ColumnModel
    buildColumnModel: function() {
        this.sm = new Ext.grid.CheckboxSelectionModel();
        this.columnHeaders = [];
        if(this.rowExpander != null)
        	this.columnHeaders.push(this.rowExpander);
        this.columnHeaders.push(new Ext.grid.RowNumberer());
        this.columnHeaders.push(this.sm);

        for (var i = 0; i < this.girdColumns.length; i++) {
            var col = this.girdColumns[i];
            if (col.hideGrid === true) {
                continue;
            }
            col.renderer = this[col.renderer];
            if(col.fontColor)
            	col.renderer = this.columnColorRenderer.createDelegate(this);
            this.columnHeaders.push(col);
        }
    },
    
    columnColorRenderer: function(value, metadata, record, rowIndex, colIndex) {
    	var col = this.columnHeaders[colIndex];
    	var arr = col.fontColor.split(",");
    	for(var i=1, len=arr.length; i<len;) {
    		if(record.json[arr[0]] == arr[i]) {
    			metadata.attr = 'style="font-weight:bold;color:' + arr[i+1] + ';"';
    			break;
    		}
    		i = i + 2;
    	}
		return value;
    },
    
    buildStore: function() {
    	var fields = [];

        for (var i = 0; i < this.girdColumns.length; i++) {
            var col = this.girdColumns[i];
            col['name'] = col.dataIndex;
            fields.push(col);
        }
    	this.store = new Ext.data.Store({
            proxy  : new Ext.data.HttpProxy({url: this.urlGridQuery}),
            reader : new Ext.data.JsonReader({
                root          : "rows",
                totalProperty : "total",
                idProperty    : "id",
                fields        : fields
            }),
            remoteSort : true,
            scope:this
        });
    },
    
	createGrid: function() {
    	this.buildColumnModel();
    	this.buildStore();
    	
    	var pageSizeCombo = new Ext.form.ComboBox({
         	name : 'pagesize',
         	allowBlank : false,
        	mode : 'local',
         	triggerAction : 'all',
         	editable : false,
         	width: 70,
         	anchor : '90%',
         	store : new Ext.data.SimpleStore({
               fields : ['text', 'value'],
               data : [['10条/页', '10'], ['20条/页', '20'], ['50条/页', '50'], ['100条/页', '100']]
         	}),
         	value:'20',  
         	valueField : 'value',
         	displayField : 'text',
         	listeners: {
				'select' : function(comboBox, recored, index) {
	    			paging.pageSize = parseInt(comboBox.getValue()); 
			    	this.store.load({
		            	params:{start:0, limit:comboBox.getValue()}
		        	});
		    	}.createDelegate(this)
		    }	
	    });
        
        var paging = new Ext.PagingToolbar({
            pageSize: parseInt(pageSizeCombo.getValue()),
            store: this.store,
            displayInfo: true,
            displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
            emptyMsg: "没有记录",
            scope:this,
            plugins: [new Ext.ux.ProgressBarPager()]
        });
        
	    this.grid = new Ext.grid.GridPanel({
	    	viewConfig: {
	    		templates: {
	    			cell: new Ext.Template(
		    			'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
	    	            '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
	    	            '</td>'
	    			)
	    		}
	    	},
	        store: this.store,
	        region: 'center',
	        bodyStyle:'width:100%',
       		autoWidth:true,
       		frame : true,
       		sm: this.sm,
       		margins : '0 0 0 0',
       		autoScroll : true, 
       		plugins: this.rowExpander,
	        columns: this.columnHeaders,
	        stripeRows: true,
	        autoExpandColumn: this.autoExpandColumn,
	        loadMask:"正在加载表格数据,请稍等...",
	        title: this.gridTitle,
	        bbar: paging,
	        scope:this
	    });
	    var index = 11;
	    
	    this.grid.getBottomToolbar().insertButton(index++,'-');
	    	this.grid.getBottomToolbar().insertButton(index++, pageSizeCombo);

	    if(this.displayButton) {
	    	this.grid.getBottomToolbar().insertButton(index++,'-');
	    	this.grid.getBottomToolbar().insertButton(index++,new Ext.Button({text:"添加",iconCls: 'add', id:'addEntity'}));
	    	this.grid.getBottomToolbar().insertButton(index++,new Ext.Button({text:"更新",iconCls: 'edit', id:'editEntity'}));
	    	this.grid.getBottomToolbar().insertButton(index++,new Ext.Button({text:"删除",iconCls: 'delete', id:'delEntity'}));
	    }
	    this.addButtonOnToolbar(this.grid.getBottomToolbar(), index);
	    
	    this.grid.addListener(this.clickType, this.rowclickFn, this);
	    this.store.on("beforeload", function(){
            Ext.apply(this.store.lastOptions.params, this.queryForm.getForm().getFieldValues());
      	}, this);
		return this.grid;
	},
    center: null,
    
    queryData: function() {
		Ext.apply(this.store.lastOptions.params, this.queryForm.getForm().getFieldValues());
		this.grid.store.reload();
		if(this.east != null) {
			if(this.east.getXType() == "grid")
				this.east.store.removeAll();
			else
				this.east.getRootNode().removeAll(true);  
		}
    },
    
    reset: function() {
    	this.queryForm.getForm().reset();
    },
    
    // 检测至少选择一个
    checkOne: function() {
        var selections = this.grid.getSelectionModel().selections;
        if (selections.length == 0) {
            Ext.MessageBox.alert("提示", "请选择一条的记录！");
            return false;
        } else if (selections.length != 1) {
            Ext.MessageBox.alert("提示", "不能选择多行！");
            return false;
        }
        return true;
    },
    
    // 检测必须选择一个
    checkMany: function() {
        var selections = this.grid.getSelectionModel().selections;
        if (selections.length == 0) {
            Ext.MessageBox.alert("提示", "请至少选择一条的记录！");
            return false;
        }
        return true;
    },
    
    registerHandler: function() {
    	//添加
    	var btn = Ext.getCmp("addEntity");
        btn.on("click", function(){
        	this.buildAddDialog();
	    	this.addDialog.show(Ext.get("addEntity"));
        }, this);
        
        //编辑 
        btn = Ext.getCmp("editEntity");
        btn.on("click", function(){
        	this.buildEditDialog();
        	if (this.checkOne()) {
	            this.editDialog.show(Ext.get("editEntity"));
	            this.editFormPanel.load({waitMsg : '正在载入数据...', url: this.urlLoadData, params : {id: this.grid.getSelectionModel().selections.items[0].id},success: this.loadEditFormSucHandler});
	        }
        }, this);
        
        //删除
        btn = Ext.getCmp("delEntity");
        btn.on("click", function(){
        	this.delData();
        }, this);
    },
    
    buildItems: function(flag) {
    	var items = [];
        for (var i = 0; i < this.girdColumns.length; i++) {
            var col = this.girdColumns[i];
            if (col.hideForm == flag || col.hideForm == "all") {
                continue;
            }
            col['fieldLabel'] = col.header;
            if(col.fieldtype) col.xtype = col.fieldtype;         
            items.push(col);
        }
        
        Ext.each(items, function(item) {
            Ext.applyIf(item, {
            	allowBlank: true,
                anchor: '90%'
            });
        });
        return items;
    },
    
    // 创建弹出式对话框
    buildAddDialog : function() {
    	this.flag = "add";
        this.addFormPanel = new Ext.form.FormPanel({
            defaultType: 'textfield',
            labelAlign: 'right',
            labelWidth: this.dialogLabelWidth,
            frame: true,
            id: "addFormPanelID",
            autoScroll: true,
            buttonAlign: 'center',
            url: this.urlAdd,
            items: this.buildItems("add"),
            fileUpload: this.isFileUpload,
            scope: this,
            buttons: [{
                text: '确定',
                scope: this,
                handler: function() {
                    if (this.addFormPanel.getForm().isValid()) {
                        this.addFormPanel.getForm().submit({
                        	waitMsg : '正在处理，请稍等...',
                            success: function(a, b) {
                                this.addDialog.close();
                                this.grid.store.reload();
                            },
                            failure: function(a, b) {
								Ext.MessageBox.alert("提示", b.result.message);
                            },
                            scope: this
                        });
                    }
                }
            },{
                text: '取消',
                scope: this,
                handler: function() {
			    	this.addDialog.close();
                }
            }]
        });
        
        this.addDialog = new Ext.Window({
            //layout: 'fit',
            title: this.addTitle,
            modal: true,
            width: this.dlgWidth,
            height: this.dlgHeight,
            closeAction: 'close',
            items: [this.addFormPanel]
        });
    },
    
    // 创建弹出式对话框
    buildEditDialog : function() {
    	this.flag = "edit";
    	var items = this.buildItems("edit");
    	var reader = new Ext.data.JsonReader({}, items);
        this.editFormPanel = new Ext.form.FormPanel({
            defaultType: 'textfield',
            labelAlign: 'right',
            labelWidth: 70,
            frame: true,
            id: "editFormPanelID",
            autoScroll: true,
            buttonAlign: 'center',
            url: this.urlEdit,
            loadMask : true,   
            reader: reader,
            items: items,
            fileUpload: this.isFileUpload,
            scope: this,
            buttons: [{
                text: '确定',
                scope: this,
                handler: function() {
                    if (this.editFormPanel.getForm().isValid()) {
                        this.editFormPanel.getForm().submit({
                        	waitMsg : '正在处理，请稍等...',
                            success: function() {
                                this.editDialog.close();
                                this.grid.store.reload();
                            },
                            failure: function(a, b) {
                            	Ext.MessageBox.alert("提示", b.result.message);
                            },
                            scope: this
                        });
                    }
                }
            },{
                text: '取消',
                scope: this,
                handler: function() {
			    	this.editDialog.close();
                }
            }]
        });
        
        this.editDialog = new Ext.Window({
            //layout: 'fit',
            title: this.editTitle,
            modal: true,
            width: this.dlgWidth,
            height: this.dlgHeight,
            closeAction: 'close',
            items: [this.editFormPanel]
        });
    },
    
    delData: function() {
        if (this.checkMany()) {
            Ext.Msg.confirm("提示", "是否确定？", function(btn, text) {
                if (btn == 'yes') {
                    this.grid.body.mask('正在处理，请稍等...', 'x-mask-loading');
                    Ext.Ajax.request({
                        url     : this.urlRemove,
                        params  : {id : this.grid.getSelectionModel().selections.items[0].id},
                        success : function() {
                            this.grid.body.unmask();
                            Ext.MessageBox.alert('提示', '操作成功！');
                            this.grid.store.reload();
                        },
                        failure : function(){
                        	this.grid.body.unmask();
                        },
                        scope   : this
                    });
                }
            }.createDelegate(this));
        }
    },
    
    prepareContextGrid: function(g, rowIndex, e) {
        g.getSelectionModel().selectRow(rowIndex, false);
        g.contextMenu.showAt(e.getXY());
    },
    
    createCenter: function() {
    	this.createForm();
		this.createGrid();
		var items = [this.queryForm, this.grid];
    	var panel = new Ext.Panel({  
            region: "center",
            collapsed:false,//收缩的  
            autoScroll : true,// 自动卷轴  
            frame:true,//渲染框架  
            border : true,//边框  
            layout: "border",
            items: items,
            margins : '0 0 0 0'
    	});
    	
    	this.store.load({
            params:{start:0, limit:this.grid.getBottomToolbar().pageSize}
        });
		
		if(this.displayButton)
			this.registerHandler();
		
		if(this.displayButton) {
			items = [{
	            id      : 'editMenuId',
	            handler : function() {
						var btn = Ext.getCmp("editEntity");
						btn.fireEvent("click");
	            	}.createDelegate(this),
	            iconCls : 'edit',
	            text    : '编辑'
	        }, {
	            id      : 'deleteMenuId',
	            handler : function() {
						var btn = Ext.getCmp("delEntity");
						btn.fireEvent("click");
	            	}.createDelegate(this),
	            iconCls : 'delete',
	            text    : '删除'
	        }];
	        
	        this.addMenuItem(items);
			this.grid.on('rowcontextmenu', this.prepareContextGrid, this);
			this.grid.contextMenu = new Ext.menu.Menu({
	            id    : 'copyCtx',
	            items : items
	        });
			
		}
    	return panel;
    },
   
    constructor: function() {
		this.createTree();
		
		var items = [this.tree, this.createCenter()];
		ST.ux.ViewTreeGrid.superclass.constructor.call(this, {
			layout: "border",
			items: items
		});
		
		if(this.showContextMenu) {
			items = [{
	            id      : 'expandMenuId',
	            handler : this.expandAll.createDelegate(this),
	            iconCls : 'expand',
	            text    : '展开' + this.typeName
	        }, {
	            id      : 'collapseMenuId',
	            handler : this.collapseAll.createDelegate(this),
	            iconCls : 'collapse',
	            text    : '合拢' + this.typeName
	        }, {
	            id      : 'refreshMenuId',
	            handler : this.refresh.createDelegate(this),
	            iconCls : 'refresh',
	            text    : '刷新' + this.typeName
	        }];
			this.tree.on('contextmenu', this.prepareContextTree, this);
			this.tree.contextMenu = new Ext.menu.Menu({
	            id    : 'copyCtx',
	            items : items
	        });
		}
	}
});