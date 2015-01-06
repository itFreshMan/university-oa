Ext.namespace("ST.ux.ExtField");

ST.ux.ExtField.ClearableComboBox = Ext.extend(Ext.form.ComboBox, {
    initComponent: function() {
        this.triggerConfig = {
            tag:'span', cls:'x-form-twin-triggers', cn:[
            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger x-form-clear-trigger"},
            {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger"}        
        ]};
        ST.ux.ExtField.ClearableComboBox.superclass.initComponent.call(this);
    },
    onTrigger1Click : function()
    {
        this.collapse();
        this.reset();                       // clear contents of combobox
        this.fireEvent('cleared');          // send notification that contents have been cleared
    },

    getTrigger: Ext.form.TwinTriggerField.prototype.getTrigger,
    initTrigger: Ext.form.TwinTriggerField.prototype.initTrigger,
    onTrigger2Click: Ext.form.ComboBox.prototype.onTriggerClick,
    trigger1Class: Ext.form.ComboBox.prototype.triggerClass,
    trigger2Class: Ext.form.ComboBox.prototype.triggerClass
});
Ext.reg('clearcombo', ST.ux.ExtField.ClearableComboBox);

ST.ux.ExtField.ComboBox = Ext.extend(ST.ux.ExtField.ClearableComboBox, {
    store : new Ext.data.JsonStore({  //填充的数据
    	url : "/dict/queryDictEntries.json",
    	fields : new Ext.data.Record.create( ['code', 'name'])
 	}),
    allowBlank: false,
    editable : false,
    valueField: 'code',
    displayField:'name',
    typeAhead: true,
    forceSelection: true,
    mode:'local', 
    triggerAction: 'all',
    emptyText:'请选择...',
    selectOnFocus:true,
    autoLoad:true,
    showAll:true,
    listeners: {
		'beforequery' : function(e) {
			if(typeof(e.combo.store.data.items[0])!="undefined"){
				if(e.combo.store.data.items[0].data.name!="全部"){
					if(e.combo.showAll){
							var data = {'code':'','name':'全部'};  
					        var rs = [new Ext.data.Record(data)];  
					        e.combo.store.insert(0,rs);  
					}
				}
			}
			e.combo.store.baseParams.dictTypeCode = e.combo.dictTypeCode;
    	},
    	'afterrender' : function(combo) {
			if(combo.autoLoad) {
				combo.store.baseParams.dictTypeCode = combo.dictTypeCode;
				combo.store.load();
			} else {
				combo.mode="remote";
			}
    	}
    }
});

 

Ext.BLANK_IMAGE_URL = "/resources/js/ext/resources/images/default/s.gif"; // 图形本地化
if ('function' !== typeof RegExp.escape) {   
    RegExp.escape = function(s) {   
        if ('string' !== typeof s) {   
            return s;   
        }   
        return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');   
    }; 
}   

ST.ux.ExtField.LovCombo = Ext.extend(Ext.form.ComboBox, {   
    selectAllOn: null,   
    checkField: 'checked',  
    separator: ';',  
    displaySeparator: ';' ,
    initComponent: function() {   
        if (!this.tpl) {   
            this.tpl =   
                 '<tpl for=".">'  
                + '<div class="x-combo-list-item">'  
                + '<img src="' + Ext.BLANK_IMAGE_URL + '" mce_src="' + Ext.BLANK_IMAGE_URL + '" '  
                + 'class="ux-lovcombo-icon ux-lovcombo-icon-'    
                + '{[values.' + this.checkField + '?"checked":"unchecked"' + ']}">'  
                + '<div class="ux-lovcombo-item-text">{' + (this.displayField || 'text') + '}</div>'  
                + '</div>'  
                + '</tpl>';   
        }   
        ST.ux.ExtField.LovCombo.superclass.initComponent.apply(this, arguments);   
        this.on({   
            scope: this, 
            beforequery: this.onBeforeQuery   
        });   
        this.onLoad = this.onLoad.createSequence(function() {   
            if (this.el) {   
                var v = this.el.dom.value;   
                this.el.dom.value = '';   
                this.el.dom.value = v;   
            }   
        });   
  
    }, 
    initEvents: function() {   
    	ST.ux.ExtField.LovCombo.superclass.initEvents.apply(this, arguments);     
        this.keyNav.tab = false;   
  
    },
    clearValue: function() {   
        this.value = '';   
        this.setRawValue(this.value);   
        this.store.clearFilter();   
        this.store.each(function(r) {   
            r.set(this.checkField, false);   
        }, this);   
        if (this.hiddenField) {   
            this.hiddenField.value = '';   
        }   
        this.applyEmptyText();   
    }, 
    getCheckedDisplay: function() {   
        var re = new RegExp(RegExp.escape(this.separator), "g");   
        return this.getCheckedValue(this.displayField).replace(re, RegExp.escape(this.displaySeparator) + ' ');   
    },
    getCheckedValue: function(field) {   
        field = field || this.valueField;   
        var c = [];   
        var snapshot = this.store.snapshot || this.store.data;   
        snapshot.each(function(r) {   
            if (r.get(this.checkField) && r.data[this.valueField] !== this.selectAllOn)   
            		c.push(r.get(field));   
        }, this);   
        return c.join(this.separator);   
    }, 
    selectAllCheck: function() {   
        var snapshot = this.store.snapshot || this.store.data;   
        var selectAll = true;   
        snapshot.each(function(r) {   
            if (r.data[this.valueField] !== this.selectAllOn && !r.get(this.checkField)) {   
                selectAll = false;   
                return;   
            }   
        }, this);   
        return selectAll;   
    }, 
    onBeforeQuery: function(qe) {   
        qe.query = qe.query.replace(new RegExp(this.getCheckedDisplay() + '[ ' + RegExp.escape(this.separator) + ']*'), '');   
    }, 
    beforeBlur: function() {   
        this.list.hide();   
        var rv = this.getRawValue();   
        var rva = rv.split(new RegExp(RegExp.escape(this.displaySeparator) + ' *'));   
        var va = [];   
        var snapshot = this.store.snapshot || this.store.data;   
        Ext.each(rva, function(v) {   
            snapshot.each(function(r) {   
                if (v === r.get(this.displayField)) {   
                    va.push(r.get(this.valueField));   
                }   
            }, this);   
        }, this);   
        this.setValue(va.join(this.separator));   
        this.store.clearFilter();   
    }, 
    onSelect: function(record, index) {   
        if (this.fireEvent('beforeselect', this, record, index) !== false) {   
            record.set(this.checkField, !record.get(this.checkField));   
            if (this.store.isFiltered()) {   
                this.doQuery(this.allQuery);   
            }   
            if (record.data[this.valueField] === this.selectAllOn) {   
                if (record.get(this.checkField)) {   
                    this.selectAll();   
                } else {   
                    this.deselectAll();   
                }   
            } else {   
                this.setValue(this.getCheckedValue());   
            }   
            this.fireEvent('select', this, record, index);   
        }   
    }, 
    setValue: function(v) {   
        if (v) {   
            v = '' + v ;   
            if (this.valueField) {   
                this.store.clearFilter();   
                this.store.each(function(r) {   
                    if (r.data[this.valueField] === this.selectAllOn && this.selectAllCheck())   
                        r.set(this.checkField, true);   
                    else if (r.data[this.valueField] === this.selectAllOn)   
                        r.set(this.checkField, null);   
                    else {   
                        var checked = !(!v.match(   
                             '(^|' + RegExp.escape(this.separator) + ')' + RegExp.escape(r.get(this.valueField))   
                            + '(' + RegExp.escape(this.separator) + '|$)'))   
                        ; 
                        r.set(this.checkField, checked);   
                    }   
                }, this);   
  
                this.value = this.getCheckedValue();   
                this.setRawValue(this.getCheckedDisplay());   
                if (this.hiddenField) {   
                    this.hiddenField.value =this.value;   
                }   
            }   
            else {   
                this.value = v;   
                this.setRawValue(v);   
                if (this.hiddenField) {   
                    this.hiddenField.value = v;   
                }   
            }   
            if (this.el) {   
                this.el.removeClass(this.emptyClass);   
            }   
        }   
        else {   
            this.clearValue();   
        }   
    }, 
    selectAll: function() {   
        this.store.each(function(record) {   
            record.set(this.checkField, true);   
        }, this);     
        this.doQuery(this.allQuery);   
        this.setValue(this.getCheckedValue());   
    }, 
    deselectAll: function() {   
        this.clearValue();   
    }   
}); 
Ext.reg('lovcombo', ST.ux.ExtField.LovCombo);   
