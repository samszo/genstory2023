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
        this.curEvent = 0;
        var svg, g;
                
        this.init = function () {
            me.story=me.omk.getItem(me.id);
            if(me.process)me.process.gen=me;
            //create svg for the scene
            svg = me.container.append('svg')
                .attr('id','genStory_'+me.id+'_svg')
                .attr('fill','black')
                .attr('height',me.screenSize.h)
                .attr('width',me.screenSize.w);        
            g = svg.append("g");
            svg.call(
                d3.zoom()
                    //.scaleExtent([.1, planExtent])
                    .on('zoom', (event) => {
                        g.attr('transform', event.transform);
                        })                        
            );
            me.getEvents();
        }

        this.setMedia=function(p,style){
            //build media from item 
            if(p['o:media'].length){
                if(!p.medias)me.omk.getMedias(p);
                let m = p.medias[Math.floor(Math.random()*p.medias.length)],
                    idm = 'media'+p['o:id']+'_'+m['o:id'];
                p.g = d3.select('#'+idm).size()==0 ? g.append('g').attr('id',idm) : d3.select('#'+idm);

                //use original file for tranparency
                //TODO : transform for sounds, videos...
                p.g.append('image')
                    .attr('xlink:href',m["o:original_url"])
                    .attr('x',0)
                    .attr('y',0)
                    .attr('style',style);
            }else{
                p.g = g.append('text').attr('id','text'+p['o:id'])
                    .attr('style',style)
                    .text(p['o:title']);
            }
            
        }
        this.getEvents = function (){                        
            me.story['genstory:hasEvenement'].forEach(e=>{
                me.events.push(syncRequest(e['@id']));
            });
            return me.events;
        }

        this.showEvent= function(e){
            me.container.append('h1').html(e["o:title"])
            me.processEvent(e);
        }

        this.processEvent= function(e){
            if(e["genstory:hasConditionInitial"]){
                let ci =  e["genstory:hasConditionInitial"][0]['@value'];
                if(me.process && me.process.do(ci)){
                    //execute function with parameter
                    e["genstory:hasFonction"].forEach((f,i) => {
                        me.process.do(f['@value'],e["genstory:hasParam"][i]['@value']);
                    });
                };
            }
        }

        this.getFirstEvent= function(){
            me.curEvent = 0;
            return me.events[me.curEvent];
        }

        this.getNextEvent= function(){
            me.curEvent++;
            return me.events[me.curEvent];
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