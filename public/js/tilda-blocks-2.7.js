 
function t121_setHeight(recid){
    var rec = $('#rec' + recid);
    var div=$("#youtubeiframe"+recid);
    var height=div.width() * 0.5625;
    div.height(height);
    div.parent().height(height);
    
    var videoLazy = rec.find('.t-video-lazyload');
    if (videoLazy != undefined) {
        var iframeLazy = videoLazy.find('iframe');
        var heightLazy = videoLazy.width() * 0.5625;
        videoLazy.height(heightLazy);
        iframeLazy.height(heightLazy);
        
        setTimeout(function() {
            div = $("#youtubeiframe"+recid);
            div.height(div.width() * 0.5625);
        }, 200);
    }
} 
function t142_checkSize(recid){
  var el=$("#rec"+recid).find(".t142__submit");
  if(el.length){
    var btnheight = el.height() + 5;
    var textheight = el[0].scrollHeight;
    if (btnheight < textheight) {
      var btntext = el.text();
      el.addClass("t142__submit-overflowed");
      el.html("<span class=\"t142__text\">" + btntext + "</span>");
    }
  }
} 
function t199_showMenu(recid) {
    var el = $('#rec' + recid);
    el.find('.t199__js__menu').each(function () {
        var $toggler = el.find('.t199__js__menu-toggler'),
            $menu = $(this),
            $body = $('body'),
            CLASS_MENU = 't199__is__menu';

        $menu.find('.t199__menu-item').each(function () {
            var curUrl = $(this).attr('href');
            if (typeof curUrl != 'undefined' && curUrl.indexOf('#') > -1 && curUrl.substring(0, 9) != '#submenu:') {
                $(this).on('click', function (e) {
                    $body.removeClass(CLASS_MENU);
                });
            }
        });
        
        $menu.find('.t199__menu-item-wrap .t-menusub__link-item').each(function () {
            var curUrl = $(this).attr('href');
            $(this).on('click', function (e) {
                $body.removeClass(CLASS_MENU);
            });
        });

        $toggler.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $body.toggleClass(CLASS_MENU);
        });

        $(document).on('click', function (e) {
            var clickedInsideMenu = $(e.target).hasClass('t199__js__menu') || $(e.target).parents('.t199__js__menu').length > 0;
            if (!clickedInsideMenu) {
                $body.removeClass(CLASS_MENU);
            }
        });

        /*$menu.on('click', function(e) {
        e.stopPropagation();
      });*/
    });
    $('.t199__mmenu').bind('clickedAnchorInTooltipMenu', function () {
        $('body').removeClass('t199__is__menu');
    });
}

function t199_positionHeader(recid) {
    var el = $('#rec' + recid);
    var $header = el.find('.t199__js__header');
    var bgcolor = $header.css('background-color');
    var isScrolling = false;
    var CLASS_ACTIVE = 't199__is__active';

    function updateHeader() {
        isScrolling = true;

        if ($(window).scrollTop() > 0) {
            $header.addClass(CLASS_ACTIVE);
            $header.css('background-color', '');
        } else {
            $header.removeClass(CLASS_ACTIVE);
            $header.css('background-color', bgcolor);
        }
    }

    setInterval(function () {
        if (isScrolling) {
            isScrolling = false;
        }
    }, 100);

    $(window).on('scroll', updateHeader);
    updateHeader();
}

function t199_setPath(pageid) {}

function t199_highlight(recid) {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == '/') {
        url = url.slice(0, -1);
    }
    if (pathname.substr(pathname.length - 1) == '/') {
        pathname = pathname.slice(0, -1);
    }
    if (pathname.charAt(0) == '/') {
        pathname = pathname.slice(1);
    }
    if (pathname == '') {
        pathname = '/';
    }
    $(".t199__menu a[href='" + url + "']").addClass('t-active');
    $(".t199__menu a[href='" + url + "/']").addClass('t-active');
    $(".t199__menu a[href='" + pathname + "']").addClass('t-active');
    $(".t199__menu a[href='/" + pathname + "']").addClass('t-active');
    $(".t199__menu a[href='" + pathname + "/']").addClass('t-active');
    $(".t199__menu a[href='/" + pathname + "/']").addClass('t-active');
}

function t199_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t199_navLinks = $('#rec' + recid + " .t-menu__link-item:not(.tooltipstered)[href*='#']");
        if (t199_navLinks.length > 0) {
            t199_catchScroll(t199_navLinks);
        }
    }
}

function t199_catchScroll(t199_navLinks) {
    var t199_clickedSectionId = null,
        t199_sections = new Array(),
        t199_sectionIdTonavigationLink = [],
        t199_interval = 100,
        t199_lastCall,
        t199_timeoutId;
    t199_navLinks = $(t199_navLinks.get().reverse());
    t199_navLinks.each(function () {
        var t199_cursection = t199_getSectionByHref($(this));
        if (typeof t199_cursection.attr('id') != 'undefined') {
            t199_sections.push(t199_cursection);
        }
        t199_sectionIdTonavigationLink[t199_cursection.attr('id')] = $(this);
    });
    t199_updateSectionsOffsets(t199_sections);
    $(window).bind(
        'resize',
        t_throttle(function () {
            t199_updateSectionsOffsets(t199_sections);
        }, 200)
    );
    $('.t199').bind('displayChanged', function () {
        t199_updateSectionsOffsets(t199_sections);
    });
    setInterval(function () {
        t199_updateSectionsOffsets(t199_sections);
    }, 5000);
    t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);

    t199_navLinks.click(function () {
        if (!$(this).hasClass('tooltipstered')) {
            t199_navLinks.removeClass('t-active');
            t199_sectionIdTonavigationLink[t199_getSectionByHref($(this)).attr('id')].addClass('t-active');
            t199_clickedSectionId = t199_getSectionByHref($(this)).attr('id');
        }
    });
    $(window).scroll(function () {
        var t199_now = new Date().getTime();
        if (t199_lastCall && t199_now < t199_lastCall + t199_interval) {
            clearTimeout(t199_timeoutId);
            t199_timeoutId = setTimeout(function () {
                t199_lastCall = t199_now;
                t199_clickedSectionId = t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);
            }, t199_interval - (t199_now - t199_lastCall));
        } else {
            t199_lastCall = t199_now;
            t199_clickedSectionId = t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);
        }
    });
}

function t199_updateSectionsOffsets(sections) {
    $(sections).each(function () {
        var t199_curSection = $(this);
        t199_curSection.attr('data-offset-top', t199_curSection.offset().top);
    });
}

function t199_getSectionByHref(curlink) {
    var t199_curLinkValue = curlink.attr('href').replace(/\s+/g, '');
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t199_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t199_curLinkValue.substring(1) + "']");
    }
}

function t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId) {
    var t199_scrollPosition = $(window).scrollTop(),
        t199_valueToReturn = t199_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (
        t199_sections.length != 0 &&
        t199_clickedSectionId == null &&
        t199_sections[t199_sections.length - 1].attr('data-offset-top') > t199_scrollPosition + 300
    ) {
        t199_navLinks.removeClass('t-active');
        return null;
    }

    $(t199_sections).each(function (e) {
        var t199_curSection = $(this),
            t199_sectionTop = t199_curSection.attr('data-offset-top'),
            t199_id = t199_curSection.attr('id'),
            t199_navLink = t199_sectionIdTonavigationLink[t199_id];
        if (
            t199_scrollPosition + 300 >= t199_sectionTop ||
            (t199_sections[0].attr('id') == t199_id && t199_scrollPosition >= $(document).height() - $(window).height())
        ) {
            if (t199_clickedSectionId == null && !t199_navLink.hasClass('t-active')) {
                t199_navLinks.removeClass('t-active');
                t199_navLink.addClass('t-active');
                t199_valueToReturn = null;
            } else {
                if (t199_clickedSectionId != null && t199_id == t199_clickedSectionId) {
                    t199_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t199_valueToReturn;
}
 
function t228_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t228__list_item a[href='"+url+"']").addClass("t-active");
  $(".t228__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"/']").addClass("t-active");
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function(){
              t228_catchScroll(t228_navLinks);
            }, 500);
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection);
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this);
    });
		t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
      return b.attr("data-offset-top") - a.attr("data-offset-top");
    });
		$(window).bind('resize', t_throttle(function(){t228_updateSectionsOffsets(t228_sections);}, 200));
		$('.t228').bind('displayChanged',function(){t228_updateSectionsOffsets(t228_sections);});
		setInterval(function(){t228_updateSectionsOffsets(t228_sections);},5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);

    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
            }, t228_interval - (t228_now - t228_lastCall));
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
        }
    });
}


function t228_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t228_curSection = $(this);
		t228_curSection.attr("data-offset-top",t228_curSection.offset().top);
	});
}

function t228_getSectionByHref(curlink) {
      var t228_curLinkValue = curlink.attr('href').replace(/\s+/g, '').replace(/.*#/, '');
      if (curlink.is('[href*="#rec"]')) {
          return $(".r[id='" + t228_curLinkValue + "']");
      } else {
          return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue + "']");
      }
  }

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length-1].attr("data-offset-top") > (t228_scrollPosition + 300)){
      t228_navLinks.removeClass('t-active');
      return null;
    }

    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null;
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t228_valueToReturn;
}

function t228_setPath(){
}

function t228_setWidth(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var left_exist=el.find('.t228__leftcontainer').length;
      var left_w=el.find('.t228__leftcontainer').outerWidth(true);
      var max_w=left_w;
      var right_exist=el.find('.t228__rightcontainer').length;
      var right_w=el.find('.t228__rightcontainer').outerWidth(true);
	  var items_align=el.attr('data-menu-items-align');
      if(left_w<right_w)max_w=right_w;
      max_w=Math.ceil(max_w);
      var center_w=0;
      el.find('.t228__centercontainer').find('li').each(function() {
        center_w+=$(this).outerWidth(true);
      });
      var padd_w=40;
      var maincontainer_width=el.find(".t228__maincontainer").outerWidth();
      if(maincontainer_width-max_w*2-padd_w*2>center_w+20){
          //if(left_exist>0 && right_exist>0){
		  if(items_align=="center" || typeof items_align==="undefined"){
            el.find(".t228__leftside").css("min-width",max_w+"px");
            el.find(".t228__rightside").css("min-width",max_w+"px");
            el.find(".t228__list").removeClass("t228__list_hidden");
          }
       }else{
          el.find(".t228__leftside").css("min-width","");
          el.find(".t228__rightside").css("min-width","");  
          
      }
    });
  }
}

function t228_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);
      }
      });
      }else{
        $(".t228").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t228_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t228").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");  
                                el.css("visibility","visible");
                                var topoffset = el.data('top-offset');
                                if (topoffset && parseInt(topoffset) > 0) {
                                    el.animate({"opacity": "1","top": topoffset+"px"}, 200,function() {
                                    });
                                    
                                } else {
                                    el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                    });
                                }
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
							el.css("opacity","0");	
                          }
                  }
           });
      }

}

function t228_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t228_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t228"),
      burger=el.find(".t228__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t228_opened")
  })
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
}
 
function t270_scroll(hash, offset, speed) {
    var $root = $('html, body');
    var target = "";
    
    if (speed === undefined) {
        speed = 500;
    }

    try {
        target = $(hash);
    } catch(event) {
        console.log("Exception t270: " + event.message);
        return true;
    }
    if (target.length === 0) {
        target = $('a[name="' + hash.substr(1) + '"]');
        if (target.length === 0) {
            return true;
        }
    }

    $root.animate({
        scrollTop: target.offset().top - offset
    }, speed, function() {
        if(history.pushState) {
            history.pushState(null, null, hash);
        } else {
            window.location.hash = hash;
        }
    });

    return true;
} 
function t300_init() {
    $('.t300').each(function () {
        var $hook = $(this).attr('data-tooltip-hook'),
            $recid = $(this).attr('data-tooltip-id');
        if ($hook !== '') {
            var $obj = $('a[href="' + $hook + '"]:not(.tooltipstered)');
            var $content = $(this).find('.t300__content').html();
            var touchDevices = false;
            if ($hook.charAt(0) == '#') {
                touchDevices = true;
            }
            var position = $(this).attr('data-tooltip-position');
            if (position === '') {
                position = 'top';
            }
            $obj.tooltipster({
                theme: 't300__tooltipster-noir t300__tooltipster-noir_' + $recid + '',
                contentAsHTML: true,
                content: $content,
                interactive: true,
                touchDevices: touchDevices,
                position: position
            });
        }
    });
}

$(document).ready(function () {
    t300_init();
    setTimeout(function () {
        /* listener open t-store popup (e.g., st300 */
        var t300_storePopups = document.querySelectorAll('body .t-store');
        if (t300_storePopups.length > 0) {
            t300_storePopups.forEach(function(el) {
                new MutationObserver(function (mutationsList, observer) {
                    for (var mutation in mutationsList) {
                        var event = mutationsList[mutation];
                        if (event.type === 'attributes') {
                            if (event.target.className.indexOf('t-popup_show') != -1) {
                                t300_init();
                            }
                        }
                    }
                }).observe(el, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
            });
        }

        t300_init();
    }, 500);
});
 
function t280_showMenu(recid){
  var el=$("#rec"+recid);
  el.find('.t280__burger, .t280__menu__bg, .t280__menu__item:not(".tooltipstered"):not(".t280__menu__item_submenu")').click(function(){
    if ($(this).is(".t280__menu__item.tooltipstered, .t794__tm-link")) { return; }  
    $('body').toggleClass('t280_opened');
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (window.location.hash && isChrome) {
        setTimeout(function () {
            var hash = window.location.hash;
            window.location.hash = "";
            window.location.hash = hash;
        }, 50);
    }
    t280_changeSize(recid);
  });
  $('.t280').bind('clickedAnchorInTooltipMenu',function(){
    $('body').removeClass('t280_opened');
  });
  
  if (el.find('.t-menusub__link-item')) {
    el.find('.t-menusub__link-item').on('click', function() {
      $('body').removeClass('t280_opened');
    });
  }
}

function t280_changeSize(recid){
  var el=$("#rec"+recid);
  var div = el.find(".t280__menu").height();
  var bottomheight = el.find(".t280__bottom").height();
  var headerheight = el.find(".t280__container").height();
  var wrapper = el.find(".t280__menu__wrapper");
  var win = $(window).height() - bottomheight - headerheight - 40;
  if (div > win ) {
    wrapper.addClass('t280__menu_static');
  }
  else {
    wrapper.removeClass('t280__menu_static');
  }
}

function t280_changeBgOpacityMenu(recid) {
  var window_width=$(window).width();
  var record = $("#rec"+recid);
  record.find(".t280__container__bg").each(function() {
        var el=$(this);
        var bgcolor=el.attr("data-bgcolor-rgba");
        var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
        var bgopacity=el.attr("data-bgopacity");
        var bgopacity_afterscroll=el.attr("data-bgopacity2");
        var menu_shadow=el.attr("data-menu-shadow");
        if ($(window).scrollTop() > 20) {
            el.css("background-color",bgcolor_afterscroll);
            if (bgopacity_afterscroll != "0" && bgopacity_afterscroll != "0.0") {
              el.css('box-shadow',menu_shadow);
            } else {
              el.css('box-shadow','none');
            }
        }else{
            el.css("background-color",bgcolor);
            if (bgopacity != "0" && bgopacity != "0.0") {
              el.css('box-shadow',menu_shadow);
            } else {
              el.css('box-shadow','none');
            }
        }
  });
}

function t280_appearMenu() {
  $('.t280').each(function() {
    var el = $(this);
    var appearoffset = el.attr('data-appearoffset');
    if (appearoffset != '') {
      if (appearoffset.indexOf('vh') > -1) {
        appearoffset = Math.floor(
          window.innerHeight * (parseInt(appearoffset) / 100)
        );
      }
      appearoffset = parseInt(appearoffset, 10);
      if ($(window).scrollTop() >= appearoffset) {
        if (el.css('visibility') == 'hidden') {
          el.finish();
          el.css('top', '-50px');
          el.css('opacity', '1');
          el.css('visibility', 'visible');
        }
      } else {
        el.stop();
        el.css('opacity', '0');
        el.css('visibility', 'hidden');
      }
    }
  });
}

function t280_highlight(recid){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t280__menu a[href='"+url+"']").addClass("t-active");
  $(".t280__menu a[href='"+url+"/']").addClass("t-active");
  $(".t280__menu a[href='"+pathname+"']").addClass("t-active");
  $(".t280__menu a[href='/"+pathname+"']").addClass("t-active");
  $(".t280__menu a[href='"+pathname+"/']").addClass("t-active");
  $(".t280__menu a[href='/"+pathname+"/']").addClass("t-active");
}
 
function t281_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    $('#rec' + recid).attr('data-popup-subscribe-inited', 'y');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');

    el.bind('scroll', t_throttle(function () {
        if (window.lazy == 'y') { t_lazyload_update(); }
    }));

    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function (e) {
            t281_showPopup(recid);
            t281_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
            if (analitics > '') {
                Tilda.sendEventToStatistics(analitics, hook);
            }
        });
    }
}

function t281_lockScroll(){
  var body = $("body");
	if (!body.hasClass('t-body_scroll-locked')) {
		var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.addClass('t-body_scroll-locked');
		body.css("top","-"+bodyScrollTop+"px");
    body.attr("data-popup-scrolltop",bodyScrollTop);
	}
}

function t281_unlockScroll(){
  var body = $("body");
	if (body.hasClass('t-body_scroll-locked')) {
    var bodyScrollTop = $("body").attr("data-popup-scrolltop");
		body.removeClass('t-body_scroll-locked');
		body.css("top","");
    body.removeAttr("data-popup-scrolltop")
		window.scrollTo(0, bodyScrollTop);
	}
}

function t281_showPopup(recid){
  var el=$('#rec'+recid),
      popup = el.find('.t-popup');

  popup.css('display', 'block');
  setTimeout(function() {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
  }, 50);

  $('body').addClass('t-body_popupshowed t281__body_popupshowed');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    setTimeout(function() {
      t281_lockScroll();
    }, 500);
  }
  
  el.find('.t-popup').mousedown(function(e){
    if (e.target == this) { t281_closePopup(recid); }
  });

  el.find('.t-popup__close').click(function(e){
    t281_closePopup(recid);
  });

  el.find('a[href*=#]').click(function(e){
    var url = $(this).attr('href');
    if (!url || (url.substring(0,7) != '#price:' && url.substring(0,7) != '#order:')) {
      t281_closePopup(recid);
      if (!url || url.substring(0,7) == '#popup:') {
        setTimeout(function() {
          $('body').addClass('t-body_popupshowed');
        }, 300);
      }
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t281_closePopup(recid); }
  });
}

function t281_closePopup(recid){
    $('body').removeClass('t-body_popupshowed t281__body_popupshowed');
    $('#rec' + recid + ' .t-popup').removeClass('t-popup_show');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    t281_unlockScroll();
  }  
  setTimeout(function() {
    $('.t-popup').not('.t-popup_show').css('display', 'none');
  }, 300);
}

function t281_resizePopup(recid){
  var el = $("#rec"+recid),
      div = el.find(".t-popup__container").height(),
      win = $(window).height() - 120,
      popup = el.find(".t-popup__container");
  if (div > win ) {
    popup.addClass('t-popup__container-static');
  } else {
    popup.removeClass('t-popup__container-static');
  }
}

function t281_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
      popupname = popupname.substring(7);
  }
    
  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }
  
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
} 
function t393_appearMenu(recid) {
    var window_width=$(window).width();
    if(window_width>980){
         $(".t393").each(function() {
                var el=$(this);
                var appearoffset=el.attr("data-appearoffset");
                var hideoffset=el.attr("data-hideoffset");
                if(appearoffset!=""){
                        if(appearoffset.indexOf('vh') > -1){
                            appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                        }

                        appearoffset=parseInt(appearoffset, 10);

                        if ($(window).scrollTop() >= appearoffset) {
                          if(el.css('visibility') == 'hidden'){
                              el.finish();
                              el.css("visibility","visible");
                              el.animate({"opacity": "1"}, 300,function() {
                              });       
                          }
                        }else{
                          el.stop();
                          el.css("visibility","hidden");
                        }
                }

                if(hideoffset!=""){
                        if(hideoffset.indexOf('vh') > -1){
                            hideoffset = Math.floor((window.innerHeight * (parseInt(hideoffset) / 100)));
                        }

                        hideoffset=parseInt(hideoffset, 10);

                        if ($(window).scrollTop()+$(window).height() >= $(document).height() - hideoffset) {
                          if(el.css('visibility') != 'hidden'){
                              el.finish();
                              el.css("visibility","hidden");
                          }
                        }else{
                          if (appearoffset!="") {
                              if($(window).scrollTop() >= appearoffset){
                                el.stop();
                                el.css("visibility","visible");
                              }
                          }else{
                              el.stop();
                              el.css("visibility","visible");
                          }
                        }
                }
         });
    }
}

 

function t396_init(recid){var data='';var res=t396_detectResolution();t396_initTNobj();t396_switchResolution(res);t396_updateTNobj();t396_artboard_build(data,recid);window.tn_window_width=$(window).width();$( window ).resize(function () {tn_console('>>>> t396: Window on Resize event >>>>');t396_waitForFinalEvent(function(){if($isMobile){var ww=$(window).width();if(ww!=window.tn_window_width){t396_doResize(recid);}}else{t396_doResize(recid);}}, 500, 'resizeruniqueid'+recid);});$(window).on("orientationchange",function(){tn_console('>>>> t396: Orient change event >>>>');t396_waitForFinalEvent(function(){t396_doResize(recid);}, 600, 'orientationuniqueid'+recid);});$( window ).load(function() {var ab=$('#rec'+recid).find('.t396__artboard');t396_allelems__renderView(ab);});var rec = $('#rec' + recid);if (rec.attr('data-connect-with-tab') == 'yes') {rec.find('.t396').bind('displayChanged', function() {var ab = rec.find('.t396__artboard');t396_allelems__renderView(ab);});}}function t396_doResize(recid){var ww=$(window).width();window.tn_window_width=ww;var res=t396_detectResolution();var ab=$('#rec'+recid).find('.t396__artboard');t396_switchResolution(res);t396_updateTNobj();t396_ab__renderView(ab);t396_allelems__renderView(ab);}function t396_detectResolution(){var ww=$(window).width();var res;res=1200;if(ww<1200){res=960;}if(ww<960){res=640;}if(ww<640){res=480;}if(ww<480){res=320;}return(res);}function t396_initTNobj(){tn_console('func: initTNobj');window.tn={};window.tn.canvas_min_sizes = ["320","480","640","960","1200"];window.tn.canvas_max_sizes = ["480","640","960","1200",""];window.tn.ab_fields = ["height","width","bgcolor","bgimg","bgattachment","bgposition","filteropacity","filtercolor","filteropacity2","filtercolor2","height_vh","valign"];}function t396_updateTNobj(){tn_console('func: updateTNobj');if(typeof window.zero_window_width_hook!='undefined' && window.zero_window_width_hook=='allrecords' && $('#allrecords').length){window.tn.window_width = parseInt($('#allrecords').width());}else{window.tn.window_width = parseInt($(window).width());}/* window.tn.window_width = parseInt($(window).width()); */window.tn.window_height = parseInt($(window).height());if(window.tn.curResolution==1200){window.tn.canvas_min_width = 1200;window.tn.canvas_max_width = window.tn.window_width;}if(window.tn.curResolution==960){window.tn.canvas_min_width = 960;window.tn.canvas_max_width = 1200;}if(window.tn.curResolution==640){window.tn.canvas_min_width = 640;window.tn.canvas_max_width = 960;}if(window.tn.curResolution==480){window.tn.canvas_min_width = 480;window.tn.canvas_max_width = 640;}if(window.tn.curResolution==320){window.tn.canvas_min_width = 320;window.tn.canvas_max_width = 480;}window.tn.grid_width = window.tn.canvas_min_width;window.tn.grid_offset_left = parseFloat( (window.tn.window_width-window.tn.grid_width)/2 );}var t396_waitForFinalEvent = (function () {var timers = {};return function (callback, ms, uniqueId) {if (!uniqueId) {uniqueId = "Don't call this twice without a uniqueId";}if (timers[uniqueId]) {clearTimeout (timers[uniqueId]);}timers[uniqueId] = setTimeout(callback, ms);};})();function t396_switchResolution(res,resmax){tn_console('func: switchResolution');if(typeof resmax=='undefined'){if(res==1200)resmax='';if(res==960)resmax=1200;if(res==640)resmax=960;if(res==480)resmax=640;if(res==320)resmax=480;}window.tn.curResolution=res;window.tn.curResolution_max=resmax;}function t396_artboard_build(data,recid){tn_console('func: t396_artboard_build. Recid:'+recid);tn_console(data);/* set style to artboard */var ab=$('#rec'+recid).find('.t396__artboard');t396_ab__renderView(ab);/* create elements */ab.find('.tn-elem').each(function() {var item=$(this);if(item.attr('data-elem-type')=='text'){t396_addText(ab,item);}if(item.attr('data-elem-type')=='image'){t396_addImage(ab,item);}if(item.attr('data-elem-type')=='shape'){t396_addShape(ab,item);}if(item.attr('data-elem-type')=='button'){t396_addButton(ab,item);}if(item.attr('data-elem-type')=='video'){t396_addVideo(ab,item);}if(item.attr('data-elem-type')=='html'){t396_addHtml(ab,item);}if(item.attr('data-elem-type')=='tooltip'){t396_addTooltip(ab,item);}if(item.attr('data-elem-type')=='form'){t396_addForm(ab,item);}if(item.attr('data-elem-type')=='gallery'){t396_addGallery(ab,item);}});$('#rec'+recid).find('.t396__artboard').removeClass('rendering').addClass('rendered');if(ab.attr('data-artboard-ovrflw')=='visible'){$('#allrecords').css('overflow','hidden');}if($isMobile){$('#rec'+recid).append('<style>@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}</style>');}}function t396_ab__renderView(ab){var fields = window.tn.ab_fields;for ( var i = 0; i < fields.length; i++ ) {t396_ab__renderViewOneField(ab,fields[i]);}var ab_min_height=t396_ab__getFieldValue(ab,'height');var ab_max_height=t396_ab__getHeight(ab);var offset_top=0;if(ab_min_height==ab_max_height){offset_top=0;}else{var ab_valign=t396_ab__getFieldValue(ab,'valign');if(ab_valign=='top'){offset_top=0;}else if(ab_valign=='center'){offset_top=parseFloat( (ab_max_height-ab_min_height)/2 ).toFixed(1);}else if(ab_valign=='bottom'){offset_top=parseFloat( (ab_max_height-ab_min_height) ).toFixed(1);}else if(ab_valign=='stretch'){offset_top=0;ab_min_height=ab_max_height;}else{offset_top=0;}}ab.attr('data-artboard-proxy-min-offset-top',offset_top);ab.attr('data-artboard-proxy-min-height',ab_min_height);ab.attr('data-artboard-proxy-max-height',ab_max_height);}function t396_addText(ab,el){tn_console('func: addText');/* add data atributes */var fields_str='top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addImage(ab,el){tn_console('func: addImage');/* add data atributes */var fields_str='img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);el.find('img').on("load", function() {t396_elem__renderViewOneField(el,'top');if(typeof $(this).attr('src')!='undefined' && $(this).attr('src')!=''){setTimeout( function() { t396_elem__renderViewOneField(el,'top');} , 2000);} }).each(function() {if(this.complete) $(this).load();}); el.find('img').on('tuwidget_done', function(e, file) { t396_elem__renderViewOneField(el,'top');});}function t396_addShape(ab,el){tn_console('func: addShape');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addButton(ab,el){tn_console('func: addButton');/* add data atributes */var fields_str='top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);return(el);}function t396_addVideo(ab,el){tn_console('func: addVideo');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);var viel=el.find('.tn-atom__videoiframe');var viatel=el.find('.tn-atom');viatel.css('background-color','#000');var vihascover=viatel.attr('data-atom-video-has-cover');if(typeof vihascover=='undefined'){vihascover='';}if(vihascover=='y'){viatel.click(function() {var viifel=viel.find('iframe');if(viifel.length){var foo=viifel.attr('data-original');viifel.attr('src',foo);}viatel.css('background-image','none');viatel.find('.tn-atom__video-play-link').css('display','none');});}var autoplay=t396_elem__getFieldValue(el,'autoplay');var showinfo=t396_elem__getFieldValue(el,'showinfo');var loop=t396_elem__getFieldValue(el,'loop');var mute=t396_elem__getFieldValue(el,'mute');var startsec=t396_elem__getFieldValue(el,'startsec');var endsec=t396_elem__getFieldValue(el,'endsec');var tmode=$('#allrecords').attr('data-tilda-mode');var url='';var viyid=viel.attr('data-youtubeid');if(typeof viyid!='undefined' && viyid!=''){ url='//www.youtube.com/embed/'; url+=viyid+'?rel=0&fmt=18&html5=1'; url+='&showinfo='+(showinfo=='y'?'1':'0'); if(loop=='y'){url+='&loop=1&playlist='+viyid;} if(startsec>0){url+='&start='+startsec;} if(endsec>0){url+='&end='+endsec;} if(mute=='y'){url+='&mute=1';} if(vihascover=='y'){ url+='&autoplay=1'; viel.html('<iframe id="youtubeiframe" width="100%" height="100%" data-original="'+url+'" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>'); }else{ if(typeof tmode!='undefined' && tmode=='edit'){}else{ if(autoplay=='y'){url+='&autoplay=1';} } if(window.lazy=='y'){ viel.html('<iframe id="youtubeiframe" class="t-iframe" width="100%" height="100%" data-original="'+url+'" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>'); el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>'); }else{ viel.html('<iframe id="youtubeiframe" width="100%" height="100%" src="'+url+'" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>'); } }}var vivid=viel.attr('data-vimeoid');if(typeof vivid!='undefined' && vivid>0){url='//player.vimeo.com/video/';url+=vivid+'?color=ffffff&badge=0';if(showinfo=='y'){url+='&title=1&byline=1&portrait=1';}else{url+='&title=0&byline=0&portrait=0';}if(loop=='y'){url+='&loop=1';}if(mute=='y'){url+='&muted=1';}if(vihascover=='y'){url+='&autoplay=1';viel.html('<iframe data-original="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');}else{if(typeof tmode!='undefined' && tmode=='edit'){}else{if(autoplay=='y'){url+='&autoplay=1';}}if(window.lazy=='y'){viel.html('<iframe class="t-iframe" data-original="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>');}else{viel.html('<iframe src="'+url+'" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');}}}}function t396_addHtml(ab,el){tn_console('func: addHtml');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addTooltip(ab, el) {tn_console('func: addTooltip');var fields_str = 'width,height,top,left,';fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';var fields = fields_str.split(',');el.attr('data-fields', fields_str);t396_elem__renderView(el);var pinEl = el.find('.tn-atom__pin');var tipEl = el.find('.tn-atom__tip');var tipopen = el.attr('data-field-tipopen-value');if (isMobile || (typeof tipopen!='undefined' && tipopen=='click')) {t396_setUpTooltip_mobile(el,pinEl,tipEl);} else {t396_setUpTooltip_desktop(el,pinEl,tipEl);}setTimeout(function() {$('.tn-atom__tip-img').each(function() {var foo = $(this).attr('data-tipimg-original');if (typeof foo != 'undefined' && foo != '') {$(this).attr('src', foo);}})}, 3000);}function t396_addForm(ab,el){tn_console('func: addForm');/* add data atributes */var fields_str='width,top,left,';fields_str+='inputs,container,axisx,axisy,widthunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_addGallery(ab,el){tn_console('func: addForm');/* add data atributes */var fields_str='width,height,top,left,';fields_str+='imgs,container,axisx,axisy,widthunits,heightunits,leftunits,topunits';var fields=fields_str.split(',');el.attr('data-fields',fields_str);/* render elem view */t396_elem__renderView(el);}function t396_elem__setFieldValue(el,prop,val,flag_render,flag_updateui,res){if(res=='')res=window.tn.curResolution;if(res<1200 && prop!='zindex'){el.attr('data-field-'+prop+'-res-'+res+'-value',val);}else{el.attr('data-field-'+prop+'-value',val);}if(flag_render=='render')elem__renderViewOneField(el,prop);if(flag_updateui=='updateui')panelSettings__updateUi(el,prop,val);}function t396_elem__getFieldValue(el,prop){var res=window.tn.curResolution;var r;if(res<1200){if(res==960){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}if(res==640){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}if(res==480){r=el.attr('data-field-'+prop+'-res-480-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}}if(res==320){r=el.attr('data-field-'+prop+'-res-320-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-480-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-640-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-res-960-value');if(typeof r=='undefined'){r=el.attr('data-field-'+prop+'-value');}}}}}}else{r=el.attr('data-field-'+prop+'-value');}return(r);}function t396_elem__renderView(el){tn_console('func: elem__renderView');var fields=el.attr('data-fields');if(! fields) {return false;}fields = fields.split(',');/* set to element value of every fieldvia css */for ( var i = 0; i < fields.length; i++ ) {t396_elem__renderViewOneField(el,fields[i]);}}function t396_elem__renderViewOneField(el,field){var value=t396_elem__getFieldValue(el,field);if(field=='left'){value = t396_elem__convertPosition__Local__toAbsolute(el,field,value);el.css('left',parseFloat(value).toFixed(1)+'px');}if(field=='top'){value = t396_elem__convertPosition__Local__toAbsolute(el,field,value);el.css('top',parseFloat(value).toFixed(1)+'px');}if(field=='width'){value = t396_elem__getWidth(el,value);el.css('width',parseFloat(value).toFixed(1)+'px');var eltype=el.attr('data-elem-type');if(eltype=='tooltip'){var pinSvgIcon = el.find('.tn-atom__pin-icon');/*add width to svg nearest parent to fix InternerExplorer problem*/if (pinSvgIcon.length > 0) {var pinSize = parseFloat(value).toFixed(1) + 'px';pinSvgIcon.css({'width': pinSize, 'height': pinSize});}el.css('height',parseInt(value).toFixed(1)+'px');}if(eltype=='gallery') {var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');if (borderStyle=='none' || typeof borderStyle=='undefined' || typeof borderWidth=='undefined' || borderWidth=='') borderWidth=0;value = value*1 - borderWidth*2;el.css('width', parseFloat(value).toFixed(1)+'px');el.find('.t-slds__main').css('width', parseFloat(value).toFixed(1)+'px');el.find('.tn-atom__slds-img').css('width', parseFloat(value).toFixed(1)+'px');}}if(field=='height'){var eltype = el.attr('data-elem-type');if (eltype == 'tooltip') {return;}value=t396_elem__getHeight(el,value);el.css('height', parseFloat(value).toFixed(1)+'px');if (eltype === 'gallery') {var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');if (borderStyle=='none' || typeof borderStyle=='undefined' || typeof borderWidth=='undefined' || borderWidth=='') borderWidth=0;value = value*1 - borderWidth*2;el.css('height',parseFloat(value).toFixed(1)+'px');el.find('.tn-atom__slds-img').css('height', parseFloat(value).toFixed(1) + 'px');el.find('.t-slds__main').css('height', parseFloat(value).toFixed(1) + 'px');}}if(field=='container'){t396_elem__renderViewOneField(el,'left');t396_elem__renderViewOneField(el,'top');}if(field=='width' || field=='height' || field=='fontsize' || field=='fontfamily' || field=='letterspacing' || field=='fontweight' || field=='img'){t396_elem__renderViewOneField(el,'left');t396_elem__renderViewOneField(el,'top');}if(field=='inputs'){value=el.find('.tn-atom__inputs-textarea').val();try {t_zeroForms__renderForm(el,value);} catch (err) {}}}function t396_elem__convertPosition__Local__toAbsolute(el,field,value){value = parseInt(value);if(field=='left'){var el_container,offset_left,el_container_width,el_width;var container=t396_elem__getFieldValue(el,'container');if(container=='grid'){el_container = 'grid';offset_left = window.tn.grid_offset_left;el_container_width = window.tn.grid_width;}else{el_container = 'window';offset_left = 0;el_container_width = window.tn.window_width;}/* fluid or not*/var el_leftunits=t396_elem__getFieldValue(el,'leftunits');if(el_leftunits=='%'){value = t396_roundFloat( el_container_width * value/100 );}value = offset_left + value;var el_axisx=t396_elem__getFieldValue(el,'axisx');if(el_axisx=='center'){el_width = t396_elem__getWidth(el);value = el_container_width/2 - el_width/2 + value;}if(el_axisx=='right'){el_width = t396_elem__getWidth(el);value = el_container_width - el_width + value;}}if(field=='top'){var ab=el.parent();var el_container,offset_top,el_container_height,el_height;var container=t396_elem__getFieldValue(el,'container');if(container=='grid'){el_container = 'grid';offset_top = parseFloat( ab.attr('data-artboard-proxy-min-offset-top') );el_container_height = parseFloat( ab.attr('data-artboard-proxy-min-height') );}else{el_container = 'window';offset_top = 0;el_container_height = parseFloat( ab.attr('data-artboard-proxy-max-height') );}/* fluid or not*/var el_topunits=t396_elem__getFieldValue(el,'topunits');if(el_topunits=='%'){value = ( el_container_height * (value/100) );}value = offset_top + value;var el_axisy=t396_elem__getFieldValue(el,'axisy');if(el_axisy=='center'){/* var el_height=parseFloat(el.innerHeight()); */el_height=t396_elem__getHeight(el);value = el_container_height/2 - el_height/2 + value;}if(el_axisy=='bottom'){/* var el_height=parseFloat(el.innerHeight()); */el_height=t396_elem__getHeight(el);value = el_container_height - el_height + value;} }return(value);}function t396_ab__setFieldValue(ab,prop,val,res){/* tn_console('func: ab__setFieldValue '+prop+'='+val);*/if(res=='')res=window.tn.curResolution;if(res<1200){ab.attr('data-artboard-'+prop+'-res-'+res,val);}else{ab.attr('data-artboard-'+prop,val);}}function t396_ab__getFieldValue(ab,prop){var res=window.tn.curResolution;var r;if(res<1200){if(res==960){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}if(res==640){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}if(res==480){r=ab.attr('data-artboard-'+prop+'-res-480');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}}if(res==320){r=ab.attr('data-artboard-'+prop+'-res-320');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-480');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-640');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'-res-960');if(typeof r=='undefined'){r=ab.attr('data-artboard-'+prop+'');}}}}}}else{r=ab.attr('data-artboard-'+prop);}return(r);}function t396_ab__renderViewOneField(ab,field){var value=t396_ab__getFieldValue(ab,field);}function t396_allelems__renderView(ab){tn_console('func: allelems__renderView: abid:'+ab.attr('data-artboard-recid'));ab.find(".tn-elem").each(function() {t396_elem__renderView($(this));});}function t396_ab__filterUpdate(ab){var filter=ab.find('.t396__filter');var c1=filter.attr('data-filtercolor-rgb');var c2=filter.attr('data-filtercolor2-rgb');var o1=filter.attr('data-filteropacity');var o2=filter.attr('data-filteropacity2');if((typeof c2=='undefined' || c2=='') && (typeof c1!='undefined' && c1!='')){filter.css("background-color", "rgba("+c1+","+o1+")");}else if((typeof c1=='undefined' || c1=='') && (typeof c2!='undefined' && c2!='')){filter.css("background-color", "rgba("+c2+","+o2+")");}else if(typeof c1!='undefined' && typeof c2!='undefined' && c1!='' && c2!=''){filter.css({background: "-webkit-gradient(linear, left top, left bottom, from(rgba("+c1+","+o1+")), to(rgba("+c2+","+o2+")) )" });}else{filter.css("background-color", 'transparent');}}function t396_ab__getHeight(ab, ab_height){if(typeof ab_height=='undefined')ab_height=t396_ab__getFieldValue(ab,'height');ab_height=parseFloat(ab_height);/* get Artboard height (fluid or px) */var ab_height_vh=t396_ab__getFieldValue(ab,'height_vh');if(ab_height_vh!=''){ab_height_vh=parseFloat(ab_height_vh);if(isNaN(ab_height_vh)===false){var ab_height_vh_px=parseFloat( window.tn.window_height * parseFloat(ab_height_vh/100) );if( ab_height < ab_height_vh_px ){ab_height=ab_height_vh_px;}}} return(ab_height);} function t396_hex2rgb(hexStr){/*note: hexStr should be #rrggbb */var hex = parseInt(hexStr.substring(1), 16);var r = (hex & 0xff0000) >> 16;var g = (hex & 0x00ff00) >> 8;var b = hex & 0x0000ff;return [r, g, b];}String.prototype.t396_replaceAll = function(search, replacement) {var target = this;return target.replace(new RegExp(search, 'g'), replacement);};function t396_elem__getWidth(el,value){if(typeof value=='undefined')value=parseFloat( t396_elem__getFieldValue(el,'width') );var el_widthunits=t396_elem__getFieldValue(el,'widthunits');if(el_widthunits=='%'){var el_container=t396_elem__getFieldValue(el,'container');if(el_container=='window'){value=parseFloat( window.tn.window_width * parseFloat( parseInt(value)/100 ) );}else{value=parseFloat( window.tn.grid_width * parseFloat( parseInt(value)/100 ) );}}return(value);}function t396_elem__getHeight(el,value){if(typeof value=='undefined')value=t396_elem__getFieldValue(el,'height');value=parseFloat(value);if(el.attr('data-elem-type')=='shape' || el.attr('data-elem-type')=='video' || el.attr('data-elem-type')=='html' || el.attr('data-elem-type')=='gallery'){var el_heightunits=t396_elem__getFieldValue(el,'heightunits');if(el_heightunits=='%'){var ab=el.parent();var ab_min_height=parseFloat( ab.attr('data-artboard-proxy-min-height') );var ab_max_height=parseFloat( ab.attr('data-artboard-proxy-max-height') );var el_container=t396_elem__getFieldValue(el,'container');if(el_container=='window'){value=parseFloat( ab_max_height * parseFloat( value/100 ) );}else{value=parseFloat( ab_min_height * parseFloat( value/100 ) );}}}else if(el.attr('data-elem-type')=='button'){value = value;}else{value =parseFloat(el.innerHeight());}return(value);}function t396_roundFloat(n){n = Math.round(n * 100) / 100;return(n);}function tn_console(str){if(window.tn_comments==1)console.log(str);}function t396_setUpTooltip_desktop(el, pinEl, tipEl) {var timer;pinEl.mouseover(function() {/*if any other tooltip is waiting its timeout to be hided — hide it*/$('.tn-atom__tip_visible').each(function(){var thisTipEl = $(this).parents('.t396__elem');if (thisTipEl.attr('data-elem-id') != el.attr('data-elem-id')) {t396_hideTooltip(thisTipEl, $(this));}});clearTimeout(timer);if (tipEl.css('display') == 'block') {return;}t396_showTooltip(el, tipEl);});pinEl.mouseout(function() {timer = setTimeout(function() {t396_hideTooltip(el, tipEl);}, 300);})}function t396_setUpTooltip_mobile(el,pinEl,tipEl) {pinEl.on('click', function(e) {if (tipEl.css('display') == 'block' && $(e.target).hasClass("tn-atom__pin")) {t396_hideTooltip(el,tipEl);} else {t396_showTooltip(el,tipEl);}});var id = el.attr("data-elem-id");$(document).click(function(e) {var isInsideTooltip = ($(e.target).hasClass("tn-atom__pin") || $(e.target).parents(".tn-atom__pin").length > 0);if (isInsideTooltip) {var clickedPinId = $(e.target).parents(".t396__elem").attr("data-elem-id");if (clickedPinId == id) {return;}}t396_hideTooltip(el,tipEl);})}function t396_hideTooltip(el, tipEl) {tipEl.css('display', '');tipEl.css({"left": "","transform": "","right": ""});tipEl.removeClass('tn-atom__tip_visible');el.css('z-index', '');}function t396_showTooltip(el, tipEl) {var pos = el.attr("data-field-tipposition-value");if (typeof pos == 'undefined' || pos == '') {pos = 'top';};var elSize = el.height();var elTop = el.offset().top;var elBottom = elTop + elSize;var elLeft = el.offset().left;var elRight = el.offset().left + elSize;var winTop = $(window).scrollTop();var winWidth = $(window).width();var winBottom = winTop + $(window).height();var tipElHeight = tipEl.outerHeight();var tipElWidth = tipEl.outerWidth();var padd=15;if (pos == 'right' || pos == 'left') {var tipElRight = elRight + padd + tipElWidth;var tipElLeft = elLeft - padd - tipElWidth;if ((pos == 'right' && tipElRight > winWidth) || (pos == 'left' && tipElLeft < 0)) {pos = 'top';}}if (pos == 'top' || pos == 'bottom') {var tipElRight = elRight + (tipElWidth / 2 - elSize / 2);var tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);if (tipElRight > winWidth) {var rightOffset = -(winWidth - elRight - padd);tipEl.css({"left": "auto","transform": "none","right": rightOffset + "px"});}if (tipElLeft < 0) {var leftOffset = -(elLeft - padd);tipEl.css({"left": leftOffset + "px","transform": "none"});}}if (pos == 'top') {var tipElTop = elTop - padd - tipElHeight;if (winTop > tipElTop) {pos = 'bottom';}}if (pos == 'bottom') {var tipElBottom = elBottom + padd + tipElHeight;if (winBottom < tipElBottom) {pos = 'top';}}tipEl.attr('data-tip-pos', pos);tipEl.css('display', 'block');tipEl.addClass('tn-atom__tip_visible');el.css('z-index', '1000');}function t396_hex2rgba(hexStr, opacity){var hex = parseInt(hexStr.substring(1), 16);var r = (hex & 0xff0000) >> 16;var g = (hex & 0x00ff00) >> 8;var b = hex & 0x0000ff;return [r, g, b, parseFloat(opacity)];} 
 
function t397_init(recid) {
    var el = $('#rec' + recid);
    var curMode = $('.t-records').attr('data-tilda-mode');
    var tabs = el.find('.t397__tab');

    if (curMode != 'edit' && curMode != 'preview') {
        t397_scrollToTabs(recid);
    }

    if (tabs.length > 0) {
        tabs.click(function () {
            el.find('.t397__tab').removeClass('t397__tab_active');
            $(this).addClass('t397__tab_active');

            t397_removeUrl();
            var tabNumber = el.find(".t397__tab_active").index() + 1;
            if (curMode != 'edit' && curMode != 'preview' && tabNumber !== 0) {
                if (typeof history.replaceState != 'undefined') {
                    window.history.replaceState('', '', window.location.href + '#!/tab/' + recid + '-' + tabNumber);
                }
            }

            t397_alltabs_updateContent(recid);
            t397_updateSelect(recid);

            var recids = $(this).attr('data-tab-rec-ids').split(',');
            recids.forEach(function (recid) {
                var el = $('#rec' + recid);
                el.find('.t-feed, .t-store, .t117, .t121, .t132, .t223, .t226, .t228, .t229, .t230, .t268, .t279, .t341, .t346, .t347, .t349, .t351, .t353, .t384, .t385, .t386, .t396, .t404, .t409, .t410, .t412, .t418, .t422, .t425, .t428, .t433, .t456, .t477, .t478, .t480, .t486, .t498, .t504, .t506, .t509, .t511, .t517, .t518, .t519, .t520, .t532, .t538, .t539, .t544, .t545, .t552, .t554, .t570, .t577, .t592, .t598, .t599, .t601, .t604, .t605, .t609, .t615, .t616, .t650, .t659, .t670, .t675, .t686, .t688, .t694, .t698, .t700, .t726, .t728, .t734, .t738, .t740, .t744, .t754, .t760, .t762, .t764, .t774, .t776, .t778, .t780, .t798, .t799, .t801, .t822, .t826, .t827, .t829, .t842, .t843, .t849, .t850, .t851, .t856, .t858, .t859, .t860, .t902, .t912, .t923, .t937').trigger('displayChanged');
            });

            t397_startUpdateLazyLoad($(this));
            if (window.lazy == 'y') {
                t_lazyload_update()
            }
        });

        t397_alltabs_updateContent(recid);
        t397_updateContentBySelect(recid);

        var bgcolor = el.css("background-color");
        var bgcolor_target = el.find(".t397__select, .t397__firefoxfix");
        bgcolor_target.css("background-color", bgcolor);
    }
}

function t397_alltabs_updateContent(recid) {
    var el = $('#rec' + recid);

    var activeTab = el.find(".t397__tab_active");
    if (activeTab.length === 1) {
        var active = activeTab.attr('data-tab-rec-ids').split(',');
        var noactive = [];

        el.find(".t397__tab:not(.t397__tab_active)").each(function (i, tab) {
            noactive = noactive.concat($(tab).attr('data-tab-rec-ids').split(','));
        });

        var unique = noactive.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        var off = unique.filter(function (value) {
            return $.inArray(value, active) === -1;
        });

        if (el.find(".t397__tab_active").is(":visible") || el.find(".t397__select").is(":visible")) {
            active.forEach(function (recid) {
                var el = $('#rec' + recid);
                el.removeClass('t379__off');
                el.removeClass('t379__zero-off');
                el.removeClass('t397__off');
                el.css('opacity', '');
            });
        } else {
            active.forEach(function (recid) {
                var el = $('#rec' + recid);
                el.attr('data-animationappear', 'off');
                el.addClass('t397__off');
            });
        }

        off.forEach(function (recid) {
            var el = $('#rec' + recid);
            el.attr('data-connect-with-tab', 'yes');
            el.attr('data-animationappear', 'off');
            el.addClass('t397__off');
  
        });
    }
}

function t397_updateContentBySelect(recid) {
    var el = $('#rec' + recid);
    el.find(".t397__select").change(function () {
        var select_val = el.find(".t397__select").val();
        var tab_index = el.find(".t397__tab[data-tab-rec-ids='" + select_val + "']");
        tab_index.trigger('click')
    })
}

function t397_updateSelect(recid) {
    var el = $('#rec' + recid);
    var current_tab = el.find(".t397__tab_active").attr('data-tab-rec-ids');
    var el_select = el.find(".t397__select");
    el_select.val(current_tab)
}

function t397_startUpdateLazyLoad($this) {
    var rec_ids = $this.attr('data-tab-rec-ids').split(',');
    rec_ids.forEach(function (rec_id, i, arr) {
        var rec_el = $('#rec' + rec_id);

        var video = rec_el.find('.t-video-lazyload');
        if (video.length > 0) {
            t397_updateVideoLazyLoad(video);
        }
    });
}

function t397_updateVideoLazyLoad(video) {
    setTimeout(function () {
        video.each(function () {
            var div = $(this);

            if (!div.hasClass('t-video__isload')) {

                var height = div.attr('data-videolazy-height') ? $(this).attr('data-videolazy-height') : '100%';
                if (height.indexOf('vh') != -1) {
                    height = '100%';
                }

                var videoId = div.attr('data-videolazy-id').trim();
                var blockId = div.attr('data-blocklazy-id') || '';
                if (typeof div.attr('data-videolazy-two-id') != 'undefined') {
                    var videoTwoId = '_' + div.attr('data-videolazy-two-id') + '_';
                } else {
                    var videoTwoId = '';
                }

                if (div.attr('data-videolazy-type') == 'youtube') {
                    div.find('iframe').remove();
                    div.prepend('<iframe id="youtubeiframe' + videoTwoId + blockId + '" width="100%" height="' + height + '" src="//www.youtube.com/embed/' + videoId + '?rel=0&fmt=18&html5=1&showinfo=0" frameborder="0" allowfullscreen></iframe>');
                }
            }

            div.addClass('t-video__isload');
        });
    }, 2);
}

function t397_scrollToTabs(recid) {
    var el = $('#rec' + recid);
    var curUrl = window.location.href;
    var tabIndexNumber = curUrl.indexOf('#!/tab/');
    var tabIndexNumberStart = curUrl.indexOf('tab/');

    el.find('.t397__wrapper_mobile .t397__select option:eq(0)').attr('selected', true);

    if (tabIndexNumber !== -1) {
        var tabRec = curUrl.substring(tabIndexNumberStart + 4, tabIndexNumberStart + 4 + recid.length);

        if (tabRec == recid) {
            var tabBlock = $('#rec' + tabRec).find('.t397');
            var tabNumber = parseInt(curUrl.slice(tabIndexNumberStart + 4 + recid.length + 1), 10);
            el.find('.t397__tab').removeClass('t397__tab_active');
            el.find('.t397__tab:eq(' + (tabNumber - 1) + ')').addClass('t397__tab_active');
            el.find('.t397__wrapper_mobile .t397__select option:eq(' + (tabNumber - 1) + ')').attr('selected', true);

            var targetOffset = tabBlock.offset().top;
            var target = targetOffset;

            if ($(window).width() > 960) {
                target = targetOffset - 200;
            } else {
                target = targetOffset - 100;
            }

            $('html, body').animate({
                scrollTop: target
            }, 300);
        }
    }
}

function t397_removeUrl() {
    var curUrl = window.location.href;
    var indexToRemove = curUrl.indexOf('#!/tab/');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && indexToRemove < 0) {
        indexToRemove = curUrl.indexOf('%23!/tab/');
    }

    curUrl = curUrl.substring(0, indexToRemove);
    if (indexToRemove != -1) {
        if (typeof history.replaceState != 'undefined') {
            window.history.replaceState('', '', curUrl);
        }
    }
}
 
function t450_showMenu(recid){
  var el=$('#rec'+recid);
  $('body').addClass('t450__body_menushowed');
  el.find('.t450').addClass('t450__menu_show');
  el.find('.t450__overlay').addClass('t450__menu_show');
  $('.t450').bind('clickedAnchorInTooltipMenu',function(){
    t450_closeMenu();
  });
  el.find('.t450__overlay, .t450__close, a[href*=#]').click(function() {
    var url = $(this).attr('href');
    if (typeof url!='undefined' && url!='' && (url.substring(0, 7) == '#price:' || url.substring(0, 9) == '#submenu:')) { return; }
    t450_closeMenu();
  });
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
    	$('body').removeClass('t390__body_popupshowed');
      $('.t390').removeClass('t390__popup_show');
    }
});
}

function t450_closeMenu(){
  $('body').removeClass('t450__body_menushowed');
  $('.t450').removeClass('t450__menu_show');
  $('.t450__overlay').removeClass('t450__menu_show');
}

function t450_checkSize(recid){
  var el=$('#rec'+recid).find('.t450');
  var windowheight = $(window).height() - 80;
  var contentheight = el.find(".t450__top").height() + el.find(".t450__rightside").height();
  if (contentheight > windowheight) {
    el.addClass('t450__overflowed');
    el.find(".t450__container").css('height', 'auto');
  }
}

function t450_appearMenu(recid) {
  var el=$('#rec'+recid);
  var burger=el.find(".t450__burger_container");
   burger.each(function() {
          var el=$(this);
          var appearoffset=el.attr("data-appearoffset");
          var hideoffset=el.attr("data-hideoffset");
          if(appearoffset!=""){
                  if(appearoffset.indexOf('vh') > -1){
                      appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                  }

                  appearoffset=parseInt(appearoffset, 10);

                  if ($(window).scrollTop() >= appearoffset) {
                    if(el.hasClass('t450__beforeready')){
                        el.finish(); 
                        el.removeClass("t450__beforeready");
                    }
                  }else{
                    el.stop();
                    el.addClass("t450__beforeready");
                  }
          }

          if(hideoffset!=""){
                  if(hideoffset.indexOf('vh') > -1){
                      hideoffset = Math.floor((window.innerHeight * (parseInt(hideoffset) / 100)));
                  }

                  hideoffset=parseInt(hideoffset, 10);

                  if ($(window).scrollTop()+$(window).height() >= $(document).height() - hideoffset) {
                    if(!el.hasClass('t450__beforeready')){
                        el.finish();
                        el.addClass("t450__beforeready");
                    }
                  }else{
                    if (appearoffset!="") {
                        if($(window).scrollTop() >= appearoffset){
                          el.stop();
                          el.removeClass("t450__beforeready");
                        }
                    }else{
                        el.stop();
                        el.removeClass("t450__beforeready");
                    }
                  }
          }
   });
}

function t450_initMenu(recid){
  var el=$('#rec'+recid).find('.t450');
  var hook=el.attr('data-tooltip-hook');
  if(hook!==''){
    var obj = $('a[href="'+hook+'"]');
    obj.click(function(e){
      t450_closeMenu();
      t450_showMenu(recid);
      t450_checkSize(recid);
      e.preventDefault();
    });
  }
  $('#rec'+recid).find('.t450__burger_container').click(function(e){
    t450_closeMenu();
    t450_showMenu(recid);
    t450_checkSize(recid);
  });
  
  if (isMobile) {
    $('#rec'+recid).find('.t-menu__link-item').each(function() {
      var $this = $(this);
      if ($this.hasClass('t450__link-item_submenu')) {
        $this.on('click', function() {
          setTimeout(function() {
            t450_checkSize(recid);
          }, 100);
        });
      }
    });
  }
  
  t450_highlight();
}

function t450_highlight() {
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t450__menu a[href='"+url+"']").addClass("t-active");
  $(".t450__menu a[href='"+url+"/']").addClass("t-active");
  $(".t450__menu a[href='"+pathname+"']").addClass("t-active");
  $(".t450__menu a[href='/"+pathname+"']").addClass("t-active");
  $(".t450__menu a[href='"+pathname+"/']").addClass("t-active");
  $(".t450__menu a[href='/"+pathname+"/']").addClass("t-active");
}
 
function t456_setListMagin(recid,imglogo){
	if($(window).width()>980){		
        var t456__menu = $('#rec'+recid+' .t456');        
        var t456__leftpart=t456__menu.find('.t456__leftwrapper');
        var t456__listpart=t456__menu.find('.t456__list');		
		if (imglogo){
			t456__listpart.css("margin-right",t456__leftpart.width());
		} else {
			t456__listpart.css("margin-right",t456__leftpart.width()+30);        
		}		        
	}
}

function t456_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t456__list_item a[href='"+url+"']").addClass("t-active");
  $(".t456__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t456__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t456__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t456__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t456__list_item a[href='/"+pathname+"/']").addClass("t-active");
}


function t456_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t456_navLinks = $("#rec" + recid + " .t456__list_item a:not(.tooltipstered)[href*='#']");
        if (t456_navLinks.length > 0) {
            t456_catchScroll(t456_navLinks);
        }
    }
}

function t456_catchScroll(t456_navLinks) {
    var t456_clickedSectionId = null,
        t456_sections = new Array(),
        t456_sectionIdTonavigationLink = [],
        t456_interval = 100,
        t456_lastCall, t456_timeoutId;
    t456_navLinks = $(t456_navLinks.get().reverse());
    t456_navLinks.each(function() {
        var t456_cursection = t456_getSectionByHref($(this));
        if (typeof t456_cursection !== "undefined") {
            if (typeof t456_cursection.attr("id") !== "undefined") {
                t456_sections.push(t456_cursection);
            }
            t456_sectionIdTonavigationLink[t456_cursection.attr("id")] = $(this);
        }
    });

		$(window).bind('resize', t_throttle(function(){t456_updateSectionsOffsets(t456_sections);}, 200));
		$('.t456').bind('displayChanged',function(){t456_updateSectionsOffsets(t456_sections);});
		setInterval(function(){t456_updateSectionsOffsets(t456_sections);},5000);
    setTimeout(function(){
			t456_updateSectionsOffsets(t456_sections);
			t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
		},1000);

    t456_navLinks.click(function() {
        if (!$(this).hasClass("tooltipstered")) {
            t456_navLinks.removeClass('t-active');
            
            var section = t456_getSectionByHref($(this));
            if (section != undefined) {
                var id = section.attr('id');
                t456_sectionIdTonavigationLink[id].addClass('t-active');
                t456_clickedSectionId = id;
            }
        }
    });
    $(window).scroll(function() {
        var t456_now = new Date().getTime();
        if (t456_lastCall && t456_now < (t456_lastCall + t456_interval)) {
            clearTimeout(t456_timeoutId);
            t456_timeoutId = setTimeout(function() {
                t456_lastCall = t456_now;
                t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
            }, t456_interval - (t456_now - t456_lastCall));
        } else {
            t456_lastCall = t456_now;
            t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
        }
    });
}


function t456_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t456_curSection = $(this);
		t456_curSection.attr("data-offset-top",t456_curSection.offset().top);
	});
}


function t456_getSectionByHref(curlink) {
    var hash = curlink.attr("href").replace(/\s+/g, '').substring(1);
    var block = $(".r[id='" + hash + "']");
    var anchor = $(".r[data-record-type='215']").has("a[name='" + hash + "']");

    if (block.length === 1) {
        return block;
    } else if (anchor.length === 1) {
        return anchor;
    } else {
        return undefined;
    }
}

function t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId) {
    var t456_scrollPosition = $(window).scrollTop(),
        t456_valueToReturn = t456_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t456_sections.length != 0 && t456_clickedSectionId == null && t456_sections[t456_sections.length-1].attr("data-offset-top") > (t456_scrollPosition + 300)){
      t456_navLinks.removeClass('t-active');
      return null;
    }

    $(t456_sections).each(function(e) {
        var t456_curSection = $(this),
            t456_sectionTop = t456_curSection.attr("data-offset-top"),
            t456_id = t456_curSection.attr('id'),
            t456_navLink = t456_sectionIdTonavigationLink[t456_id];
        if (((t456_scrollPosition + 300) >= t456_sectionTop) || (t456_sections[0].attr("id") == t456_id && t456_scrollPosition >= $(document).height() - $(window).height())) {
            if (t456_clickedSectionId == null && !t456_navLink.hasClass('t-active')) {
                t456_navLinks.removeClass('t-active');
                t456_navLink.addClass('t-active');
                t456_valueToReturn = null;
            } else {
                if (t456_clickedSectionId != null && t456_id == t456_clickedSectionId) {
                    t456_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t456_valueToReturn;
}

function t456_setPath(){
}

function t456_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t456").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);
      }
      });
      }else{
        $(".t456").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t456_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t456").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");
                                el.css("visibility","visible");
                                el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                });
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
                          }
                  }
           });
      }

}

function t456_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t456").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t456_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t456"),
      burger=el.find(".t456__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t456_opened")
  });
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
} 
function t481_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t481__list_item a[href='"+url+"']").addClass("t-active");
  $(".t481__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t481__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t481__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t481__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t481__list_item a[href='/"+pathname+"/']").addClass("t-active");
}

function t481_checkAnchorLinks(recid) {
	if($(window).width()>=960) {
	  var t481_navLinks = $("#rec"+recid+" .t481__list_item a:not(.tooltipstered)[href*='#']");
      if (t481_navLinks.length>0){
      	t481_catchScroll(t481_navLinks);
      };
	}
}

function t481_catchScroll(t481_navLinks) {
    var t481_clickedSectionId = null,
      t481_sections = new Array(),
      t481_sectionIdTonavigationLink = {},
      t481_interval = 100,
      t481_lastCall,
      t481_timeoutId,
	  t481_offsetTop = $(".t270").attr("data-offset-top");
	if (typeof t481_offsetTop == "undefined") { t481_offsetTop = 0; }
	t481_navLinks = $(t481_navLinks.get().reverse());
	t481_navLinks.each(function(){
		var t481_cursection = t481_getSectionByHref($(this));
		if (typeof t481_cursection.attr("id") != "undefined") { t481_sections.push(t481_cursection); }
		t481_sectionIdTonavigationLink[t481_cursection.attr("id")] = $(this);
	});

	t481_highlightNavLinks(t481_navLinks,t481_sections,t481_sectionIdTonavigationLink,t481_clickedSectionId,t481_offsetTop);
	t481_navLinks.click(function() {		
		if (!$(this).hasClass("tooltipstered")) {
		  t481_navLinks.removeClass('t-active');	
          t481_sectionIdTonavigationLink[t481_getSectionByHref($(this)).attr("id")].addClass('t-active');
          t481_clickedSectionId = t481_getSectionByHref($(this)).attr("id");
		}
  	});
	$(window).scroll( function() {
		var t481_now = new Date().getTime();
		if (t481_lastCall && t481_now < (t481_lastCall + t481_interval) ) {
				clearTimeout(t481_timeoutId);
				t481_timeoutId = setTimeout(function () {
						t481_lastCall = t481_now;
						t481_clickedSectionId = t481_highlightNavLinks(t481_navLinks,t481_sections,t481_sectionIdTonavigationLink,t481_clickedSectionId,t481_offsetTop);
				}, t481_interval - (t481_now - t481_lastCall) );
		} else {
				t481_lastCall = t481_now;
				t481_clickedSectionId = t481_highlightNavLinks(t481_navLinks,t481_sections,t481_sectionIdTonavigationLink,t481_clickedSectionId,t481_offsetTop);
		}
	});
}

function t481_getSectionByHref (curlink) {
	if (curlink.is('[href*="#rec"]')) { return $(".r[id='"+curlink.attr("href").substring(1)+"']"); }
	else { return $(".r[data-record-type='215']").has("a[name='"+curlink.attr("href").substring(1)+"']"); }
}

function t481_highlightNavLinks(t481_navLinks,t481_sections,t481_sectionIdTonavigationLink,t481_clickedSectionId,offsetTop) {	                                                      
	var t481_scrollPosition = $(window).scrollTop(),
		t481_valueToReturn = t481_clickedSectionId;
	$(t481_sections).each(function(e) {
			var t481_curSection = $(this),
					t481_sectionTop = t481_curSection.offset().top,
					t481_id = t481_curSection.attr('id'),
					t481_navLink = t481_sectionIdTonavigationLink[t481_id];                                                 			                                                      
			if (t481_scrollPosition >= (t481_sectionTop - offsetTop) || (t481_sections[0].attr("id") == t481_id && $(window).scrollTop() >= $(document).height() - $(window).height())) {
				if (t481_clickedSectionId == null && !t481_navLink.hasClass('t-active')) {
					t481_navLinks.removeClass('t-active');
					t481_navLink.addClass('t-active');					
					t481_valueToReturn = null;
				} else {
					if (t481_clickedSectionId != null && t481_id == t481_clickedSectionId) {
						t481_valueToReturn = null;
					}
				}
				return false;
			}
	});
	return t481_valueToReturn;
}

function t481_setPath(){
}

function t481_setWidth(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t481").each(function() {
      var el=$(this);
      var left_exist=el.find('.t481__leftcontainer').length;
      var left_w=el.find('.t481__leftcontainer').outerWidth(true);
      var max_w=left_w;
      var right_exist=el.find('.t481__rightcontainer').length;
      var right_w=el.find('.t481__rightcontainer').outerWidth(true);
    var items_align=el.attr('data-menu-items-align');
      if(left_w<right_w)max_w=right_w;
      max_w=Math.ceil(max_w);
      var center_w=0;
      el.find('.t481__centercontainer').find('li').each(function() {
        center_w+=$(this).outerWidth(true);
      });
      //console.log(max_w);
      //console.log(center_w);
      var padd_w=40;
      var maincontainer_width=el.find(".t481__maincontainer").outerWidth(true);
      if(maincontainer_width-max_w*2-padd_w*2>center_w+20){
          //if(left_exist>0 && right_exist>0){
      if(items_align=="center" || typeof items_align==="undefined"){
            el.find(".t481__leftside").css("min-width",max_w+"px");
            el.find(".t481__rightside").css("min-width",max_w+"px");
            
          }
       }else{
          el.find(".t481__leftside").css("min-width","");
          el.find(".t481__rightside").css("min-width","");  
          
      }
    });
  }
}

function t481_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t481").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);             
      }
      });
      }else{
        $(".t481").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t481_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t481").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("visibility","visible");
                                el.animate({"opacity": "1"}, 200,function() {
                                });       
                            }
                          }else{
                            el.stop();
                            el.animate({"opacity": "0"}, 200,function() {
                            });
                            el.css("visibility","hidden");
                          }
                  }
           });
      }

}

function t481_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t481").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t481_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t481"),
      burger=el.find(".t481__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t481_opened")
  })
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
}

 
function t498_unifyHeights(recid) {
    $('#rec'+recid+' .t498 .t-container').each(function() {
        var t498__highestBox = 0;
        $('.t498__col', this).each(function(){
			var t498__curcol=$(this);
			var t498__curcolchild=t498__curcol.find('.t498__col-wrapper');
			if(t498__curcol.height() < t498__curcolchild.height())t498__curcol.height(t498__curcolchild.height());
            if(t498__curcol.height() > t498__highestBox)t498__highestBox = t498__curcol.height();
        });
        if($(window).width()>=960){
        	$('.t498__col',this).css('height', t498__highestBox);
        }else{
	        $('.t498__col',this).css('height', "auto");
        }
    });
};
 
function t570_init(recid){
if($(window).width()>750){
  t570_setMapHeight(recid);

  $(window).load(function() {
      t570_setMapHeight(recid);
  });

  $(window).resize(function(){
    t570_setMapHeight(recid);
  });
}
}

function t570_setMapHeight(recid) {
  var t570__el=$('#rec'+recid),
  	  t570__map = t570__el.find('.t-map');
  var t570__textwrapper = t570__el.find('.t570__col_text').height();
  t570__map.css('height', t570__textwrapper).trigger('sizechange');
} 
function t602_init(recid){
	var t602_lastCall,
			t602_timeoutId,
			t602_interval = 100;
	$(window).scroll( function() {
		var t602_now = new Date().getTime();
		if (t602_lastCall && t602_now < (t602_lastCall + t602_interval) ) {
				clearTimeout(t602_timeoutId);
				t602_timeoutId = setTimeout(function () {
						t602_lastCall = t602_now;
						t602_setProgressBarWidth(recid);
				}, t602_interval - (t602_now - t602_lastCall) );
		} else {
				t602_lastCall = t602_now;
				t602_setProgressBarWidth(recid);
		}
	});
}


function t602_setProgressBarWidth(recid) {
	var t602_windowScrollTop = $(window).scrollTop(),
			t602_docHeight = $(document).height(),
			t602_winHeight = $(window).height();
			t602_scrollPercent = (t602_windowScrollTop / (t602_docHeight-t602_winHeight)) * 100;
	$(".t602__indicator").css('width', t602_scrollPercent + '%');
}
 
function t604_init(recid) {  
  t604_imageHeight(recid);
  t604_arrowWidth(recid);
  t604_show(recid);
  t604_hide(recid);
  $(window).bind('resize', t_throttle(function(){
    t604_arrowWidth(recid);
  }, 200));
}

function t604_show(recid) {  
  var el=$("#rec"+recid),
      play = el.find('.t604__play');
  play.click(function(){
    if($(this).attr('data-slider-video-type')=='youtube'){
      var url = $(this).attr('data-slider-video-url');
      $(this).next().html("<iframe class=\"t604__iframe\" width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/"+url+"?autoplay=1\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");
    }
    if($(this).attr('data-slider-video-type')=='vimeo'){
      var url = $(this).attr('data-slider-video-url');
      $(this).next().html("<iframe class=\"t604__iframe\" width=\"100%\" height=\"100%\" src=\"https://player.vimeo.com/video/"+url+"?autoplay=1\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>");
    }
    $(this).next().css('z-index', '3');
  });
}

function t604_hide(recid) {  
  var el=$("#rec"+recid),
      body = el.find('.t604__frame');
  el.on('updateSlider', function(){
    body.html('').css('z-index', '');
  });
}

function t604_imageHeight(recid) {  
  var el=$("#rec"+recid); 
  var image = el.find(".t604__separator");
  image.each(function() {
    var width = $(this).attr("data-slider-image-width");
    var height = $(this).attr("data-slider-image-height"); 
    var ratio = height/width;
    var padding = ratio*100;      
    $(this).css("padding-bottom",padding+"%");    
  });
}

function t604_arrowWidth(recid) {  
  var el=$("#rec"+recid),
      arrow = el.find('.t-slds__arrow_wrapper'),
      slideWidth = el.find('.t-slds__wrapper').width(),
      windowWidth = $(window).width(),
      arrowWidth = windowWidth-slideWidth;
  if(windowWidth>960){
    arrow.css('width', arrowWidth/2);
  } else {
    arrow.css('width', '');
  }
} 
function t635_init(recid) {
    var el = $("#rec" + recid);
    var data = el.find(".t635__textholder");
    var animRecId = data.attr("data-recid");
    var screenmin = parseInt($("#rec" + animRecId).attr("data-screen-min"), 10);
    var screenmax = parseInt($("#rec" + animRecId).attr("data-screen-max"), 10);

    if (isNaN(screenmax) && isNaN(screenmin)) {
        t635_startType(recid);
    } else if (!isNaN(screenmax) && !isNaN(screenmin)) {
        if ($(window).width() >= screenmin && $(window).width() <= screenmax) {
            t635_startType(recid);
        }
    } else if (!isNaN(screenmax)) {
        if ($(window).width() <= screenmax) {
            t635_startType(recid);
        }
    } else if (!isNaN(screenmin)) {
        if ($(window).width() >= screenmin) {
            t635_startType(recid);
        }
    }
}

function t635_startType(recid) {
    var t635_el = $('#rec' + recid),
        t635_data = t635_el.find(".t635__textholder"),
        t635_animRecId = t635_data.attr("data-recid"),
        t635_animText = t635_findAnimElem(t635_animRecId),
        t635_phrasesList = [],
        t635_phrase1 = t635_data.attr("data-text1"),
        t635_phrase2 = t635_data.attr("data-text2"),
        t635_phrase3 = t635_data.attr("data-text3"),
        t635_phrase4 = t635_data.attr("data-text4"),
        t635_phrase5 = t635_data.attr("data-text5"),
        t635_speed = t635_data.attr("data-speed"),
        t635_loop = t635_data.attr("data-loop"),
        t635_backspaceDelay = t635_data.attr("data-backspacing-delay");
    if (typeof t635_animText == "undefined") {
        return;
    }
    if (typeof t635_phrase1 != "undefined") {
        t635_phrasesList.push(t635_phrase1.slice(0, 80));
    }
    if (typeof t635_phrase2 != "undefined") {
        t635_phrasesList.push(t635_phrase2.slice(0, 80));
    }
    if (typeof t635_phrase3 != "undefined") {
        t635_phrasesList.push(t635_phrase3.slice(0, 80));
    }
    if (typeof t635_phrase4 != "undefined") {
        t635_phrasesList.push(t635_phrase4.slice(0, 80));
    }
    if (typeof t635_phrase5 != "undefined") {
        t635_phrasesList.push(t635_phrase5.slice(0, 80));
    }

    if (t635_animText.length !== 0 && t635_phrasesList.length !== 0) {
        var t635_animTextHtml = t635_animText.html(),
            t635_animTextSplitted = t635_animTextHtml.split("|"),
            t635_curWin = $(window);
        t635_animText.html(t635_animTextSplitted[0] + "<span class=\"t635__typing-text\"></span>" + t635_animTextSplitted[1]);

        t635_updateAnimTextLimits(t635_animRecId);
        t635_curWin.bind('resize', t_throttle(function () {
            t635_updateAnimTextLimits(t635_animRecId);
        }, 200));
        var intervalUpdate = setInterval(function () {
            t635_updateAnimTextLimits(t635_animRecId);
        }, 5000);

        var t635_animatedText = $("#rec" + t635_animRecId + " .t635__typing-text"),
            t635_animTextTop = t635_animatedText.attr("data-top-limit"),
            t635_animTextBottom = t635_animatedText.attr("data-bottom-limit"),
            t635_winTop = t635_curWin.scrollTop(),
            t635_winBottom = t635_winTop + t635_curWin.height();
        t635_animateText(t635_animRecId, t635_phrasesList, t635_speed, t635_loop, t635_backspaceDelay);
        if (t635_animTextBottom < t635_winTop || t635_animTextTop > t635_winBottom) {
            $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').pauseTyping();
            $("#rec" + t635_animRecId + " .t635__typing-text").html("");
        }

        t635_curWin.bind('scroll', t_throttle(function () {
            t635_animTextTop = t635_animatedText.attr("data-top-limit");
            t635_animTextBottom = t635_animatedText.attr("data-bottom-limit");
            t635_winTop = t635_curWin.scrollTop();
            t635_winBottom = t635_winTop + t635_curWin.height();
            if (t635_animTextBottom < t635_winTop || t635_animTextTop > t635_winBottom) {
                $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').pauseTyping();
                $("#rec" + t635_animRecId + " .t635__typing-text").html("");
            } else {
                $("#rec" + t635_animRecId + " .t635__typing-text").data('typed').continueTyping();
            }
        }, 200));
    }
}

function t635_findAnimElem(animRecId) {
    var animRec = $("#rec" + animRecId);
    var animH1 = animRec.find("h1:contains(\'|\')").last();
    var animH2 = animRec.find("h2:contains(\'|\')").last();
    var animH3 = animRec.find("h3:contains(\'|\')").last();
    var animDiv = animRec.find("div:contains(\'|\')").last();
    if (typeof animH1 != "undefined" && animH1.length > 0) {
        return animH1;
    }
    if (typeof animH2 != "undefined" && animH2.length > 0) {
        return animH2;
    }
    if (typeof animH3 != "undefined" && animH3.length > 0) {
        return animH3;
    }
    if (typeof animDiv != "undefined" && animDiv.length > 0) {
        return animDiv;
    }
}

function t635_updateAnimTextLimits(t635_animRecId) {
    var t635_animatedBlock = $("#rec" + t635_animRecId),
        t635_animatedText = t635_animatedBlock.find(".t635__typing-text");
    if (typeof t635_animatedText.offset() != 'undefined') {
        t635_animatedText.attr("data-top-limit", t635_animatedText.offset().top);
        t635_animatedText.attr("data-bottom-limit", (t635_animatedBlock.offset().top + t635_animatedBlock.height()));
    }
}

function t635_animateText(t635_animRecId, t635_phrasesList, t635_speed, t635_loop, t635_backspaceDelay) {
    if (typeof t635_speed == "undefined") {
        t635_speed = 40;
    }
    if (typeof t635_backspaceDelay == "undefined") {
        t635_backspaceDelay = 800;
    }
    if (typeof t635_loop == "undefined") {
        t635_loop = true;
    } else {
        t635_loop = false;
    }
    $("#rec" + t635_animRecId + " .t635__typing-text").typed({
        strings: t635_phrasesList,
        typeSpeed: t635_speed * 1,
        startDelay: 600,
        backSpeed: 10,
        backDelay: t635_backspaceDelay * 1,
        loop: t635_loop,
        contentType: 'text'
    });
} 
function t678_onSuccess(t678_form){
	var t678_inputsWrapper = t678_form.find('.t-form__inputsbox');
    var t678_inputsHeight = t678_inputsWrapper.height();
    var t678_inputsOffset = t678_inputsWrapper.offset().top;
    var t678_inputsBottom = t678_inputsHeight + t678_inputsOffset;
	var t678_targetOffset = t678_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t678_target = t678_targetOffset - 200;
    }	else {
        var t678_target = t678_targetOffset - 100;
    }

    if (t678_targetOffset > $(window).scrollTop() || ($(document).height() - t678_inputsBottom) < ($(window).height() - 100)) {
        t678_inputsWrapper.addClass('t678__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);		
    } else {
        $('html, body').animate({ scrollTop: t678_target}, 400);
        setTimeout(function(){t678_inputsWrapper.addClass('t678__inputsbox_hidden');}, 400);
    }

	var successurl = t678_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

}

 
function t690_onSuccess(t690_form){
	var t690_inputsWrapper = t690_form.find('.t-form__inputsbox');
    var t690_inputsHeight = t690_inputsWrapper.height();
    var t690_inputsOffset = t690_inputsWrapper.offset().top;
    var t690_inputsBottom = t690_inputsHeight + t690_inputsOffset;
	var t690_targetOffset = t690_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t690_target = t690_targetOffset - 200;
    }	else {
        var t690_target = t690_targetOffset - 100;
    }

    if (t690_targetOffset > $(window).scrollTop() || ($(document).height() - t690_inputsBottom) < ($(window).height()-100)) {
        t690_inputsWrapper.addClass('t690__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);                                                                                                                           
    } else {
        $('html, body').animate({ scrollTop: t690_target}, 400);
        setTimeout(function(){t690_inputsWrapper.addClass('t690__inputsbox_hidden');}, 400);
    }
                                                                                                                           
	var successurl = t690_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }
                                                                                                                           
} 
function t702_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');

    el.bind('scroll', t_throttle(function () {
        if (window.lazy == 'y') { t_lazyload_update(); }
    }));

    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function (e) {
            t702_showPopup(recid);
            t702_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7);
                }
                Tilda.sendEventToStatistics(analitics, virtTitle);
            }
        });
    }
}

function t702_onSuccess(t702_form){
	var t702_inputsWrapper = t702_form.find('.t-form__inputsbox');
    var t702_inputsHeight = t702_inputsWrapper.height();
    var t702_inputsOffset = t702_inputsWrapper.offset().top;
    var t702_inputsBottom = t702_inputsHeight + t702_inputsOffset;
	var t702_targetOffset = t702_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t702_target = t702_targetOffset - 200;
    }	else {
        var t702_target = t702_targetOffset - 100;
    }

    if (t702_targetOffset > $(window).scrollTop() || ($(document).height() - t702_inputsBottom) < ($(window).height() - 100)) {
        t702_inputsWrapper.addClass('t702__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);
    } else {
        $('html, body').animate({ scrollTop: t702_target}, 400);
        setTimeout(function(){t702_inputsWrapper.addClass('t702__inputsbox_hidden');}, 400);
    }

	var successurl = t702_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

}


function t702_lockScroll(){
  var body = $("body");
	if (!body.hasClass('t-body_scroll-locked')) {
		var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.addClass('t-body_scroll-locked');
		body.css("top","-"+bodyScrollTop+"px");
    body.attr("data-popup-scrolltop",bodyScrollTop);
	}
}

function t702_unlockScroll(){
  var body = $("body");
	if (body.hasClass('t-body_scroll-locked')) {
    var bodyScrollTop = $("body").attr("data-popup-scrolltop");
		body.removeClass('t-body_scroll-locked');
		body.css("top","");
    body.removeAttr("data-popup-scrolltop")
		window.scrollTo(0, bodyScrollTop);
	}
}


function t702_showPopup(recid){
  var el=$('#rec'+recid),
      popup = el.find('.t-popup');

  popup.css('display', 'block');
  el.find('.t-range').trigger('popupOpened');
  if(window.lazy=='y'){t_lazyload_update();}
  setTimeout(function() {
    popup.find('.t-popup__container').addClass('t-popup__container-animated');
    popup.addClass('t-popup_show');
  }, 50);

  $('body').addClass('t-body_popupshowed t702__body_popupshowed');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    setTimeout(function() {
      t702_lockScroll();
    }, 500);
  }
  el.find('.t-popup').mousedown(function(e){
    var windowWidth = $(window).width();
    var maxScrollBarWidth = 17;
    var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
    if(e.clientX > windowWithoutScrollBar) {
        return;
    }  
    if (e.target == this) { t702_closePopup(recid); }
  });

  el.find('.t-popup__close').click(function(e){
    t702_closePopup(recid);
  });

  el.find('a[href*="#"]').click(function(e){
    var url = $(this).attr('href');
    if (!url || url.substring(0,7) != '#price:') {
      t702_closePopup(recid);
      if (!url || url.substring(0,7) == '#popup:') {
        setTimeout(function() {
          $('body').addClass('t-body_popupshowed');
        }, 300);
      }
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t702_closePopup(recid); }
  });
}

function t702_closePopup(recid){
    $('body').removeClass('t-body_popupshowed t702__body_popupshowed');
    $('#rec' + recid + ' .t-popup').removeClass('t-popup_show');
  /*fix IOS11 cursor bug + general IOS background scroll*/
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
    t702_unlockScroll();
  }  
  setTimeout(function() {
    $('.t-popup').not('.t-popup_show').css('display', 'none');
  }, 300);
}

function t702_resizePopup(recid){
  var el = $("#rec"+recid),
      div = el.find(".t-popup__container").height(),
      win = $(window).height() - 120,
      popup = el.find(".t-popup__container");
  if (div > win ) {
    popup.addClass('t-popup__container-static');
  } else {
    popup.removeClass('t-popup__container-static');
  }
}
/* deprecated */
function t702_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
      popupname = popupname.substring(7);
  }

  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }

    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
} 
$btnpaysubmit = false;

/* new block */
$(document).ready(function() {
    window.tildaGetPaymentForm = function (price, product, paysystem, blockid, lid, uid) {
        var $allrecords = $('#allrecords');
        var formnexturl = 'htt'+'ps://forms.tildacdn'+'.com/payment/next/';
        var virtPage = '/tilda/'+blockid+'/payment/';
        var virtTitle = 'Go to payment from '+blockid;

        if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
            Tilda.sendEventToStatistics(virtPage, virtTitle, product, price);
        }

        
        $.ajax ({
            type: "POST",
            url: formnexturl /*$(this).attr('action')*/,
            data: {
                projectid: $allrecords.data('tilda-project-id'),
                formskey: $allrecords.data('tilda-formskey'),
                price: price,
                product: product,
                system: paysystem,
                recid: blockid,
                lid: lid ? lid : '',
                uid: uid ? uid : ''
            },
            dataType : "json",
            success: function(json){
                $btnpaysubmit.removeClass('t-btn_sending');
                tildaBtnPaySubmit = '0';
                
                /* если нужно переслать данные дальше, в платежную систему */
                if (json && json.next && json.next.type > '') {
                    var res = window.tildaForm.payment($('#'+blockid), json.next);
                    successurl = '';
                    return false;
                }
                
            },
            fail: function(error){
                var txt;
                $btnpaysubmit.removeClass('t-btn_sending');
                tildaBtnPaySubmit = '0';

                if (error && error.responseText>'') {
                    txt = error.responseText+'. Please, try again later.';
                } else {
                    if (error && error.statusText) {
                        txt = 'Error ['+error.statusText+']. Please, try again later.';
                    }else {
                        txt = 'Unknown error. Please, try again later.';
                    }
                }
                alert(txt);
            },
            timeout: 10*1000
        });
        
    };
    
    if (typeof tcart__cleanPrice == 'undefined') {
        function tcart__cleanPrice (price) {
            if (typeof price=='undefined' || price=='' || price==0) {
                price=0;
            } else {
                price = price.replace(',','.');
                price = price.replace(/[^0-9\.]/g,'');
                price = parseFloat(price).toFixed(2);
                if(isNaN(price)) { price=0; }
                price = parseFloat(price);
                price = price*1;
                if (price<0) { price=0; }
            }
            return price;
        }
    }
                             
    if (typeof tcart__escapeHtml == 'undefined') {
        function tcart__escapeHtml(text) {
            var map = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[<>"']/g, function(m) { return map[m]; });
        }
    }

    if ($('.js-payment-systembox').length > 0) {
        var tildaBtnPaySubmit = '0';
        $('a[href^="#order"]').off('dblclick');
        $('a[href^="#order"]').off('click');
        $('a[href^="#order"]').click(function(e){
            e.preventDefault();

            // защита от поаторной отправки
            if (tildaBtnPaySubmit == '1') {
                return false;
            }

            if ($('.t706').length > 0) {
                console.log('Conflict error: there are two incompatible blocks on the page: ST100 and ST105. Please go to Tilda Editor and delete one of these blocks.');
                return false;
            }
            
            $btnpaysubmit = $(this);
            $btnpaysubmit.addClass('t-btn_sending');
            tildaBtnPaySubmit = '1'

            var tmp = $(this).attr('href');
            var arParam, price=0, product='', lid='', uid='';
            if (tmp.substring(0,7) == '#order:') {
                // format:  #order:Product name=Cost
                tmp = tmp.split(':');
                arParam = tmp[1].split('=');
                price = tcart__cleanPrice(arParam[1]);
                product = tcart__escapeHtml(arParam[0]);
            } else {
                var pel=$(this).closest('.js-product');
                if(typeof pel!='undefined') {
                    if(product==''){
                            product=pel.find('.js-product-name').text();
                            if (typeof product=='undefined') { product='' };
                    }
                    if(price=='' || price==0){
                        price = pel.find('.js-product-price').text();
                        price = tcart__cleanPrice(price);
                    }
                    lid = pel.data('product-lid') || '';
                    uid = pel.data('product-uid') || pel.data('product-gen-uid') || '';

                    var optprice = 0;
                    var options=[];
                    pel.find('.js-product-option').each(function() {
                        var el_opt=$(this);
                        var op_option=el_opt.find('.js-product-option-name').text();
                        var op_variant=el_opt.find('option:selected').val();
                        var op_price=el_opt.find('option:selected').attr('data-product-variant-price');
                        op_price = tcart__cleanPrice(op_price);
                        
                        if(typeof op_option!='undefined' && typeof op_variant!='undefined'){
                            var obj={};
                            if(op_option!=''){
                                op_option = tcart__escapeHtml(op_option);
                            }
                            if(op_variant!=''){
                                op_variant = tcart__escapeHtml(op_variant);
                                op_variant = op_variant.replace(/(?:\r\n|\r|\n)/g, '');
                            }
                            if(op_option.length>1 && op_option.charAt(op_option.length-1)==':'){
                                op_option=op_option.substring(0,op_option.length-1);
                            }
                            
                            optprice = optprice + parseFloat(op_price);
                            options.push(op_option + '=' + op_variant);
                        }
                    });			

                    if (options.length > 0) {
                        product = product + ': '+options.join(', ');
                        /* price = parseFloat(optprice); */
                    }
                }
            }
            var $parent = $(this).parent();
            var blockid = $(this).closest('.r').attr('id');
            var $paysystems= $('.js-dropdown-paysystem .js-payment-system');
            
            if (!product) {
                var tmp=$(this).closest('.r').find('.title');
                if (tmp.length > 0) {
                    product = tmp.text();
                } else {
                    product = $(this).text();
                }
            }

            if ($paysystems.length == 0) {
                alert('Error: payment system is not assigned. Add payment system in the Site Settings.');
                $btnpaysubmit.removeClass('t-btn_sending');
                tildaBtnPaySubmit = '0';
                return false;
            }
            if ($paysystems.length == 1) {
                tildaGetPaymentForm(price, product, $paysystems.data('payment-system'), blockid, lid, uid);
            } else {
                var $jspaybox = $('.js-payment-systembox');
                if ( $jspaybox.length > 0) {
                    var $linkelem = $(this);
                    var offset = $linkelem.offset();
                    $jspaybox.css('top',offset.top+'px');
                    $jspaybox.css('left',offset.left+'px');
                    $jspaybox.css('margin-top','-45px');
                    $jspaybox.css('margin-left','-25px');
                    $jspaybox.css('position','absolute');
                    $jspaybox.css('z-index','9999999');
                    $jspaybox.appendTo($('body'));
                    $(window).resize(function(){
                        if ($jspaybox.css('display')=='block' && $linkelem) {
                            offset = $linkelem.offset();
                            $jspaybox.css('top',offset.top+'px');
                            $jspaybox.css('left',offset.left+'px');
                        }
                    });
                    /*
                    $jspaybox.css('margin-top','-45px');
                    $($parent).css('position','relative');
                    $jspaybox.appendTo($parent);
                    */
                    $jspaybox.show();
                    /*
                    var parentoffset = $(this).offset();
                    var payboxoffset = $jspaybox.offset();
                    if (parentoffset.top > parseInt(payboxoffset.top) + parseInt($jspaybox.height())) {
                        var margintop = parseInt(parentoffset.top)+parseInt($(this).height())-parseInt(payboxoffset.top)-parseInt( $jspaybox.height());
                        $jspaybox.css('margin-top', margintop+'px');
                    }
                    */
                    
                    function hideList() {
                        $btnpaysubmit.removeClass('t-btn_sending');
                        tildaBtnPaySubmit = '0';

                        $jspaybox.hide(); 
                        $('.r').off('click', hideList); 
                        return false; 
                    }
                    $('.r').click(hideList);

                    $('.js-payment-systembox a').off('dblclick');
                    $('.js-payment-systembox a').off('click');
                    $('.js-payment-systembox a').click(function(e){
                        e.preventDefault();
                        $jspaybox.hide();
                        $linkelem = false;
                        tildaGetPaymentForm(price, product, $(this).data('payment-system'), blockid, lid, uid);
                        return false;
                    });
                }
            }

            return false;
        });
    }

});
 
function t796_init(recid) {
    var el = $("#rec" + recid);
    var shapeEl = el.find(".t796__shape-border");
    var recs = el.find(".t796").attr("data-shape-rec-ids");

    if (typeof recs != "undefined") {
        recs = recs.split(",");
        /* append to certain blocks */
        recs.forEach(function(rec_id, i, arr) {
            var curRec = $("#rec" + rec_id);
            var curShapeEl = shapeEl.clone();
            t796_setColor(el,curShapeEl);
            t796_addDivider(curRec, curShapeEl);
        });
    } else {
        var excludes = "[data-record-type='215'],[data-record-type='706'],[data-record-type='651'],[data-record-type='825'],[data-record-type='708']";

        if (shapeEl.hasClass('t796__shape-border_top') || shapeEl.hasClass('t796__shape-border_top-flip')) {
            var curRec = el.next(".r");
            if (curRec.is(excludes)) {
                curRec = curRec.next(".r");
            }
        }

        if (shapeEl.hasClass('t796__shape-border_bottom') || shapeEl.hasClass('t796__shape-border_bottom-flip')) {
            var curRec = el.prev(".r");
            if (curRec.is(excludes)) {
                curRec = curRec.prev(".r");
            }
        }

        if (curRec.length != 0) {
            var curShapeEl = shapeEl.clone();
            t796_setColor(el, curShapeEl);
            t796_addDivider(curRec, curShapeEl);
        }
    }
}


function t796_addDivider(curRec, curShapeEl) {
    curRec.attr("data-animationappear","off").removeClass('r_hidden');
    var coverWrapper = curRec.find(".t-cover");
    var zeroWrapper = curRec.find(".t396");
    if (coverWrapper.length > 0 || zeroWrapper.length > 0) {
        /* if cover or zero */
        if (coverWrapper.length > 0) {
            coverWrapper.find(".t-cover__filter").after(curShapeEl);
        }
        if (zeroWrapper.length > 0) {
           zeroWrapper.after(curShapeEl);
           curRec.css("position", "relative");
        }
        curShapeEl.css("display", "block");
    } else {
        /*if any block*/
        var wrapper = curRec;
        var curRecType = curRec.attr("data-record-type");
        if (wrapper.length == 0) {
            return true;
        }
        wrapper.append(curShapeEl);
        wrapper.css("position", "relative");
        if (curRecType != "554" && curRecType != "125") {
            wrapper.children("div").first().css({
                "position": "relative",
                "z-index": "1"
            }).addClass("t796_cont-near-shape-divider");
        }
        if (curRecType == "734" || curRecType == "675" || curRecType == "279" || curRecType == "694" || curRecType == "195") {
            curShapeEl.css("z-index", "1");
        }
        curShapeEl.css("display", "block");
    }
}


function t796_setColor(el,curShapeEl) {
    /* get color from nearest block, if it is not set for curShape */
    if (typeof curShapeEl.attr("data-fill-color") != "undefined") {
        return;
    }

    if (curShapeEl.hasClass("t796__shape-border_bottom") || curShapeEl.hasClass("t796__shape-border_bottom-flip")) {
        var nearestBlock = el.next(".r");
    } else {
        var nearestBlock = el.prev(".r");
    }

    if (nearestBlock.length == 0) {
        return;
    }

    var fillColor = nearestBlock.attr("data-bg-color");
    if (typeof fillColor == "undefined") {
        return;
    }

    curShapeEl.find(".t796__svg").css("fill",fillColor);
}
 
function t802_insta_init(recid,instauser){
    var projectid=$('#allrecords').attr('data-tilda-project-id');
    t802_insta_loadflow(recid,projectid,instauser);
}

function t802_insta_loadflow(recid,projectid,instauser){
    if (instauser == '') {
        var url = "https://insta.tildacdn.com/fish/0.json";
    } else {
        var url = "https://insta.tildacdn.com/json/project"+projectid+"_"+instauser+".json";
    }

    $.ajax({
      type: "GET",
      url: url,
      dataType : "json",
      success: function(data){
            if(typeof data=='object'){
                t802_insta_draw(recid,data);
            }else{
                console.log('error. insta flow json not object');
                console.log(data);
            }
      },
      error: function(){
          console.log('error load instgram flow');
      },
      timeout: 1000*90
    });       
}

function t802_insta_draw(recid,obj){
	if(typeof obj.photos=='undefined'){return;}
	$.each(obj.photos, function(index, item) {
	    t802_insta_drawItem(recid,obj.username,item);
	});		
}

function t802_insta_drawItem(recid,username,item){
    var emptyEl = $("#rec"+recid).find(".t802__imgwrapper_empty").first();
    if (emptyEl.length > 0) {
        emptyEl.removeClass("t802__imgwrapper_empty");
        emptyEl.append('<div class="t802__bgimg" style="background-image:url('+item.url+')"></div>');
        emptyEl.wrap('<a href="'+item.link+'" target="_blank"></a>');
        
        /*add text and filter for hover*/
        var hoverEl = emptyEl.find(".t802__hover-wrapper");
        if (hoverEl.length > 0 && isMobile == false) {
            var text = t802_insta_cropText(recid,'@'+username+': '+item.text);
            hoverEl.append('<div class="t802__hover-filter"></div>');
            hoverEl.append('<div class="t802__text t-text t-descr_xxs">'+text+'</div>');
        }
    }
}

function t802_insta_cropText(recid,text){
    var colsInLine = $("#rec"+recid).find("[data-cols-in-line]").attr("data-cols-in-line");
    if (colsInLine == 6) {
        var maxLength = 90;
    } else {
        var maxLength = 130;    
    }
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        text = text.substring(0, Math.min(maxLength,text.lastIndexOf(" ")));
        text += ' ...';
    }
    return text;
} 
function t807__init(recid) {
  tvote__init(recid);
  var testWrap = $('#rec' + recid);

  $('#rec'+recid).find('.t-vote').bind('tildavote:numberschanged',function(){
    $(".js-vote-item").each(function() {
        var percentage = $(this).find(".t-vote__btn-res__percent");
        if (typeof percentage != "undefined") {
            var bar = $(this).find(".t807__answer-progressbar");
            bar.css("width",percentage.html());
        }
    })
  });

  $('#rec'+recid).find('.t-vote').bind('tildavote:resultsended',function(){
    if (!$(this).hasClass('t-vote_sended') || $(this).hasClass('t807__hidden')) {
      return;
    }
    
    $(this).addClass('t807__hidden');

    if (!$(this).attr('data-vote-visibility') && $(this).hasClass('t807__test')) {
      t807__onSuccess(recid);
    }

  });

  t807__replyClickBtn(recid);
}

function t807__replyClickBtn(test) {
    var testBlock = $('#rec' + test);
    var replyBtn = testBlock.find('.t807__btn_reply');

    replyBtn.on('click', function (e) {
        e.preventDefault();
    });
}


function t807__onSuccess(test) {
  var testBlock = $('#rec' + test).find('.t807__test');
  var t807_targetOffset = testBlock.offset().top;

  if ($(window).width()>960) {
    var t807_target = t807_targetOffset - 200;
  } else {
    var t807_target = t807_targetOffset - 100;
  }

  $('html, body').animate({ scrollTop: t807_target}, 400);
}
 
function t825_initPopup(recid) {
  var rec = $('#rec' + recid);
  $('#rec' + recid).attr('data-animationappear', 'off');
  $('#rec' + recid).css('opacity', '1');
  var el = $('#rec' + recid).find('.t825__popup');
  var analitics = el.attr('data-track-popup');
  var hook="TildaSendMessageWidget" + recid;
  var obj = $('#rec' + recid + ' .t825__btn');

  obj.click(function(e) {
    if (obj.hasClass('t825__btn_active')) {
  		t825_closePopup(rec);
  		return;
	}
  obj.addClass('t825__btn_active');
	$('#rec' + recid + ' .t825').addClass('t825_active');
    t825_showPopup(recid);
    e.preventDefault();
    if (analitics > '') {
        Tilda.sendEventToStatistics(analitics, hook);
    }
  });

  if(window.lazy == 'y'){t_lazyload_update();}
}


function t825_showPopup(recid) {
  var el = $('#rec' + recid);
  var popup = el.find('.t825__popup');

  el.find('.t825__btn_wrapper').removeClass('t825__btn_animate');
  el.find('.t825__btn-text').css('display','none');
  if ($(window).width() < 960) { $('body').addClass('t825__body_popupshowed'); }

  popup.css('display', 'block');
  setTimeout(function() {
    popup.addClass('t825__popup_show');
  }, 50);

  el.find('.t825__mobile-icon-close').click(function(e) { t825_closePopup(el); });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) { t825_closePopup(el); }
  });

  if(window.lazy == 'y'){t_lazyload_update();}
}

function t825_closePopup(rec) {
  if ($(window).width() < 960) { $('body').removeClass('t825__body_popupshowed'); }
  rec.find('.t825').removeClass('t825_active');
  rec.find('.t825__btn').removeClass('t825__btn_active');
  rec.find('.t825__popup').removeClass('t825__popup_show');
  setTimeout(function() {
    rec.find('.t825__popup').not('.t825__popup_show').css('display', 'none');
  }, 300);
}

function t825_sendPopupEventToStatistics(popupname) {
  var virtPage = '/tilda/popup/';
  var virtTitle = 'Popup: ';
  if (popupname.substring(0,7) == '#popup:') {
    popupname = popupname.substring(7);
  }

  virtPage += popupname;
  virtTitle += popupname;
  if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
    Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
  } else {
    if(ga) {
      if (window.mainTracker != 'tilda') {
        ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTitle});
      }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
      window[window.mainMetrika].hit(virtPage, {title: virtTitle,referer: window.location.href});
    }
  }
}
 
function t826_init(recid) {
    t826_startAnimation(recid);

    var t826__smartResize;

    window.addEventListener("resize", function () {
        if (!$isMobile) {
            clearTimeout(t826__smartResize);
            t826__smartResize = setTimeout(function () {
                $("div:not(.t826__animation) > div[data-galaxy-id=" + recid + "]").remove();
                t826_startAnimation(recid);
            }, 500);
        }
    }, !1);

    window.addEventListener("orientationchange", function () {
        if ($isMobile) {
            clearTimeout(t826__smartResize);
            t826__smartResize = setTimeout(function () {
                $("div:not(.t826__animation) > div[data-galaxy-id=" + recid + "]").remove();
                t826_startAnimation(recid);
            }, 500);
        }
    }, !1);
    
    $('.t826').bind('displayChanged', function() {
        $("div:not(.t826__animation) > div[data-galaxy-id=" + recid + "]").remove();
        t826_startAnimation(recid);
    });
}

function t826_startAnimation(recid) {
    var el = $("#rec" + recid);
    var GalaxyEl = el.find(".t826__galaxy");
    var wr = el.find(".t826");
    var recs = wr.attr("data-galaxy-rec-ids");
    var wholepage = wr.attr("data-galaxy-whole-page");
    var vertFlip = wr.attr("data-galaxy-vflip");
    var color = wr.attr("data-element-color");
    var opacity = wr.attr("data-element-opacity");
    var options = {
        'color': (color === "" ? "#fff" : color),
        'opacity': (opacity === "" ? 1 : opacity.replace(/^0?.([0-9])0?$/g, ".$1"))
    };
    
    if(options.color.indexOf('#') !== -1) {
        var color = options.color;
        if (color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
            options.color = "#" + color[1] + color[3] + color[5];
        }
    }

    if (vertFlip === "yes") {
        GalaxyEl.addClass("t826__galaxy_flip");
    }

    if ($("#allrecords").attr("data-tilda-mode") === "edit") {
        t826_addAnimation(el.find(".t826__demo"), GalaxyEl, options);
        return;
    }

    if (typeof recs !== "undefined") {
        recs = recs.split(",");
        /* append to certain blocks */
        recs.forEach(function (rec, index, array) {
            var curRec = $("#rec" + rec);
            var curGalaxyEl = GalaxyEl.clone().css("position", "absolute");
            t826_addAnimation(curRec, curGalaxyEl, options);
        });
    } else {
        var nextBlock = el.next(":has(.t-cover)");
        var prevBlock = el.prev(":has(.t-cover)");
        var curGalaxyEl = GalaxyEl.clone().css("position", "absolute");
        if (nextBlock.length !== 0) {
            t826_addAnimation(nextBlock, curGalaxyEl, options);
        } else if (prevBlock.length !== 0) {
            t826_addAnimation(prevBlock, curGalaxyEl, options);
        }
    }

    if (wholepage === "yes") {
        el.find(".t826__animation").css("display", "block");
        t826_addAnimation($("#allrecords"), GalaxyEl.css("position", "fixed"), options);
    }
}

function t826_addAnimation(curRec, GalaxyEl, options) {
    curRec.attr("data-animationappear", "off").removeClass('r_hidden');

    var curRecType = curRec.attr("data-record-type");
    var curRecId = curRec.attr("id");

    if (curRecType === "396") {
        /*if zero block*/
        curRec.find(".t396__filter").after(GalaxyEl);
        GalaxyEl.css("z-index", "0");
    } else if (curRecId === "allrecords") {
        GalaxyEl.css("z-index", "-1");
    } else {
        var coverWrapper = curRec.find(".t-cover");
        if (coverWrapper.length > 0) {
            /*if cover*/
            coverWrapper.find(".t-cover__filter").after(GalaxyEl);
            GalaxyEl.css("z-index", "0");
        } else {
            /*if any block*/
            var wrapper = curRec;
            if (wrapper.length === 0) {
                return true;
            }
            wrapper.append(GalaxyEl);
            wrapper.css("position", "relative");
            wrapper.children("div").first().css({
                "position": "relative",
                "z-index": "1"
            });
            if (curRecType == "734" || curRecType == "675") {
                return;
            }
            GalaxyEl.css("z-index", "0");
            if (curRecType == "754" || curRecType == "776" || curRecType == "778" || curRecType == "786") {
                wrapper.children("div").first().css({
                    "z-index": ""
                });
                GalaxyEl.css("z-index", "-1");
            }
        }
    }

    t826_runningAnimation(curRec, options);
}

function t826_runningAnimation(curRec, options) {
    var starsSetting;
    if(!window.isMobile) {
        starsSetting = [{
            name: "near",
            count: 100,
            speed: 50
        }, {
            name: "mid",
            count: 200,
            speed: 100
        }, {
            name: "far",
            count: 700,
            speed: 150
        }];
    } else {
        starsSetting = [{
            name: "near",
            count: 25,
            speed: 50
        }, {
            name: "mid",
            count: 500,
            speed: 100
        }, {
            name: "far",
            count: 175,
            speed: 150
        }];
    }

    var curRecId = curRec.attr("id");
    var maxHeight = curRec.outerHeight();
    var maxWidth = curRec.outerWidth();

    if (typeof curRecId === "undefined") {
        curRecId = "demo";
    } else if (curRecId === "allrecords") {
        maxHeight = $(window).height();
        maxWidth = $(window).width();
    }

    var animationName = "t826__galaxy-" + curRecId;
    curRec.find("#" + animationName).remove();

    var newStyle = document.createElement("style");
    newStyle.id = animationName;
    newStyle.innerHTML = "@keyframes " + animationName + "{" +
        "to{" +
            "transform:translateY(" + (-maxHeight) + "px)" +
        "}" +
    "}";

    starsSetting.forEach(function (value, index, array) {
        var x = Math.round(Math.random() * maxHeight);
        var y = Math.round(Math.random() * maxWidth);
        var dot = "";

        if(options.color.indexOf('#') !== -1) {
            dot = x + "px " + y + "px";
        } else {
            if (options.opacity < 1) {
                dot = x + "px " + y + "px rgba(" + options.color + "," + options.opacity + ")";
            } else {
                dot = x + "px " + y + "px rgb(" + options.color + ")";
            }
        }

        var countDots = Math.round(array[index].count * maxHeight / 2000);

        for (var i = 0; i < countDots; i++) {
            var x = Math.round(Math.random() * maxWidth);
            var y = Math.round(Math.random() * maxHeight);
            
            if(options.color.indexOf('#') !== -1) {
                dot += ", " + x + "px " + y + "px";
                dot += ", " + x + "px " + (y + maxHeight) + "px";
            } else {
                if (options.opacity < 1) {
                    dot += ", " + x + "px " + y + "px rgba(" + options.color + "," + options.opacity + ")";
                    dot += ", " + x + "px " + (y + maxHeight) + "px rgba(" + options.color + "," + options.opacity + ")";
                } else {
                    dot += ", " + x + "px " + y + "px rgb(" + options.color + ")";
                    dot += ", " + x + "px " + (y + maxHeight) + "px rgb(" + options.color + ")";
                }
            }
        }

        var animationDuration = Math.round(array[index].speed * maxHeight / 2000);
        className = "t826__galaxy-" + array[index].name + "-" + curRecId;

        newStyle.innerHTML += "." + className + ":after, ." + className + "{" +
                "box-shadow:" + dot + ";" +
                "animation-duration:" + animationDuration + "s;" +
                "animation-name:" + animationName + ";" +
                (options.color.indexOf('#') !== -1 ? "color:" + options.color + ";" : "" ) +
                (options.color.indexOf('#') !== -1 && options.opacity < 1 ? "opacity:" + options.opacity : "") +
            "}" +
            "." + className + ":after{" +
                "content:' ';" +
                "position:absolute;" +
                "top:" + maxHeight + "px" +
            "}";

        curRec.find(".t826__galaxy > .t826__galaxy-wrapper > .t826__galaxy-" + array[index].name).addClass(className);
    });

    curRec.prepend(newStyle);

    curRec.find(".t826__galaxy > .t826__galaxy-wrapper").css("animation-name", "t826__galaxy-fadeIn");
}
 
function t849_init(recid) {
    var el = $('#rec' + recid);
    var toggler = el.find('.t849__header');
    var accordion = el.find('.t849__accordion');
    if (accordion) {
        accordion = accordion.attr('data-accordion');
    } else {
        accordion = "false";
    }

    toggler.click(function () {
        if (accordion === "true") {
            toggler.not(this).removeClass("t849__opened").next().slideUp();
        }

        $(this).toggleClass('t849__opened');
        $(this).next().slideToggle();
        if (window.lazy === 'y') {
            t_lazyload_update();
        }
    });
} 
function t851_init(recid) {
  var rec = $('#rec' + recid + ' .t851');

  t851_updateLazyLoad(recid);
}

function t851_updateLazyLoad(recid) {
    var scrollContainer = $("#rec" + recid + " .t851__container_mobile-flex");
    var curMode = $(".t-records").attr("data-tilda-mode");
    if (scrollContainer.length && curMode != "edit" && curMode != "preview") {
        scrollContainer.bind('scroll', t_throttle(function() {
            t_lazyload_update()
        }, 500))
    }
}
 
function t862_init(recid) {
    var rec = $('#rec' + recid);
    var quizWrapper = rec.find('.t862__quiz-wrapper');
    var form = rec.find('.t862 .t-form');
    var quizQuestion = rec.find('.t862 .t-input-group');
    var prevBtn = rec.find('.t862__btn_prev');
    var nextBtn = rec.find('.t862__btn_next');
    var resultBtn = rec.find('.t862__btn_result');
    var errorBoxMiddle = rec.find('.t-form__errorbox-middle .t-form__errorbox-wrapper');
    var captureFormHTML = '<div class="t862__capture-form"></div>';
    rec.find('.t862 .t-form__errorbox-middle').before(captureFormHTML);
    var quizQuestionNumber = 0;
    form.removeClass('js-form-proccess');
    $(quizQuestion[quizQuestionNumber]).show();
    $(quizQuestion[quizQuestionNumber]).addClass('t-input-group-step_active');
    rec.attr('data-animationappear', 'off');
    rec.css('opacity', '1');

    t862_workWithAnswerCode(rec);

    quizQuestion.each(function (i) {
        $(quizQuestion[i]).attr('data-question-number', i);
    });

    t862_wrapCaptureForm(rec);
    var captureForm = rec.find('.t862__capture-form');

    t862_showCounter(rec, quizQuestionNumber);
    t862_disabledPrevBtn(rec, quizQuestionNumber);
    t862_checkLength(rec);

    t862_openToHook(rec, form, quizQuestion, captureForm);

    prevBtn.click(function (e) {
        if (quizQuestionNumber > 0) {
            quizQuestionNumber--;
        }

        t862_setProgress(rec, -1);
        t862_lazyLoad();
        t862_awayFromResultScreen(rec);
        t862_showCounter(rec, quizQuestionNumber);
        t862_hideError(rec, quizQuestionNumber);
        t862_disabledPrevBtn(rec, quizQuestionNumber);
        t862_switchQuestion(rec, quizQuestionNumber);
        t862_resizePopup(rec);

        e.preventDefault();
    });

    nextBtn.click(function (e) {
        var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);

        if (showErrors) {
            errorBoxMiddle.hide();
        }

        if (!showErrors) {
            quizQuestionNumber++;
            prevBtn.attr('disabled', false);
            t862_setProgress(rec, 1);
            t862_showCounter(rec, quizQuestionNumber);
            t862_switchQuestion(rec, quizQuestionNumber);
            t862_resizePopup(rec);
        }

        t862_lazyLoad();

        e.preventDefault();
    });

    quizQuestion.keypress(function (e) {
        var activeStep = form.find('.t-input-group-step_active');
        if (event.keyCode === 13 && !form.hasClass('js-form-proccess') && !activeStep.hasClass('t-input-group_ta')) {
            var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);
            var questionArr = t862_createQuestionArr(rec);

            if (showErrors) {
                errorBoxMiddle.hide();
            }

            prevBtn.attr('disabled', false);
            if (!showErrors) {
                quizQuestionNumber++;
                t862_setProgress(rec, 1);
                t862_showCounter(rec, quizQuestionNumber);

                if (quizQuestionNumber < questionArr.length) {
                    t862_switchQuestion(rec, quizQuestionNumber);
                } else {
                    t862_switchResultScreen(rec);
                    form.addClass('js-form-proccess');
                }

                t862_disabledPrevBtn(rec, quizQuestionNumber);
            }

            t862_lazyLoad();

            e.preventDefault();
        }
    });

    resultBtn.click(function (e) {
        var showErrors = t862_showError(rec, quizWrapper, quizQuestionNumber);

        if (showErrors) {
            errorBoxMiddle.hide();
        }

        if (!showErrors) {
            quizQuestionNumber++;
            t862_setProgress(rec, 1);
            t862_switchResultScreen(rec);
            form.addClass('js-form-proccess');
            t862_disabledPrevBtn(rec, quizQuestionNumber);
        }

        e.preventDefault();
    });
}

function t862_workWithAnswerCode(rec) {
    rec.find('.t-input-group_ri')
        .find('input')
        .each(function () {
            var $this = $(this);
            if ($this.val().indexOf('value::') != -1) {
                t862_setAnswerCode($this);
                var label = $this.parent().find('.t-img-select__text');
                label.text(label.text().split('value::')[0].trim());
            }
        });

    rec.find('.t-input-group_rd')
        .find('input')
        .each(function () {
            var $this = $(this);
            if ($this.val().indexOf('value::') != -1) {
                t862_setAnswerCode($this);
                var label = $this.parent();

                label.html(function () {
                    var html = $(this).html().split('value::')[0].trim();
                    return html;
                });
            }
        });

    rec.find('.t-input-group_sb')
        .find('option')
        .each(function () {
            var $this = $(this);
            if ($this.val().indexOf('value::') != -1) {
                t862_setAnswerCode($this);
                $this.text($this.text().split('value::')[0].trim());
            }
        });
}

function t862_setAnswerCode($this) {
    var parameter = $this.val().split('value::')[1].trim();
    $this.val(parameter);
}

function t862_openToHook(rec, form, quizQuestion, captureForm) {
    var popup = rec.find('.t-popup');
    var hook = popup.attr('data-tooltip-hook');
    var analitics = popup.attr('data-track-popup');

    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function (e) {
            t862_showPopup(rec, form, quizQuestion, captureForm);
            setTimeout(function() {
                t862_resizePopup(rec);
            }, 50);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7);
                }
                Tilda.sendEventToStatistics(analitics, virtTitle);
            }
        });
    }
}

function t862_showError(rec, quizWrapper, quizQuestionNumber) {
    if (quizWrapper.hasClass('t862__quiz-published')) {
        var errors = t862_setError(rec, quizQuestionNumber);

        return errors;
    }
}

function t862_lazyLoad() {
    if (typeof $('.t-records').attr('data-tilda-mode') == 'undefined') {
        if (window.lazy == 'y') {
            t_lazyload_update();
        }
    }
}

function t862_setHeight(rec, form, quizQuestion, captureForm) {
    var questions = [];
    var questionsHeight = [];

    var descrHeight = rec.find('.t862__quiz-description').outerHeight();
    var titleHeight = rec.find('.t862__result-title').outerHeight();

    quizQuestion.each(function () {
        var $this = $(this);
        if (!$this.hasClass('t862__t-input-group_capture')) {
            questions.push($this);
        }
    });

    questions.forEach(function (item) {
        questionsHeight.push(item.outerHeight());
    });

    var maxHeightQuestion = Math.max.apply(null, questionsHeight);

    var captureFormHeight = captureForm.outerHeight();
    var height = maxHeightQuestion > captureFormHeight ? maxHeightQuestion : captureFormHeight;

    questions.forEach(function (item) {
        item.css('min-height', height);
    });

    captureForm.css('min-height', height);
    rec.find('.t862__quiz-form-wrapper').css('min-height', height);

    var headerHeight = titleHeight > descrHeight ? titleHeight : descrHeight;
    var quizWrapperHeight = rec.find('.t862__quiz-form-wrapper').outerHeight();
    var btnHeight = rec.find('.t862__btn-wrapper').outerHeight();

    rec.find('.t862__wrapper').css('min-height', headerHeight + quizWrapperHeight + btnHeight);
}

function t862_setMobileHeight() {
    t862_calcVH();
    window.addEventListener('resize', function () {
        t862_calcVH();
    });
}

function t862_calcVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

function t862_checkLength(rec) {
    var nextBtn = rec.find('.t862__btn_next');
    var resultBtn = rec.find('.t862__btn_result');
    var questionArr = t862_createQuestionArr(rec);

    if (questionArr.length < 2) {
        nextBtn.hide();
        resultBtn.show();
    }
}

function t862_showCounter(rec, quizQuestionNumber) {
    var counter = rec.find('.t862__quiz-description-counter');
    var questionArr = t862_createQuestionArr(rec);
    counter.html(quizQuestionNumber + 1 + '/' + questionArr.length);
}

function t862_setError(rec, quizQuestionNumber) {
    var questionArr = t862_createQuestionArr(rec);
    var currentQuestion = $(questionArr[quizQuestionNumber]);
    var arErrors = window.tildaForm.validate(currentQuestion);
    var showErrors;
    currentQuestion.addClass('js-error-control-box');
    var errorsTypeObj = arErrors[0];
    var arLang = window.tildaForm.arValidateErrors[window.tildaBrowserLang] || {};

    if (errorsTypeObj != undefined) {
        var errorType = errorsTypeObj.type[0];
        var errorTextCustom = rec
            .find('.t862 .t-form')
            .find('.t-form__errorbox-middle')
            .find('.js-rule-error-' + errorType)
            .text();
        var sError = '';
        if (errorTextCustom != '') {
            sError = errorTextCustom;
        } else {
            sError = arLang[errorType];
        }
        showErrors = errorType == 'emptyfill' ? false : window.tildaForm.showErrors(currentQuestion, arErrors);
        currentQuestion.find('.t-input-error').html(sError);
    }

    return showErrors;
}

function t862_hideError(rec, quizQuestionNumber) {
    var questionArr = t862_createQuestionArr(rec);
    var currentQuestion = $(questionArr[quizQuestionNumber]);
    currentQuestion.removeClass('js-error-control-box');
    currentQuestion.find('.t-input-error').html('');
}

function t862_setProgress(rec, index) {
    var progressbarWidth = rec.find('.t862__progressbar').width();
    var progress = rec.find('.t862__progress');
    var questionArr = t862_createQuestionArr(rec);
    var progressWidth = progress.width();
    var progressStep = progressbarWidth / questionArr.length;
    var percentProgressWidth = Math.ceil(((progressWidth + index * progressStep) / progressbarWidth) * 100) + '%';

    progress.css('width', percentProgressWidth);
}

function t862_wrapCaptureForm(rec) {
    var captureForm = rec.find('.t862__capture-form');
    var quizQuestion = rec.find('.t862 .t-input-group');
    var quizFormWrapper = rec.find('.t862__quiz-form-wrapper');

    quizQuestion.each(function (i) {
        var currentQuizQuestion = $(quizQuestion[i]);
        var emailInputExist = $(currentQuizQuestion).hasClass('t-input-group_em');
        var nameInputExist = $(currentQuizQuestion).hasClass('t-input-group_nm');
        var phoneInputExist = $(currentQuizQuestion).hasClass('t-input-group_ph');
        var checkboxInputExist = $(currentQuizQuestion).hasClass('t-input-group_cb');
        var quizQuestionNumber = currentQuizQuestion.attr('data-question-number');
        var maxCountOfCaptureFields = 4;

        if (quizQuestionNumber >= quizQuestion.length - maxCountOfCaptureFields) {
            var isCaptureGroup = true;

            if (quizFormWrapper.hasClass('t862__quiz-form-wrapper_newcapturecondition')) {
                var inputsGroup = currentQuizQuestion.nextAll('.t-input-group');
                inputsGroup.each(function () {
                    isCaptureGroup =
                        $(this).hasClass('t-input-group_cb') ||
                        $(this).hasClass('t-input-group_em') ||
                        $(this).hasClass('t-input-group_nm') ||
                        $(this).hasClass('t-input-group_ph');
                });
            }

            if (isCaptureGroup) {
                if (emailInputExist || nameInputExist || phoneInputExist || checkboxInputExist) {
                    currentQuizQuestion.addClass('t862__t-input-group_capture');
                    captureForm.append(currentQuizQuestion);
                }
            }
        }
    });
}

function t862_createQuestionArr(rec) {
    var quizQuestion = rec.find('.t862 .t-input-group');
    var questionArr = [];

    quizQuestion.each(function (i) {
        var question = $(quizQuestion[i]);
        if (!question.hasClass('t862__t-input-group_capture')) {
            questionArr.push(quizQuestion[i]);
        }
    });

    return questionArr;
}

function t862_disabledPrevBtn(rec, quizQuestionNumber) {
    var prevBtn = rec.find('.t862__btn_prev');
    quizQuestionNumber == 0 ? prevBtn.attr('disabled', true) : prevBtn.attr('disabled', false);
}

function t862_switchQuestion(rec, quizQuestionNumber) {
    var nextBtn = rec.find('.t862__btn_next');
    var resultBtn = rec.find('.t862__btn_result');
    var questionArr = t862_createQuestionArr(rec);

    $(questionArr).hide();
    $(questionArr).removeClass('t-input-group-step_active');
    $(questionArr[quizQuestionNumber]).show();
    $(questionArr[quizQuestionNumber]).addClass('t-input-group-step_active');

    if (quizQuestionNumber === questionArr.length - 1) {
        nextBtn.hide();
        resultBtn.show();
    } else {
        nextBtn.show();
        resultBtn.hide();
    }
}

function t862_switchResultScreen(rec) {
    var captureForm = rec.find('.t862__capture-form');
    var quizDescription = rec.find('.t862__quiz-description');
    var resultTitle = rec.find('.t862__result-title');
    var resultBtn = rec.find('.t862__btn_result');
    var submitBtnWrapper = rec.find('.t862 .t-form__submit');
    var questionArr = t862_createQuestionArr(rec);

    $(questionArr).hide();
    $(captureForm).show();

    resultBtn.hide();
    quizDescription.hide();
    resultTitle.show();

    submitBtnWrapper.show();
}

function t862_awayFromResultScreen(rec) {
    var captureForm = rec.find('.t862__capture-form');
    var quizDescription = rec.find('.t862__quiz-description');
    var resultTitle = rec.find('.t862__result-title');
    var submitBtnWrapper = rec.find('.t862 .t-form__submit');

    submitBtnWrapper.hide();
    $(captureForm).hide();
    quizDescription.show();
    resultTitle.hide();
}

function t862_onSuccess(form) {
    var inputsWrapper = form.find('.t-form__inputsbox');
    var inputsHeight = inputsWrapper.height();
    var inputsOffset = inputsWrapper.offset().top;
    var inputsBottom = inputsHeight + inputsOffset;
    var targetOffset = form.find('.t-form__successbox').offset().top;
    var prevBtn = form.parents('.t862').find('.t862__btn_prev');
    var target;

    if ($(window).width() > 960) {
        target = targetOffset - 200;
    } else {
        target = targetOffset - 100;
    }

    if (targetOffset > $(window).scrollTop() || $(document).height() - inputsBottom < $(window).height() - 100) {
        inputsWrapper.addClass('t862__inputsbox_hidden');
        setTimeout(function () {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate(
                    {
                        opacity: 0,
                    },
                    50
                );
            }
        }, 300);
    } else {
        $('html, body').animate(
            {
                scrollTop: target,
            },
            400
        );
        setTimeout(function () {
            inputsWrapper.addClass('t862__inputsbox_hidden');
        }, 400);
    }

    var successurl = form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function () {
            window.location.href = successurl;
        }, 500);
    }

    prevBtn.hide();
}

function t862_lockScroll() {
    var body = $('body');
    if (!body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop =
            typeof window.pageYOffset !== 'undefined' ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        body.addClass('t-body_scroll-locked');
        body.css('top', '-' + bodyScrollTop + 'px');
        body.attr('data-popup-scrolltop', bodyScrollTop);
    }
}

function t862_unlockScroll() {
    var body = $('body');
    if (body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = $('body').attr('data-popup-scrolltop');
        body.removeClass('t-body_scroll-locked');
        body.css('top', '');
        body.removeAttr('data-popup-scrolltop');
        window.scrollTo(0, bodyScrollTop);
    }
}

function t862_showPopup(rec, form, quizQuestion, captureForm) {
    var popup = rec.find('.t-popup');
    var quiz = rec.find('.t862__quiz');
    popup.css('display', 'block');
    rec.find('.t-range').trigger('popupOpened');
    if (window.lazy == 'y') {
        t_lazyload_update();
    }
    setTimeout(function () {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show');
        if ($(window).width() > 640 && quiz.hasClass('t862__quiz_fixedheight')) {
            t862_setHeight(rec, form, quizQuestion, captureForm);
        }

        if ($(window).width() <= 640) {
            t862_setMobileHeight();
        }

        t862__showJivo(popup, '1', '1');
    }, 50);

    $('body').addClass('t-body_popupshowed t862__body_popupshowed');
    /*fix IOS11 cursor bug + general IOS background scroll*/
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        setTimeout(function () {
            t862_lockScroll();
        }, 500);
    }

    rec.find('.t-popup').click(function (e) {
        var windowWidth = $(window).width();
        var maxScrollBarWidth = 17;
        var windowWithoutScrollBar = windowWidth - maxScrollBarWidth;
        if (e.clientX > windowWithoutScrollBar) {
            return;
        }
        if (e.target == this) {
            t862_closePopup(rec);
        }
    });

    rec.find('.t-popup__close').click(function () {
        t862_closePopup(rec);
    });

    rec.find('a[href*="#"]').click(function () {
        var url = $(this).attr('href');
        if (!url || url.substring(0, 7) != '#price:') {
            t862_closePopup(rec);
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function () {
                    $('body').addClass('t-body_popupshowed');
                }, 300);
            }
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            t862_closePopup();
        }
    });
}

function t862_closePopup(rec) {
    $('body').removeClass('t-body_popupshowed t862__body_popupshowed');
    /*fix IOS11 cursor bug + general IOS background scroll*/
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        t862_unlockScroll();
    }
    rec.find('.t-popup').removeClass('t-popup_show');
    t862__showJivo($('.t-popup'), '2147483647', '2147483648');
    setTimeout(function () {
        $('.t-popup').not('.t-popup_show').css('display', 'none');
    }, 300);
}

function t862_resizePopup(rec) {
    var div = rec.find('.t-popup__container').height();
    console.log(div);
    var win = $(window).height() - 120;
    console.log(win);
    var popup = rec.find('.t-popup__container');
    if (div > win) {
        popup.addClass('t-popup__container-static');
    } else {
        popup.removeClass('t-popup__container-static');
    }
}

function t862__showJivo(popup, indexMobile, indexDesktop) {
    if ($('._show_1e.wrap_mW.__jivoMobileButton').length != 0) {
        $('._show_1e.wrap_mW.__jivoMobileButton').css('z-index', indexMobile);
    }

    if ($('.label_39#jvlabelWrap').length != 0) {
        $('.label_39#jvlabelWrap').css('z-index', indexDesktop);
    }
}

/* deprecated */
function t862_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7);
    }

    virtPage += popupname;
    virtTitle += popupname;

    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0);
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {
                    hitType: 'pageview',
                    page: virtPage,
                    title: virtTitle,
                });
            }
        }

        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {
                title: virtTitle,
                referer: window.location.href,
            });
        }
    }
}
