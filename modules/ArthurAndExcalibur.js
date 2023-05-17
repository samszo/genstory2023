import anime from './anime.es.js';

export class ArthurAndExcalibur {
    constructor(params) {
        var me = this;
        this.isFind = {'Excalibur':false};        
        this.params={};
        this.omk = params.omk ? params.omk : false;
        this.gen = params.gen ? params.gen : false;
        this.posiLookFor = {'x':0,'y':0,'w':0,'h':0};

        this.init = function () {
        }

        this.do=function(f,p){
            switch (f) {
                case 'Walk':
                    return me.Walk(p);
                    break;            
                case 'LookFor':
                    return me.LookFor(p);
                    break;            
                case 'ExcaliburIsNotFind':
                    return me.isFind.Excalibur ? false : true;
                    break;            
            }
        }
        this.LookFor=function(p){
            p.split(',').forEach(par => {
                me.getParam(par.trim());
            });
            //put Excalibur somewhere in screen
            me.posiLookFor={'x':anime.random(128, me.gen.screenSize.w-128),'y':anime.random(128, me.gen.screenSize.h-128),'w':128,'h':128}
            let s = "height:"+me.posiLookFor.h+"px;x:"+me.posiLookFor.x+"px;y:"+me.posiLookFor.y+"px";
            if(!me.params['Excalibur'].g)
                me.gen.setMedia(me.params['Excalibur'],s);
            else
                me.params['Excalibur'].g.style(s);

        }
        function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
            // Check x and y for overlap
            if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
                return false;
            }
            return true;
        }
        this.Walk=function(p){
            p.split(',').forEach(par => {
                me.getParam(par.trim());
            });
            //put the lieu in screen
            let s = "height:"+me.gen.screenSize.h+"px;width:"+me.gen.screenSize.w+"px;";
            if(!me.params['lieu'].g)
                me.gen.setMedia(me.params['lieu'],s);
            else me.params['lieu'].g.style(s);
            //put actant in screen
            s = "height:64px";
            if(!me.params['actant'].g)
                me.gen.setMedia(me.params['actant'],s);
            else me.params['actant'].g.style(s)
            //actant walk in place to a random position 
            aleaMove(me.params['actant'])           
        }
        var randomMovement = function(d) {
            return  anime.random(-20, 20) + 'rem'
        };
        
        var randomSpeed = function() {
          return anime.random(3000, 5000) + 'rem'  
        };        
        function aleaMove(p){
            console.log("animation");
            var timelineParameters = anime.timeline({
                loop: false
            });
        
            timelineParameters
            .add({
                targets: p.g.node(),
                translateX: 0,
                translateY: me.gen.screenSize.h,
                duration: 100
                })
            .add({
                targets: p.g.node(),
                translateX: [ { value: randomMovement('w')}, { value: randomMovement('w') }, { value: randomMovement('w') }],
                translateY: [ { value: randomMovement('h')}, { value: randomMovement('h') }, { value: randomMovement('h') } ],
                //opacity: [ {value: 0.5 }, { value: 0 }],
                easing: 'linear',
                duration: randomSpeed
            });
            timelineParameters.complete = function() {aleaMove(p);};
        }
        this.getParam=function(p){
            if(me.params[p])return me.params[p];
            switch (p) {
                case 'Excalibur':
                    me.params[p]=me.omk.getItem(60);
                    break;            
                //force arthur for param actant
                case 'actant':
                    me.params[p]=me.omk.getItem(59);
                    break;            
                //force broceliande for param lieu
                case 'lieu':
                    me.params[p]=me.omk.getItem(68);
                    break;            
                default:
                    me.params[p]=me.omk.getRandomItemByClass(p);
                    break;
            }
        }
        this.init();
    }
}