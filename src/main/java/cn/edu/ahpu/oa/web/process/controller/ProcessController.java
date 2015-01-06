package cn.edu.ahpu.oa.web.process.controller;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

/**
 * 
 * <p>
 * Project: university-oa
 * </p>
 * 
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
	
	
	@RequestMapping(value = "/deployProcess")
	public String openDeployPage() {
		return "/oa/process/deployProcess";
	}
}
