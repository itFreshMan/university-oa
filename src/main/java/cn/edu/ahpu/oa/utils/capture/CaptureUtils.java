package cn.edu.ahpu.oa.utils.capture;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.jsoup.Connection.Method;
import org.jsoup.Connection.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;



/**
 * @author <a href="jhuaishuang@gmail.com">JHS</a>
 * @datetime 2015-1-16 上午10:10:32 
 * @description:
 */
public class CaptureUtils {
	
	/**
	 *解决ajax请求跨域访问:
	 */
	public static String ajaxCrossDomain(String url,Map<String, String> params){
		String infos = null;
		Document document;
		try {
			document = Jsoup.connect(url).data(params).userAgent("Mozilla").get();
			Element body = document.body();
			infos = body.html();
			if(infos != null && infos.trim().length() > 0){
				infos = infos.replaceAll("&quot;","\"");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return infos;
	}
	
	/**
	 * 带登陆的数据抓取;
	 * @param loginUrl
	 * @param loginMap
	 * @param dataUrl
	 * @param dataMap
	 * @return
	 */
	public static Document login(String loginUrl,Map<String, String> loginMap , String dataUrl ,Map<String, String> dataMap) {
		Document document = null;
		try {
			Response response= Jsoup.connect(loginUrl).ignoreContentType(true).data(loginMap).userAgent("Mozilla").method(Method.POST).execute();
			Map<String, String> cookies = response.cookies();
			/*Iterator<?> it = cookies.entrySet().iterator();
			while(it.hasNext()){
				Entry<?, ?> entry = (Entry<?, ?>) it.next();
				System.out.println(entry.getKey()+":"+entry.getValue());
			}
			String sessionId = response.cookie("JSESSIONID"); 
			System.out.println(sessionId);*/
			 document =Jsoup.connect(dataUrl).ignoreContentType(true).cookies(cookies).data(dataMap).post();
		} catch (IOException e) {
			e.printStackTrace();
		}
		 return document;
}
	
	public static void testLogin() {
		String loginUrl = "http://10.160.134.10:8088/j_spring_security_check";
		Map<String, String> loginMap = new HashMap<String, String>();  
		loginMap.put("j_username","508974");
		loginMap.put("j_password","000000");
		
		String dataUrl = "http://10.160.134.10:8088/select/tjb_IpasTjbCkftplr";
		Map<String, String> dataMap = new HashMap<String, String>();  
		dataMap.put("limit","508974");
		dataMap.put("start","000000");
		dataMap.put("tjrqStr","201412");
		
		Document document = login(loginUrl, loginMap, dataUrl, dataMap);
		System.out.println(document.html());
	}
	
	
	public static void testAjaxCrossDomain01() {
		String url = "http://www.kuaidi100.com/query?type=shentong";
		Map<String, String> params = new HashMap<String, String>();  
		params.put("postid","968646983186");
		String infos =  ajaxCrossDomain(url,params);
		System.out.println(infos);
	}
}
