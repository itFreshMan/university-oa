package cn.edu.ahpu.oa.web.sto.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.edu.ahpu.oa.web.model.StoCheckorderDetails;
import cn.edu.ahpu.oa.web.sto.service.StoCheckorderDetailsService;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.web.controller.BaseController;

/**
 * sto_checkorder_details Controller
 * @author            
 * @since             2015-01-14
 */
@Controller
@RequestMapping(value="/sto/StoCheckorderDetails")
public class StoCheckorderDetailsController extends BaseController
{
    @Autowired
    private StoCheckorderDetailsService service;
    
    @RequestMapping(value = "/index")
    public String index(){
        return "/oa/sto/StoCheckorderDetails";
    }
    
}

