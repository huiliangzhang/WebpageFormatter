var settings;
var autoRuns=[];
var autoRunsArray=[];
var syncSettings = function() {
	prepareAutoRun();
}

/*
chrome.runtime.sendMessage({messageType: "askSettings"}, function(response) {
	settings = response;
	syncSettings();
});
*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(sender.id!=chrome.runtime.id)
	{
		console.log('Invalid message', request, sender);
		return;
	}
	if(request.messageType == 'updateSettings')
	{

        if(request.changeInfo && request.changeInfo.status == 'loading'){
            return;
        }

        /* This is not needed as complete event happens before the document is changed
        if(request.changeInfo.status != 'complete')
            return;
        */

        //console.log(request.event, new Date().toLocaleTimeString(), request.changeInfo);

		settings = request.value;

		//setTimeout(syncSettings, 100);
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
			for(let i=0; i<settings.autorun.customcodes.length; i++)
			{
				if(settings.autorun.customcodes[i].id==autocode.id)
				{
					p=settings.autorun.customcodes[i];
				}
			}
			if(!p)
			{
				p={id:autocode.id};
				settings.autorun.customcodes.push(p);
			}

			p.name=autocode.name;
			p.websites=autocode.websites;
			p.script=autocode.script;
			p.activated=autocode.activated;
			if(autocode.author)
				p.author=autocode.author;
			if(autocode.version)
				p.version=autocode.version;
			if(autocode.describe)
				p.describe=autocode.describe;

            p.parameters=autocode.parameters;

			p.youtubeVideoId=autocode.youtubeVideoId;

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

//autorun code
var prepareAutoRun=function(){
	if(!settings){
	    return;
	}

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
					autoRun=autoRunsArray[i];
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
		        				var autoRun={id:x.id, name:x.name, autoRun:autoRuns[0]};
		        				autoRunsArray.push(autoRun);
							}
        				}

                        var settings={};
                        x.parameters.forEach(function(y){settings[y.name]=y.value});
        				autoRun.autoRun && autoRun.autoRun.activate && autoRun.autoRun.activate(settings);
        			}
        			catch(e) {
        				console.log('Failed to start Auto Run: '+x.name, e);
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

var internal_deactivate=function(p){
    try{
    	p&&p.autoRun && p.autoRun.deactivate && p.autoRun.deactivate();
    }
    catch(error)
    {
        console.log('Failed to deactivate Auto Run: '+p.name, error);
    }
}

