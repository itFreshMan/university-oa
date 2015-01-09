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

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import cn.edu.ahpu.oa.web.process.dao.BusinessDao;
import cn.edu.ahpu.oa.web.process.dao.ProcessOptionDao;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

/**
 * 
 * <p>
 * Project: university-oa
 * </p>
 * 
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-7 下午5:28:37
 * @description:
 */
@Service
public class ManualTaskService {

	@Autowired
	private TaskService taskService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private BusinessDao businessDao;
	
	@Autowired
	private ProcessOptionDao processOptionDao;

	/**
	 * 根据当前登陆用户取得该用户的待办任务列表,即流程直接分配到个人
	 */
	public List<Map<String, Object>> getWaitDealTaskList(Integer start,
			Integer limit) {
		User user = SecurityContextUtil.getCurrentUser();
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		String userCode = user.getUserCode();
		// 取得直接分配给个人的任务
		List<Task> tasksAssignee = taskService.createTaskQuery()
				.taskAssignee(userCode).active().orderByTaskCreateTime().desc()
				.list();
		for (Task task : tasksAssignee) {
			Map<String, Object> map = new HashMap<String, Object>();
			// 业务数据
			String processInstanceId = task.getProcessInstanceId();
			ProcessInstance processInstance = runtimeService
					.createProcessInstanceQuery()
					.processInstanceId(processInstanceId).active()
					.singleResult();
			String businessKey = processInstance.getBusinessKey();
			String processDefinitionId = task.getProcessDefinitionId();
			String processKey = processDefinitionId.split(":")[0];
			if (StringUtils.hasText(businessKey)) {
				map.put("businessKey", businessKey);
				List<Map<String, Object>> listBusi = businessDao
						.getBusinessInfo(processKey, businessKey);
				if (!listBusi.isEmpty()) {
					Map<String, Object> mapBusi = listBusi.get(0);
					map.put("title", mapBusi.get("title"));
					map.put("remark", mapBusi.get("remark"));
					map.put("userName", mapBusi.get("userName"));
				}
			}
			// 流程相关数据
			map.put("taskId", task.getId());
			map.put("processDefinitionId", processDefinitionId);
			map.put("processInstanceId", task.getProcessInstanceId());
			map.put("processKey", processDefinitionId.split(":")[0]);
			map.put("name", task.getName());
			map.put("taskDefinitionKey", task.getTaskDefinitionKey());
			map.put("assignee", task.getAssignee());
			map.put("owner", task.getOwner());
			map.put("priority", task.getPriority());
			map.put("createTime", task.getCreateTime());
			map.put("dueDate", task.getDueDate());
			map.put("description", task.getDescription());
			list.add(map);
		}
		return list;
	}

	/**
	 * 根据当前登陆用户取得该用户的待办任务列表,即流程分配给对应组的
	 */
	public List<Map<String, Object>> getWaitGetTaskList(Integer start,
			Integer limit) {
		User user = SecurityContextUtil.getCurrentUser();
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		List<Task> tasks = new ArrayList<Task>();
		String userCode = user.getUserCode();
		// 取得分配给当前登陆用户所属组的任务
		List<Task> taskCandidateGroup = taskService.createTaskQuery()
				.taskCandidateUser(userCode).active().orderByTaskCreateTime()
				.desc().list();
		// 取得直接分配给个人的任务
	/*	List<Task> tasksAssignee = taskService.createTaskQuery()
				.taskAssignee(userCode).active().orderByTaskCreateTime().desc()
				.list();
		tasks.addAll(tasksAssignee);*/
		tasks.addAll(taskCandidateGroup);
		for (Task task : tasks) {
			Map<String, Object> map = new HashMap<String, Object>();
			// 业务数据
			String processInstanceId = task.getProcessInstanceId();
			ProcessInstance processInstance = runtimeService
					.createProcessInstanceQuery()
					.processInstanceId(processInstanceId).active()
					.singleResult();
			String businessKey = processInstance.getBusinessKey();
			String processDefinitionId = task.getProcessDefinitionId();
			String processKey = processDefinitionId.split(":")[0];
			if (StringUtils.hasText(businessKey)) {
				map.put("businessKey", businessKey);
				List<Map<String, Object>> listBusi = businessDao.getBusinessInfo(processKey, businessKey);
				if (!listBusi.isEmpty()) {
				/*	Map<String, Object> mapBusi = listBusi.get(0);
					map.put("title", mapBusi.get("title"));
					map.put("remark", mapBusi.get("remark"));
					map.put("userName", mapBusi.get("userName"));*/
					map.putAll(listBusi.get(0));
				}
			}
			// 流程相关数据
			map.put("taskId", task.getId());
			map.put("processDefinitionId", processDefinitionId);
			map.put("processInstanceId", task.getProcessInstanceId());
			map.put("processKey", processDefinitionId.split(":")[0]);
			map.put("name", task.getName());
			map.put("taskDefinitionKey", task.getTaskDefinitionKey());
			map.put("assignee", task.getAssignee());
			map.put("owner", task.getOwner());
			map.put("priority", task.getPriority());
			map.put("createTime", task.getCreateTime());
			map.put("dueDate", task.getDueDate());
			map.put("description", task.getDescription());
			list.add(map);
		}
		return list;
	}

	/**
	 * 当前登陆用户签收任务
	 * 
	 * @param taskId
	 *            任务ID
	 * @return
	 */
	public void claimTask(String taskId) {
		User user = SecurityContextUtil.getCurrentUser();
		String userCode = user.getUserCode();
		taskService.claim(taskId, userCode);
	}

	/**
	 * 
	 * @param processKey
	 * @param businessKey -- 业务数据
	 * @return
	 */
	public Map<String, Object> getBusiInfoByBusinessKey(String processKey,
			String businessKey) {
		List<Map<String, Object>> listBusi = businessDao.getBusinessInfo(processKey, businessKey);
		Map<String, Object> mapBusi = new HashMap<String, Object>();
		if (!listBusi.isEmpty() && listBusi.size() > 0) {
			mapBusi = listBusi.get(0);
		}
		return mapBusi;
	}
	
	//根据业务主键查找对应历史审批意见
	public List<Map<String, Object>> getHistoryOpinionByBusinessKey(
			String processKey, String businessKey) {
		return processOptionDao.getProcessOptionList(processKey , businessKey );
	}
}
