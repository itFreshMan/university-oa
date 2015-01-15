package cn.edu.ahpu.oa.web.sto.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.web.model.StoCheckorderTitle;
import cn.edu.ahpu.oa.web.sto.service.StoCheckorderTitleService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

/**
 * sto_checkorder_title Controller
 * @author            
 * @since             2015-01-14
 */
@Controller
@RequestMapping(value="/sto/StoCheckorderTitle")
public class StoCheckorderTitleController extends BaseController
{
    @Autowired
    private StoCheckorderTitleService service;
    
    @RequestMapping(value = "/index")
    public String index(){
        return "/oa/sto/StoCheckorderTitle";
    }
    
	@RequestMapping(value = "/pageFindCheckorderTitles", method = RequestMethod.POST)
	@ResponseBody
	public Pagination<Map<String, Object>> pageFindCheckorderTitles(Integer start, Integer limit,String titleCode,String titleContent) {
		return service.pageFindCheckorderTitles(start, limit,titleCode,titleContent);
	}
    
    @RequestMapping(value="/save")
    @ResponseBody
    public ResponseData save(StoCheckorderTitle entity)
    {
    	return service.insertEntity(entity);
    }
    
    @RequestMapping(value="/update")
    @ResponseBody
    public ResponseData update(StoCheckorderTitle entity)
    {
	  StoCheckorderTitle dbEntity = service.getEntityById(entity.getBusiId());
	  if(dbEntity == null){
		  return new ResponseData(false,"改条记录busiId("+entity.getBusiId()+")已被删除");
	  }
	  dbEntity.setTitleContent(entity.getTitleContent());
	  dbEntity.setExpirationDays(entity.getExpirationDays());
	  service.updateEntity(dbEntity);
      return ResponseData.SUCCESS_NO_DATA;
    }
    
	@RequestMapping(value="/delete")
    @ResponseBody
    public ResponseData delete(Long[] ids)
    {
	  service.delete(ids);
      return ResponseData.SUCCESS_NO_DATA;
    }
    
    
}

