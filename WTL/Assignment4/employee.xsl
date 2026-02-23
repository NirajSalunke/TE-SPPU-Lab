<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
<xsl:template match="/">
<html>
<head>
<title>Employee Directory</title>
<style>
  body { font-family: Arial, sans-serif; background: #fff; padding: 40px; color: #333; }
  h2 { font-size: 22px; margin-bottom: 4px; }
  p.sub { color: #999; font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f4f4f4; padding: 12px 14px; text-align: left; font-size: 13px; color: #555; border-bottom: 2px solid #ddd; }
  td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #eee; }
  tr:hover td { background: #fafafa; }
  .id { color: #888; font-size: 13px; }
  .salary { color: #2d6a4f; font-weight: bold; }
  .email { color: #3b82f6; }
</style>
</head>
<body>
  <h2>Employee Directory</h2>
  <p class="sub">XML + DTD Validation + XSLT Transformation</p>
  <table>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Department</th>
      <th>Salary (₹)</th>
      <th>Hire Date</th>
      <th>Email</th>
    </tr>
    <xsl:for-each select="employees/employee">
    <tr>
      <td class="id"><xsl:value-of select="@empId"/></td>
      <td><strong><xsl:value-of select="name"/></strong></td>
      <td><xsl:value-of select="department"/></td>
      <td class="salary">₹ <xsl:value-of select="salary"/></td>
      <td><xsl:value-of select="hire_date"/></td>
      <td class="email"><xsl:value-of select="email"/></td>
    </tr>
    </xsl:for-each>
  </table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
