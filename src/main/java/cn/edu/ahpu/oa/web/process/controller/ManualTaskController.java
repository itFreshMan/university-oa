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

package cn.edu.ahpu.oa.web.process.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.activiti.engine.FormService;
import org.activiti.engine.form.FormProperty;
import org.activiti.engine.form.TaskFormData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.edu.ahpu.oa.web.process.service.ManualTaskService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ibm.db2.jcc.sqlj.k;
import com.ibm.db2.jcc.t2zos.v;

/**
 * 
 * <p>Project: university-oa </p>
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-7 下午4:31:47 
 * @description:
 */
@Controller
@RequestMapping(value = "/oa/process/task")
public class ManualTaskController extends BaseController{

	@Autowired
	private FormService formService;
	
	@Autowired
	private ManualTaskService manualTaskService;
	/**
	 * 待签收任务
	 * @return
	 */
	@RequestMapping(value = "/waitGetTaskIndex")
	public String openWaitGetTaskPage() {
		return "/oa/process/task/waitGetTask";
	}
	
	/**
	 * 等办任务
	 * @return
	 */
	@RequestMapping(value = "/waitDealTaskIndex")
	public String openWaitDealTaskPage() {
		return "/oa/process/task/waitDealTask";
	}
	/**
	 * 根据传入的任务ID找到对应的FormKey并打开此FormKey指向的页面,
	 * 同时取得该任务环节配置的FORM变量(即此环节后面的连线变量),传至前台
	 * @param processKey 流程KEY
	 * @param taskId 任务ID
	 * @param businessKey 业务主键
	 * @return
	 */
	@RequestMapping(value = "/openTaskDealPage/{processKey}/{taskId}/{businessKey}")
	public ModelAndView openTaskDealPage(@PathVariable String processKey, @PathVariable String taskId,
			@PathVariable String businessKey) {
		User user = SecurityContextUtil.getCurrentUser();
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("userCode", user.getUserCode());
		TaskFormData taskFormData = formService.getTaskFormData(taskId);
		String formKey = taskFormData.getFormKey();
		List<FormProperty> listProperty = taskFormData.getFormProperties();
		if(!listProperty.isEmpty()) {
			String lineVar = listProperty.get(0).getId();
			modelAndView.addObject("lineVar", lineVar);
		}
		modelAndView.setViewName(formKey);
		modelAndView.addObject("taskId", taskId);
		
		Map<String, Object> mapBusi = manualTaskService.getBusiInfoByBusinessKey(processKey, businessKey);
		modelAndView.addObject("mapBusi", mapBusi);
		
		//根据业务主键查找对应历史审批意见
		List<Map<String, Object>> listOption = manualTaskService.getHistoryOpinionByBusinessKey(processKey, businessKey);
		/*
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(Map<String, Object> map :listOption){
			Iterator iterator = map.entrySet().iterator();
			while(iterator.hasNext()){
				Entry<String, Object> entry = (Entry<String, Object>) iterator.next();
				String key = entry.getKey();
				Object value = entry.getValue();
				if(value != null && value instanceof Date){
					map.put(key, df.format(value));
				}
			}
		}*/
		modelAndView.addObject("listOption", listOption);
		//历史审批意见转成JSON字符串
	    String json = null;
		try {
			mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
			json = mapper.writeValueAsString(listOption);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		modelAndView.addObject("optionJson", json);
		return modelAndView;
	}
	

	/**
	 * 根据当前登陆用户取得该用户的待签收任务列表
	 */
	@RequestMapping(value = "/getWaitGetTaskList", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> getWaitGetTaskList(Integer start, Integer limit) {		
		return manualTaskService.getWaitGetTaskList(start, limit);
	}
	
	/**
	 * 根据当前登陆用户取得该用户的待办任务列表
	 */
	@RequestMapping(value = "/getWaitDealTaskList", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> getWaitDealTaskList(Integer start, Integer limit) {		
		return manualTaskService.getWaitDealTaskList(start, limit);
	}
	/**
	 * 当前登陆用户签收任务
	 * @param taskId 任务ID
	 * @return
	 */
	@RequestMapping(value = "/claimTask", method = RequestMethod.POST)
	@ResponseBody
	public ResponseData claimTask(String taskId) {
		manualTaskService.claimTask(taskId);
		return ResponseData.SUCCESS_NO_DATA;
	}
}
