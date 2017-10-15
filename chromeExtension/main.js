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

//image hoving code
function ImageHoving() {
	this.isActivated= isActivated;
	this.enlarging={src:'', ratio:1, pageX:0, pageY:0};
	this.enlargingElement = document.createElement('img');
	this.enlargingElement.style.position='absolute';
	this.enlargingElement.style['z-index']=999;
}
ImageHoving.prototype = {
    remove_enlargingElement: function() {
        if(!this.enlarging.src)
            return;
        document.body.removeChild(this.enlargingElement);
        this.enlarging.src=null;
    },
    decide_position: function(width, height) {
        var doc = document.documentElement;
        var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        var toLeft=this.enlarging.pageX-scrollLeft;
        var toTop=this.enlarging.pageY-scrollTop;
        var toRight=window.innerWidth-toLeft;
        var toBottom=window.innerHeight-toTop;

        var positionLeft=this.enlarging.pageX, positionTop=this.enlarging.pageY;
        if(width<=toLeft)
        {
            positionLeft=this.enlarging.pageX-width;
        }
        else if(width>toRight)
        {
            if(toLeft>toRight || width>=window.innerWidth)
            {
                positionLeft=scrollLeft;
            }
            else
            {
                positionLeft=scrollLeft+window.innerWidth-width;
            }
        }

        if(height<=toTop)
        {
            positionTop=this.enlarging.pageY-height;
        }
        else if(height>toBottom)
        {
            if(toTop>toBottom || height>=window.innerHeight)
            {
                positionTop=scrollTop;
            }
            else
            {
                positionTop=scrollTop+window.innerHeight-height;
            }
        }

        this.enlargingElement.style.left=positionLeft+'px';
        this.enlargingElement.style.top=positionTop+'px';
    },
    insert_enlargingElement: function(src, pageX, pageY, width, height){
        if(!src || height<=0 || width<=0)
            return;

        this.enlarging.src=src;
        this.enlarging.ratio=width/height;
        this.enlarging.pageX=pageX;
        this.enlarging.pageY=pageY;
        this.enlargingElement.src=src;
        this.enlargingElement.style.width='';

        if(width>=window.innerWidth || height>=window.innerHeight)
        {
            if(this.enlarging.ratio<window.innerWidth/window.innerHeight)
            {
                height=window.innerHeight;
                width=height*this.enlarging.ratio;
            }
            else
            {
                width=window.innerWidth;
                height=width/this.enlarging.ratio;
            }

            this.enlargingElement.style.width=width+'px';
        }

        this.decide_position(width, height);
        document.body.appendChild(this.enlargingElement);
    },
    func_mousemove: function(e){
        if(!this.isActivated(e))
        {
            if(this.enlarging.src)
            {
                this.remove_enlargingElement();
            }
            return;
        }

        var target = e.target;
        if(target.tagName.toLowerCase()=='img' && target.src)
        {
            var src=target.src;
            if(src!=this.enlarging.src)
            {
                this.remove_enlargingElement();

                this.insert_enlargingElement(src, e.pageX, e.pageY, target.naturalWidth, target.naturalHeight);
            }
        }
        else
        {
            this.remove_enlargingElement();
        }
    },
    func_mousewheel: function(e){
        if(!this.enlarging.src)
            return;

        e.preventDefault();
        e.stopImmediatePropagation();

        var width = this.enlargingElement.offsetWidth + e.wheelDeltaY;
        this.enlargingElement.style.width=width+'px';
        var height=width/this.enlarging.ratio;

        this.decide_position(width, height);
    },
    init: function(settings) {
		this.setting=settings.imagehoving;

		document.removeEventListener('mousemove', this.func_mousemove.bind(this));
		document.removeEventListener('mousewheel', this.func_mousewheel.bind(this));
        if(settings.running && this.setting.running)
        {
            document.addEventListener('mousemove', this.func_mousemove.bind(this));
            document.addEventListener('mousewheel', this.func_mousewheel.bind(this));
        }
    }
}

//click to Hide code
function ClickToHide() {
	this.isActivated= isActivated;
	this.last_hover_element=null;
	this.disappearing_elements=[];
	this.last_click=0;
	this.originalTitle='';
	this.styleClasses = {
    	hoving:' zhl_hovering',
    	disappearing:' zhl_disappearing'
    };
}
ClickToHide.prototype = {
    removeclass: function(element, name){
		if(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)
		{
			element.className = element.className.replace(this.styleClasses[name], '');
			for(var i=0; i<element.childNodes.length; i++)
			{
				this.removeclass(element.childNodes[i], name);
			}
		}
	},
	addclass: function(element, name){
		if(element && element.className && element.className.indexOf && element.className.indexOf(this.styleClasses[name])!=-1)
		{
			return;
		}
		if(!element.className)
		{
			element.className='';
		}
		element.className += this.styleClasses[name];

		for(var i=0; i<element.childNodes.length; i++)
		{
			this.addclass(element.childNodes[i], name);
		}
	},
	func_mousemove: function(e){
		if(!this.isActivated(e))
		{
			this.removeclass(this.last_hover_element, 'hoving');
			this.last_hover_element = null;
			return;
		}

		var target = e.target;
		if(this.last_hover_element != target)
		{
			this.removeclass(this.last_hover_element, 'hoving');
			this.addclass(target, 'hoving');
			this.last_hover_element = target;
		}
	},
	func_document_click: function(e){
		if(!this.isActivated(e))
		{
			return;
		}
		e.preventDefault();
		e.stopImmediatePropagation();

		var now=new Date().getTime();
		if(now - this.last_click <= 500)
		{
			for(var i=0; i<this.disappearing_elements.length; i++)
			{
				this.removeclass(this.disappearing_elements[i], 'disappearing');
			}
			this.disappearing_elements=[];
			this.removeclass(this.last_hover_element, 'hoving');

			if(this.originalTitle)
			{
				document.title = this.originalTitle;
				this.originalTitle = '';
			}

			return;
		}
		this.last_click=now;

		if(this.setting.titleName)
		{
			if(!this.originalTitle)
			{
				this.originalTitle = document.title;
			}
			document.title = this.setting.titleName;
		}

		var target = e.target;
		this.addclass(target, 'disappearing');
		this.disappearing_elements.push(target);
	},
    init: function(settings) {
		this.setting=settings.clicktohide;

		document.removeEventListener('mousemove', this.func_mousemove.bind(this));
		document.removeEventListener('click', this.func_document_click.bind(this));
        if(settings.running && this.setting.running)
        {
            document.addEventListener('mousemove', this.func_mousemove.bind(this));
            document.addEventListener('click', this.func_document_click.bind(this));
        }
    }
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

var settings;
var imagehoving= new ImageHoving();
var clicktohide= new ClickToHide();
var syncSettings = function() {
	imagehoving.init(settings);
	clicktohide.init(settings);
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


