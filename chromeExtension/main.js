var settings;
var addons=[];
var autoRuns=[];
var autoRunsArray=[];
var syncSettings = function() {
	for(var i=0; i<addons.length; i++)
	{
		addons[i].init(settings);
	}
	prepareAutoRun();
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

	if(baseURI=='https://www.swiftformatter.com/' || baseURI=='http://localhost:4200/')
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
			document.dispatchEvent(new CustomEvent('sf_send_autocode_from_extension', {detail: settings.autorun.customcodes}));
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

			p.name=autocode.name;
			p.websites=autocode.websites;
			p.script=autocode.script;
			p.activated=autocode.activated;
			if(autocode.version)
				p.version=autocode.version;
			p.setting=autocode.setting;
			p.settingText=autocode.settingText;

	    	chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_send_autocode_saved_from_extension', attached:{detail:p}}});

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
	    	chrome.runtime.sendMessage({messageType: "notifyEditor", value:{event:'sf_delete_autocode_from_extension', attached:{detail:{id:autocode.id}}}});
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
var prepareAutoRun=function(){
	if(settings.running && settings.autorun.running)
	{
		//deactivate removed autorun
		for(var i=0; i<autoRunsArray.length; i++)
		{
			var existing=false;

			for(var j=0; j<settings.autorun.customcodes.length; j++)
			{
				if(settings.autorun.customcodes[j].id == autoRunsArray[i].id)
				{
					existing=true;
					break;
				}
			}
			if(!existing)
			{
				internal_deactivate(autoRunsArray[i]);
			}
		}

		//initial running
		var currentUrl=document.location.href;
        settings.autorun.customcodes.forEach(function(x){
        	var autoRun;
			for(var i=0; i<autoRunsArray.length; i++)
			{
				if(autoRunsArray[i].id==x.id)
				{
					autoRun=autoRunsArray[i].autoRun;
					break;
				}
			}
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
        				if(!autoRun)
        				{
							autoRuns.length=0;
		        			eval('{'+x.script+'}');
							if(autoRuns.length>0)
							{
		        				var p={id:x.id, autoRun:autoRuns[0]};
		        				autoRunsArray.push(p);
		        				autoRun=p.autoRun;
							}
        				}

        				autoRun && autoRun.activate && autoRun.activate(x.setting);
        			}
        			catch(e) {
        				console.log(e);
        			}
        		}
        		else
        		{
        			internal_deactivate(autoRun);
        		}
         	}
         	else
         	{
         		internal_deactivate(autoRun);
         	}
        });
	}
	else
	{
		for(var i=0; i<autoRunsArray.length; i++)
		{
			internal_deactivate(autoRunsArray[i]);
		}
	}
}

var internal_deactivate=function(autoRun){
	autoRun && autoRun.deactivate && autoRun.deactivate();
}
