/* A JQuery plugin for submitting a form to DB/Textworks
*
*    Copyright 2010 Parliament of Victoria Library
*    Author: Peter Neish
*
*    Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
*
*
*    Submit form to database
*    -----------------------
*    Note: You will need to have a DB/Textworks (http://www.inmagic.com) database for this to work
*    
*    Usage:
*    for a form like <form id="myform">...
*    call 
*        jQuery(document).ready(function(){
*            jQuery("#myform").dbtextSubmit();  
*        });    
*
*    It will then loop through all the fields on the form and submit
*    then to the field with the same name in the db/textworks database
*    It will ignore any submit or reset buttons as well as anything 
*    with the class 'ignore'.
*
*    If you try and submit a field that doesn't exist in the database
*    you will get an error. Alternatively you append the field contents
*    on to another field:
*
*    <input name="field_does_not_exist" class="appendto" rel="name_of_a_field_that_exists" />
*
*    this will append this field onto the field designated in the rel attribute
*    it will append the field name as well e.g. field_does_not_exist: value of data submitted 
*
*    You can specify a different location for the webpublisher script or a different database name
*    by passing in a json object with the following variables
*        jQuery("#myform").dbtextSubmit({"database":"mydatabase", "dbtext_url" : "/dbt/dbtwpub.dll"});
*
*	Debug
*	-----
*	If you just want to test this script and don't have a dbtextworks database running you can
*	pass the option debug: false to the dbtextSubmit call. This will just display the XML that 
*	would have been sent to the DB/Textworks database. Use this call:
*	jQuery("#myform").dbtextSubmit({"debug":true)});
*
*/
 (function($) {
 
   $.ajaxSetup({cache: false});   
 
   $.fn.dbtextSubmit = function(settings) {
         
     var config = { 'dbtext_url'    : '/dbtw-wpd/exec/dbtwpub.dll',
                    'database'      : 'feedback',
					'debug'			: false
                  };
  
     if (settings) $.extend(config, settings);
 
     this.each(function() {
        var f = $(this);
        
        // append a div to hold a message
        f.after("<div class='form_message' style='display:none;' />");
        
        
        // do the submit when we click the button
        $(this).submit(function(data){
            x = _form2xml(config, f);
			
			if(config.debug){
				alert(x);
			}
			else{				          
				$.ajax({
				  type: "POST",
				  url: config.dbtext_url,
				  processData: false,
				  data: x,
				  dataType: 'xml',
				  success: function(data){
						var err = $(data).find("inm\\:Record-Error").first().text();
						err += $(data).find("inm\\:Error").first().text();
						if(err.length > 0 ){
							$(".form_message").text("Oops, there was a problem: " + err).show("slow");
						}
						else{
							$(".form_message").text("Thanks for your comments!").show().delay(1000).fadeOut("slow");
						}    

				  },
				  error: function (request, status, error) {
							$(".form_message").text("Sorry, we had a problem with your submission. If you like, you can email webmaster@parliament.vic.gov.au.").show("slow");
				  }
				});
			}
            

            
            return false;
        });
        
     });
 
     return this;
 
   };
   
 })(jQuery); 

 
 
 function _form2xml(options, form, action){
 // creates XML that can perform an action on a dbTextworks database
   var dbaction = "insert";
   switch(action){
     case "update":
        dbaction = "update";
        break;
     case "delete":
        dbaction ="delete";
        break;
   }
 
   ret = "<?xml version=\"1.0\" ?>\n";
   ret += "<Query xmlns=\"http://www.inmagic.com/webpublisher/query\">\n";
   ret += "<AC validation='none' trim='N'>" + dbaction + "</AC>\n";
   ret += "<KeyFields>\n";
   ret += "<KeyField>id</KeyField>\n";
   ret += "</KeyFields>\n";
   ret += "<TN>" + options.database + "</TN>\n";
   // put the fields in here
   ret += "<Recordset>\n";
   ret += "<Record>\n";
   form.find(":input").not(':submit')
						 .not(':reset')
                         .not('.ignore')
                         .not(':radio:not(:checked)')     //drop any unchecked radio/checkboxes
                         .not(':checkbox:not(:checked)')
						 .each(function(){
						 
								el = $(this).attr('name');
								val = $(this).val();
								if (val.length > 0){
                                    if($(this).hasClass("appendto")){
                                        val = el + ": " + val;
                                        el = $(this).attr('rel');
                                    }    
                                
									ret += "<"+el+"><![CDATA["+val+"]]></"+el+">";
								}	
	});
   
   ret += "</Record>\n";
   ret += "</Recordset>\n";
   ret += "</Query>\n";

	return ret;
}

