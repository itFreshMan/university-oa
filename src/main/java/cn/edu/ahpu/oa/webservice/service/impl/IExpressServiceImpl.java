package cn.edu.ahpu.oa.webservice.service.impl;

import java.util.HashMap;
import java.util.Map;

import cn.edu.ahpu.oa.utils.capture.CaptureUtils;
import cn.edu.ahpu.oa.webservice.service.IExpressService;


public class IExpressServiceImpl implements IExpressService {
	
	public static final String STO_TYPE ="shentong";
	
	@Override
	public String showDetails(String type, String postid) {
		String url = IExpressService.URL;
		Map<String, String> params = new HashMap<String, String>();  
		params.put("type",type);
		params.put("postid",postid);
		String infos =  CaptureUtils.ajaxCrossDomain(url,params);
		return infos;
	}

	@Override
	public String showSTODetails(String postid) {
		return showDetails(STO_TYPE,postid);
	}
}
