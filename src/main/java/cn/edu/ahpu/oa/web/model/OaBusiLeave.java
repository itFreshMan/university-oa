package cn.edu.ahpu.oa.web.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * oa_busi_leave
 * 
 * @author
 * @since 2014-12-23
 */
@Entity
@Table(name = "oa_busi_leave")
public class OaBusiLeave implements Serializable {

	/** 请假单ID */
	private Long busiId;

	/** 事由说明 */
	private String title;

	/** 机构ID */
	private Long orgId;

	/** 开始时间 */
	private java.util.Date beginTime;

	/** 结束时间 */
	private java.util.Date endTime;

	/** 实际时长(小时) */
	private Integer realTime;

	/** 说明 */
	private String remark;

	/** PROC_INST_ID */
	private String procInstId;

	/** 业务状态;0:初始状态(还未发起流程),1:审批中,2:审批通过,3:审批未通过,4:强制结束 */
	private Integer status;

	/** CREATE_USER */
	private Integer createUser;

	/** CREATE_TIME */
	private java.util.Date createTime;

	/** 0: 未删除,1:删除 */
	private Integer delFlag;

	@Id
	@GeneratedValue(generator = "tableGenerator")
	@GenericGenerator(name = "tableGenerator", strategy = "cn.edu.ahpu.common.dao.key.SequenceGenerator")
	@Column(name = "BUSI_ID", length = 19, nullable = false)
	public Long getBusiId() {
		return busiId;
	}

	public void setBusiId(Long busiId) {
		this.busiId = busiId;
	}

	@Column(name = "TITLE", length = 200, nullable = false)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "ORG_ID", length = 19, nullable = false)
	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	@Column(name = "BEGIN_TIME", length = 19, nullable = false)
	public java.util.Date getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(java.util.Date beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "END_TIME", length = 19, nullable = false)
	public java.util.Date getEndTime() {
		return endTime;
	}

	public void setEndTime(java.util.Date endTime) {
		this.endTime = endTime;
	}

	@Column(name = "REAL_TIME", length = 10, nullable = true)
	public Integer getRealTime() {
		return realTime;
	}

	public void setRealTime(Integer realTime) {
		this.realTime = realTime;
	}

	@Column(name = "REMARK", length = 1000, nullable = true)
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "PROC_INST_ID", length = 64, nullable = true)
	public String getProcInstId() {
		return procInstId;
	}

	public void setProcInstId(String procInstId) {
		this.procInstId = procInstId;
	}

	@Column(name = "STATUS", length = 10, nullable = true)
	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@Column(name = "CREATE_USER", length = 10, nullable = true)
	public Integer getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Integer createUser) {
		this.createUser = createUser;
	}

	@Column(name = "CREATE_TIME", length = 19, nullable = false)
	public java.util.Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(java.util.Date createTime) {
		this.createTime = createTime;
	}

	@Column(name = "DEL_FLAG", length = 10, nullable = true)
	public Integer getDelFlag() {
		return delFlag;
	}

	public void setDelFlag(Integer delFlag) {
		this.delFlag = delFlag;
	}

}
