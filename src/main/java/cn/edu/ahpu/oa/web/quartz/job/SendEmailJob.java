package cn.edu.ahpu.oa.web.quartz.job;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import cn.edu.ahpu.oa.web.quartz.util.SendEmailUtils;

public class SendEmailJob extends QuartzJobBean{

	@Override
	protected void executeInternal(JobExecutionContext context)
			throws JobExecutionException {
	    try {
            SendEmailUtils.sendMail();//调用发送邮件的逻辑
        } catch (Exception e) {
            e.printStackTrace();
        }
	}


}
