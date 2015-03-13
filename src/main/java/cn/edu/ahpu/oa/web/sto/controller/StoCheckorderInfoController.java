package cn.edu.ahpu.oa.web.sto.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.JSONUtils;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.utils.capture.CaptureUtils;
import cn.edu.ahpu.oa.web.model.StoCheckorderDetails;
import cn.edu.ahpu.oa.web.model.StoCheckorderInfo;
import cn.edu.ahpu.oa.web.sto.dto.StoResponseMessage;
import cn.edu.ahpu.oa.web.sto.dto.StoResponseMessageData;
import cn.edu.ahpu.oa.web.sto.service.StoCheckorderDetailsService;
import cn.edu.ahpu.oa.web.sto.service.StoCheckorderInfoService;
import cn.edu.ahpu.tpc.framework.core.spring.JXLSExcelView;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * sto_checkorder_info Controller
 * 
 * @author
 * @since 2015-01-14
 */
@Controller
@RequestMapping(value = "/sto/StoCheckorderInfo")
public class StoCheckorderInfoController extends BaseController {
	@Autowired
	private StoCheckorderInfoService service;

	@Autowired
	private StoCheckorderDetailsService detailsService;

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		dateFormat.setLenient(false);
		CustomDateEditor dateEditor = new CustomDateEditor(dateFormat, true);// true:允许输入空值，false:不能为空值
		binder.registerCustomEditor(Date.class, dateEditor);
	}

	@RequestMapping(value = "/index")
	public String index() {
		return "/oa/sto/StoCheckorderInfo";
	}

	@RequestMapping(value = "/pageFindCheckorderInfo", method = RequestMethod.POST)
	@ResponseBody
	public Pagination<Map<String, Object>> pageFindCheckorderInfo(
			Integer start, Integer limit, StoCheckorderInfo entity,
			Date startDate, Date endDate) {
		Pagination<Map<String, Object>> page = service.pageFindCheckorderInfo(start, limit, entity, startDate,endDate);
		if(page != null && page.getResult() != null && page.getResult().size() > 0){
			List<Map<String, Object>> infoList = page.getResult();
			Date curDate = new Date();
			Calendar c = Calendar.getInstance();
			for(Map<String,Object> map :infoList){
				Integer status = Integer.parseInt( map.get("status").toString());
				Integer expirationDays = Integer.parseInt( map.get("expirationDays").toString());
				if(status == 1 || status == 2){
					if( map.get("checkTime") != null){
						Date checkTime = (Date) map.get("checkTime");
						c.setTime(checkTime);
						c.add(Calendar.DATE, expirationDays);
						Date expirationDate = c.getTime();//过期日期
						if(curDate.after(expirationDate)){//当前日期 after 过期日期,说明过期了
							map.put("expirationFlag", 1);
						}
					}
				}
			}
		}
		return page;
				
	}

	@RequestMapping(value = "/viewDetails")
	public ModelAndView openTaskDealPage(Long busiId) {
		ModelAndView modelAndView = new ModelAndView(
				"/oa/sto/viewCheckorderInfoDetails");
		Map<String, Object> map = service.getEntityBusiInfo(busiId);
		modelAndView.addObject("busiMap", map);
	/*	List<StoCheckorderDetails> listAllDetails = detailsService
				.listAllDetails(busiId);*/
		 List<Map<String,Object>> listAllMapDetails= detailsService.listAllMapDetails(busiId);
		String json = null;
		try {
			mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
			json = mapper.writeValueAsString(listAllMapDetails);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		modelAndView.addObject("detailsJson", json);
		return modelAndView;
	}

	@RequestMapping(value = "/save")
	@ResponseBody
	public ResponseData save(StoCheckorderInfo entity) {
		return service.insertEntity(entity);
	}

	/*
	 * @RequestMapping(value="/update")
	 * 
	 * @ResponseBody public ResponseData update(StoCheckorderInfo entity) {
	 * return service.updateEntity(entity); }
	 */

	@RequestMapping(value = "/delete")
	@ResponseBody
	public ResponseData delete(Long[] ids) {
		service.delete(ids);
		return ResponseData.SUCCESS_NO_DATA;
	}

	@RequestMapping(value = "/changeStatus")
	@ResponseBody
	public ResponseData changeStatus(Long busiId, Integer status) {
		return service.changeStatus(busiId, status);
	}

	/**
	 * 检查处理
	 * 
	 * @param busiId
	 * @return
	 */
	@RequestMapping(value = "/checkNowByStoUser")
	@ResponseBody
	public ResponseData checkNowByStoUser(StoCheckorderDetails detailsEntity) {
		return service.checkNowByStoUser(detailsEntity);
	}

	/**
	 * 导出excel
	 * @param entity
	 * @param startDate
	 * @param endDate
	 * @param fileName
	 * @return
	 */
	@RequestMapping(value = "/xls")
	public ModelAndView xls(StoCheckorderInfo entity, Date startDate,Date endDate, String fileName) {
			
		if (StringUtils.isNotBlank(fileName)) {
			try {
				fileName = URLDecoder.decode(fileName, "UTF-8");
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}

		}
		// limit为0：标识为部分也查询;
		Pagination<Map<String, Object>> page = service.pageFindCheckorderInfo(0, 0, entity, startDate, endDate);
		List<Map<String,Object>> infoList = new ArrayList<Map<String,Object>>();
		if(page != null && page.getResult() != null && page.getResult().size() > 0){
			infoList = page.getResult();
		}
		ModelMap modelMap = new ModelMap();
		
		 modelMap.addAttribute("list",infoList);
		 modelMap.put("ExcelExportFileName", fileName);    
         modelMap.put("ExcelTemplateFileName", "查单信息明细.xls");   
         modelMap.put("fileName", fileName);   
		 return new ModelAndView(new JXLSExcelView(),modelMap);
	}
	
	
	
	@Value("${kuaidi100.sto.capture.url}")
	private String kuaidi100StoCaptureUrl ;
	
	/**
	 * 抓取申通快递 数据;
	 */
	@RequestMapping(value = "/captureStoOrderDetails")
	public ModelAndView captureStoOrderDetails(String orderNum){
		ModelAndView mav = new ModelAndView("/oa/sto/captureStoOrderDetails");
		Map<String, String> params = new HashMap<String, String>();  
//		params.put("type","shentong");
		params.put("postid",orderNum);
		
		Map<String, Class> classMap = new HashMap<String, Class>();  
		classMap.put("data", StoResponseMessageData.class);
		String infos =  CaptureUtils.ajaxCrossDomain(kuaidi100StoCaptureUrl,params);
		
		JsonConfig config = new JsonConfig();
		JSONUtils. getMorpherRegistry().registerMorpher( new DateMorpher( new String[] {"yyyy-MM-dd HH:mm:ss" }) );//存在Date类型
		StoResponseMessage entity = (StoResponseMessage) JSONObject.toBean(JSONObject.fromObject(infos,config), StoResponseMessage.class, classMap);
		mav.addObject("busiInfo",entity);
		mav.addObject("orderNum",orderNum);
		mav.addObject("successFlag",entity.getMessage().toLowerCase().equals("ok") && entity.getStatus().equals("200"));
		
		if(entity != null && entity.getData() != null && entity.getData().size() > 0){
			List<StoResponseMessageData> dataList = entity.getData();
			mav.addObject("dealRecordSize",dataList.size());//处理记录条数
			
			Date dStart = dataList.get(0).getTime();
			Date dEnd =  dataList.get(dataList.size() - 1).getTime();
			long interval  = 0l;
			if(dStart.after(dEnd)){
				interval  = dStart.getTime() - dEnd.getTime();
			}else{
				interval  = dEnd.getTime() - dStart.getTime();
			}
			interval  = interval / (1000 * 60) ;//转换为分钟
			long days = interval / (24 * 60);
			interval = interval % (24 * 60);
			long hours = interval / 60;
			mav.addObject("usedTimeStr",days+"天"+hours+"小时");
			
			//对指定列表按升序进行排序。
			Collections.sort(dataList, new Comparator<StoResponseMessageData>() {
				@Override
				public int compare(StoResponseMessageData o1,
						StoResponseMessageData o2) {
					int result = 0;
					if(o1 !=null && o2 != null && o1.getTime() != null && o2.getTime() != null){
						if(o1.getTime().after(o2.getTime())){
							result = 1;
						}
					}
					return result;
				}
			});
			entity.setData(dataList);
		}
		return mav;
		
	}
}
