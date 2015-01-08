package cn.edu.ahpu.oa.web.leave.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.edu.ahpu.oa.web.leave.service.OaBusiLeaveService;
import cn.edu.ahpu.oa.web.model.OaBusiLeave;
import cn.edu.ahpu.oa.web.process.service.ProcessService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;


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
}
