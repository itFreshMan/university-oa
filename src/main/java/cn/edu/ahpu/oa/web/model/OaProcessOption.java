/**
 * Copyright (c) 2015,AHPU All Rights Reserved.
 */
package cn.edu.ahpu.oa.web.model;
// Generated 2015-1-7 15:15:58 by Hibernate Tools 3.2.2.GA


import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * OaProcessOption generated by hbm2java
 */
@Entity
@Table(name="oa_process_option"
)
public class OaProcessOption  implements java.io.Serializable {


     private Long opinionId;
     private String processType;
     private String procInstId;
     private String businessKey;
     private String taskId;
     private String executionId;
     private String actName;
     private String optionAction;
     private String optionName;
     private String optionContent;
     private Date approveTime;
     private String approveUser;
     private String remark;
     private String extra1;
     private String extra2;
     private String extra3;
     private String extra14;

    public OaProcessOption() {
    }

	
    public OaProcessOption(Date approveTime) {
        this.approveTime = approveTime;
    }
    public OaProcessOption(String processType, String procInstId, String businessKey, String taskId, String executionId, String actName, String optionAction, String optionName, String optionContent, Date approveTime, String approveUser, String remark, String extra1, String extra2, String extra3, String extra14) {
       this.processType = processType;
       this.procInstId = procInstId;
       this.businessKey = businessKey;
       this.taskId = taskId;
       this.executionId = executionId;
       this.actName = actName;
       this.optionAction = optionAction;
       this.optionName = optionName;
       this.optionContent = optionContent;
       this.approveTime = approveTime;
       this.approveUser = approveUser;
       this.remark = remark;
       this.extra1 = extra1;
       this.extra2 = extra2;
       this.extra3 = extra3;
       this.extra14 = extra14;
    }
   
     @Id @GeneratedValue(strategy=IDENTITY)
    
    @Column(name="OPINION_ID", unique=true, nullable=false)
    public Long getOpinionId() {
        return this.opinionId;
    }
    
    public void setOpinionId(Long opinionId) {
        this.opinionId = opinionId;
    }
    
    @Column(name="PROCESS_TYPE", length=100)
    public String getProcessType() {
        return this.processType;
    }
    
    public void setProcessType(String processType) {
        this.processType = processType;
    }
    
    @Column(name="PROC_INST_ID_", length=64)
    public String getProcInstId() {
        return this.procInstId;
    }
    
    public void setProcInstId(String procInstId) {
        this.procInstId = procInstId;
    }
    
    @Column(name="BUSINESS_KEY")
    public String getBusinessKey() {
        return this.businessKey;
    }
    
    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }
    
    @Column(name="TASK_ID", length=64)
    public String getTaskId() {
        return this.taskId;
    }
    
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
    
    @Column(name="EXECUTION_ID", length=64)
    public String getExecutionId() {
        return this.executionId;
    }
    
    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }
    
    @Column(name="ACT_NAME")
    public String getActName() {
        return this.actName;
    }
    
    public void setActName(String actName) {
        this.actName = actName;
    }
    
    @Column(name="OPTION_ACTION", length=16)
    public String getOptionAction() {
        return this.optionAction;
    }
    
    public void setOptionAction(String optionAction) {
        this.optionAction = optionAction;
    }
    
    @Column(name="OPTION_NAME", length=32)
    public String getOptionName() {
        return this.optionName;
    }
    
    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }
    
    @Column(name="OPTION_CONTENT", length=2048)
    public String getOptionContent() {
        return this.optionContent;
    }
    
    public void setOptionContent(String optionContent) {
        this.optionContent = optionContent;
    }
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="APPROVE_TIME", nullable=false, length=19)
    public Date getApproveTime() {
        return this.approveTime;
    }
    
    public void setApproveTime(Date approveTime) {
        this.approveTime = approveTime;
    }
    
    @Column(name="APPROVE_USER", length=64)
    public String getApproveUser() {
        return this.approveUser;
    }
    
    public void setApproveUser(String approveUser) {
        this.approveUser = approveUser;
    }
    
    @Column(name="REMARK", length=512)
    public String getRemark() {
        return this.remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    @Column(name="extra1", length=64)
    public String getExtra1() {
        return this.extra1;
    }
    
    public void setExtra1(String extra1) {
        this.extra1 = extra1;
    }
    
    @Column(name="extra2", length=64)
    public String getExtra2() {
        return this.extra2;
    }
    
    public void setExtra2(String extra2) {
        this.extra2 = extra2;
    }
    
    @Column(name="extra3", length=64)
    public String getExtra3() {
        return this.extra3;
    }
    
    public void setExtra3(String extra3) {
        this.extra3 = extra3;
    }
    
    @Column(name="extra14", length=64)
    public String getExtra14() {
        return this.extra14;
    }
    
    public void setExtra14(String extra14) {
        this.extra14 = extra14;
    }




}
