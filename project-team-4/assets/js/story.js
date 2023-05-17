// import data from '../json/sampletext.json' assert { type: 'json' };

// https://html-shark.com/HTML/ShowHideSections.htm
function ShowAndHide() {
    var x = document.getElementById('dialog-1');
    // x.style.backgroundColor = 'red';
    if (x.style.display == 'none') {
        x.style.display = 'block';
        // console.log("hello")
    } else {
        x.style.display = 'none';
    }
}

// link story items
    // d3.json('https://www.rit.motsvoir.org/api/items/137').then(story=>{
    // console.log(story)
    // d3.select('body').select('div').data(story['genstory:hasActant']).enter().append('div').html(a=>{
    // return a.display_title
    //     });
    // })

