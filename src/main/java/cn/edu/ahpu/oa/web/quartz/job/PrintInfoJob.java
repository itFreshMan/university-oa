package cn.edu.ahpu.oa.web.quartz.job;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class PrintInfoJob {
	protected  final Logger logger = LoggerFactory.getLogger(getClass());
	
	public void print() {
		logger.info("--------------------------打印信息"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:sss").format(new Date()));
	}
}
