import anime from './anime.es.js';

export class ArthurAndExcalibur {
    constructor(params) {
        var me = this;
        this.isFind = [];        
        this.params={};
        this.omk = params.omk ? params.omk : false;
        this.gen = params.gen ? params.gen : false;
        this.itemsLookFor = [];
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
                    return isItemFind('Excalibur') ? false : true;
                    break;            
                case 'ExcaliburIsFind':
                    return isItemFind('Excalibur');
                    break;            
                case 'take':
                    return me.take(p);
                    break;            
            }
        }
        function isItemFind(n){
            return me.isFind.filter(i=>i.ilf.o['o:title']==n).length;
        }
        this.take=function(p){
            //get last object find
            //TODO:get the object find by aactant ?
            let oLastFound = me.isFind[me.isFind.length-1];

            //add line between actant and object
            me.gen.g.append('line')
                .attr('id',oLastFound.a['o:id']+'_take_'+oLastFound.ilf.o['o:id'])
                .style("stroke", "lightgreen")
                .style("stroke-width", 10)
                .attr("x1", oLastFound.p.x)
                .attr("y1", oLastFound.p.y)
                .attr("x2", oLastFound.ilf.p.x+(oLastFound.ilf.p.w/2))
                .attr("y2", oLastFound.ilf.p.y+(oLastFound.ilf.p.h/2)); 
        }

        this.LookFor=function(p){
            p.split(',').forEach(par => {
                me.getParam(par.trim());
            });
            //put Excalibur somewhere in screen
            let ilf = {'p':{'x':anime.random(128, me.gen.screenSize.w-128),'y':anime.random(128, me.gen.screenSize.h-128),'w':128,'h':128}},
                s = "height:"+ilf.p.h+"px;x:"+ilf.p.x+"px;y:"+ilf.p.y+"px";
            if(!me.params['Excalibur'].g)
                me.gen.setMedia(me.params['Excalibur'],s);
            else
                me.params['Excalibur'].g.style(s);
            ilf.o = me.params['Excalibur'];
            me.itemsLookFor.push(ilf);
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
        /**
         * Random move for a spécifique existence
         * @param  {object} e the existence is moving
         */        
        function aleaMove(e){
            let a = anime.timeline({
                loop: false
            }), n = e.g.node(), end=false;
        
            a.add({
                targets: n,
                translateX: [ { value: randomMovement('w')}, { value: randomMovement('w') }, { value: randomMovement('w') }],
                translateY: [ { value: randomMovement('h')}, { value: randomMovement('h') }, { value: randomMovement('h') } ],
                //opacity: [ {value: 0.5 }, { value: 0 }],
                easing: 'linear',
                duration: randomSpeed,
                update: function(anim) {
                    if(Math.round(anim.progress)==100)me.nbWalk++;
                    if(me.itemsLookFor.length){
                        let b = n.getBoundingClientRect(),
                        posi = {'x':b.x,'y':b.y,'w':b.width,'h':b.height};
                        me.itemsLookFor.forEach(ilf=>{
                            if(rectIntersect(posi,ilf.p)){
                                a.pause();
                                end=true;
                                //add posi of find object
                                //and actant who find object
                                //TODO: more than one actant find the object
                                me.isFind.push({'ilf':ilf,'a':e,'p':posi});
                                me.gen.processSuccess();
                            }    
                        })
                    }
                    if(me.nbWalk > me.maxWalk){
                        end=true;
                        me.gen.processEchec();
                    }
                }
            });
            a.complete = function() {if(!end)aleaMove(e);};
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