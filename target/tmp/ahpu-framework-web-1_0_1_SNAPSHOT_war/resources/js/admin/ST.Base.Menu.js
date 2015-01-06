Ext.namespace("ST.base");

var ds = new Ext.data.Store({
    proxy  : new Ext.data.HttpProxy({url: '/resource/pageQueryResourcesByMenu.json'}),
    reader : new Ext.data.JsonReader({
    	root          : "rows",
        totalProperty : "total",
        idProperty    : "id",
        fields        : [
        	{name: 'id'},
	        {name: 'name'},
	        {name: 'action'}
	    ]
    })
});

var resultTpl = new Ext.XTemplate(
    '<tpl for="."><div class="x-combo-list-item">',
        '{name}</span>({action})',
    '</div></tpl>'
);
ST.ux.ExtField.ResCombo = Ext.extend(ST.ux.ExtField.ClearableComboBox, {
    store: ds,
    hiddenName: 'resource.id',
    editable : false,
    allowBlank: false,
    valueField: 'id',
    displayField:'action',
    listWidth: 360,
    typeAhead: true,
    loadingText: '正在加载数据...',
    pageSize:10,
    tpl: resultTpl,
    forceSelection: true,
    triggerAction: 'all',
    emptyText:'请选择...',
    selectOnFocus:true,
    listeners:{
        'select': function(combo, record, index) {
        	Ext.getCmp("Ext_text").setValue(record.data.name);
        }
   }
});
Ext.reg('resTypeField', ST.ux.ExtField.ResCombo);

Ext.reg('menuNodeTypeField', ST.ux.ExtField.ComboBox);

ST.base.menuView = Ext.extend(ST.ux.ViewTree, {
	typeName: '菜单',
	dlgWidth: 300,
	dlgHeight: 320,
	urlSaveOrder: "/menu/saveMenuOrder.json",
	urlTreeQuery: "/menu/queryMenus.json",
	urlRemoveNode: "/menu/deleteMenu.json",
	urlAddNode: "/menu/insertMenu.json",
	urlEditNode: "/menu/updateMenu.json",
	urlLoadNode: "/menu/loadMenu.json",
	addTitle: "增加菜单",
    editTitle: "更新菜单",
    treePanelTitle:"菜单树",
	girdColumns: [
				{header: 'ID', width: 150, name: 'id', hideForm: 'all'},
	            {header: '菜单名称', width: 150, name: 'text', allowBlank:false, id: 'Ext_text'},
	            {header: '资源URL', width: 200, name: 'action', fieldtype:'resTypeField', id: 'Ext-action'},
	            {header: 'parentId', width: 200, name: 'parentId', fieldtype:'hidden', id: 'Ext-parentId'},
	            {header: 'level', width: 200, name: 'level', fieldtype:'hidden', id:'Ext-level'},
	            {header: '菜单类型', width: 90, showAll:false, sortable: true, fieldtype:'menuNodeTypeField', hiddenName: 'isLeaf', dictTypeCode: "CORE.NODE.TYPE", name: 'isLeaf',id:"id-isLeaf"},
	            {header: '菜单顺序', width: 60, sortable: true, name: 'theSort', allowBlank:false,regex:/[0-9]+/,regexText:"请输入数字"},
	            {header: '菜单样式', width: 150, name: 'iconCls', allowBlank:true},
	            {header: '描述', width: 250, name: 'descn', fieldtype:'textarea'}
	        ],
	
    setFieldDefaultValue: function(node) {
    	Ext.getCmp("Ext-parentId").setRawValue(node.id);
    	Ext.getCmp("Ext-level").setRawValue(node.attributes.level+1);
    },
    
    loadEditFormSucHandler: function(form, action) {
    	var menu = action.reader.jsonData;
    	if(menu.leaf){//叶子节点
    		Ext.getCmp("id-isLeaf").setValue("Y");
    	}else{
    		Ext.getCmp("id-isLeaf").setValue("N");
    	}
    	if(menu.resource != null) {
    		Ext.getCmp("Ext-action").setValue(menu.resource.action);
    		Ext.getCmp("Ext-action").hiddenField.value = menu.resource.id;
    	}
    },
    
	constructor: function() {
		ST.base.menuView.superclass.constructor.call(this, {});
	}
});