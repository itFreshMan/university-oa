package cn.edu.ahpu.oa.web.process.controller;

import java.sql.SQLException;

import javax.sql.rowset.serial.SerialException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.edu.ahpu.oa.web.process.service.ApproveService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;


/**
 * 
	 * <p>Project: university-oa </p>
	 * @author <a href="jhuaishuang@gmail.com">JHS</a>
	 * @version 2015-1-7 下午4:38:42 
	 * @description:
 */
@Controller
@RequestMapping("/oa/process/form")
public class ApproveController extends BaseController{

	@Autowired
	private ApproveService approveService;
	
	/**
	 * 通用环节处理逻辑
	 * @param taskId 工作项任务ID
	 * @param lineVariable 当前环节下一连线设置变量
	 * @param value 连线变量值 (1:同意  0:不同意)
	 * @param businessKey 业务主键(对应各业务表的主键)
	 * @return
	 */
	@RequestMapping(value = "/dealAct", method = RequestMethod.POST)
	@ResponseBody
	public ResponseData dealAct(String taskId, String lineVariable, String value, String businessKey, String optionContent) {
		try {
			approveService.dealAct(taskId, lineVariable, value, businessKey, optionContent);
		} catch (SerialException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		return ResponseData.SUCCESS_NO_DATA;
	}
	
}
