// link story items
d3.json('https://www.rit.motsvoir.org/api/items/271').then(story=>{
    console.log(story)
// d3.select('body').select('div').data(story['genstory:hasActant']).enter().append('div').html(a=>{
    // return a.display_title
    //      });
    d3.select('.dog').data(story['genstory:hasActant'][0]).enter().append('img').html(a=>{
        return "<img src=" + a.thumbnail_url + "></img>"
    })
    d3.select('.cat').data(story['genstory:hasActant'][1]).enter().append('img').html(a=>{
        return "<img src=" + a.thumbnail_url + "></img>"
    })
    d3.select('.turtle').data(story['genstory:hasActant'][2]).enter().append('img').html(a=>{
        return "<img src=" + a.thumbnail_url + "></img>"
    })
    d3.select('.snake').data(story['genstory:hasActant'][3]).enter().append('img').html(a=>{
        return "<img src=" + a.thumbnail_url + "></img>"
    })
})

function tellStory(character){
    d3.json('https://www.rit.motsvoir.org/api/items/271').then(story=>{
        if(character == 0){
            var catStory = [244, 249, 251, 253]
            d3.select('.message').data(story['genstory:hasEvenement']).append("p").text();
        }
        else if(character == 1){
            var dogStory = [244, 249, 251, 253]
            d3.select('.message').data(story['genstory:hasEvenement']).append("p").text();
        }
        else if(character == 2){
            var snakeStory = [244, 249, 251, 253]
            d3.select('.message').data(story['genstory:hasEvenement']).append("p").text();
        }
        else if(character == 3){
            var turtleStory = [244, 249, 251, 253]
            d3.select('.message').data(story['genstory:hasEvenement']).append("p").text();
        }
    })
}

function next(){
    document.getElementsById("text").innerHTML="";