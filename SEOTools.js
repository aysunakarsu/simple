function Response(uri)
{
  try {
  var options = {
  followRedirects : false
 };
  var response = UrlFetchApp.fetch(uri, options);
  return response.getResponseCode() ;  
  }  
   catch (error) {        
     return "Error";
    }
}
function Title(uri) {
  var html = getContents(uri);
  var title = html.match('<title>([^\<]+)</title>')[1];
  return title; 
}
function H1(uri) {
  var html = getContents(uri);
  var h1 = html.match('<h1[^\>]*>([^\<]+)</h1>')[1];
  return h1; 
}
function ILinks(uri) {
  var base_uri = uri.split('://')[0] + "://" + uri.split('://')[1].split('/')[0];
  var inner_links = [];
  inner_links=getInnerlinks(uri,base_uri);
  return inner_links.length; 
}

function getInnerlinks(geturi,getbase_uri) { 
  try  {
    var html = getContents(geturi);
    if (html.indexOf('</head>') !== -1 ) {
        html = html.split('</head>')[1];    
        if (html.indexOf('</body>') !== -1 ) { 
           html = html.split('</body>')[0] + '</body>';
           var inner_links_arr= [];
           var linkRegExp = /href="([^\"#]+)"/gi; // regex href 
           var extractLinks = linkRegExp.exec(html);
           var item=getbase_uri;
           var pagesVisited = {};
           while (extractLinks != null) {
              if ((extractLinks[0].indexOf("href=")==0))
                  if (extractLinks[1].indexOf(getbase_uri)==0)  item= extractLinks[1];                 
                  else if (extractLinks[1].indexOf("http")!==0) item= getbase_uri+extractLinks[1]; 
                  if (!(item in  pagesVisited)) {
                    pagesVisited[item]=true;
                    inner_links_arr.push(item);
                    }
              extractLinks = linkRegExp.exec(html); }
           return inner_links_arr;  
           }
       }
  }
  catch (e) { 
   return "Error"
  } 
}
function ELinks(uri) {
  var base_uri = uri.split('://')[0] + "://" + uri.split('://')[1].split('/')[0];
  var external_links = [];
  external_links=getExternalLinks(uri,base_uri);
  if (typeof external_links !== 'undefined' && external_links.length > 0 ) 
      return external_links.length;
 return 0;       
}
function getExternalLinks(geturi,getbase_uri) { 
  try  {
    var html = getContents(geturi);
    if (html.indexOf('</head>') !== -1 ) {
        html = html.split('</head>')[1];    
        if (html.indexOf('</body>') !== -1 ) { 
           html = html.split('</body>')[0] + '</body>';
           var external_links_arr= [];
           var linkRegExp = /href="(http[^"#]+)"/gi; // regex href 
           var extractLinks = linkRegExp.exec(html);
           var pagesVisited = {};
           while (extractLinks != null) {
              if (extractLinks[0].indexOf("href=")==0)  {
                  if (extractLinks[1].indexOf(getbase_uri) != 0 &&  (!(extractLinks[1] in  pagesVisited)) ){
                    pagesVisited[extractLinks[1]]=true;
                    external_links_arr.push(extractLinks[1]);}
                    }
              extractLinks = linkRegExp.exec(html); }
           return external_links_arr;  
           }
       }
  }
  catch (e) { 
    return e;
  } 
}
function getContents(uri) {
  var result = UrlFetchApp.fetch(uri); 
  var contents = result.getContentText();
  return contents;
}