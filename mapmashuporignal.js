var mapEnumerations = { MapTypes: { Google: "G", GetType: function(a) { try { if(a && ("G" == a.toUpperCase() ||
"GOOGLE" == a.toUpperCase())) return this.Google } catch(c) { } return null } }, MapViews: { ROADMAP: "ROADMAP",
SATELLITE: "SATELLITE", HYBRID: "HYBRID", TERRAIN: "TERRAIN", GetView: function(a) { try { if(a) switch(a.toUpperCase())
{ case "R": case "ROAD": case "ROADMAP": return this.ROADMAP;

 case"S":case"SAT":case"SATELLITE":returnthis.SATELLITE;

 case"H":case"HYB":case"HYBRID":returnthis.HYBRID;

 case"T":case"TERR":case"TERRAIN":returnthis.TERRAIN}}catch(c){}returnnull}},BubbleOpenType:{Never:0,MouseOver:1,MouseCl
 ick:2},ComparisonStyle:{STRING:"STRING",NUMERIC:"NUMERIC",DATE_TIME:"DATE/TIME"},ComparisonOperator:{EQUAL:"EQUAL",NOT_
 EQUAL:"NOTEQUAL",GREATER_THAN:"GREATERTHAN",GREATER_THAN_OR_EQUAL:"GREATERTHANOREQUAL",LESS_THAN:"LESSTHAN",LESS_THAN_O
 R_EQUAL:"LESSTHANOREQUAL",CONTAINS:"CONTAINS",IS_NULL:"ISNULL",IS_NOT_NULL:"ISNOTNULL"}},utilities={ReadString:function
 (a){try{returna.replace(/^\s+|\s+$/g,"")}catch(c){returnnull}},ReadInteger:function(a){try{varc=this.ReadString(a);

 returnparseInt(c)}catch(b){return0}},ReadBoolean:function(a){try{varc=this.ReadString(a);

 return"Y"==c.toUpperCase()||"YES"==c.toUpperCase()||"1"==c.toUpperCase()||"TRUE"==c.toUpperCase()}catch(b){return!1}},R
 eadFloat:function(a){try{varc=this.UnformatNumberString(this.ReadString(a));

 returnparseFloat(c)}catch(b){return0}},UnformatNumberString:function(a){if(a){a=a.replace(/[^0-9.,\-\+]/g,"").replace("
 ,",".");

 for(varc=!1,b="",d=a.length-1;

 0<=d;

 d--)"."==a.charAt(d)&&c||(b=a.charAt(d)+b,"."==a.charAt(d)&&(c=!0));

 a=b;

 for(c=a.charAt(a.length-1);

 0<a.length&&("."==c||"-"==c||"+"==c);

) a = a.substring(0, a.length - 1), 0 < a.length && (c = a.charAt(a.length - 1)} return a }, ReportStatus: function(a{
) try { window.status = a } catch(c{ } }, ContainsCSS: function(a, c{ try { return -1 != a.replace(/\s/g, "").indexOf(";

" + c + ":") } catch(b) { return !1 } } };

 functionmapDataPageSettings(a){this.AppKey=a;

 this.Items=[];

 this.IconConditions=[];

 this.DefaultIconHeight=this.DefaultIconWidth=this.DefaultIcon="";

 this.MapItEnabled=!1;

 this.MapItLabel="Mapit";

 this.FilterNeed="N";

 this.FilterRowSize="5";

 this.MarkersVisible=!0;

 this.AddCondition=function(a){a.Visible=utilities.ReadBoolean(a.Visible);

 this.IconConditions.push(a)};

 this.ReadSettings=function(){if(this.FilterNeed=utilities.ReadBoolean(this.FilterNeed))this.FilterRowSize=utilities.Rea
 dInteger(this.FilterRowSize),0==this.FilterRowSize&&(this.FilterRowSize=5)};

 this.GetItemIndex=function(a){if(a)for(varb=0;

 b<this.Items.length;

 b++)if(this.Items[b].PkId==a)returnb;

 returnnull};

 this.GetCriteria=function(a){if(a&&0<a.length)for(varb=0;

 b<this.IconConditions.length;

 b++)if(this.IconConditions[b].UUID==a)returnthis.IconConditions[b];

 returnnull}}functionmapItemSettings(a,c){this.AppKey=a;

 this.PkId=c;

 this.ConditionsMappings={};

 this.MatchedCriteria=this.Longitude=this.Latitude=this.Description=this.Address=this.MapIconHeight=this.MapIconWidth=th
 is.MapIcon="";

 this.GeocodingFailed=!1;

 this.ReadValue=function(a){try{returndocument.getElementById(a+":"+this.PkId+":"+this.AppKey).innerHTML.replace(/^\s+|\
 s+$/g,"")}catch(c){return""}};

 this.ReadSettings=function(a){this.Address=this.ReadValue("Address");

 this.Description=this.ReadValue("Description");

 this.Latitude=utilities.ReadFloat(this.ReadValue("Latitude"));

 this.Longitude=utilities.ReadFloat(this.ReadValue("Longitude"));

 if((!this.Description||""==this.Description)&&this.Address)this.Description=this.Address;

 this.Description="<span>"+this.Description+"</span>";

 if(a&&0<a.length)for(varc=0;

 c<a.length;

 c++)for(vare=0;

 e<a[c].Operators.length;

 e++){varf=a[c].Operators[e].FieldToCompare;

 void0==this.ConditionsMappings[f]&&(this.ConditionsMappings[f]=this.ReadValue("IconCheckValue:"+a[c].Operators[e].Field
 ToCompare))}};

 this.HasCoordinates=function(){returnthis.Latitude&&this.Longitude&&""!=this.Latitude.toString()&&""!=this.Longitude.to
 String()}}functionmapIconCondition(){this.GenerateUUID=function(){return"xxxxxxxxxxxx-4xxx-yxxx-
 xxxxxxxxxxxx".replace(/[xy]/g,function(a){varc=16*Math.random()|0;

 return("x"==a?c:c&3|8).toString(16)}).toUpperCase()};

 this.Name="";

 this.UUID=this.GenerateUUID();

 this.Operators=[];

 this.MapIconHeight=this.MapIconWidth=this.MapIcon="";

 this.Visible="Y"}varmapEnvironment={Version:"7.1.0",Controller:null,Container:null,Settings:{Type:mapEnumerations.MapTy
 pes.Google,View:mapEnumerations.MapViews.ROADMAP,Height:null,Width:null,HomePosition:null,ContainerCSS:null,ZoomLevel:{
 Auto:!0,Result:null,Details:null,MapIt:null},BubbleOpen:mapEnumerations.BubbleOpenType.MouseOver,HideOnSearch:!1,HideOn
 Details:!1,DisableScrollWheel:!1,ShowTrafficLayer:!1,PlotMarkers:!1,APIKey:null},Defaults:{DetailsLinkIsUnavailableStri
 ng:'javascript:alert("Linktodetailsnotavailable")',Icon:{URL:"https://d23b32zmhbr2ct.cloudfront.net/mashup/icons/flat/i
 con2.png",Height:34,Width:20}},DataPages:[],DetailsPageSettings:null,State:{Ready:!1,SettingsReady:!1,IsDetailsPage:!1,
 JustPreload:!1,TotalItems:0},GetDataPageMapSettings:function(a){for(varc=0;

 c<this.DataPages.length;

 c++)if(this.DataPages[c].AppKey.toUpperCase()==a.toUpperCase())returnthis.DataPages[c];

 returnnull},InitSettings:function(){if(!this.State.SettingsReady){try{if(!mapSettings){alert("Nomapsettingsdefined");

 return}}catch(a){alert("Nomapsettingsdefined");

 return}try{varc=mapEnumerations.MapTypes.GetType(utilities.ReadString(mapSettings.mapType));

 c&&(this.Settings.Type=c);

 if(c=mapEnumerations.MapViews.GetView(utilities.ReadString(mapSettings.mapView)))this.Settings.View=c;

 this.Settings.HomePosition=utilities.ReadString(mapSettings.homePosition);

 "" == this.Settings.HomePosition && (this.Settings.HomePosition = "United States");

 this.Settings.APIKey=utilities.ReadString(mapSettings.apiKey);

 this.Settings.ZoomLevel.Auto=utilities.ReadBoolean(mapSettings.useAutoZoom);

 this.Settings.ZoomLevel.Result=utilities.ReadInteger(mapSettings.zoomLevelResult);

 this.Settings.ZoomLevel.Details=utilities.ReadInteger(mapSettings.zoomLevelDetails);

 this.Settings.ZoomLevel.MapIt=utilities.ReadInteger(mapSettings.zoomLevelMapIt);

 this.Settings.Height=utilities.ReadInteger(mapSettings.mapHeight);

 this.Settings.Width=utilities.ReadInteger(mapSettings.mapWidth);

 this.Settings.ContainerCSS=utilities.ReadString(mapSettings.mapCssStyle);

 c=utilities.ReadInteger(mapSettings.bubbleOpenType);

 switch(c){case0:this.Settings.BubbleOpen=mapEnumerations.BubbleOpenType.Never;

 break;

 case1:this.Settings.BubbleOpen=mapEnumerations.BubbleOpenType.MouseOver;

 break;

 case2:this.Settings.BubbleOpen=mapEnumerations.BubbleOpenType.MouseClick}this.Settings.HideOnSearch=utilities.ReadBoole
 an(mapSettings.hideOnSearch);

 this.Settings.HideOnDetails=utilities.ReadBoolean(mapSettings.hideOnDetails);

 this.Settings.DisableScrollWheel=utilities.ReadBoolean(mapSettings.disableScrollWheel);

 this.Settings.ShowTrafficLayer=utilities.ReadBoolean(mapSettings.showTrafficLayer);

 this.Settings.PlotMarkers=utilities.ReadBoolean(mapSettings.plotMarkers);

 0>=this.Settings.Height&&(this.Settings.Height=450);

 0>=this.Settings.Width&&(this.Settings.Width=800);

 0>=this.Settings.ZoomLevel.Result&&(this.Settings.ZoomLevel.Result=14);

 this.State.SettingsReady=!0}catch(b){alert("Invalidmapsettingsdefined")}}},RaiseController:function(){try{if(!this.Stat
 e.Ready){switch(this.Settings.Type){casemapEnumerations.MapTypes.Google:this.Controller=newgoogleMapController,this.Con
 troller.Init()}this.Controller&&(this.State.Ready=!0)}}catch(a){this.Controller=null}},OnControllerReady:function(){thi
 s.State.Ready&&(this.State.JustPreload||this.PlotAllMarkers())},PrepareContainer:function(){if(!this.Container&&this.St
 ate.SettingsReady){if(document.getElementById("map"))this.Container=document.getElementById("map");

 else{if(null==document.body||this.State.JustPreload)return;

 this.Container=document.createElement("div");

 this.Container.setAttribute("id","map");

 null!=document.body.firstChild?document.body.insertBefore(this.Container,document.body.firstChild):document.body.append
 Child(this.Container)}!this.Container.style.border&&!utilities.ContainsCSS(this.Settings.ContainerCSS,"border")&&(this.
 Container.style.border="1pxsolid#A5A5A5");

 !this.Container.style.margin &&utilities.ContainsCSS(this.Settings.ContainerCSS, "margin") &&
 !(this.Container.style.margin = "5px 0px 5px 0px");

 !this.Container.style.width &&utilities.ContainsCSS(this.Settings.ContainerCSS, "width") && (this.Container.style.width
 != this.Settings.Width.toString() + "px");

 !this.Container.style.height &&utilities.ContainsCSS(this.Settings.ContainerCSS, "height") &&
 !(this.Container.style.height = this.Settings.Height.toString() + "px");

 this.Settings.ContainerCSS&&""!=this.Settings.ContainerCSS&&(this.Container.style.cssText+=this.Settings.ContainerCSS)}
 },AddDataPageMapSettings:function(a){varc=this.GetDataPageMapSettings(a.AppKey);

 c?c.Items.concat(a.Items):(a.ReadSettings(),this.DataPages.push(a))},AddDpItemMapSettings:function(a,c){varb=this.GetDa
 taPageMapSettings(a);

 b||(b=newmapDataPageSettings(a),this.AddDataPageMapSettings(b));

 vard=newmapItemSettings(a,c);

 d.ReadSettings(b.IconConditions);

 b.Items.push(d);

 this.State.IsDetailsPage||this.State.TotalItems++;

 if(utilities.ReadBoolean(b.MapItEnabled)){vare=document.getElementById("MapItLink:"+d.PkId+":"+d.AppKey);

 e&&(e.innerHTML='<ahref="#"id="cbMapPtr:'+d.PkId+":"+d.AppKey+'"onclick="mapEnvironment.ProcessMapIt(\''+d.AppKey+"','"
 +d.PkId+"');

 returnfalse;

 \">" + b.MapItLabel + "</a>") } !this.State.IsDetailsPage && ("first" == this.Settings.HomePosition &&
 \">" + !this.State.Ready) && mapEnvironment.RaiseController();

 returnd},SetDetailsMapSettings:function(a,c){varb=this.AddDpItemMapSettings(a,c);

 this.DetailsPageSettings||(this.DetailsPageSettings=b,this.State.IsDetailsPage=!0,this.State.TotalItems=1)},PreLoadEmpt
 yMap:function(){mapEnvironment.InitSettings();

 mapEnvironment.Container||(mapEnvironment.State.JustPreload=!0,mapEnvironment.PrepareContainer(),mapEnvironment.Contain
 er?"first"!=mapEnvironment.Settings.HomePosition&&mapEnvironment.RaiseController():setTimeout(mapEnvironment.PreLoadEmp
 tyMap,10))},PlotAllMarkers:function(){this.State.Ready&&this.Controller.PlotAllMarkers()},ToggleMarkerInfoWindow:functi
 on(a){this.State.Ready&&this.Controller.ToggleMarkerInfoWindow(a)},FixMarker:function(a){this.State.Ready&&this.Control
 ler.FixMarker(a)},ProcessMapIt:function(a,c){try{this.State.Ready&&this.Controller.ProcessMapIt(a,c)}catch(b){}},OnMark
 ersPlotted:function(){if(this.State.Ready)if(this.State.IsDetailsPage){vara=this.DetailsPageSettings.AppKey.toString()+
 "_"+this.DetailsPageSettings.PkId.toString();

 this.Controller.CenterAt(a);

 this.Controller.SetZoom(this.Settings.ZoomLevel.Details);

 this.ToggleMarkerInfoWindow(a);

 this.FixMarker(a)}elseif(this.Settings.ZoomLevel.Auto&&(0<this.State.TotalItems&&this.Settings.PlotMarkers)&&this.Contr
 oller.AutoZoomAndCenter(),0<this.State.TotalItems)for(a=0;

 a<this.DataPages.length;

 a++)this.DataPages[a].FilterNeed&&(this.DataPages[a].IconConditions&&0<this.DataPages[a].IconConditions.length)&&this.D
 rawFilterBar(this.DataPages[a])},GetCaspioPointerUrl:function(a){return"//d23b32zmhbr2ct.cloudfront.net/mashup/icons/fl
 at/icon"+a.toString().replace(/^\s+|\s+$/g,"")+".png"},CheckConditionPair:function(a,c,b){vard=!1;

 if(!a||""==a)a=mapEnumerations.ComparisonOperator.EQUAL;

 try{switch(a.toUpperCase()){case"1":case"=":casemapEnumerations.ComparisonOperator.EQUAL:d=c==b;

 break;

 case"2":case"!=":casemapEnumerations.ComparisonOperator.NOT_EQUAL:d=c!=b;

 break;

 case"3":case">":casemapEnumerations.ComparisonOperator.GREATER_THAN:d=c>b;

 break;

 case"4":case">=":casemapEnumerations.ComparisonOperator.GREATER_THAN_OR_EQUAL:d=c>=b;

 break;

 case"5":case"<":casemapEnumerations.ComparisonOperator.LESS_THAN:d=c<b;

 break;

 case"6":case"<=":casemapEnumerations.ComparisonOperator.LESS_THAN_OR_EQUAL:d=c<=b;

 break;

 case"7":case"LIKE":casemapEnumerations.ComparisonOperator.CONTAINS:d=null!=c&&null!=b&&-1<c.toLowerCase().indexOf(b.toL
 owerCase(),0);

 break;

 case"8":casemapEnumerations.ComparisonOperator.IS_NULL:case"ISNULL":case"ISBLANK":case"ISBLANK":d=null==c||""==c;

 break;

 case"9":casemapEnumerations.ComparisonOperator.IS_NOT_NULL:case"ISNOTNULL":case"ISNOTBLANK":case"ISNOTBLANK":d=null!=c&
 &""!=c;

 break;

 default:d=!1}}catch(e){d=!1}returnd},CheckRecordCondition:function(a,c){if(a&&c){for(varb=!0,d=0;

 d<a.length;

 d++){vare=a[d];

 if(!e.ComparisonStyle||""==e.ComparisonStyle)e.ComparisonStyle=mapEnumerations.ComparisonStyle.STRING;

 e.ComparisonStyle=e.ComparisonStyle.toUpperCase();

 if(e.ComparisonStyle!=mapEnumerations.ComparisonStyle.STRING&&e.ComparisonStyle!=mapEnumerations.ComparisonStyle.NUMERI
 C&&e.ComparisonStyle!=mapEnumerations.ComparisonStyle.DATE_TIME&&"1"!=e.ComparisonStyle&&"2"!=e.ComparisonStyle&&"3"!=e
 .ComparisonStyle||!e.Action||null==e.Action||""==e.Action||!e.FieldToCompare||void0==c[e.FieldToCompare])return!1;

 e.ValueToCompare||(e.ValueToCompare=null);

 varf=c[e.FieldToCompare],g=e.ValueToCompare;

 try{switch(e.ComparisonStyle){case"1":casemapEnumerations.ComparisonStyle.STRING:null==f&&(f="");

 f=String(f).toLowerCase();

 null==g&&(g="");

 g=String(g).toLowerCase();

 break;

 case"2":casemapEnumerations.ComparisonStyle.NUMERIC:null!=f&&""!=f&&(f=Number(utilities.UnformatNumberString(f)));

 null!=g&&""!=g&&(g=Number(utilities.UnformatNumberString(g)));

 break;

 case"3":casemapEnumerations.ComparisonStyle.DATE_TIME:null!=f&&""!=f&&(f=newDate(Date.parse(f))),null!=g&&""!=g&&(g=new
 Date(Date.parse(g)))}}catch(h){g=f=null}b=b&&this.CheckConditionPair(e.Action,f,g);

 if(!b)break}returnb}return!1},GetConditionIcon:function(a,c){varb=!1,d=null;

 if(this.State.Ready)try{if(a&&null!=a)for(vare=0;

 e<a.length;

 e++)if(this.CheckRecordCondition(a[e].Operators,c.ConditionsMappings)){d={URL:a[e].MapIcon,Width:a[e].MapIconWidth,Heig
 ht:a[e].MapIconHeight};

 c.MatchedCriteria=a[e].UUID;

 b=!0;

 break}}catch(f){b=!1}b||(d={URL:"",Width:0,Height:0});

 returnd},PrepareIcon:function(a,c){if(this.State.Ready){varb=this.GetConditionIcon(a.IconConditions,c);

 if(""==b.URL)for(vard=[c.MapIcon,a.DefaultIcon,this.Defaults.Icon.URL],e=0;

 e<d.length&&!(b.URL=d[e],""!=b.URL);

 e++);

 if(0<!b.Width){d=[parseInt(c.MapIconWidth),parseInt(a.DefaultIconWidth),this.Defaults.Icon.Width];

 for(e=0;

 e<d.length&&!(b.Width=d[e],0<b.Width);

 e++);

 } if(0 < !b.Height) { d = [parseInt(c.MapIconHeight), parseInt(a.DefaultIconHeight), this.Defaults.Icon.Height];

 for(e=0;

 e<d.length&&!(b.Height=d[e],0<b.Height);

 e++);

 } b.URL && !isNaN(b.URL) && (b.URL = this.GetCaspioPointerUrl(b.URL));

 returnb}returnnull},GetDetailsURL:function(a,c){for(varb="",d=document.getElementsByTagName("a"),e=0;

 e<document.forms.length;

 e++){d=!0;

 try{for(varf=!1,g=document.forms[e].getElementsByTagName("div"),h=0;

 h<g.length;

 h++)if(g[h].id.toUpperCase()=="CASPIOFORMDIV_"+c.toUpperCase()){f=!0;

 break}if("caspioform"!=document.forms[e].id&&!1==f)continue}catch(j){continue}if(f=document.forms[e].getElementsByTagNa
 me("input"))for(h=0;

 h<f.length;

 h++)try{if("AppKey"==f[h].name||f[h].id&&"AppKey"==f[h].id)f[h].value==c&&(d=!1)}catch(m){}if(!d){d=null;

 try{d=document.forms[e].getElementsByTagName("a")}catch(n){continue}if(d&&null!=d){for(h=0;

 h<d.length;

 h++)try{varf="Mod0InlineEdit=",k=d[h].href.indexOf(f);

 if(-1==k&&(f="Mod0InlineDelete=",k=d[h].href.indexOf(f),-1==k&&(f="download=",k=d[h].href.indexOf(f),-1==k&&(f="RecordI
 D=",k=d[h].href.indexOf(f),-1<k)))){varl=d[h].href.substring(k+f.length,d[h].href.length-1).split("&");

 if(0<l.length&&""!=String(a)&&String(l[0])==String(a)){b=d[h].href;

 break}}}catch(p){}if(b&&""!=b)break}}}""==b&&(b=this.Defaults.DetailsLinkIsUnavailableString);

 returnb},ToggleMarkersVisible:function(a,c){if(this.State.Ready){varb=this.GetDataPageMapSettings(c);

 if(b&&(b.MarkersVisible=a,this.State.Ready&&this.Controller.MapReady))for(vard=0;

 d<b.Items.length;

 d++){vare=b.Items[d];

 this.Controller.SetMarkerVisible(a,e.AppKey.toString()+"_"+e.PkId.toString())}}},GetDataPage:function(a){try{for(varc=d
 ocument.getElementsByName("AppKey"),b=0;

 b<c.length;

 b++)if("INPUT"==c[b].nodeName.toUpperCase()&&"HIDDEN"==c[b].type.toUpperCase()&&c[b].value.toUpperCase()==a.toUpperCase
 ())returnc[b].parentNode;

 returnnull}catch(d){returnnull}},DrawFilterBar:function(a){if(this.State.Ready&&null==document.getElementById("filterCo
 ntainer"+a.AppKey.toUpperCase())){varc=document.createElement("div");

 c.id="filterContainer"+a.AppKey.toUpperCase();

 c.style.width="100%";

 c.style.marginTop="5px";

 c.style.marginBottom="5px";

 varb=this.GetDataPage(a.AppKey);

 if(b&&b.parentNode){b.parentNode.insertBefore(c,b);

 b=document.createElement("div");

 b.id="filterHeader";

 b.innerHTML="FilterbyCategory:";

 b.style.width="100%";

 b.style.fontSize="large";

 b.style.fontWeight="bold";

 b.style.textAlign="center";

 c.appendChild(b);

 c.appendChild(document.createElement("hr"));

 b=document.createElement("table");

 b.id="filterTable";

 b.style.verticalAlign="middle";

 b.style.width="100%";

 b.style.textAlign="left";

 c.appendChild(b);

 c=document.createElement("tbody");

 c.id="filterTableBody";

 b.appendChild(c);

 for(varb=null,d=a.IconConditions,e=0;

 e<=d.length;

 e++){0==e%a.FilterRowSize&&(b=document.createElement("tr"),b.id="tableRow_"+e%a.FilterRowSize+"_"+e,c.appendChild(b));

 varf=document.createElement("td");

 f.style.verticalAlign="text-bottom";

 f.style.paddingLeft="25px";

 f.style.paddingRight="25px";

 if(e<d.length){varg=document.createElement("input");

 g.id="cellCheckbox_"+a.AppKey+"_"+e;

 g.onclick=function(a,b,c){returnfunction(){mapEnvironment.ApplyFilter(a,b,c)}}(g.id,a.AppKey,d[e].UUID);

 g.type="checkbox";

 varh=document.createElement("span");

 h.innerHTML=d[e].Name;

 varj=document.createElement("img");

 j.src=isNaN(d[e].MapIcon)?d[e].MapIcon:this.GetCaspioPointerUrl(d[e].MapIcon);

 j.style.marginLeft="5px";

 0<parseInt(d[e].MapIconWidth)&&0<parseInt(d[e].MapIconHeight)?(j.style.width=parseInt(d[e].MapIconWidth)+"px",j.style.h
 eight=parseInt(d[e].MapIconHeight)+"px"):0<parseInt(a.DefaultIconWidth)&&0<parseInt(a.DefaultIconHeight)&&(j.style.widt
 h=parseInt(a.DefaultIconWidth)+"px",j.style.height=parseInt(a.DefaultIconHeight)+"px");

 f.appendChild(g);

 f.appendChild(h);

 f.appendChild(j)}e==d.length&&(g=document.createElement("input"),g.id="cellCheckbox_"+a.AppKey+"_other",g.type="checkbo
 x",g.onclick=function(a,b,c){returnfunction(){mapEnvironment.ApplyFilter(a,b,c)}}(g.id,a.AppKey,""),h=document.createEl
 ement("span"),h.innerHTML="Showallother",f.appendChild(g),f.appendChild(h));

 b.appendChild(f)}for(e=0;

 e<=d.length;

 e++)e<d.length&&(document.getElementById("cellCheckbox_"+a.AppKey+"_"+e).checked=d[e].Visible),e==d.length&&(document.g
 etElementById("cellCheckbox_"+a.AppKey+"_other").checked=!0)}}},ToggleMarkersVisibilityByCriteria:function(a,c,b){if(th
 is.State.Ready&&(c=this.GetDataPageMapSettings(c)))for(vard=0;

 d<c.Items.length;

 d++){vare=c.Items[d];

 e.MatchedCriteria==b&&this.Controller.SetMarkerVisibleByCriteria(a,e.AppKey.toString()+"_"+e.PkId.toString())}},ApplyFi
 lter:function(a,c,b){this.State.Ready&&!0!=this.State.IsDetailsPage&&(a=document.getElementById(a))&&this.ToggleMarkers
 VisibilityByCriteria(a.checked,c,b)}};

 functiongoogleMapController(){this.Clusterer=this.GeocoderObject=this.MapObject=null;

 this.Markers=[];

 this.DefaultCallbackDelay=250;

 this.APILoaded="undefined"!=typeofgoogle&&void0!=typeofgoogle.maps&&"function"==typeofgoogle.maps.Map;

 this.CanPlotMarkers=this.AllMarkersPlotted=this.MapReady=!1;

 this.ProgressCounter=this.ItemIndex=this.DPIndex=0;

 this.MarkerGeocodingCallback="";

 this.Init=function(){try{if(this.APILoaded="undefined"!=typeofgoogle&&void0!=typeofgoogle.maps&&"function"==typeofgoogl
 e.maps.Map){if(this.MapObject=newgoogle.maps.Map(mapEnvironment.Container,null),this.GeocoderObject=newgoogle.maps.Geoc
 oder,mapEnvironment.Settings.ShowTrafficLayer&&(newgoogle.maps.TrafficLayer).setMap(this.MapObject),this.MapObject&&thi
 s.GeocoderObject){ScrollInterceptOverlay.prototype=newgoogle.maps.OverlayView;

 (new ScrollInterceptOverlay).setMap(this.MapObject);

try{this.Clusterer=new MarkerClusterer(this.MapObject,null,{imagePath:'https://cdn.rawgit.com/googlemaps/js-marker-
clusterer/gh-pages/images/m' });

}catch(v_e){if("first" != mapEnvironment.Settings.HomePosition) this.GeocoderObject.geocode({ address:
}mapEnvironment.Settings.HomePosition , this.ProcessGeocoderCallBackHome);

 else{for(varc=null,b=0;

 b<mapEnvironment.DataPages.length;

 b++)if(0<mapEnvironment.DataPages[b].Items.length){c=mapEnvironment.DataPages[b].Items[0];

 break}c?c.HasCoordinates()?this.PrepareMap(newgoogle.maps.LatLng(c.Latitude,c.Longitude)):this.GeocoderObject.geocode({
 address:c.Address},this.ProcessGeocoderCallBackHome):this.GeocoderObject.geocode({address:"UnitedStates"},this.ProcessG
 eocoderCallBackHome)}this.MapReady=!0}}elsec=document.createElement("script"),c.type="text/javascript",c.src="//maps.go
 ogleapis.com/maps/api/js?v=3.8&sensor=false&callback=mapEnvironment.Controller.Init",mapEnvironment.Settings.APIKey&&""
 !=mapEnvironment.Settings.APIKey&&(c.src+="&key="+mapEnvironment.Settings.APIKey),document.body.appendChild(c)}catch(d)
 {this.MapReady=!1}};

 this.PrepareMap=function(a){varc=google.maps.MapTypeId.ROADMAP;

 switch(mapEnvironment.Settings.View){casemapEnumerations.MapViews.SATELLITE:c=google.maps.MapTypeId.SATELLITE;

 break;

 casemapEnumerations.MapViews.HYBRID:c=google.maps.MapTypeId.HYBRID;

 break;

 casemapEnumerations.MapViews.TERRAIN:c=google.maps.MapTypeId.TERRAIN}this.MapObject.setOptions({scrollwheel:!mapEnviron
 ment.Settings.DisableScrollWheel,zoom:mapEnvironment.Settings.ZoomLevel.Result,center:a,mapTypeId:c});

 utilities.ReportStatus("Waitingformarkers...");

 this.CanPlotMarkers=!0;

 setTimeout("mapEnvironment.OnControllerReady()",this.DefaultCallbackDelay)};

 this.ProcessGeocoderCallBackHome=function(a,c){c==google.maps.GeocoderStatus.OK&&!mapEnvironment.Controller.AllMarkersP
 lotted&&mapEnvironment.Controller.PrepareMap(a[0].geometry.location)};

 this.ProcessGeocoderCallBackMarker=function(a,c){try{varb=null;

 if(b=mapEnvironment.State.IsDetailsPage?mapEnvironment.DetailsPageSettings:mapEnvironment.DataPages[mapEnvironment.Cont
 roller.DPIndex].Items[mapEnvironment.Controller.ItemIndex])if(c==google.maps.GeocoderStatus.OK)b.Latitude=a[0].geometry
 .location.lat(),b.Longitude=a[0].geometry.location.lng();

 elseif(b.FirstGeocodingFailed)b.GeocodingFailed=!0;

 else{b.FirstGeocodingFailed=!0;

 setTimeout(mapEnvironment.Controller.MarkerGeocodingCallback,4*mapEnvironment.Controller.DefaultCallbackDelay);

 return}}catch(d){}setTimeout(mapEnvironment.Controller.MarkerGeocodingCallback,mapEnvironment.Controller.DefaultCallbac
 kDelay)};

 this.PlotAllMarkers=function(){if(this.MapReady&&this.CanPlotMarkers){if(mapEnvironment.State.IsDetailsPage){vara=mapEn
 vironment.DetailsPageSettings,c=mapEnvironment.GetDataPageMapSettings(a.AppKey);

 if(b=this.DoPlotItem(c,a,0,0,"mapEnvironment.Controller.PlotAllMarkers()"))return}elseif(mapEnvironment.Settings.PlotMa
 rkers)for(a=this.DPIndex;

 a<mapEnvironment.DataPages.length;

 a++)for(c=this.ItemIndex;

 c<mapEnvironment.DataPages[a].Items.length;

 c++){varb=this.DoPlotItem(mapEnvironment.DataPages[a],mapEnvironment.DataPages[a].Items[c],a,c,"mapEnvironment.Controll
 er.PlotAllMarkers()");

 if(b)return}utilities.ReportStatus("Done");

 this.AllMarkersPlotted=!0;

 setTimeout("mapEnvironment.OnMarkersPlotted()",this.DefaultCallbackDelay)}elsesetTimeout("mapEnvironment.Controller.Plo
 tAllMarkers()",this.DefaultCallbackDelay)};

 this.DoPlotItem=function(a,c,b,d,e){if(a&&c)if(c.HasCoordinates())b=mapEnvironment.PrepareIcon(a,c),this.PlotMarker(new
 google.maps.LatLng(c.Latitude,c.Longitude),b,c,a),this.ProgressCounter++,utilities.ReportStatus("Markersplotted"+this.P
 rogressCounter+"of"+mapEnvironment.State.TotalItems);

 else{if(!c.Address||""==c.Address.replace("",""))c.GeocodingFailed=!0;

 if(!c.GeocodingFailed)returnthis.DPIndex=b,this.ItemIndex=d,this.MarkerGeocodingCallback=e,this.GeocoderObject.geocode(
 {address:c.Address},this.ProcessGeocoderCallBackMarker),!0}return!1};

 this.PlotMarker=function(a,c,b,d){if(this.MapReady&&b){vare=b.AppKey.toString()+"_"+b.PkId.toString(),f=mapEnvironment.
 GetDetailsURL(b.PkId,b.AppKey),g=b.Description;

 -1 < f.indexOf("javascript:") ? f == mapEnvironment.Defaults.DetailsLinkIsUnavailableString || !0 ==
 -mapEnvironment.State.IsDetailsPage || (g = g + '<br /><a href="#" onclick="' + f + '">Details</a>') : f ==
 -mapEnvironment.Defaults.DetailsLinkIsUnavailableString || !0 == mapEnvironment.State.IsDetailsPage || (g = g + '<br
 -/><a href="' + f + '" >Details</a>');

 f=newgoogle.maps.InfoWindow({content:g,maxWidth:mapEnvironment.Settings.Width/2});

 google.maps.event.addListener(f,"closeclick",function(){mapEnvironment.Controller.InfoWindowClosed(e)});

 f.Opened=!1;

 g=!0;

 if(b=d.GetCriteria(b.MatchedCriteria))g=b.Visible;

 c=newgoogle.maps.MarkerImage(c.URL,null,null,null,newgoogle.maps.Size(c.Width,c.Height,"px","px"));

 a=newgoogle.maps.Marker({position:a,icon:c,visible:d.MarkersVisible&&g,optimized:!1});

 this.Clusterer?a.getVisible()&&this.Clusterer.addMarker(a):a.setMap(this.MapObject);

 this.Markers.push({Key:e,MarkerObject:a,InfoWindow:f,MarkerVisible:d.MarkersVisible,MarkerVisibleByCriteria:g,MarkerFix
 ed:!1});

 switch(mapEnvironment.Settings.BubbleOpen){casemapEnumerations.BubbleOpenType.MouseClick:google.maps.event.addListener(
 a,"click",function(){mapEnvironment.ToggleMarkerInfoWindow(e)});

 break;

 casemapEnumerations.BubbleOpenType.MouseOver:google.maps.event.addListener(a,"mouseover",function(){mapEnvironment.Togg
 leMarkerInfoWindow(e)}),google.maps.event.addListener(a,"mouseout",function(){mapEnvironment.ToggleMarkerInfoWindow(e)}
 ),google.maps.event.addListener(a,"click",function(){mapEnvironment.FixMarker(e)})}google.maps.event.addListener(a,"vis
 ible_changed",function(){mapEnvironment.Controller.MarkerVisibleChanged(e)})}};

 this.FindMarker=function(a){try{for(varc=0;

 c<this.Markers.length;

 c++)if(this.Markers[c].Key.toUpperCase()==a.toUpperCase())returnthis.Markers[c];

 returnnull}catch(b){returnnull}};

 this.InfoWindowClosed=function(a){if(this.MapReady&&(a=this.FindMarker(a)))a.InfoWindow.Opened=!1,a.MarkerFixed=!1};

 this.MarkerVisibleChanged=function(a){if(this.MapReady&&this.Clusterer&&(a=this.FindMarker(a)))a.MarkerObject.getVisibl
 e()?this.Clusterer.addMarker(a.MarkerObject):this.Clusterer.removeMarker(a.MarkerObject),this.Clusterer.redraw()};

 this.CloseAllInfoWindows=function(){if(this.MapReady)try{for(vara=0;

 a<this.Markers.length;

 a++)this.Markers[a].InfoWindow.Opened&&(this.Markers[a].InfoWindow.close(),this.Markers[a].InfoWindow.Opened=!1),this.M
 arkers[a].MarkerFixed=!1}catch(c){}};

 this.FixMarker=function(a){if(this.MapReady&&(a=this.FindMarker(a))&&mapEnvironment.Settings.BubbleOpen==mapEnumeration
 s.BubbleOpenType.MouseOver)a.MarkerFixed=!0};

 this.ToggleMarkerInfoWindow=function(a){if(this.MapReady&&(a=this.FindMarker(a))){if(a.InfoWindow.Opened){if(a.MarkerFi
 xed)return;

 a.InfoWindow.close()}else{if(!a.MarkerVisible||!a.MarkerVisibleByCriteria)return;

 this.CloseAllInfoWindows();

 a.InfoWindow.open(a.MarkerObject.getMap(),a.MarkerObject)}a.InfoWindow.Opened=!a.InfoWindow.Opened}};

 this.ProcessMapIt=function(a,c){if(this.MapReady){varb=this.FindMarker(a+"_"+c);

 if(b)b.MarkerVisible&&b.MarkerVisibleByCriteria&&(mapEnvironment.Container.scrollIntoView(!0),this.CloseAllInfoWindows(
 ),b.InfoWindow.Opened||(b.InfoWindow.open(b.MarkerObject.getMap(),b.MarkerObject),b.InfoWindow.Opened=!0,this.FixMarker
 (a+"_"+c)),this.MapObject.setCenter(b.MarkerObject.getPosition()),this.MapObject.setZoom(mapEnvironment.Settings.ZoomLe
 vel.MapIt));

 elseif(!mapEnvironment.Settings.PlotMarkers&&(b=mapEnvironment.GetDataPageMapSettings(a))){vard=b.GetItemIndex(c);

 if(d){vare="mapEnvironment.Controller.ProcessMapIt('"+a+"','"+c+"')";

 this.DoPlotItem(b,b.Items[d],0,d,e)||b.Items[d].GeocodingFailed||setTimeout(e,this.DefaultCallbackDelay)}}}};

 this.SetMarkerVisible=function(a,c){if(this.MapReady)try{varb=this.FindMarker(c);

 b.MarkerVisible=a;

 vard=b.MarkerVisible&&b.MarkerVisibleByCriteria;

 !d && b.InfoWindow.Opened && (b.InfoWindow.close(), b.InfoWindow.Opened =1, b.MarkerFixed =1);

 b.MarkerObject.setVisible(d)}catch(e){}};

 this.SetMarkerVisibleByCriteria=function(a,c){if(this.MapReady)try{varb=this.FindMarker(c);

 b.MarkerVisibleByCriteria=a;

 vard=b.MarkerVisible&&b.MarkerVisibleByCriteria;

 !d && b.InfoWindow.Opened && (b.InfoWindow.close(), b.InfoWindow.Opened =1, b.MarkerFixed =1);

 b.MarkerObject.setVisible(d)}catch(e){}};

 this.AutoZoomAndCenter=function(){if(this.MapReady){for(vara=1E3,c=1E3,b=-1E3,d=-1E3,e=0;

 e<this.Markers.length;

 e++){varf=this.Markers[e].MarkerObject.getPosition();

 f.lat()<parseFloat(c)&&(c=f.lat());

 f.lat()>parseFloat(d)&&(d=f.lat());

 f.lng()<parseFloat(a)&&(a=f.lng());

 f.lng()>parseFloat(b)&&(b=f.lng())}e=(parseFloat(b)+parseFloat(a))/2;

 f=(parseFloat(d)+parseFloat(c))/2;

 e=newgoogle.maps.LatLng(f,e);

 a=newgoogle.maps.LatLngBounds(newgoogle.maps.LatLng(d,a),newgoogle.maps.LatLng(c,b));

 this.MapObject.fitBounds(a);

 this.MapObject.setCenter(e)}};

 this.SetZoom=function(a){this.MapReady&&this.MapObject.setZoom(a)};

 this.CenterAt=function(a){this.MapReady&&(a=this.FindMarker(a))&&this.MapObject.setCenter(a.MarkerObject.getPosition())
 }}varScrollInterceptOverlay=function(){if(thisinstanceofScrollInterceptOverlay){vara,c=function(a){a&&a.preventDefault&
 &a.preventDefault()};

 this.onAdd=function(){a=document.createElement("div");

 a.style.display="inline-block";

 a.style.position="absolute";

 a.style.top=a.style.left=0;

 document.addEventListener?(a.addEventListener("mousewheel",c,!1),a.addEventListener("DOMMouseScroll",c,!1)):document.at
 tachEvent&&a.attachEvent("onmousewheel",c);

 varb=this.getPanes().overlayMouseTarget,d=b.firstChild;

 d?b.insertBefore(a,d):b.appendChild(a)};

 this.onRemove=function(){a.parentNode.removeChild(a);

 deletea};

 this.draw=function(){varb=this.getMap();

 if(b&&(b=b.getDiv()))b=b.getBoundingClientRect(),a.style.width=b.width?b.width+"px":b.right-b.left+"px",a.style.height=
 b.height?b.height+"px":b.bottom-b.top+"px"}}};

 functionrunMashup(){mapEnvironment.State.Ready?mapEnvironment.State.JustPreload&&mapEnvironment.PlotAllMarkers():(mapEn
 vironment.InitSettings(),!mapEnvironment.Settings.HideOnSearch&&!mapEnvironment.Settings.HideOnDetails&&(mapEnvironment
 .State.JustPreload=!1,mapEnvironment.PrepareContainer(),mapEnvironment.RaiseController()))}functioncustomOnLoad(a){"com
 plete"==document.readyState?a():setTimeout(function(){customOnLoad(a)},10)}functioninitMashupStart(){document.useCustom
 Onload?customOnLoad(runMashup):window.addEventListener?window.addEventListener("load",runMashup):window.attachEvent?win
 dow.attachEvent("onload",runMashup):customOnLoad(runMashup)}initMashupStart();


