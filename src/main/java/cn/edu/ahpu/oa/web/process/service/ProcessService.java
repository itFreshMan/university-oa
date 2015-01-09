/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.edu.ahpu.oa.web.process.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.utils.OaConstants;
import cn.edu.ahpu.oa.web.process.dao.BusinessDao;
import cn.edu.ahpu.oa.web.process.dao.ProcessApiDao;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;


/**
 * 
 * <p>Project: university-oa </p>
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-9 上午10:07:17 
 * @description:
 */

@Service
public class ProcessService {
	protected final Logger logger = LoggerFactory.getLogger(getClass());
	
    @Autowired
	private RuntimeService runtimeService;
	  
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
	private IdentityService identityService;
	
	@Autowired
	private BusinessDao businessDao;
	
	@Autowired
	private ProcessApiDao processApiDao;
	
	@Autowired
	private HistoryService historyService;

	public Pagination<Map<String, Object>> getDeployProcessList(Integer start,
			Integer limit) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery().orderByProcessDefinitionVersion().desc();	
		 long totalRecords = processDefinitionQuery.count();
        List<ProcessDefinition> processDefinitionList = processDefinitionQuery.listPage(start, limit);
		if(processDefinitionList != null && processDefinitionList.size() > 0){
			for(ProcessDefinition processDefinition : processDefinitionList){
				String deploymentId = processDefinition.getDeploymentId();
				Deployment deployment = repositoryService.createDeploymentQuery().deploymentId(deploymentId).singleResult();
				Map<String, Object> map = new HashMap<String, Object>();
	        	map.put("processDefId", processDefinition.getId());
//	        	map.put("name", processDefinition.getName());
	        	map.put("name", deployment.getName());
	        	map.put("deploymentId", deploymentId);
	        	map.put("key", processDefinition.getKey());
	        	map.put("version", processDefinition.getVersion());
	        	map.put("category", processDefinition.getCategory());
	        	map.put("resourceName", processDefinition.getResourceName());
	        	map.put("description", processDefinition.getDescription());
	        	map.put("diagramResourceName", processDefinition.getDiagramResourceName());
	        	map.put("suspensionState", processDefinition.isSuspended());       	
	        	map.put("deploymentTime", deployment.getDeploymentTime());
	        	list.add(map);
			}
		}
		double totalPages = Math.ceil(totalRecords * 1d / limit);
		Pagination<Map<String, Object>> pagination = new Pagination<Map<String, Object>>((long)totalPages, start, limit, totalRecords, list);
		return pagination;
	}
	
	/**
	 * 根据流程定义ID激活流程,激活的同时把该流程下已经启动的流程实例也全部激活
	 */
	public void activateProcessDefinition(String processDefinitionId) {
		repositoryService.activateProcessDefinitionById(processDefinitionId, true, null);
	}
	
	/**
	 * 根据流程定义ID挂起流程,挂起的同时把该流程下已经启动的流程实例也全部挂起
	 * @param processDefinitionId 流程定义ID
	 */
	public void suspendProcessDefinition(String processDefinitionId) {
		repositoryService.suspendProcessDefinitionById(processDefinitionId, true, null);
	}

	/**
	 * 根据流程定义ID删除流程定义
	 */
	public void deleteProcessDefinition(String processDefinitionId) {
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
		String deploymentId = processDefinition.getDeploymentId();
	//	repositoryService.deleteDeploymentCascade(deploymentId);
		//级联删除,会删除当下正在执行的流程信息,以及历史信息;
		repositoryService.deleteDeployment(deploymentId, true);
	}
	
	
	
	
	/*
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 启动工作流:startworkflow
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 */
	
	/**
	 * 启动请假流程
	 * @param businessKey
	 * @param orgId
	 * @param hours
	 */
	public void startLeaveFlow(String businessKey,Long orgId,Integer hours){
		User user = SecurityContextUtil.getCurrentUser();
		String userCode = user.getUserCode();
		String isMonitor = "";
		List<String> roleList = businessDao.listAllRoleCode(userCode, orgId);
		if(roleList == null || roleList.isEmpty()){
			logger.error("!#########申请人("+userCode+")角色信息为空#########!");
			return ;
		}else if(roleList.contains(OaConstants.MONITOR_ROLE_CODE)){
			isMonitor = "1";
		}else if(roleList.contains(OaConstants.STUDENT_ROLE_CODE)){
			isMonitor = "0";
		}else{
			logger.error("!#########申请人("+userCode+")角色必须为学生或者班长#########");
			return ;
		}
		
		List<String> candiateMonitors = businessDao.listUserCodesByOrgIdAndRoleCode(OaConstants.MONITOR_ROLE_CODE,orgId);
		if(candiateMonitors == null || candiateMonitors.isEmpty()){
			logger.error("!#########申请人("+userCode+")所在机构的班长角色为空#########!");
			return ;
		}
		String monitors = "";
		for(String monitor : candiateMonitors){
			monitors += monitor +",";
		}
		if(monitors.endsWith(",")){
			monitors.substring(0, monitors.length() - 1);
		}
		List<String> candiateAssistants = businessDao.listUserCodesByOrgIdAndRoleCode(OaConstants.ASSISTANT_ROLE_CODE,orgId);
		if(candiateAssistants == null || candiateAssistants.isEmpty()){
			logger.error("!#########申请人("+userCode+")所在机构的辅导员角色为空#########!");
			return ;
		}
		String assistants = "";
		for(String assistant : candiateAssistants){
			assistants += assistant +",";
		}
		if(assistants.endsWith(",")){
			assistants.substring(0, assistants.length() - 1);
		}
		
		List<String> directorAssistants = businessDao.listUserCodesByOrgIdAndRoleCode(OaConstants.DIRECTOR_ROLE_CODE,orgId);
		if(directorAssistants == null || directorAssistants.isEmpty()){
			logger.error("!#########申请人("+userCode+")所在机构的院长角色为空#########!");
			return ;
		}
		String directors = "";
		for(String director : directorAssistants){
			directors += director +",";
		}
		if(directors.endsWith(",")){
			directors.substring(0, directors.length() - 1);
		}
		
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("isMonitor", isMonitor);
		variables.put("businessKey", businessKey);
		variables.put("hours", hours);
		variables.put("monitors", monitors);
		variables.put("assistants", assistants);
		variables.put("directors", directors);
	    // 用来设置启动流程的人员ID，引擎会自动把用户ID保存到activiti:initiator中
	    identityService.setAuthenticatedUserId(userCode);
	    
	   ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(OaConstants.LEAVE_BILL_PROCESS_KEY, businessKey, variables);
	   String processInstanceId = processInstance.getProcessInstanceId();
	   businessDao.updateLeaveInfoAtStartProcess(OaConstants.LEAVE_BILL_PROCESS_KEY,processInstanceId, businessKey);
	}

	public Pagination<Map<String, Object>> getMyProcess(Integer start,
			Integer limit, String processKey) {
		User user = SecurityContextUtil.getCurrentUser();
		Pagination<Map<String, Object>> pagination = processApiDao.getMyProcess(start, limit, processKey,user.getUserCode());
		for(Map<String, Object> mapResult :pagination.getResult() ){
			String processInstanceId = mapResult.get("processInstanceId").toString();
			String processDefinitionId = mapResult.get("processDefinitionId").toString();
			ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
			if(processInstance == null) {
				mapResult.put("processFlag", "1");//流程已结束
				mapResult.put("activityName", "- - -");//当前环节
			}else {
				mapResult.put("processFlag", "0");//流程运行中
				String activityId = processInstance.getActivityId();
				mapResult.put("activityId", activityId);//当前环节
				try{
					ProcessDefinition processDefinition = repositoryService.getProcessDefinition(processDefinitionId);
				    for (ActivityImpl activityImpl : ((ProcessDefinitionEntity) processDefinition).getActivities()) {
				    	if(activityId.equals(activityImpl.getId())) {
				    		mapResult.put("activityName", activityImpl.getProperty("name"));
					    	break;
				    	}
				    }						
				} catch(Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		return pagination;
	}
	
}
