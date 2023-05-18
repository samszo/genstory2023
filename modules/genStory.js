export class genStory {
    constructor(params) {
        var me = this;
        this.omk = params.omk ? params.omk : false;
        this.id = params.id ? params.id : false;
        this.story = params.story ? params.story : false;
        this.process = params.process ? params.process : false;
        this.container = params.container ? params.container : false;
        this.screenSize = params.screenSize ? params.screenSize : {'w':800,'h':600};

        this.events = [];
        this.curEventId = 0;
        this.curEvent=false;
        this.g;
        var svg, sceneTitle;
                
        this.init = function () {
            me.story=me.omk.getItem(me.id);
            if(me.process)me.process.gen=me;
            //create svg for the scene
            //TO first for correct position in svg
            svg = me.container.append('svg')
                .attr('id','genStory_'+me.id+'_svg')
                .attr('fill','black')
                .attr('height',me.screenSize.h)
                .attr('width',me.screenSize.w);        
            me.g = svg.append("g");
            svg.call(
                d3.zoom()
                    //.scaleExtent([.1, planExtent])
                    .on('zoom', (event) => {
                        me.g.attr('transform', event.transform);
                        })                        
            );            
            //create title for the story
            me.container.append('h1').html(me.story['o:title']);
            //create subtitle for the scene
            sceneTitle = me.container.append('h2').attr('id','sceneFor_'+me.story['o:id']);
            me.getEvents();
        }

        this.setMedia=function(p,style,attributes){
            //build media from item 
            if(p['o:media'].length){
                if(!p.medias)me.omk.getMedias(p);
                let m = p.medias[Math.floor(Math.random()*p.medias.length)],
                    idm = 'media'+p['o:id']+'_'+m['o:id'];
                p.g = d3.select('#'+idm).size()==0 ? me.g.append('g').attr('id',idm) : d3.select('#'+idm);

                //use original file for tranparency
                //TODO : transform for sounds, videos...
                p.g.append('image')
                    .attr('xlink:href',m["o:original_url"])
                    .attr('x',0)
                    .attr('y',0)
                    .attr('style',style);
            }else{
                p.g = me.g.append('text').attr('id','text'+p['o:id'])
                    .attr('style',style)
                    .text(p['o:title']);                
            }
            for (const prop in attributes) {
                p.g.attr(prop,attributes[prop]);
            }
        }
        this.getEvents = function (){                        
            me.story['genstory:hasEvenement'].forEach(e=>{
                me.events.push(syncRequest(e['@id']));
            });
            return me.events;
        }

        this.processEvent= function(e){
            me.curEvent = e;
            sceneTitle.html(e["o:title"]);
            if(e["genstory:hasConditionInitial"]){
                let ci =  e["genstory:hasConditionInitial"][0]['@value'];
                if(me.process && me.process.do(ci)){
                    //execute function with parameter
                    e["genstory:hasFonction"].forEach((f,i) => {
                        me.process.do(f['@value'],e["genstory:hasParam"][i]['@value']);
                    });
                }else me.processEchec();
            }
        }
        function getRandomItem(a){
           return a[Math.floor(Math.random()*a.length)]
        }
        this.processSuccess = function(){
            if(me.curEvent["genstory:hasEvenementAfterValid"]){
                let e = getRandomItem(me.curEvent["genstory:hasEvenementAfterValid"])
                me.processEvent(me.getEventByTitle(e.display_title))
            }else me.processEvent(me.getNextEvent());
        }
        this.processEchec = function(){
            if(me.curEvent["genstory:hasEvenementAfterEchec"]){
                let e = getRandomItem(me.curEvent["genstory:hasEvenementAfterEchec"])
                me.processEvent(me.getEventByTitle(e.display_title));
            }else me.processEvent(me.getFirstEvent());
        }

        this.getEventByTitle= function(n){
            return me.events.filter(ev=>ev['o:title']==n)[0];
        }

        this.getFirstEvent= function(){
            me.curEventId = 0;
            return me.events[me.curEventId];
        }

        this.getNextEvent= function(){
            me.curEventId++;
            return me.events[me.curEventId];
        }

        function syncRequest(q){
            const request = new XMLHttpRequest();
            request.open('GET', q, false);  
            request.send(null);        
            if (request.status === 200) {
              return JSON.parse(request.response);
            }        
        };        
        this.init();
    }
}