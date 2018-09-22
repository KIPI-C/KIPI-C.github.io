var url='https://support.image-line.com/api.php';var logged=false;var preffered_currency='USD';var country_iso='';var forex_rate=1;var owned='';var cart_id=0;var storedData;var showOwned=false;function get_url_param(name){var res="";var href=window.location.href;if(href.indexOf("?")>-1){var qry=href.substr(href.indexOf("?")).toLowerCase();var a_qry=qry.split("&");for(var param=0;param<a_qry.length;param++){if(a_qry[param].indexOf(name.toLowerCase()+"=")>-1){var a_param=a_qry[param].split("=");res=a_param[1];break;}}}
return unescape(res);}
function call_api(api_method,callback){var script=document.createElement('script');var final_url=url+'?call='+encodeURIComponent(api_method)+'&'+'callback='+encodeURIComponent(callback);if(arguments.length>0){for(var i=2;i<arguments.length;i++){var param=encodeURI(arguments[i]);final_url+="&"+param.replace("&",encodeURIComponent("&"));}}
script.setAttribute('src',final_url);document.getElementsByTagName('head')[0].appendChild(script);}
function showDownItems(id,tit){$('#showDW-'+id).dialog({width:400,height:450,title:'Downloads for &quot;'+tit+'&quot;'});$.get("https://support.image-line.com/member/get_prod_downloads.php",{psid:id},function(data){$('#showDWUpdate-'+id).removeClass('waiting');$('#showDWUpdate-'+id).html(data);});$('.itemName a').blur();}
function addToCart(pid){$.get("https://support.image-line.com/jshop/shop.php",{ajax:1,ord:pid,cart:cart_id},function(data){alert('added to cart '+data);il_check_login();});}
function toggle_owned(){if($('.notOwned').is(':visible')){showOwned=1;$('.notOwned').addClass('hidden');$('#ownedToggler').html('show all');}
else{showOwned=0;$('.notOwned').removeClass('hidden');$('#ownedToggler').html('show only packs i own');}}
function handle_owned(data){allPlugins=data.owned['31020ALL']!=undefined;var arr_upgrades_to_producer=['31040','31051','31071','31076','31081'];var arr_updgrades_to_signature=['31036','31037','31038','31039','31083','31084','31085'];var arr_upgrades_to_fruity=['31050','31070','31075'];var arr_upgrades_to_allPlugins=['31035ALL','31036ALL','31037ALL','31039ALL','31083ALL','31084ALL','31087ALL'];for(var i=0;i<=arr_upgrades_to_allPlugins.length;i++){if(data.owned[arr_upgrades_to_allPlugins[i]]!=undefined){allPlugins=true;}}
$('.category_item').addClass('notOwned');for(id in data.owned){if(data.owned[id]['id'].indexOf('$')==-1){is_all_plugins_u=$.inArray(id,arr_upgrades_to_allPlugins)!=-1;is_producer_u=$.inArray(id,arr_upgrades_to_producer)!=-1;is_signature_u=$.inArray(id,arr_updgrades_to_signature)!=-1;is_fruity_u=$.inArray(id,arr_upgrades_to_fruity)!=-1;if(id=='31020'||id=='31035'||id=='31020ALL'||is_all_plugins_u||is_producer_u||is_signature_u)$('#atc_31010 .e_button').hide();if(id=='31035'||id=='31020ALL'||is_all_plugins_u||is_signature_u)$('#atc_31020 .e_button').hide();if(id=='31020ALL'||is_all_plugins_u)$('#atc_31035 .e_button').hide();if(!allPlugins||(allPlugins&&(id!='31035'&&id!='31020'))){var this_id=data.owned[id]['id'];if(is_producer_u)
this_id='31020';else if(is_signature_u)
this_id='31035';else if(is_fruity_u)
this_id='31010';else if(is_all_plugins_u)
this_id='31020ALL';$('#atc_'+this_id).html('<p class="msg">I Own This!</p>'+
'<a class="e_button" target="_blank" href="https://support.image-line.com/member/profile.php?module=Licenses&prod='+data.owned[id]['product_sid']+'">Download</a>').parents('.category_item').toggleClass('owned notOwned');}}}
$('.toshow').removeClass('hidden');}
function updateOnAjax2(){handle_owned(storedData);if(showOwned)
$('.notOwned').hide();}
function il_get_free_downloads_cb(data){ealert('<div>Click here to download:<div id="free_downloads"></div></div>','Cancel');$('#free_downloads').html(data);}
function il_get_free_downloads(pId){rp='return_path='+location.href;call_api('get_free_downloads','il_get_free_downloads_cb','product_id='+pId,rp);}
function append_free_button(owned,pid){events=owned!==false?'onclick="il_get_free_downloads(\''+pid+'\')"':'onclick="ealert(\'Free downloads are available to customers. Please sign in to your account.\');"';if(pid=='all')
$('#allFree').prepend('<div class="free" '+events+'>Download all free loops selections</div>');else
$('#atc_'+pid+' .e_button').parent().append('<div class="free" '+events+'>Free Selection</div>');}
function il_check_login_cb(data){login_panel='';cart_panel='';logged=false;storedData=data;handle_owned(data);if(data.signedin)
$('#xm1').addClass('signed');if(data.signedin&&$('.owned').length&&$('.category_item').length)
$('.ver_cat_list').append('<li class="vcl_level1 vcl_m vcl_own"><p><span id="ownedToggler" onclick="toggle_owned()">show only packs i own</span></p></li>');if(data.result){cart_id=data.cart_id;if(typeof productId!='undefined'){if(data.downloads!='')
append_free_button(data.owned,productId);if(data.owned&&productId in data.owned)
$('.div_header').addClass('owned');else
$('.div_header').addClass('notOwned');}
if(data.products_freedownloads!=''){for(id in data.products_freedownloads){append_free_button(data.owned,data.products_freedownloads[id]);}
append_free_button(data.owned,'all');}
preffered_currency=data.cart_currency;country_iso=data.country_iso;if(country_iso=='US'||country_iso=='UK'||country_iso=='DE'||country_iso=='CA'||country_iso=='FR'){var isFF=navigator.userAgent.toLowerCase().indexOf('firefox')>-1;var isIe=/Trident|MSIE|Edge/.test(navigator.userAgent);var isWin=navigator.appVersion.toLowerCase().indexOf("win")>-1;}
forex_rate=data.forex_rate;if(data.signedin){if(data.cart_price){cart_panel='<div id="cart_info" style="cursor:pointer" onclick="onCheckout(\''+data.cart_url+'\', event)">'+data.cart_image+' <a onlcik="onCheckout(\''+data.cart_url+'\', event)" style="color: #454545;text-decoration:none;" href="'+data.cart_url+'">Click to checkout</a>'+
'<div class="cart_item_price">'+data.cart_total+' '+data.cart_currency+'</div>'+
'<div style="position:absolute;top:2px;left:7px;width:20px;font-size:18px;text-align:center;color:white;">'+data.cart_items_count+'</div>'+
'</div>';cart_panel+='<div id="cart_products" style="display:none">';for(id in data.cart_items){cart_panel+='<div class="cart_product">'+data.cart_items[id]['name']
+' <div class="cart_item_price">'+data.cart_items[id]['price']+' '+data.cart_items[id]['currency']+'</div>'
+' <input type="hidden" class="gtm_name" value="'+data.cart_items[id]['name']+'" />'
+' <input type="hidden" class="gtm_price" value="'+data.cart_items[id]['price']+'" />'
+' <input type="hidden" class="gtm_category" value="'+data.cart_items[id]['category']+'" />'
+' <input type="hidden" class="gtm_code" value="'+data.cart_items[id]['product_id']+'" />'
+' <input type="hidden" class="gtm_currency" value="'+data.cart_currency+'" />'
+' <input type="hidden" class="gtm_bundle" value="'+data.cart_items[id]['bundle']+'" />'
+'</div>';}
cart_panel+='</div>';}
login_panel+="<a href='"+data.profile_url+"'>"+data.name+"</a>";login_panel+="<a class='signoutIcon' title='Sign Out' href='"+data.signout_url+"'></a>";$('#frm_name').val(data.name);$('.logged_mail').html(data.email);$('#frm_mail').val(data.email);logged=true;}
else{if(data.cart_price){cart_panel='<div id="cart_info" style="cursor:pointer" onclick="onCheckout(\''+data.cart_url+'\', event)">'+data.cart_image+' <a onlcik="onCheckout(\''+data.cart_url+'\', event)" href="'+data.cart_url+'">Click to checkout</a>'+
'<div class="cart_item_price">'+data.cart_total+' '+data.cart_currency+'</div></div>';cart_panel+='<div id="cart_products" style="display:none">';for(id in data.cart_items){cart_panel+='<div class="cart_product">'+data.cart_items[id]['name']
+' <div class="cart_item_price">'+data.cart_items[id]['price']+' '+data.cart_items[id]['currency']+'</div>'
+' <input type="hidden" class="gtm_name" value="'+data.cart_items[id]['name']+'" />'
+' <input type="hidden" class="gtm_price" value="'+data.cart_items[id]['price']+'" />'
+' <input type="hidden" class="gtm_category" value="'+data.cart_items[id]['category']+'" />'
+' <input type="hidden" class="gtm_code" value="'+data.cart_items[id]['product_id']+'" />'
+' <input type="hidden" class="gtm_currency" value="'+data.cart_currency+'" />'
+' <input type="hidden" class="gtm_bundle" value="'+data.cart_items[id]['bundle']+'" />'
+'</div>';}
cart_panel+='</div>';}
login_panel+="<a href='"+data.signin_url+"'>Sign In</a>";login_panel+="&nbsp;|&nbsp;";login_panel+="<a href='"+data.join_url+"'>Join</a>";}}
else{login_panel="Error: "+data.error;}
$('#show_login_state').html(login_panel);$('#cart_panel').html(cart_panel);if(!logged)
$('#show_login_state').addClass('unlogged');if(storedData.use_gtm){tag_impressions();tag_productDetailsView();tag_addToCart();tag_productClicks();tag_impressionsDetails();}
$.each($('a.addtocart'),function(){var th=$(this);var pr_id=th.prop('id').replace(/^\D+/g,'');var obj={};var css_no_btn={'cursor':'default','border':'none','background':'none','box-shadow':'none'};obj.id=pr_id;if(pr_id!=''){if(is_incart(obj)){th.attr('href','#').text('IN CART').css(css_no_btn);$('#o_order').hide();}
else if('owned'in window.storedData&&window.storedData.owned){for(id in storedData.owned){if(storedData.owned[id]['id'].indexOf('$')==-1&&storedData.owned[id]['id']==obj.id){th.attr('href','#').text('OWNED').css(css_no_btn);$('#o_order').hide();}}}}});return data;}
function il_check_login(){rp='return_path='+location.href;if(typeof productId!='undefined')
call_api('check_login','il_check_login_cb','product_id='+productId,rp);else
call_api('check_login','il_check_login_cb',rp);}
function il_check_forum_login_cb(data){login_panel='';logged=false;if(data.result){if(data.signedin){if(data.cart_price){login_panel+=data.cart_price;}
login_panel+="<a href='"+data.profile_url+"'>"+data.name+"</a>";login_panel+="<a title='Sign Out' class='signoutIcon' href='"+data.signout_url+"'></a>";logged=true;}
else{login_panel+="<a href='"+data.signin_url+"'>Sign In</a>";login_panel+="&nbsp;|&nbsp;";login_panel+="<a href='"+data.join_url+"'>Join</a>";}}
else{login_panel="Error: "+data.error;}
$('#show_login_state').html(login_panel);if(!logged)$('#show_login_state').addClass('unlogged');}
function il_check_forum_login(){call_api('check_forum_login','il_check_forum_login_cb','return_path='+location.href);}
function il_check_product_cb(data){product_panel='';if(data.result){if(data.own_product){product_panel+="<a href='"+data.profile_url+"'>";product_panel+="<img src='images/own_product.png' style=\"vertical-align: bottom; width: 168px; height: 40px; border:0px;\" />";product_panel+="</a>";}
else{product_panel+="<a href=\"http://shop.image-line.com\">";product_panel+="<img src='dx10_files/Order19.gif' style=\"vertical-align: bottom; width: 161px; height: 40px; border:0px;\">";product_panel+="</a>";}}
else{product_panel="Error: "+data.error;}
$('#show_price_or_profile').html(product_panel);}
function il_check_product(product_id){call_api('check_product','il_check_product_cb','product_id='+product_id);}
function il_product_description_cb(data){product_panel='';if(data.result){if(data.image_url!='none'){product_panel+="<div><img src='https://support.image-line.com"+data.image_url+"' style=\"border:0px;\"></div>";}
product_panel+='<div>'+data.description+'</div>';product_panel+='<div><b>Price:</b>&nbsp;$'+data.price+'</div>';}
else{product_panel="Error: "+data.error;}
$('#product_description').html(product_panel);return data;}
function il_product_description(id){if(id===''){id=get_url_param('ID');}
call_api('get_product_description','il_product_description_cb','product_id='+id);}
function il_product_data(data){if(data.result){}}
function il_get_product_data(id){call_api('get_product_data','il_product_data','product_id='+id);}
function il_user_licenses_cb(data){if(data){for($id in data){if($id==='31020'){il_get_product_data('31036');}
else if($id==='31010'){il_get_product_data('31040');}}}
return data;}
function il_user_licences(){call_api('get_user_licenses','il_user_licenses_cb','');}
function il_user_tutorials_cb(data){if(data!==''){$('#promo_inner').append(data);$('#promo').fadeIn(600);il_user_licences();}}
function il_user_tutorials(){call_api('get_user_tutorials','il_user_tutorials_cb','');}
function embed_incontainer(cid,list){$('#'+cid).html('<iframe style="width:100%" height="520" src="//www.youtube.com/embed/videoseries?list='+list+'" frameborder="0" allowfullscreen></iframe>');}
function il_user_products_cb(data){owned=data;}
function il_user_products(){call_api('get_user_products','il_user_products_cb','');}
function is_enabled_GTM(){if(typeof ga.getAll!=='function'){return false;}
return typeof window.google_tag_manager!=='undefined';}
function is_incart(gtm_info){var in_cart=false;if('cart_items'in window.storedData&&window.storedData.cart_items){$.each(window.storedData.cart_items,function(){if(this.product_id==gtm_info.id){in_cart=true;return in_cart;}});}
return in_cart;}
function get_gtmProductInfo(elem){var striptags=function(str){return str!=undefined?str.replace(/(<([^>]+)>)/ig,""):'';}
var gtm_info={};gtm_info={'name':striptags($(elem).find('.gtm_name').val()),'id':striptags($(elem).find('.gtm_code').val()),'price':striptags($(elem).find('.gtm_price').val()),'category':striptags($(elem).find('.gtm_category').val()),'list':striptags($(elem).find('.gtm_list').val()),'currency':striptags($(elem).find('.gtm_currency').val()),'bundle':striptags($(elem).find('.gtm_bundle').val())}
return gtm_info.id!=''&&gtm_info.name.indexOf('%ext_')==-1?gtm_info:false;}
function tag_impressions(){if(!is_enabled_GTM()||!is_gtm_event_enabled('impression')){return;}
var
imprObjs=[],currencyCode='EUR',is_homepage=$('#showcase').length,prepare_viewed_prodcuts=function(){$.each($(".gtm-product"),function(){var is_viewed=$(this).hasClass('viewed');if(!is_homepage){if(!is_viewed&&isScrolledIntoView(this)){$(this).addClass('viewed');build_impressionObj(this);}}else{var is_visible=$(this).parents('.thumb')[0].isVisible($(this).parents('.thumb')[0]);if(!is_viewed&&is_visible){$(this).addClass('viewed');build_impressionObj(this);}}});},isScrolledIntoView=function(elem){var $elem=$(elem),$window=$(window),docViewTop=$window.scrollTop(),docViewBottom=docViewTop+$window.height(),elemTop=$elem.offset().top,elemBottom=elemTop+$elem.height();return((elemBottom<=docViewBottom)&&(elemTop>=docViewTop));},build_impressionObj=function(elem){var gtm_info=get_gtmProductInfo(elem);if(gtm_info&&!is_incart(gtm_info)){currencyCode=gtm_info.currency;if(gtm_info.bundle!=''){eval('var obj_bundle='+gtm_info.bundle);if(obj_bundle.length){$.each(obj_bundle,function(){imprObjs.push({'id':this.id,'list':gtm_info.list});});}}
imprObjs.push({'id':gtm_info.id,'list':gtm_info.list});}},do_impression=function(){if(imprObjs.length){dataLayer=window.dataLayer||[];dataLayer.push({'event':'productImpression','ecommerce':{'currencyCode':currencyCode,'impressions':imprObjs}});}};prepare_viewed_prodcuts();do_impression();if(!is_homepage){$(window).scroll(function(){imprObjs=[];prepare_viewed_prodcuts();do_impression();});}}
function tag_impressionsDetails(){if(!is_enabled_GTM()||!is_gtm_event_enabled('impression_detail')){return;}
var impressionObjs=[],detailObjs_products=[],detailObjs={},currencyCode='EUR';$.each($(".gtm-product"),function(){var gtm_info=get_gtmProductInfo(this);if(gtm_info&&!is_incart(gtm_info)){currencyCode=gtm_info.currency;list=gtm_info.list;if(gtm_info.bundle!=''){eval('var obj_bundle='+gtm_info.bundle);if(obj_bundle.length){$.each(obj_bundle,function(){impressionObjs.push({'id':this.id,'list':gtm_info.list});});}}
impressionObjs.push({'id':gtm_info.id,'list':gtm_info.list});detailObjs_products.push({'id':gtm_info.id});}});if(detailObjs_products.length){detailObjs={'actionField':{'list':list},'products':detailObjs_products};}
if(impressionObjs.length){dataLayer.push({'event':'productImpression','ecommerce':{'currencyCode':currencyCode,'impressions':impressionObjs,'detail':detailObjs}});}}
function tag_addToCart(){var add_to_cart=function(pr_code,url){var gtm_product=$('#gtm_pr_'+pr_code);if(!is_enabled_GTM()||!gtm_product.length||!is_gtm_event_enabled('addtocart')){document.location=url;return;}
var gtm_info=get_gtmProductInfo(gtm_product[0]);if(!gtm_info){document.location=url;return;}
if(is_incart(gtm_info)){document.location=url;return;}
dataLayer=window.dataLayer||[];productObjs=[];productObjs.push({'id':gtm_info.id,'quantity':1});if(gtm_info.bundle!=''){eval('var obj_bundle='+gtm_info.bundle);if(obj_bundle.length){$.each(obj_bundle,function(){productObjs.push({'id':this.id,'quantity':1});});}}
dataLayer.push({'event':'addToCart','ecommerce':{'currencyCode':gtm_info.currency,'add':{'actionField':{'list':gtm_info.list},'products':productObjs}},'eventCallback':function(){document.location=url;}});}
$('a.addtocart').on('click',function(e){e.preventDefault();var product_code=$(this).attr('id').replace('gtm_add_','');add_to_cart(product_code,$(this).attr('href'));});$('#o_order').on('click',function(e){e.preventDefault();var product_code=$('.gtm-product').attr('id').replace('gtm_pr_','');add_to_cart(product_code,$(this).attr('href'));});$('#buy_button').on('click',function(e){e.preventDefault();var product_code=$(this).attr('product_code');add_to_cart(product_code,$(this).attr('href'));});}
function tag_productClicks(){var tag_productClicks_event=function(elem,product_code,url){var gtm_product=$('#gtm_pr_'+product_code);if(!is_enabled_GTM()||!is_gtm_event_enabled('productclick')||!gtm_product.length){if(url!=undefined){document.location=url;}
return;}
window.dataLayer=window.dataLayer||[];var gtm_info=get_gtmProductInfo(gtm_product[0]);if(!gtm_info&&url!=undefined){document.location=url;return;}
if(is_incart(gtm_info)){document.location=url;return;}
window.dataLayer.push({'event':'productClick','ecommerce':{'currencyCode':gtm_info.currency,'click':{'actionField':{'list':gtm_info.list},'products':[{'id':gtm_info.id}]}},'eventCallback':function(){if(url!=undefined){document.location=url;}}});}
$('a.product_name_link').on('click',function(e){e.preventDefault();var url=$(this).attr('href');if($(this).attr('id')=='undefined'){document.location=url;return;}
var product_code=$(this).attr('id').replace('gtm_name_','');tag_productClicks_event(this,product_code,url);});$(".img_image1").parents('a').on('click',function(e){e.preventDefault();var img=$(this).find('img');var url=$(this).attr('href');if(img.attr('id')=='undefined'){document.location=url;return;}
var product_code=img.attr('id').replace('gtm_img_','');tag_productClicks_event(img,product_code,url);});$(".thumb").on('click',function(){if($(this).attr('id')=='undefined'){return;}
var product_code=$(this).attr('id').replace('thumb_','');tag_productClicks_event(this,product_code);});$("#more_button").on('click',function(e){e.preventDefault();var url=$(this).attr('href');if($(this).attr('product_code')=='undefined'){document.location=url;return;}
var product_code=$(this).attr('product_code');tag_productClicks_event(this,product_code,url);});}
function tag_productDetailsView(){if(!is_enabled_GTM()||!is_gtm_event_enabled('detailview')){return;}
dataLayer=window.dataLayer||[];var d_layer={};var bundleObjs=[];if($(".gtm-product").length==1){var gtm_info=get_gtmProductInfo($(".gtm-product")[0]);if(gtm_info&&!is_incart(gtm_info)){if(gtm_info.bundle!=''){eval('var obj_bundle='+gtm_info.bundle);if(obj_bundle.length){$.each(obj_bundle,function(){bundleObjs.push({'id':this.id,'list':gtm_info.list});});}}
d_layer={'event':'productDetailsView','ecommerce':{'currencyCode':gtm_info.currency,'detail':{'actionField':{'list':gtm_info.list},'products':[{'id':gtm_info.id}]}}};if(bundleObjs.length){d_layer.ecommerce.impressions=bundleObjs;}
dataLayer.push(d_layer);}}}
function is_gtm_event_enabled(event){return typeof window.gtm_events!='undefined'&&$.inArray(event,window.gtm_events)!=-1}
function onCheckout(url,event){event.preventDefault();if(!is_enabled_GTM()||!storedData.use_gtm){document.location=url;return;}
dataLayer=window.dataLayer||[];var productObjs=[];var currencyCode='EUR';$.each($('#cart_products .cart_product'),function(){var gtm_info=get_gtmProductInfo(this);if(gtm_info&&!is_incart(gtm_info)){currencyCode=gtm_info.currency;productObjs.push({'id':gtm_info.id,'quantity':1});if(gtm_info.bundle!=''){eval('var obj_bundle='+gtm_info.bundle);if(obj_bundle.length){$.each(obj_bundle,function(){productObjs.push({'id':this.id,'quantity':1});});}}}});dataLayer.push({'event':'checkout','ecommerce':{'currencyCode':currencyCode,'checkout':{'actionField':{'step':1},'products':productObjs}},'eventCallback':function(){document.location=url;}});}
$(document).ready(function(){$('#footer .colsitemap_col_ul a').on('click',function(e){e.preventDefault();var url=$(this).attr('href');if(!is_enabled_GTM()){document.location=url;return;}
var link_name=$(this).text().trim();dataLayer=window.dataLayer||[];dataLayer.push({'event':'footerSitemapClick','eventCategory':'Footer Sitemap','eventAction':'Link Click','eventLabel':link_name,'eventCallback':function(){document.location=url;}});});});Element.prototype.isVisible=function(){function m(a,c,k,l,d,g,h){var b=a.parentNode,e;a:{for(e=a;e=e.parentNode;)if(e==document){e=!0;break a}e=!1}if(!e)return!1;if(9===b.nodeType)return!0;if("0"===f(a,"opacity")||"none"===f(a,"display")||"hidden"===f(a,"visibility"))return!1;if("undefined"===typeof c||"undefined"===typeof k||"undefined"===typeof l||"undefined"===typeof d||"undefined"===typeof g||"undefined"===typeof h)c=a.offsetTop,d=a.offsetLeft,l=c+a.offsetHeight,k=d+a.offsetWidth,g=a.offsetWidth,h=a.offsetHeight;if(b){if("hidden"===f(b,"overflow")||"scroll"===f(b,"overflow"))if(d+2>b.offsetWidth+b.scrollLeft||d+g-2<b.scrollLeft||c+2>b.offsetHeight+b.scrollTop||c+h-2<b.scrollTop)return!1;a.offsetParent===b&&(d+=b.offsetLeft,c+=b.offsetTop);return m(b,c,k,l,d,g,h)}return!0}function f(a,c){if(window.getComputedStyle)return document.defaultView.getComputedStyle(a,null)[c];if(a.currentStyle)return a.currentStyle[c]}return m(this)};