package cn.edu.ahpu.oa.utils.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

/**
 * 
 * @author JHS
 * @date 2014-12-1 下午3:59:12
 */
public class FileCommonOperate {

	/**
	 * 
	 * @param inputStream 待上传文件的输入流
	 * @param path 上传目标路径
	 * @param fileName 上传后文件名
	 * @return
	 */
	public static String uploadFile(InputStream inputStream, String path, String fileName) {
		try {
			File file = createFile(path, fileName);
			OutputStream outputStream = new FileOutputStream(file);			
			try {
				IOUtils.copyLarge(inputStream, outputStream);
			} finally {
				outputStream.close();
			}			
			return file.getName();
		} catch (IOException e) {
			throw new IllegalArgumentException("Could not add record", e);
		}
	}	
	
	private static File createFile(String path, String fileName) {
	 	File file = new File(path);
	 	if(!file.exists())
	 		file.mkdirs();
	 	file = new File(path, fileName);
	  	return file;
	}
	
	/**
	 * 下载文件
	 * @param request 
	 * @param response
	 * @param filePath 完整文件路径(包含文件名)
	 * @param saveFileName 下载时保存到本地的文件名
	 * @throws UnsupportedEncodingException
	 */
	public static void downLoadFile(HttpServletRequest request, HttpServletResponse response, String filePath, String saveFileName) throws UnsupportedEncodingException {
		if (request.getHeader("User-Agent").toLowerCase()
				.indexOf("firefox") > 0) {
			saveFileName = new String(saveFileName.getBytes("UTF-8"),
					"ISO8859-1");// firefox浏览器
		} else if (request.getHeader("User-Agent").toUpperCase()
				.indexOf("MSIE") > 0) {
			saveFileName = URLEncoder.encode(saveFileName, "UTF-8");// IE浏览器
		} else {
			saveFileName = URLEncoder.encode(saveFileName, "UTF-8");
		}
		try {
			FileInputStream fis = new FileInputStream(new File(filePath));
			response.setHeader("Content-Disposition", "attachment; filename=\""+ saveFileName + "\""); 
			response.setContentType("application/octet-stream");
			OutputStream os = response.getOutputStream();
			byte[] b = new byte[1024];
			int i = 0;
			while ((i = fis.read(b)) > 0) {
			    os.write(b, 0, i);
			}
			fis.close();
			os.flush();
			os.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
/*	public static void main(String[] args) {
		try {
			FileInputStream fileInputStream = new FileInputStream(new File("D:" + File.separator + "ttt.txt"));
			FileCommonOperate t = new FileCommonOperate();
			String temp = t.uploadFile(fileInputStream, "d:/temz", "zzp123321.txt");
			System.out.println(temp);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}*/
}
