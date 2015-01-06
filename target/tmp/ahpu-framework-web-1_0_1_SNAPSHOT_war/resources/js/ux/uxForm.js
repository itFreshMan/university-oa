Ext.namespace("Ext.ux");

Ext.override(Ext.form.TextField, {      //区别汉字和英文的长度
    validateValue : function(value){
    	
    	var strLen = this.countStrLen(value);
    	
        if(value.length < 1 || value === this.emptyText){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(strLen > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },
    countStrLen: function(strTemp) {  //计算字符串的长度,区分英文和汉字
        var  i,sum;  
        sum=0;  
        for(i=0;i<strTemp.length;i++) {  
            if  ((strTemp.charCodeAt(i)>=0) && (strTemp.charCodeAt(i)<=255))  
                sum=sum+1;  
            else   
                sum=sum+2;  
        }  
        return  sum;  
    }
});

Ext.ux.Form = Ext.extend(Ext.form.FormPanel, {
    frame: true,
    bodyStyle:"padding: 5px 5px 0",
    initComponent: function() {
    	Ext.ux.Form.superclass.initComponent.call(this);
    },
    initEvents : function(){
        Ext.ux.Form.superclass.initEvents.call(this);
    },
    createButton: function(text,handler) {
    	var btn = new Ext.Button({
    	    text: text,
    	    handler: handler
    	});
    	return btn;
    },
    createTextField: function(fieldLabel, name, anchor, blankText, vtype, maxLength, maxLengthText,inputType, colspan) {    //生成一个通用的TextField
        var tf = new Ext.form.TextField({
            fieldLabel: fieldLabel,
            name: name,
            xtype: 'textfield',
            readOnly: false,
            allowBlank: false,
            anchor: anchor,
            blankText: '该选项为必填项,请输入内容...',
            vtype: vtype,
            maxLength: maxLength,
            maxLengthText: maxLengthText,
            inputType:inputType,
            colspan: colspan
        });
        return tf;
    },
    createNumberField: function(fieldLabel, name, anchor, decimalPrecision, colspan) {    //生成一个通用的TextField
        var nf = new Ext.form.NumberField({
            fieldLabel: fieldLabel,
            name: name,
            readOnly: false,
            allowBlank: false,
            allowNegative :false,//值为false时只允许为正数(默认为 true，即默认允许为负数)
            decimalPrecision :decimalPrecision ,//设置小数点后最大精确位数(默认为 2)。
            anchor: anchor,
            cls:'forbiddenZH',//禁用中文输入法
            blankText: '该选项为必填项,请输入内容...',
            colspan: colspan
        });
        return nf;
    },
    createPassWordField: function(fieldLabel, name, anchor, blankText, vtype, maxLength, maxLengthText) {  //生成一个通用的密码输入框  
        var tf = new Ext.form.TextField({
            fieldLabel: fieldLabel,
            name: name,
            xtype: 'textfield',
            inputType :'password',
            readOnly: false,
            allowBlank: false,
            anchor: anchor,
            blankText: '该选项为必填项,请输入内容...',
            vtype: vtype,
            maxLength: maxLength,
            maxLengthText: maxLengthText
        });
        return tf;
    },
    createRadio: function(boxLabel,name,checked,inputValue) {    //生成一个通用的Radio
        var radio = new Ext.form.Radio({
            boxLabel:boxLabel,
            checked:checked,
            name:name,
            labelSeparator:"",
            inputValue:inputValue,
            anchor:"90%"
        });
        return radio;
    },
    createCombo: function(fieldLabel,id,name,formName,anchor,url,extra1,extra2,colspan) {    //生成一个通用的ComboBox
        var combo = new Ext.form.ComboBox({
        	colspan:colspan,
        	autoLoad: true,
            fieldLabel: fieldLabel,
            emptyText: '请选择...',
            isFormField: true,
            anchor: anchor,
            mode: 'local',
            hiddenName :formName,
            name:formName,
            allowBlank: false,
            blankText:'请选择...',
            forceSelection: true,
            lastQuery: '',
            triggerAction: 'all',
            displayField:name,
            valueField:id,
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({url: url, method: 'POST'}),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:id},{name:name},{name:extra1},{name:extra2}]))
            }),
            editable : false
        });
        return combo;
    }, 
    createSearchCombo: function(fieldLabel,id,name,formName,anchor,url,extra1,extra2,colspan) {    //生成一个支持模糊查询的ComboBox
        var comboBox = new Ext.form.ComboBox({
        	colspan:colspan,
        	autoLoad: true,
            fieldLabel: fieldLabel,
            typeAhead: false,
            emptyText: '请选择...',
            triggerAction: 'all',
            isFormField: true,
            anchor: anchor,
            mode: 'local',
            hiddenName :formName,
            name:formName,
            allowBlank: false,
            blankText:'请选择...',
            forceSelection: true,
            lastQuery: '',
            displayField:name,
            valueField:id,
            selectOnFocus: true,
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({url: url, method: 'POST'}),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:id},{name:name},{name:extra1},{name:extra2}]))
            }),
            editable : true,
            listeners : {
            	'beforequery':function(e){  
            		var combo = e.combo; 
            		combo.collapse();
                	if(!e.forceAll){  
                		var value = e.query;  
                		combo.store.filterBy(function(record,id){  
                			var text = record.get(combo.displayField);  
                			//用自己的过滤规则,如写正则式  
                			return (text.indexOf(value)!=-1);    //实现的核心
                		}); 
                		combo.onLoad(); 
                		combo.expand();  
                		return false;  
                	}
            	},
            	'focus':function(combo){  
                	combo.store.load();
            	} 
            }  
        });
        return comboBox;
    }, 
    createMemoryCombo: function(fieldLabel,id,name,anchor,jsonData,formName) {
    	 var combo = new Ext.form.ComboBox({
            fieldLabel: fieldLabel,
            emptyText: '请选择...',
            isFormField: true,
            anchor: anchor,
            mode: 'local',
            name: formName,
            hiddenName :formName,
            allowBlank: false,
            blankText:'请选择...',
            forceSelection: true,
            triggerAction: 'all',
            displayField:name,
            valueField:id,
            store: new Ext.data.Store({
                proxy: new Ext.data.MemoryProxy(jsonData),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:id},{name:name}]))
            }),
            editable : false
        });
        return combo;
    },  
    createDictCombo: function(fieldLabel, formName, anchor, dictTypeCode, colspan) {    //生成一个通用的ComboBox
        var combo = new Ext.form.ComboBox({
        	colspan:colspan,
        	autoLoad: true,
            fieldLabel: fieldLabel,
            emptyText: '请选择...',
            isFormField: true,
            anchor: anchor,
            mode: 'local',
            hiddenName :formName,
            name:formName,
            allowBlank: true,
            blankText:'请选择...',
            forceSelection: true,
            lastQuery: '',
            triggerAction: 'all',
            displayField:'name',
            valueField:'code',
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({url: '/dict/queryDictEntries', method: 'POST'}),
                reader: new Ext.data.JsonReader({},new Ext.data.Record.create([{name:'code'},{name:'name'}]))
            }),
            editable : false
        });
        combo.store.load({params: {dictTypeCode: dictTypeCode}});
        return combo;
    },
    /**
     * 生成一个通用的本地combo
     * @param {} jsonData 格式必须是：[['-1','请选择…'],['1', '是'],['0', '否']]
     * @param {} anchor
     * @param {} allowBlank 
     * @param {} helpText  帮助文本
     * @return {}
     */
    createSimpleCombo: function(fieldLabel,jsonData,anchor,allowBlank,helpText) {  
       		var itemCls=(allowBlank?'':'required-field');
    		var dataStore = new Ext.data.SimpleStore({
    			fields : ['id', 'name'],
    			data : jsonData
    		});
    		var combox = new Ext.form.ComboBox({
    				fieldLabel : fieldLabel,
    				emptyText : "请选择...",
    				store : dataStore,
    				editable : false,
    				hiddenName : 'id',
    				valueField : 'id',
    				displayField : 'name',
    				typeAhead : true,
    				triggerAction : 'all',
    				selectOnFocus : true,
    				anchor: anchor,
    				itemCls:itemCls,
               		allowBlank:allowBlank,
    				mode : 'local'
    		});	
    		return combox;
    },
    createTextArea: function(fieldLabel,name,height,anchor, colspan) {
    	var ta = new Ext.form.TextArea({
    	    fieldLabel:fieldLabel,
            name:name,
            height:height,
            anchor:anchor,
            colspan:colspan
    	});
    	return ta;
    },
    createHidden: function(fieldLabel,name) {
    	var hidden = new Ext.form.Hidden({
    	    fieldLabel:fieldLabel,
    	    name:name
    	});
    	return hidden;
    },
    createHtmlEditor: function(fieldLabel, anchor) {      //生成一个通用的HtmlEditor
        var he = new Ext.form.HtmlEditor({
            fieldLabel: fieldLabel,
            height: 270,
            anchor: anchor,
            enableLinks: false,
            enableSourceEdit: false,
            fontFamilies:['宋体','隶书','黑体']
        });
        return he;
    },
    createButton: function(text,fn,scope) {
    	var btn = new Ext.Button({
    		align: 'left',
    		text: text,
    		handler: fn,
    		scope: scope
    	});
    	return btn;
    },
    createDateField: function(fieldLabel, name, format, anchor) {
    	var df =  new Ext.form.DateField({
			fieldLabel: fieldLabel,
			name: name,
			format: format,
			anchor: anchor,
			allowBlank: false,
			editable:false,//不能手动输入
			blankText: '请选择时间'
		});
		return df;
    },
    createLabel: function(fieldLabel,text) {
    	var label = new Ext.form.Label({
            width: 90,
            height: 40,
            fieldLabel: fieldLabel,
            text: text
        });
        return label;
    },
    createDateMonthField: function(fieldLabel, name, format, anchor) {
    	var df =  new Ext.form.DateField({
			fieldLabel: fieldLabel,
			plugins: 'monthPickerPlugin',
			name: name,
			format: format,
			anchor: anchor,
			allowBlank: false,
			editable:false,//不能手动输入
			blankText: '请选择时间'
		});
		return df;
    },
    /**
     * 创建下拉树
     * @param fieldLabel 标签
     * @param rootName 根节点名子
     * @param hiddenName 
     * @param url 请求URL
     * @param anchor 
     * @returns
     */
    createTreeCombo: function(fieldLabel, rootName, hiddenName, url, anchor) {
    	var df =  new Ext.ux.TreeCombo({
    		fieldLabel:fieldLabel,
    		rootVisible: false,
    		url: url,
    		allowBlank: false,
    		hiddenName: hiddenName,
    		name:hiddenName,
    		rootName: rootName,
    		anchor: anchor
		});
		return df;
    }
});

Ext.reg("uxForm", Ext.ux.Form);

