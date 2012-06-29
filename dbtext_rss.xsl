<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0"
       xmlns:inm="http://www.inmagic.com/webpublisher/query"
       xmlns:msxsl="urn:schemas-microsoft-com:xslt"
       xmlns:script="http://www.inmagic.com/professionalservicesgroup"
       xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
       xmlns:fo="http://www.w3.org/1999/XSL/Format"
	   xmlns:dc="http://purl.org/dc/elements/1.1/"
	   xmlns:atom="http://www.w3.org/2005/Atom">
      
       <xsl:output method="xml"
                           indent="yes"
                           cdata-section-elements="link"
						   encoding="iso-8859-1"
						    
						   />
	   <!-- ##########################################################
			An XSL script to use with a DB/Textworks database to turn
			into RSS. Will need modification to match your field names and
			database.
			########################################################### -->
						   
						   
	   <!-- set some variables -->				   
       <xsl:variable name="organisation">My Organisation</xsl:variable>                   
       <xsl:variable name="domain">example.com</xsl:variable>
	   <xsl:variable name="database">newsdatabase</xsl:variable>
	   
                                       
       <msxsl:script language="JScript" implements-prefix="script">
          function PubDate() {
              var objDate = new Date();
             
			 var s = objDate.toUTCString();
			 s = s.replace(/UTC/, "UT"); // to conform to RFC-822
			 return s;
          }
       </msxsl:script>
 
       <xsl:template match="/">
             <rss version="2.0">
                    <channel>
                           <title><xsl:copy-of select="$organisation"/></title>
                           <link><xsl:text>http://<xsl:copy-of select="$domain"/>/</xsl:text></link>
                           <description>Feed from <xsl:copy-of select="$organisation"/></description>
                           <language>en-au</language>
						   <copyright>For internal use only</copyright>
						   <managingEditor>webmaster@<xsl:copy-of select="$domain"/></managingEditor>
						   <ttl>240</ttl>
						   <image>
								<title><xsl:copy-of select="$organisation"/></title>
								<url>http://<xsl:copy-of select="$domain"/>/rss/library.png</url>
								<link>http://<xsl:copy-of select="$domain/>/</link>
						   </image>
                           <pubDate><xsl:value-of select="script:PubDate()"/></pubDate>
                           <generator><xsl:value-of select="/inm:Results/@productTitle"/></generator>
                           <xsl:apply-templates select="inm:Results/inm:Recordset">
                             </xsl:apply-templates>
                           <xsl:apply-templates select="inm:Results/inm:Error">
                             </xsl:apply-templates>
                    </channel>
             </rss>
       </xsl:template>
	   

       <xsl:template match="inm:Record">
             <!-- record body -->
             <item>
                    <xsl:apply-templates select="inm:Title"/>
                    <xsl:apply-templates select="inm:Abstract"/>
					<xsl:apply-templates select="inm:Filename"/>	
					<xsl:apply-templates select="inm:Descriptor"/>
					<guid>http://<xsl:copy-of select="$organisation"/>/<xsl:copy-of select="$database"/>/<xsl:value-of select="inm:RecordNo" /></guid>
             </item>
       </xsl:template>
	   
       <xsl:template match="inm:Title">
             <title>
                    <xsl:value-of select="."/>
					<xsl:text> (</xsl:text>
					<xsl:value-of select="../inm:ItemNo" />
					<xsl:text> : </xsl:text>
					<xsl:value-of select="../inm:IssueDate" />
					<xsl:text>)</xsl:text>
             </title>
       </xsl:template>
	   
       <xsl:template match="inm:Filename">
             <link>http://<xsl:copy-of select="$domain"/>/digital_objects/<xsl:copy-of select="$database"/>/<xsl:value-of select="."/></link>
			 <dc:creator><xsl:copy-of select="$organisation"/></dc:creator>
       </xsl:template>
	   
       <xsl:template match="inm:Abstract">
             <description>
				<![CDATA[<strong>]]>
						<xsl:value-of select="../inm:Author" />
				<![CDATA[</strong>]]>
					<xsl:text> </xsl:text>
					<![CDATA[<em>]]>
						<xsl:value-of select="../inm:Journal" /> <xsl:text>. </xsl:text>
						<![CDATA[</em>]]>
						<xsl:value-of select="../inm:Volume" /> <xsl:text> </xsl:text>
						<xsl:value-of select="../inm:Number" /> <xsl:text> </xsl:text>
						<xsl:value-of select="../inm:Date" /> <xsl:text> </xsl:text>
						<xsl:value-of select="../inm:Page" />
					
				
				<![CDATA[<div>]]>	
                    <xsl:value-of select="."/>
				<![CDATA[</div>]]>
             </description>
       </xsl:template>
	   
	          <xsl:template match="inm:Descriptor">
				<category><xsl:value-of select="."/></category>
			 </xsl:template>
	   
</xsl:stylesheet>