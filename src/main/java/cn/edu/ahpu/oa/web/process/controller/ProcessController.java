package cn.edu.ahpu.oa.web.process.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.servlet.http.HttpServletResponse;

import org.activiti.bpmn.constants.BpmnXMLConstants;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.bpm.engine.extend.diagram.ProcessDiagramGeneratorExtend;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.utils.file.FileCommonOperate;
import cn.edu.ahpu.oa.web.process.service.ProcessService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

/**
 * 
 * Project: university-oa
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-5 下午2:45:44
 * @description:流程管理
 */
@Controller
@RequestMapping(value = "/oa/process")
public class ProcessController extends BaseController {
	
	@Value(value = "${file.store.path}")
	private String deployFilePath;
	
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
	private HistoryService historyService;
	
	@Autowired
	private ProcessService processService;
	
	@Autowired
	private ProcessDiagramGeneratorExtend generatorExtend;
	
	/**
	 * 流程部署页面
	 * @return
	 */
	@RequestMapping(value = "/openDeployPage")
	public String openDeployPage() {
		return "/oa/process/deployProcess";
	}
	
	/**
	 * 打开所有运行中流程页面
	 * @return
	 */
	@RequestMapping(value = "/openRunningProcess")
	public String openRunningProcessPage() {
		return "/oa/process/runningProcess";
	}

	/**
	 * 打开历史流程页面
	 * @return
	 */
	@RequestMapping(value = "/openHistoryProcessPage")
	public String openHistoryProcessPage() {
		return "/oa/process/historyProcess";
	}

	/**
	 * 打开当前用户参与的任务页面(已办任务)
	 * @return
	 */
	@RequestMapping(value = "/openInvolvedProcessProcessPage")
	public String openInvolvedProcessProcessPage() {
		return "/oa/process/involvedProcess";
	}
	
	/**
	 * 打开我的流程页面
	 * @return
	 */
	@RequestMapping(value = "/openMyProcessPage")
	public String openMyProcessPage() {
		return "/oa/process/myProcess";
	}
	
	/**
	 * 取得系统中已经部署过的流程,与ACT_RE_PROCDEF中数据一致
	 */
	@RequestMapping(value = "/getDeployProcessList", method = RequestMethod.POST)
	@ResponseBody
	public Pagination<Map<String, Object>> getDeployProcessList(Integer start, Integer limit) {
		return processService.getDeployProcessList(start, limit);
	}
	
	
	/**
	 * 部署流程定义文件,根据后缀名自动调用不同的API部署
	 */
	@RequestMapping(value = "/deployProcess", method = RequestMethod.POST)
	@ResponseBody
	public String deployProcess(@RequestParam("attachMentFile") MultipartFile multipartFile,String deploymentName) throws FileNotFoundException {
		if (multipartFile != null && multipartFile.getSize() != 0) {
			//开始上传附件,并保存上传成功后完整的路径
			try {
				String fileName = FileCommonOperate.uploadFile(multipartFile.getInputStream(), deployFilePath, multipartFile.getOriginalFilename());
				InputStream fileInputStream = multipartFile.getInputStream();
				String extension = FilenameUtils.getExtension(fileName);
			    if (extension.equals("zip") || extension.equals("bar")) {
			          ZipInputStream zip = new ZipInputStream(fileInputStream);
			          repositoryService.createDeployment().addZipInputStream(zip).name(deploymentName).deploy();
			    } else {
			          repositoryService.createDeployment().addInputStream(fileName, fileInputStream).name(deploymentName).deploy();
			     }			
			} catch (IOException e) {
				e.printStackTrace();
				
			}			
		}
		return "{success:true}";
	}
	
	 /**
	   * 通过流程定义ID读取资源
	   *
	   * @param deploymentId 流程部署id
	   * @param name 资源名称
	   * @throws Exception
	   */
	  @RequestMapping(value = "/resource/read")
	  public void loadByDeployment(@RequestParam("deploymentId") String deploymentId, @RequestParam("name") String name,
	                               HttpServletResponse response) throws Exception {
	    InputStream resourceAsStream = repositoryService.getResourceAsStream(deploymentId, name);
	    byte[] b = new byte[1024];
	    int len = -1;
	    while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
	      response.getOutputStream().write(b, 0, len);
	    }
	  }
	  
	  
		/**
		 * 根据流程定义ID激活流程,激活的同时把该流程下已经启动的流程实例也全部激活
		 */
		@RequestMapping(value = "/activateProcessDefinition", method = RequestMethod.POST)
		@ResponseBody
		public ResponseData activateProcessDefinition(String processDefinitionId) {
			processService.activateProcessDefinition(processDefinitionId);
			return ResponseData.SUCCESS_NO_DATA;
		}
		
		/**
		 * 根据流程定义ID挂起流程,挂起的同时把该流程下已经启动的流程实例也全部挂起
		 */
		@RequestMapping(value = "/suspendProcessDefinition", method = RequestMethod.POST)
		@ResponseBody
		public ResponseData suspendProcessDefinition(String processDefinitionId) {
			processService.suspendProcessDefinition(processDefinitionId);
			return ResponseData.SUCCESS_NO_DATA;
		}
		
		/**
		 * 根据流程定义ID删除流程定义
		 */
		@RequestMapping(value = "/deleteProcessDefinition", method = RequestMethod.POST)
		@ResponseBody
		public ResponseData deleteProcessDefinition(String processDefinitionId) {
			processService.deleteProcessDefinition(processDefinitionId);
			return ResponseData.SUCCESS_NO_DATA;
		}
		
		
		/**
		 * 分页查询当前用户发起的流程信息
		 * @param start
		 * @param limit
		 * @return
		 */
		@RequestMapping(value = "/myProcess/list", method = RequestMethod.POST)
		@ResponseBody
		public Pagination<Map<String, Object>> getMyProcess(Integer start, Integer limit, String processKey) {
			return processService.getMyProcess(start, limit, processKey);
		}
		
		/**
		 * 分页查询当前用户发起的流程信息
		 * @param start
		 * @param limit
		 * @return
		 */
		@RequestMapping(value = "/involvedProcess/list", method = RequestMethod.POST)
		@ResponseBody
		public Pagination<Map<String, Object>> getInvolvedProcess(Integer start, Integer limit, String processKey) {
			return processService.getInvolvedProcess(start, limit, processKey);
		}
		
		
		/**
		 * 根据流程实例ID和是否已经结束流程标志动态显示流程图及运行轨迹
		 * @param processInstanceId 流程实例ID
		 * @param historyFlag 是否历史流程 1:是 , 0:否
		 * @return
		 */
		@RequestMapping(value = "/showProcessTrack")
		public ModelAndView showProcessTrack(String processInstanceId, Integer historyFlag) {
			String showProcessUrl = "";
			ModelAndView modelAndView = new ModelAndView("/oa/process/showProcessTrack");
			if(historyFlag == 1) {
				showProcessUrl = "/oa/process/showHistoryProcessImage?processInstanceId=" + processInstanceId;
			}else if(historyFlag == 0) {
				showProcessUrl = "/oa/process/showProcessImage?processInstanceId=" + processInstanceId;
			}
			List<Map<String, Object>> runningAct = new ArrayList<Map<String, Object>>();
			List<HistoricActivityInstance> activityInstances = historyService.createHistoricActivityInstanceQuery()
	                .processInstanceId(processInstanceId).orderByHistoricActivityInstanceId().asc().list();
	        for (HistoricActivityInstance historicActivityInstance : activityInstances) {
//	        	if(historicActivityInstance.getActivityType().equals("userTask") || historicActivityInstance.getActivityType().equals("serviceTask")){
//	        	if(historicActivityInstance.getActivityType().equals("userTask")){
	        	if(historicActivityInstance.getActivityType().equals(BpmnXMLConstants.ELEMENT_TASK_USER)){
	        		Map<String, Object> tempMap = new HashMap<String, Object>();
                	tempMap.put("actName", historicActivityInstance.getActivityName());
                	if (historicActivityInstance.getEndTime() == null) {// 节点正在运行中
	                	tempMap.put("curActFlag", true);
	                }
                	runningAct.add(tempMap);
	        	}
	        }		
	        
	        modelAndView.addObject("historyFlag", historyFlag);
	        modelAndView.addObject("runningAct", runningAct);
			modelAndView.addObject("showProcessUrl", showProcessUrl);
			//查找环节审批轨迹
//			List<CpsProcessOption> optionList = optionDao.getProcessOptionList(processInstanceId);
//			modelAndView.addObject("optionList", optionList);
			return modelAndView;
		}
		
		/**
		 * 显示运行中流程图,正在运行的环节高亮显示
		 * @param processDefinitionId
		 * @param processInstanceId
		 */
		@RequestMapping(value = "/showProcessImage")
		public void showProcessImage(String processInstanceId, HttpServletResponse resp) {
	        try {
	        	InputStream inputStream = generatorExtend.generateDiagram(processInstanceId);
				 if (inputStream != null) {  
			            resp.setContentType("image/png");  
			            OutputStream out = resp.getOutputStream();  
			            try {  
			                byte[] bs = new byte[1024];  
			                int n = 0;  
			                while ((n = inputStream.read(bs)) != -1) {  
			                    out.write(bs, 0, n);  
			                }  
			                out.flush();  
			            } catch (Exception ex) {  
			                ex.printStackTrace();  
			            } finally {  
			            	inputStream.close();  
			                out.close();  
			            }  
			        }
			} catch (IOException e) {
				e.printStackTrace();
			}
	        
		}
		
		/**
		 * 显示历史流程图
		 * @param processInstanceId
		 * @param resp
		 */
		@RequestMapping(value = "/showHistoryProcessImage")
		public void showHistoryProcessImage(String processInstanceId, HttpServletResponse resp) {
	        try {
	        	InputStream inputStream = generatorExtend.generateHistoryDiagram(processInstanceId);
				 if (inputStream != null) {  
			            resp.setContentType("image/png");  
			            OutputStream out = resp.getOutputStream();  
			            try {  
			                byte[] bs = new byte[1024];  
			                int n = 0;  
			                while ((n = inputStream.read(bs)) != -1) {  
			                    out.write(bs, 0, n);  
			                }  
			                out.flush();  
			            } catch (Exception ex) {  
			                ex.printStackTrace();  
			            } finally {  
			            	inputStream.close();  
			                out.close();  
			            }  
			        }
			} catch (IOException e) {
				e.printStackTrace();
			}
	        
		}
		
		
		/**
		 * 取得运行中流程列表
		 */
		@RequestMapping(value = "/runningProcess/list", method = RequestMethod.POST)
		@ResponseBody
		public Pagination<Map<String, Object>> getRunningProcessList(Integer start, Integer limit,String processKey) {
			return processService.getRunningProcessList(start, limit,processKey);
		}
		

		/**
		 * 取得运行中流程列表
		 */
		@RequestMapping(value = "/historyProcess/list", method = RequestMethod.POST)
		@ResponseBody
		public Pagination<Map<String, Object>> getHistoryProcessList(Integer start, Integer limit,String processKey) {
			return processService.getHistoryProcessList(start, limit,processKey);
		}
		
}
