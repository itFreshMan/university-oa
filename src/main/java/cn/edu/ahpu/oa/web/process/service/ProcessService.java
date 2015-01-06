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
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ahpu.common.dao.support.Pagination;


/**
 * @author zhuzengpeng
 */
@Service
public class ProcessService {

    @Autowired
	private RuntimeService runtimeService;
	  
	@Autowired
	private RepositoryService repositoryService;
	
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
	
}
