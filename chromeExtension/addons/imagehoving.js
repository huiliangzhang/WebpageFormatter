

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

addons.push(new ImageHoving());

