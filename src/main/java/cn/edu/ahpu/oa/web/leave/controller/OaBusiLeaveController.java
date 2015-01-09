package cn.edu.ahpu.oa.web.leave.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.edu.ahpu.oa.utils.OaConstants;
import cn.edu.ahpu.oa.web.leave.service.OaBusiLeaveService;
import cn.edu.ahpu.oa.web.model.OaBusiLeave;
import cn.edu.ahpu.oa.web.process.service.ManualTaskService;
import cn.edu.ahpu.oa.web.process.service.ProcessService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

import com.fasterxml.jackson.core.JsonProcessingException;


/**
 * 
 * <p>Project: university-oa </p>
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-5 下午2:45:07 
 * @description:请假管理
 */
@Controller
@RequestMapping(value = "/oa/leave")
public class OaBusiLeaveController extends BaseController {
	@Autowired
	private OaBusiLeaveService service;

	@Autowired
	private ProcessService processService;
	
	@Autowired
	private ManualTaskService manualTaskService;
	
	@InitBinder
	public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
    }
	
	@RequestMapping(value = "/index")
	public String index() {
		return "/oa/leave/OaBusiLeave";
	}

	@RequestMapping(value="/addBusiLeave",method=RequestMethod.POST)
	@ResponseBody
	public ResponseData addBusiLeave(OaBusiLeave entity){
		Long busiId = service.addBusiLeave(entity);
		processService.startLeaveFlow(busiId.toString(), entity.getOrgId(),entity.getRealTime());
		return ResponseData.SUCCESS_NO_DATA;
	}
	
	@RequestMapping(value = "/showLeaveBillProcessOption")
	public ModelAndView openTaskDealPage(String businessKey){
		ModelAndView modelAndView = new ModelAndView("/oa/leave/showLeaveBillProcessOption");
		String processKey = OaConstants.LEAVE_BILL_PROCESS_KEY;
		Map<String, Object> mapBusi = manualTaskService.getBusiInfoByBusinessKey(processKey, businessKey);
		modelAndView.addObject("mapBusi", mapBusi);
		
		//根据业务主键查找对应历史审批意见
		List<Map<String, Object>> listOption = manualTaskService.getHistoryOpinionByBusinessKey(processKey, businessKey);
		modelAndView.addObject("listOption", listOption);
		//历史审批意见转成JSON字符串
	    String json = null;
		try {
//			DateFormat df = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
			json = mapper.writeValueAsString(listOption);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		modelAndView.addObject("optionJson", json);
		return modelAndView;
	}
}
