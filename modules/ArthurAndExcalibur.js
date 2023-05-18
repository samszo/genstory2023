import anime from './anime.es.js';

export class ArthurAndExcalibur {
    constructor(params) {
        var me = this;
        this.isFind = {'Excalibur':false};        
        this.params={};
        this.omk = params.omk ? params.omk : false;
        this.gen = params.gen ? params.gen : false;
        this.posiLookFor = false;
        this.maxWalk = 10;
        this.nbWalk = 0;

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

        function rectIntersect(p1, p2) {
            // Check x and y for overlap
            if (p2.x > p1.w + p1.x || p1.x > p2.w + p2.x || p2.y > p1.h + p1.y || p1.y > p2.h + p2.y){
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
            me.nbWalk=0;
            aleaMove(me.params['actant'])           
        }
        var randomMovement = function(d) {
            return  anime.random(0, me.gen.screenSize[d]) //+ 'rem'
        };
        
        var randomSpeed = function() {
          return anime.random(3000, 5000) //+ 'rem'  
        };        
        function aleaMove(p){
            let a = anime.timeline({
                loop: false
            }), n = p.g.node(), end=false;
        
            a.add({
                targets: n,
                translateX: [ { value: randomMovement('w')}, { value: randomMovement('w') }, { value: randomMovement('w') }],
                translateY: [ { value: randomMovement('h')}, { value: randomMovement('h') }, { value: randomMovement('h') } ],
                //opacity: [ {value: 0.5 }, { value: 0 }],
                easing: 'linear',
                duration: randomSpeed,
                update: function(anim) {
                    if(Math.round(anim.progress)==100)me.nbWalk++;
                    if(me.posiLookFor){
                        let b = n.getBoundingClientRect(),
                        posi = {'x':b.x,'y':b.y,'w':b.width,'h':b.height};
                        if(rectIntersect(posi,me.posiLookFor)){
                            a.pause();
                            end=true;
                            me.gen.processSuccess();
                        }
                    }
                    if(me.nbWalk > me.maxWalk){
                        end=true;
                        me.gen.processEchec();
                    }
                }
            });
            a.complete = function() {if(!end)aleaMove(p);};
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