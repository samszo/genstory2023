import anime from './anime.es.js';

export class ArthurAndExcalibur {
    constructor(params) {
        var me = this;
        this.isFind = {'Excalibur':false};        
        this.params={};
        this.omk = params.omk ? params.omk : false;
        this.gen = params.gen ? params.gen : false;
        this.posiLookFor = {'x':0,'y':0};

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
            let s = "height:128px;x:"+anime.random(128, me.gen.screenSize.w-128)+"px;y:"+anime.random(128, me.gen.screenSize.h-128)+"px";
            if(!me.params['Excalibur'].g)
                me.gen.setMedia(me.params['Excalibur'],s);
            else
                me.params['Excalibur'].g.style(s)

        }
        this.Walk=function(p){
            p.split(',').forEach(par => {
                me.getParam(par.trim());
            });
            //put the lieu in screen
            if(!me.params['lieu'].media)
                me.gen.setMedia(me.params['lieu'],"height:"+me.gen.screenSize.h+"px;width:"+me.gen.screenSize.w+"px;");
            //put actant in screen
            if(!me.params['actant'].media)
                me.gen.setMedia(me.params['actant'],"height:64px");
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
                case 'Excalibur':
                    me.params[p]=me.omk.getRandomItemByClass(p);
                    break;            
                default:
                    me.params[p]=me.omk.getRandomItemByClass(p);
                    break;
            }
        }
        this.init();
    }
}