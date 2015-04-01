package cn.edu.ahpu.oa.web.process.support;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.springframework.stereotype.Component;

/**
 * 指定下一个任务的办理人;
 *
 */
@Component
public class ManagerTaskHandler implements TaskListener {
	@Override
	public void notify(DelegateTask delegateTask) {
		
	}
}
