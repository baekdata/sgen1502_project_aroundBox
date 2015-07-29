package example;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kim on 2015-06-22.
 */


public class HelloWorld {

  public static final String		KLT_URL						= "C:\\Users\\Kim\\IdeaProjects\\test\\EXE";

  public static String analysis(String str) {
    if(str==null) return null;

    // " �� ' �� �ٲ��ֱ�
    if (str.contains("\"")) {
      str.replaceAll("\"", "'");
    }


    File f = new File(KLT_URL);
    String exeFile = KLT_URL + "\\indexT.exe";
    String inFile = KLT_URL + "\\input.txt";



    try {
      System.out.println("1");

      FileOutputStream fos = new FileOutputStream(inFile);
      OutputStreamWriter osw = new OutputStreamWriter(fos, "MS949");
      BufferedWriter bw = new BufferedWriter(osw);
      bw.write(str);
      bw.close();
      System.out.println("2");

      String s = null;
      ProcessBuilder builder;
      Process oProcess;



      builder = new ProcessBuilder(exeFile, inFile);
      builder.directory(f);// �����ָ鿡��

      System.out.println("4"+str);

      oProcess = builder.start();

      System.out.println("5");

      BufferedReader stdOut = new BufferedReader(new InputStreamReader(
              oProcess.getInputStream() ,"MS949"));
      BufferedReader stdError = new BufferedReader(new InputStreamReader(
              oProcess.getErrorStream() ,"MS949"));

      int i = 0;
      s = stdOut.readLine();
      s = stdOut.readLine();
      s = stdOut.readLine();
      s = stdOut.readLine();

      JSONObject result = new JSONObject();
      JSONArray keywords = new JSONArray();
      while (s != null){
        i++;
        System.out.println("7-"+i);
        System.out.println(s);
        String[] arStr = s.split("\\s+");
        int length=s.split("\\s+").length;
        if(length==1) break;
        System.out.println("8-aaa"+length);
        for(int j=0;i<length;i++) {
          System.out.println(arStr[i]);
        }

        System.out.println("8-"+arStr[0]);
        Map keyword = new HashMap();
        keyword.put("keyword",arStr[4]);
        keyword.put("socre",arStr[3]);
        System.out.println("9-" + i);

        keywords.put(keyword);

        s = stdOut.readLine();
        System.out.println("10-"+i);
      }
      System.out.println("8");

      s = stdError.readLine();
//      if(s != null) {
//        result.put("error", "1");
//        result.put("message", s);
//      }
//      else {
        result.put("error", "0");
        result.put("result", keywords);
//      }
        //System.out.println("Exit Code: " + oProcess.exitValue());
        oProcess.exitValue();
      System.out.println(result);
      return result.toString();

    } catch (IOException e) {
      e.printStackTrace(); System.out.println("error");
    }
    System.out.println("9");



    return null;
  }
}