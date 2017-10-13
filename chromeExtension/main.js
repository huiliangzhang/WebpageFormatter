var settings;
var isActivated = function(e) {
	if(!settings.running)
	{
		return false;
	}

	if((settings.clicktohide.activationKey == 'shift' && e.shiftKey) ||
	   (settings.clicktohide.activationKey == 'alt' && e.altKey) ||
	   (settings.clicktohide.activationKey == 'meta' && e.metaKey) ||
	   (settings.clicktohide.activationKey == 'control' && e.ctrlKey))
	{
		return true;
	}

	return false;
}

var last_hover_element;
var disappearing_elements=[];
var last_click=0;
var func_mousemove = function(e){
	if(!isActivated(e))
	{
		styleClasses.remove(last_hover_element, 'hoving');
		last_hover_element = null;
		return;
	}

	var target = e.target;	
	if(last_hover_element != target)
	{
		styleClasses.remove(last_hover_element, 'hoving');
		styleClasses.add(target, 'hoving');		
		last_hover_element = target;
	}	
}

var originalTitle;
var func_document_click = function(e){
	if(!isActivated(e))
	{
		return;
	}
	e.preventDefault();
	e.stopImmediatePropagation();
	
	var now=new Date().getTime();
	if(now - last_click <= 500)
	{
		disappearing_elements.forEach(function(x){ styleClasses.remove(x, 'disappearing'); });
		disappearing_elements=[];
		styleClasses.remove(last_hover_element, 'hoving');
		
		if(originalTitle)
		{
			document.title = originalTitle;
		}
		
		return;
	}
	last_click=now;
	
	if(settings.titleName)
	{
		if(!originalTitle)
		{
			originalTitle = document.title;
		}
		document.title = settings.titleName;
	}
	
	var target = e.target;
	styleClasses.add(target, 'disappearing');	
	disappearing_elements.push(target);	
}

var syncSettings = function() {

	if(settings.running)
	{
		document.addEventListener('mousemove', func_mousemove);
		document.addEventListener('click', func_document_click);

		//initial running
		var currentUrl=document.location.href;
        settings.autorun.customcodes.forEach(function(x){
        	if(x.activated)
        	{
        		var websites = x.websites.split(/\s|;|,/);
        		var matching=false;
        		websites.forEach(function(y){
        			if(!y)
        				return;
        			var reg = new RegExp(y, 'g');
        			if(reg.test(currentUrl))
        			{
        				matching=true;
        			}
        		});

        		if(matching)
        		{
        			try{
	        			eval(x.script);
        			}
        			catch(e) {
        				console.log(e);
        			}
        		}
         	}
        });

	}
	else
	{
		document.removeEventListener('mousemove', func_mousemove);
		document.removeEventListener('click', func_document_click);			
	}

}

var styleClasses={
	hoving:' zhl_hovering',
	disappearing:' zhl_disappearing'
};
styleClasses.remove = function(element, name){
	if(element && element.className && element.className.indexOf && element.className.indexOf(styleClasses[name])!=-1)
	{
		element.className = element.className.replace(styleClasses[name], '');
		element.childNodes.forEach(function(x){styleClasses.remove(x, name)});
	}	
}
styleClasses.add = function(element, name){
	if(element && element.className && element.className.indexOf && element.className.indexOf(styleClasses[name])!=-1)
	{
		return;
	}
	if(!element.className)
	{
		element.className='';
	}
	element.className += styleClasses[name];
	
	element.childNodes.forEach(function(x){styleClasses.add(x, name)});
	
}

chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
	settings = response;
	syncSettings();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(sender.id!=chrome.runtime.id)
	{
		console.log('Invalid message', request, sender);
		return;
	}
	if(request.messageType == 'updateSettings')
	{
		settings = request.value;
		syncSettings();
	}
	else if(request.messageType == 'notifyEditor')
	{
		document.dispatchEvent(new CustomEvent(request.value.event, request.value.attached));
	}
  }
);

internal_is_certified_editor=function(event){
	var baseURI = event.srcElement.baseURI;
//	if(baseURI=='http://localhost:4200/')
//		return true;

	if(baseURI=='https://www.swiftformatter.com/')
	{
		return true;
	}
	return false;
}

document.addEventListener("sf_get_autocode", function(event) {
	if(internal_is_certified_editor(event))
	{
		if(settings)
		{
			event.srcElement.dispatchEvent(new CustomEvent('sf_send_autocode_from_extension', {detail: settings.autorun.customcodes}));
		}
	}
});

document.addEventListener("sf_send_autocode_from_editor", function(event) {
	if(internal_is_certified_editor(event))
	{
		var autocode=event.detail;
		if(autocode)
		{
			var p;
			for(var i=0; i<settings.autorun.customcodes.length; i++)
			{
				if(settings.autorun.customcodes[i].id==autocode.id)
				{
					p=settings.autorun.customcodes[i];
				}
			}
			if(!p)
			{
				p={id:autocode.id, activated:true};
				settings.autorun.customcodes.push(p);
			}
			event.srcElement.dispatchEvent(new CustomEvent('sf_send_autocode_saved_from_extension'));

			p.name=autocode.name;
			p.websites=autocode.websites;
			p.script=autocode.script;
			p.activated=autocode.activated;

			settings.autorun.customcodes.sort(function(a,b){return a.name>b.name});

		    chrome.runtime.sendMessage({messageType: "saveSettings", value:settings});

		}
	}
});

document.addEventListener("sf_delete_autocode_from_editor", function(event) {
	if(internal_is_certified_editor(event))
	{
		var autocode=event.detail;
		if(autocode)
		{
			for(var i=0; i<settings.autorun.customcodes.length; i++)
			{
				if(settings.autorun.customcodes[i].id==autocode.id)
				{
					settings.autorun.customcodes.splice(i, 1);
					break;
				}
			}
		    chrome.runtime.sendMessage({messageType: "saveSettings", value:settings});
		}
	}
});



