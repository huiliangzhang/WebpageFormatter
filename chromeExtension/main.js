var settings;
var addons=[];
var syncSettings = function() {
	for(var i=0; i<addons.length; i++)
	{
		addons[i].init(settings);
	}
	autorun();
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

var isActivated = function(e) {
	if(!this.setting.running)
	{
		return false;
	}

	if((this.setting.activationKey == 'shift' && e.shiftKey) ||
	   (this.setting.activationKey == 'alt' && e.altKey) ||
	   (this.setting.activationKey == 'meta' && e.metaKey) ||
	   (this.setting.activationKey == 'control' && e.ctrlKey))
	{
		return true;
	}

	return false;
}

//autorun code
var autorun=function(){
	if(settings.running && settings.autorun.running)
	{
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
}


