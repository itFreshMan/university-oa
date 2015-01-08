package cn.edu.ahpu.oa.web.process.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

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
	
	@RequestMapping(value = "/openDeployPage")
	public String openDeployPage() {
		return "/oa/process/deployProcess";
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
}
