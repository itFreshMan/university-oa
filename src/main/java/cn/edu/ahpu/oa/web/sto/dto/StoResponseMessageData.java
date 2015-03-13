package cn.edu.ahpu.oa.web.sto.dto;

import java.util.Date;

public class StoResponseMessageData {

	private Date time;
	private String context;
	private String ftime;

	public StoResponseMessageData() {
		super();
	}

	@Override
	public String toString() {
		return "MessageData [time=" + time + ", context=" + context
				+ ", ftime=" + ftime + "]";
	}

	public StoResponseMessageData(Date time, String context, String ftime) {
		super();
		this.time = time;
		this.context = context;
		this.ftime = ftime;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getFtime() {
		return ftime;
	}

	public void setFtime(String ftime) {
		this.ftime = ftime;
	}

}
