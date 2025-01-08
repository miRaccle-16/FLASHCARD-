const intro = document.querySelector(".intro");
const tool_circle = document.querySelector(".tool-circle");
const tool_box = tool_circle.parentElement.parentElement;

const flashcard = document.querySelector(".flashcard");

const flashcard_main = document.querySelector(".flashcard-main");

const archive_name = document.getElementById("archive-name");
const create_note = document.getElementById("create-note");

const goToMain = document.getElementById("goToMain");
const goToRecord = document.getElementById("goToRecord");
const goToRecord2 = document.getElementById("direct-to-record");

const tapMe = tool_circle.children[0];

let books = []

const record = document.querySelector(".record");
const note = document.getElementById("data");
const color = document.getElementById("color");
const main = document.querySelector(".main");
const edit = document.querySelector(".icon1");
const ui = edit.nextElementSibling;

const icons = [edit, ui];
let record_data;

class ElemPositions {

    constructor(element, property) {
        this.e = element;
        this.prop = property;
    }

    get editPos() {
        return getComputedStyle(this.e[0]).getPropertyValue(this.prop)
    }

    get uIPos() {
        return getComputedStyle(this.e[1]).getPropertyValue(this.prop)
    }

    set editPos(value) {
        this.e[0].style[this.prop] = `${value}px`;
    }

    set uIPos(value) {
        this.e[1].style[this.prop] = `${value}px`;
    }

    //General Display
    get display() {
        return getComputedStyle(this.e).getPropertyValue(this.prop)
    }

    set display(value) {
        this.e.style[this.prop] = value;
    }

}


//Get elements Top value
const iconTop = new ElemPositions(icons, "top");
let closeIcon = true;
//show tip immediately after Entering the main page

tool_circle.addEventListener("click", ()=> {

    iconTop.editPos = "-55";
    iconTop.uIPos = "105";

    icons.forEach((icon)=> {
        icon.style['visibility'] = "visible"
    });

    tapMe.style.display = "none";

    showNoteTip(tool_box, "Double Tap Outside the Circle to hide Icons", "iconTip", 3000);
});

//Instance of main page
const main_page_display = new ElemPositions(main, "display");
const record_page_display = new ElemPositions(record, "display");
const flashcard_page_display = new ElemPositions(flashcard, "display");
const flashcard_main_display = new ElemPositions(flashcard_main, "display");


edit.addEventListener("click", ()=> {
    main_page_display.display = "none"
    record_page_display.display = "flex";
});


create_note.addEventListener("click", ()=> {
    if (archive_name.value !== "" && note.value !== "") {

        record_page_display.display = "none";
        flashcard_page_display.display = "flex";

        const record_obj = {
            col: color.value,
            note_value: note.value,
            archive_name_value: archive_name.value
        }

        localStorage.setItem("record", JSON.stringify(record_obj));

        //DATA IN JAVASCRIPT OBJECT

        record_data = localStorage.length > 0 && localStorage.getItem("record") !== null? JSON.parse(localStorage.getItem("record")): null;

        /*If FALSE div will not be created*/
        createFlashCards(record_data !== null, record_data);
    }

});


const noteWidth = new ElemPositions(note, "width");
const noteHeight = new ElemPositions(note, "height");


const notePos = new ElemPositions(note, "position");
const shadow = new ElemPositions(note, "box-shadow");

const noteDisplay = new ElemPositions(note, "display");


note.addEventListener("focus", (e)=> {
    notePos.display = "absolute";
    noteWidth.display = "90%";
    noteHeight.display = "90vh";
    shadow.display = "-1px 1px 3px 0.4px rgba(0,0,0,0.4)";

    note.style['text-align'] = "center";
    note.style['word-break'] = "break-word";

    showNoteTip(record, "Tap outside the Input Frame to minimize", "notetip", 2000);
});


note.addEventListener("blur", ()=> {
    noteWidth.display = "300px";
    noteHeight.display = "50px";
    notePos.display = "";
    shadow.display = ""
    note.style['text-align'] = "left";
});



goToRecord.addEventListener("click", ()=> {
    record_page_display.display = "flex";
    flashcard_page_display.display = "none"
});



goToMain.addEventListener("click", ()=> {
    record_page_display.display = "none";
    main_page_display.display = "flex"
});


goToRecord2.addEventListener("click", ()=> {
    record_page_display.display = "flex";
    main_page_display.display = "none";
});


window.addEventListener("dblclick", ()=> {
    iconTop.editPos = "0";
    iconTop.uIPos = "0";

    icons.forEach((icon)=> {
        icon.style['visibility'] = "hidden";
    });
})

const createFlashCards = (storage, data)=> {
    /*@Params 1; If Storage is true*/

    if (storage) {
        let noteBox = document.createElement("div");
        let h4 = document.createElement("h4");

        h4.textContent = `>${data.archive_name_value}< BOOK`;

        noteBox.appendChild(h4)
        let notTouched = true;

        noteBox.classList.add("note-data");

        noteBox.style['background'] = /^#000+/.test(data.col)? null: data.col;

        flashcard_main.appendChild(noteBox)

        document.querySelectorAll(".note-data").forEach((book)=> {
            book.onclick = ()=> {

                if (notTouched) {
                    book.style['border'] = "3px dashed red";

                    notTouched = false;
                    createCancelBtn(book);
                    enlargeBtn(book, data);

                } else {
                    notTouched = true;
                    book.style['border'] = "none";

                }

            }
        });

    } else {
        showNoteTip(flashcard_main, "No data Entries", "iconTip", 5000);
    }
}

const showNoteTip = function(parent, text, className, time) {
    let tip = document.createElement("div");
    tip.innerHTML = text;
    tip.classList.add(className);

    parent.appendChild(tip);

    setTimeout(function() {
        tip.remove();
    }, time);
}


const createCancelBtn = (box)=> {
    let cancel = document.createElement("i");
    cancel.classList.add("fa", "fa-x");
    cancel.id = "remove-note-box";
    box.appendChild(cancel)

    let parent = cancel.parentElement;
    cancel.onclick = ()=> {
        flashcard_main.removeChild(box)
    }

    setTimeout(()=> {
        cancel.remove()
    }, 1000);

}


const enlargeBtn = (box, data)=> {
    let peek = document.createElement("i");
    peek.classList.add("fa", "fa-search");
    peek.id = "look-note-box";
    box.appendChild(peek)

    let parent = peek.parentElement;
    let p;
    let h;
    peek.onclick = ()=> {
        p = document.createElement("p");
        removeP = document.createElement("i")
        removeP.classList.add("fa", "fa-x");

        p.textContent = data.note_value
        parent.appendChild(removeP);
        parent.appendChild(p);

        removeP.style['position'] = "absolute";
        removeP.style['right'] = "20px"
        removeP.style['top'] = "10px"

        parent.style['position'] = "absolute";
        parent.style['justify-content'] = "";
        parent.style['flex-direction'] = "column"
        parent.style['align-items'] = "center";
        parent.style['width'] = "300px"
        parent.style['height'] = "500px"
        parent.style['box-shadow'] = "1px 1px 3px 0.3px black";

        h = parent.querySelector("h4");
        h.style['font-size'] = "3.4em"
        h.innerHTML = h.innerHTML.replace(" BOOK", "");

        removeP.onclick = ()=> {
            parent.style['position'] = "";
            parent.style['flex-direction'] = ""
            parent.style['align-items'] = "center";
            parent.style['width'] = "305px"
            parent.style['height'] = "100px"

            removeP.remove();
            p.remove();
            h.style['font-size'] = '1.2em'
        }
    }

    setTimeout(()=> {
        peek.remove();
    }, 1000)

}

setTimeout(function() {
    intro.style['display'] = "none";
    main_page_display.display = 'flex'
}, 4000);

ui.addEventListener("click", ()=> {
    const ink = [{
        bg: "#000",
        color: "#fff"
    },
        {
            bg:"#ffb300",
            color:"#3f00ff"
        },
        {
            bg:"#ff00df",
            color:"#00ff25"
        }
    ]
    
   let random = Math.floor(Math.random() * (ink.length))
   let random_ink = ink[random];
   
   main.style['background'] =random_ink.bg;
   main.style['color'] = random_ink.color;
   
   flashcard_main.style['background'] =random_ink.bg;
   flashcard_main.style['color'] = random_ink.color;
   
   record.style['background'] =random_ink.bg;
   record.style['color'] = random_ink.color;
   
   flashcard.style['background'] =random_ink.bg;
   flashcard.style['color'] = random_ink.color;
   
   create_note.style['background'] =random_ink.bg;
   create_note.style['color'] = random_ink.color;
});