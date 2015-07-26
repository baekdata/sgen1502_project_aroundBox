<%--
  Created by IntelliJ IDEA.
  User: Kim
  Date: 2015-06-22
  Time: 오후 4:18
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="example.HelloWorld" %>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Insert title here</title>
  </head>
<body>
<form action="/index.jsp" method="post">
  <input type="text" name="key">
  <input type="submit">
</form>
<%
  request.setCharacterEncoding("UTF-8");
  String key = request.getParameter("key");
%>
  <%=HelloWorld.analysis(key)%>
</body>
</html>