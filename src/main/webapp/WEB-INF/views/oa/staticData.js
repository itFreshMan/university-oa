/*******************************请假类型************/
var HOLIDAY_TYPE = [{'code':'1','name':'请假'},{'code':'2','name':'调休'},{'code':'3','name':'年休'}];
/*******************************请假类型(带所有)************/
var HOLIDAY_TYPE_ALL = [{'code':'-1','name':'--所有类型--'},{'code':'1','name':'请假'},{'code':'2','name':'调休'},{'code':'3','name':'年休'}];
/*******************************业务状态(带所有)************/
var STATUS_ALL = [{'code':'-1','name':'--所有状态--'},{'code':'1','name':'审批中'},{'code':'2','name':'审批通过'},{'code':'3','name':'审批未通过'}];

/****项目状态****/
var PROJECT_STATUS = [{'code':'0','name':'立项'},{'code':'1','name':'进行中'},{'code':'2','name':'结束'}];
/****借款方式****/
var BORROW_MONEY = [{'code':'1','name':'现金'},{'code':'2','name':'转账'}];
/****借款方式(带所有)****/
var BORROW_MONEY_ALL = [{'code':'-1','name':'--所有方式--'},{'code':'1','name':'现金'},{'code':'2','name':'转账'}];
/****奖惩类型****/
var JC_TYPE = [{'code':'1','name':'奖励'},{'code':'2','name':'惩罚'}];

var CALENDAR_LIST = {
	    "calendars":[{
	        "id":1,
	        "title":"考勤"
	    },{
	        "id":2,
	        "title":"派遣"
	    },{
	        "id":3,
	        "title":"请假"
	    },{
	        "id":4,
	        "title":"加班"
	    }]
	};

/********流程类型********/
var PROCESS_KEY_QUERY = [{'code':'-1','name':'--全部--'},{'code':'dispatchProcess','name':'出差派遣流程'},{'code':'dispatchReturnProcess','name':'差回流程'},
                   {'code':'leaveProcess','name':'请假流程'},{'code':'overTimeProcess','name':'加班流程'},
                   {'code':'paymentProcess','name':'费用报销流程'},{'code':'borrowMoneyProcess','name':'出差借款流程'}];

