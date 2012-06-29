// A JQuery plugin that puts in links (permalinks and RSS for current search)
// Copyright Parliamentary Library of Victoria
//
// Usage
//
// 1. Add a report header or footer with a combination of fixed text and the variable: SEARCH as the content
//    it will look something like:
//		<div id="rss">
//		[Variable:SEARCH]
//		</div>
//		(make sure they are all treated as raw html)
//		
// 2. include jquery and this script by putting the following in a report header (assuming the scripts are located in /script:
//		 <script src="/script/jquery.js" type="text/javascript" ></script>
// 		<script src="/script/jquery.searchlinks.js" type="text/javascript" ></script>
//
//3. Add a bit of javascript to call this function (can go straight after the declarations in step 2)
// 		<script type="text/javascript">
//  			$ (document).ready(function(){    
//      			$("#rss").searchlinks( );
//			});
//		</script>
//
//
//	You could also override any variables to the searchlinks functions e.g.
//		$("#rss").searchlinks(
//			{ limit: 10,
//			  rssxsl: "http://library.parliment.vic.gov.au/rss/default.xsl",
//			  types: ["rss"],
//			  rssIcon: "/rss/bigIcon.png"}
//		);
//	
//	Peter Neish 30 Oct 2008
//
// 
// 

 (function($){  
  $.fn.searchlinks = function(options) {  
   
   var defaults = {  
    reportForm: "",	// for the   search display (TODO: we could try and get this from the DOM somehow..)
    displayForm: "",
    sortForm: "sortbydate", // the default sort form for RSS display  
    limit: 40,				// how many items to show in RSS feed  
	dll: "/dbtw-wpd/exec/dbtwpub.dll",
	database: "",			// database name (TODO: get from the DOM?)
	rssxsl: "",					// will default to: /rss/databasename_rss.xsl
	types: ["permalink", "rss"], // other types may be defined in the future.
	rssIcon: "/rss/rss.png",
	permIcon: "/rss/perm.gif"
	
   };  
   var options = $.extend(defaults, options);  
      
   return this.each(function() {  
		obj = $(this);  
		var qry = obj.html(); // assumes that we put in the SEARCH varialble in a DB/Textworks form
		obj.html("");			// clear the html so we can put in our own
		qry = qry.replace(/\n/g, "");
		qry = qry.replace(/^\s*|\s*$/,""); // trim spaces
		qry = qry.replace(/&amp;/g, "%26");	// jquery converts to &amp; so we encode it here
		var db = options.database;
		var rf = options.reportForm;
        var df = options.displayForm;
		
		// attempt to get the database name
		if(db.length == 0){
			// see if we have the dbtw_params string in the DOM
			if(dbtw_params.length > 0){
				re=/tn\=(.+?)&/i;
				db = dbtw_params.match(re)[1];
			}	
		}	
		
		if(rf.length == 0){
			// see if we have the dbtw_params string in the DOM
			if(dbtw_params.length > 0){
				re=/rf\=(.+?)&/i;
				rf = dbtw_params.match(re)[1];
			}	
		}
		
		// now construct a default rss.xsl file if we didn't recieve one
		if(options.rssxsl.length == 0 && db.length > 0){
			options.rssxsl = "http://library.parliament.vic.gov.au/rss/" + db + "_rss.xsl";
		}				
	
		
		jQuery.each(options.types, function(){
			if(this == "rss"){
				
				var rss = options.dll;
				rss += "?tn="+ db;
				rss+= "&rf=" + options.sortForm;
				rss+= "&AC=QUERY";
				rss+= "&XM=1";
				rss+= "&OEX=iso-8859-1";
				rss+= "&TX="+options.limit;
				rss+= "&XS="+options.rssxsl;
				rss += "&qy=" + qry.replace(/"/g, "");
				//rss = rss.replace(/\s&\s/g," %26 "); // encode ampersands
				rss = rss.replace(/\s/g,"%20"); // encode spaces
				
				//if we have a blank rss link then fill in the correct href
				// note this is because IE will only discover RSS if the link is in the DOM from the start
				$("link[href='']").attr("href",rss);
				
				rss = ' <div class="searchlink" ><a href="' + rss + '">';
				
				if(options.rssIcon.length > 0){
					rss = rss + '<img border="0" src="' + options.rssIcon + '" alt="rss" />';
				}	
				rss+= ' RSS</a> (<a href="http://library.parliament.vic.gov.au/rss/rsshelp.htm">what\'s this?</a>)</div>' ;
				obj.append(rss);
				//obj.append(rsslink);
				


			}
			else if (this == "permalink"){			
				// construct the permanent url
				var pl = options.dll;
				pl += "?tn="+ db;
				pl+= "&rf=" + rf;
                pl+= "&df=" + df;
				pl+= "&AC=QUERY";
				pl+= "&NP=2";
				pl+= "&MR=20";
				pl+= "&qy=" + qry.replace(/"/g, "");
				pl = pl.replace(/\s/g,"%20"); // encode spaces	
				pl = '  <div class="searchlink" ><a href="' + pl + '">';
				if(options.permIcon.length > 0){
					pl = pl + '<img border="0" src="' + options.permIcon + '" alt="permalink" /> ';
				}
				pl += 'Permanent URL for this search</a></div>' ;
				
				// and set the object to use this permanent link
				obj.append(pl);
			}	
		});
			
		
		
	
		
		
		
   });  
  };  
  

// put some private functions in here e.g.:
//$.fn.searchlinks.debug(obj){};
  
 })(jQuery); 