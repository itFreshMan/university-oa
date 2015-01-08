package cn.edu.ahpu.oa.web.process.service;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.sql.rowset.serial.SerialException;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import cn.edu.ahpu.oa.web.model.OaProcessOption;
import cn.edu.ahpu.oa.web.process.dao.ProcessOptionDao;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

/**
 * 
 * <p>Project: university-oa </p>
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-7 下午4:39:07 
 * @description:
 */
@Service
public class ApproveService {

	  @Autowired
	  private TaskService taskService;
	  
	  @Autowired
	  private ProcessOptionDao processOptionDao;
	/**
	 * 通用环节处理逻辑
	 * @param taskId 工作项任务ID
	 * @param lineVariable 当前环节下一连线设置变量
	 * @param value 连线变量值 (1:同意  0:不同意)
	 * @return
	 * @throws SQLException 
	 * @throws SerialException 
	 */
  @Transactional
  public void dealAct(String taskId, String lineVariable, String value, String businessKey, String optionContent)
		  throws SerialException, SQLException {
		User user = SecurityContextUtil.getCurrentUser();
		String userCode = user.getUserCode();//任务处理完成后保存处理意见
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		String procInstId = task.getProcessInstanceId();//流程实例ID
		String processDefinitionId = task.getProcessDefinitionId();
		String processKey = processDefinitionId.split(":")[0];
		String executionId = task.getExecutionId();//对应流程引擎中 的EXECUTION_ID_
		String actName = task.getName();//环节名称
		String optionAction = value;//审批动作
		String optionName = value;//审批动作名称	
		//保存流程审批意见(同时保存电子签章)
		OaProcessOption processOption = new OaProcessOption();
		if(value.equals("0")) {
			optionName = "不批准";
		}else if(value.equals("1")) {
			optionName = "批准";
		}	
		processOption.setProcInstId(procInstId);
		processOption.setBusinessKey(businessKey);
		processOption.setTaskId(taskId);
		processOption.setExecutionId(executionId);
		processOption.setActName(actName);
		processOption.setOptionAction(optionAction);
		processOption.setOptionName(optionName);
		processOption.setOptionContent(optionContent);
		processOption.setApproveTime(new Date());
		processOption.setApproveUser(userCode);
		processOption.setProcessType(processKey);
		//保存审批意见表入库
		processOptionDao.save(processOption);	
		//根据页面选择的操作设置连线变量完成任务
		Map<String, Object> variables = new HashMap<String, Object>();
		if(StringUtils.hasText(lineVariable)) {
			variables.put(lineVariable, value);
		}
		taskService.complete(taskId, variables);		
  	}
  
}
