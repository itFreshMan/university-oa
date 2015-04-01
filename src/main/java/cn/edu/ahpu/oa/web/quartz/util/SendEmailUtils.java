package cn.edu.ahpu.oa.web.quartz.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import cn.edu.ahpu.tpc.framework.core.spring.SpringApplicationContextHolder;

public class SendEmailUtils {
	protected static final Logger logger = LoggerFactory.getLogger(SendEmailUtils.class);
	private static JavaMailSender javaMailSender = SpringApplicationContextHolder.getBean(JavaMailSender.class);
	
	public static void sendMail(){
		logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>发送邮件了"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:sss").format(new Date()));
		
		String subject = "主题1";
		String mailFrom = ((JavaMailSenderImpl)javaMailSender).getJavaMailProperties().getProperty("mail.from");
		String mailContent = "这里是邮件主题，内容：恭喜你中奖了...........";
		MimeMessage msg = javaMailSender.createMimeMessage();  
        // false表示非marltipart,UTF-8为字符编码  
        MimeMessageHelper helper;
		try {
			helper = new MimeMessageHelper(msg, false, "UTF-8");
			  helper.setSubject(subject);  
		        helper.setFrom(mailFrom);  
		        helper.setTo("393055332@qq.com");  
		        helper.setText(mailContent, true);//设置为true表示发送的是HTML  
		        javaMailSender.send(msg);  
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
      
	}
	
	

	/**
	 * 判断字符串是否是正确的邮件地址
	 * @param phoneNo
	 * @return
	 */
	private static boolean checkMailStr(String email) {
	    boolean isExist = false;  	       
        Pattern p = Pattern.compile("\\w+@(\\w+.)+[a-z]{2,3}");  
        Matcher m = p.matcher(email);  
        boolean b = m.matches();  
        if(b) {  
            isExist=true;  
        } 
        return isExist; 
	}
}
