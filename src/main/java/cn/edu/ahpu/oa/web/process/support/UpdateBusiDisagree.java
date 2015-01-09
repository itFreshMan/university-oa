package cn.edu.ahpu.oa.web.process.support;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.edu.ahpu.oa.utils.OaAttitude;
import cn.edu.ahpu.oa.web.process.dao.BusinessDao;


/**
 * 流程最终审批不通过时,更新对应业务表状态为不批准
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @version 2015-1-8 下午7:49:11 
 * @description:
 */
@Component
public class UpdateBusiDisagree implements JavaDelegate{

	@Autowired
	private BusinessDao businessDao;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		  String businessKey = execution.getProcessBusinessKey();
		  String processKey = execution.getProcessDefinitionId().split(":")[0];
		  businessDao.updateBusiByAttitude(processKey, businessKey,OaAttitude.DISAGREE);
	}

}
