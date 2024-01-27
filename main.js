
const autoTyping = (selector,text,speed) =>  {
    var i = 0;

    function typeWriter() {
        if (i < text.length) {
            document.querySelector(selector).innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter()
    return 'done';
}


function showBoxesElements () {
	pfp = (Math.floor(Math.random() * 3) + 1).toString();
    elements = [
        // Small Box
        ['<br><img id="pfp" class="fadein" src="images/pfp/pfp'+pfp+'.jpeg">','#sml-sub1'],
        ['<div class="text"> <h2></h2> <br> <p></p> <br> <div id="social"></div> </div>','#sml-sub2'],
        ['autotype:> Mohammed Motahher','.text > h2:nth-child(1)'],
        ['autotype:I am a high school student, from Yemen and living in Saudi Arabia. I started my journey in the world of programming three years ago, and since then I have not stopped learning and developing. I am passionate about the world of programming and technology. I am interested in programming websites and console applications.','.text > p:nth-child(3)'],
        ['<a href="mailto:hamadanime1@gmail.com" ><img class="simg" src="images/social/email.png"></a><br>','#social'],
        ['<a href="https://github.com/mohdmot" ><img class="simg" src="images/social/github.png"></a><br>','#social'],
        ['<a href="https://www.instagram.com/z1.2d" ><img class="simg" src="images/social/insta.png"></a><br>','#social'],
        ['<a href="https://t.me/aaambd1" ><img class="simg" src="images/social/tele.png"></a><br>','#social'],
        ['<a href="https://twitter.com/mhmd_albkry" ><img class="simg" src="images/social/x.png"></a><br><br>','#social'],
        ['autotype:Email','#social > a:nth-child(1)'],
        ['autotype:Github','#social > a:nth-child(3)'],
        ['autotype:Instagram','#social > a:nth-child(5)'],
        ['autotype:Telegram','#social > a:nth-child(7)'],
        ['autotype:X','#social > a:nth-child(9)'],
        // Big Box
        ['<div class="text"> <h2></h2> </div>','#big-sub1'],
        ['autotype:> Programming Language i Have', '#big-sub1 > div:nth-child(1) > h2:nth-child(1)'],
        ['<p></p>','#big-sub1 > div:nth-child(1)'],
        ['autotype:Over the course of three years, I learned a lot of experiences in the field of programming, and the most important of these experiences is programming languages', '#big-sub1 > div:nth-child(1) > p:nth-child(2)'],
        ['<img class="fadein plimg" src="images/lang/py.png">&ensp;<img class="fadein plimg" src="images/lang/c.png">&ensp;<img class="fadein plimg" src="images/lang/php.png">&ensp;<img class="fadein plimg" src="images/lang/js.png">&ensp;<img class="fadein plimg" src="images/lang/html.png">&ensp;<img class="fadein plimg" src="images/lang/css.png">&ensp;','#big-sub1 > div:nth-child(1)'],
        ['<h2></h2><p></p>','#big-sub1 > div:nth-child(1)'],
        ['autotype:> Certificates and Workshops','#big-sub1 > div:nth-child(1) > h2:nth-child(9)'],
        ['autotype:Over a recent period of time, I attended many courses, workshops or camps, the most notable of which are the following','#big-sub1 > div:nth-child(1) > p:nth-child(10)'],
        ['<ul></ul>','#big-sub1 > div:nth-child(1)'],
        ['<li> <a href="https://drive.google.com/file/d/14Bg_gcTJfGuZ-gRHpsFODrZRULMHAkRI/view?usp=sharing"></a> </li>','#big-sub1 > div:nth-child(1) > ul:nth-child(11)'],
        ['autotype:Python (Basic) - HackerRank','#big-sub1 > div:nth-child(1) > ul:nth-child(11) > li:nth-child(1) > a:nth-child(1)'],
        ['<li> <a href="https://drive.google.com/file/d/1dkmd3eCBqHtb8IuzVI01tp8IxT42jNiO/view?usp=sharing"></a> </li>','#big-sub1 > div:nth-child(1) > ul:nth-child(11)'],
        ['autotype:AI BOOTCAMP - HRSD','#big-sub1 > div:nth-child(1) > ul:nth-child(11) > li:nth-child(2) > a:nth-child(1)'],
        ['<li> <a href="https://drive.google.com/file/d/1q5r6KD3gnifUkgHbHi8mRGZkBT7LNEqn/view?usp=sharing"></a> </li>','#big-sub1 > div:nth-child(1) > ul:nth-child(11)'],
        ['autotype:Cyber Security- TVTC','#big-sub1 > div:nth-child(1) > ul:nth-child(11) > li:nth-child(3) > a:nth-child(1)'],
        ['<li> <a href="https://drive.google.com/file/d/1nzxVHsbis9jgpbUghr5JqAVN0H7-szZJ/view?usp=sharing"></a> </li>','#big-sub1 > div:nth-child(1) > ul:nth-child(11)'],
        ['autotype:Data Science - Techead','#big-sub1 > div:nth-child(1) > ul:nth-child(11) > li:nth-child(4) > a:nth-child(1)'],
        ['<p></p>','#big-sub1 > div:nth-child(1)'],
        ['autotype:You can take a look at the rest on ','#big-sub1 > div:nth-child(1) > p:nth-child(12)'],
        ['<h2></h2><p></p>','#big-sub1 > div:nth-child(1)'],
        ['autotype:> Some of my Projects','#big-sub1 > div:nth-child(1) > h2:nth-child(13)'],
        ['autotype:I have some good projects currently, I am always working on increasing them.','#big-sub1 > div:nth-child(1) > p:nth-child(14)'],
        ['<table> <tr> <td></td><td></td> </tr> <tr> <td></td><td></td> </tr> </table>','#big-sub1 > div:nth-child(1)'],
        ['<a href="https://github.com/mohdmot/webwareos" ><img class="fadein pimg" src="https://raw.githubusercontent.com/mohdmot/webwareos/main/src/img/logo.png">', '#big-sub1 > div:nth-child(1) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)'],
        ['<a href="https://github.com/mohdmot/FxLinux" ><img class="fadein pimg" src="https://raw.githubusercontent.com/mohdmot/FxLinux/main/logo.png">', '#big-sub1 > div:nth-child(1) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)'],
        ['<a href="https://drive.google.com/drive/folders/1_4FThWfGL0pwjaDF6vBpAvNq6ylyU-BI?usp=sharing"></a>','#big-sub1 > div:nth-child(1) > p:nth-child(12)'],
        ['autotype:My Google Drive','#big-sub1 > div:nth-child(1) > p:nth-child(12) > a:nth-child(1)'],
        ['<a href="https://www.kagsa.org/" ><img class="fadein pimg" src="https://camo.githubusercontent.com/9181b65a342edb8b24a1a6bc5015c2279d2da763f5e876fc222bece8618cc299/68747470733a2f2f7777772e6b616773612e6f72672f646f776e6c6f61642f6173736574732f6c6f676f2e706e67">', '#big-sub1 > div:nth-child(1) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'],
        ['<a href="https://github.com/mohdmot/CustomClassifier" ><img class="fadein pimg" src="https://github.com/mohdmot/CustomClassifier/blob/main/logo.png?raw=true">', '#big-sub1 > div:nth-child(1) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)'],
        ['<p></p><br>','#big-sub1 > div:nth-child(1)'],
        ['autotype:Visit my Github for more content.','#big-sub1 > div:nth-child(1) > p:nth-child(16)'],
    ]
    function show_element (idx) {
        if (idx >= elements.length) {
            return;
        }
        setTimeout(() => {
            console.log(elements[idx][0],elements[idx][1])
            if (elements[idx][0].startsWith('autotype:')) {
                if (elements[idx][0].length > 80)
                    autoTyping(elements[idx][1],elements[idx][0].slice(9),9)
                else 
                    autoTyping(elements[idx][1],elements[idx][0].slice(9),60)
            }
            else {
                if (document.querySelector(elements[idx][1]).innerHTML.includes(" <br>  Loading ... ") ) {
                    document.querySelector(elements[idx][1]).innerHTML = ' '
                }
                document.querySelector(elements[idx][1]).insertAdjacentHTML('beforeend', elements[idx][0])
            }

            show_element(idx+1);
        },400)
    }

    show_element(0)
}
// Show Box
function showBoxes () {
    document.body.innerHTML = '';
    code = `<center>
    <div id="small-box" class="blur-background fadein">
        <center>
            <div id="sml-sub1">
                <br>&ensp;&ensp;Loading ... 
            </div>
        </center>
        <center>
            <div id="sml-sub2">
            </div>
        </center>
    </div>
    &ensp;
    <div id="big-box" class="blur-background fadein">
        <center><div id="big-sub1">
            <br>&ensp;&ensp;Loading ... 
        </div></center>
    </div>
    </center>`
    document.body.insertAdjacentHTML('beforeend',code)
    setTimeout( showBoxesElements, 1500)
}

// Intro
const texts = [
    'Welcome to ..',
    'Mohammed Motahher',
    'Website on Github'
];
function showTexts(index) {
    if (index >= texts.length) {
        return;
    }
    document.body.innerHTML = ''
    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    document.body.appendChild(textContainer);

    const textElement = document.createElement('h1');
    textElement.align = 'center';
    textElement.classList.add('fade');
    textElement.classList.add('text-in-begin');
    textElement.innerHTML = '<b>' + texts[index] + '</b>';
    textContainer.appendChild(textElement);
    document.body.insertAdjacentHTML('beforeend','<center >\n    <div >\n        <center>\n            <div>\n                <br>&ensp;&ensp;\n            </div>\n        </center>\n        <center>\n            <div >\n            </div>\n        </center>\n    </div>\n    &ensp;\n    <div>\n        <center><div>\n            <br>&ensp;&ensp;\n        </div></center>\n    </div>\n    </center>'.repeat(8))

    setTimeout(() => {
        showTexts(index + 1);
    }, 3000);
}


window.onload = () => {
    showTexts(0)
    setTimeout(() => {
        showBoxes()
    }, 10000)
};