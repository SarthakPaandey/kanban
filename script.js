let addBtn = document.querySelector('.add-btn');
let removeBtn = document.querySelector('.remove-btn');
let modal = document.querySelector('.modal-cont');
let textArea = document.querySelector('.textarea-cont');
let mainCont = document.querySelector('.main-cont');
let allPriorityColor = document.querySelectorAll('.priority-color');
let addModal = true;
let taskColor = 'red';
let removeBtnActive = false;
let colorArr = ['red','blue','green','pink'];
let ticketArr = [];

if(localStorage.getItem('tasks')){
    let stringifiedArr = localStorage.getItem('tasks');
    ticketArr = JSON.parse(stringifiedArr);
    console.log(ticketArr);
    for(let i=0;i<ticketArr.length;i++){
        generateTicket(ticketArr[i].task,ticketArr[i].color,ticketArr[i].id);
    }
}

let allFilterColor = document.querySelectorAll('.color');
for(let i=0;i<allFilterColor.length;i++){
    allFilterColor[i].addEventListener('click',function(){
        let currentSelectedFilter = allFilterColor[i].classList[1];
        console.log(currentSelectedFilter);
        let allTicketsColor = document.querySelectorAll('.ticket-color');
        for(let j=0;j<allTicketsColor.length;j++){
            let colorOfTicket = allTicketsColor[j].classList[1];
            console.log(colorOfTicket);
            if(colorOfTicket == currentSelectedFilter){
                allTicketsColor[j].parentElement.style.display = 'block';
            }else{
                allTicketsColor[j].parentElement.style.display = 'none';
            }
        }
    })

    allFilterColor[i].addEventListener('dblclick',function(){
        let allTicketsColor = document.querySelectorAll('.ticket-color');
        for(let j=0;j<allTicketsColor.length;j++){
            allTicketsColor[j].parentElement.style.display = 'block';
        }
    })
}

removeBtn.addEventListener('click',function(){
    if(removeBtnActive){
        removeBtn.style.color = 'black';
        removeBtnActive = false;
    }else{
        removeBtn.style.color = 'red';
        removeBtnActive = true;
    }  
})

var uid = new ShortUniqueId();

addBtn.addEventListener('click',function(){
    console.log("Btn has been clicked")
    if(addModal){
        modal.style.display = 'flex'
    }else{
        modal.style.display = 'none'
    }
    addModal = !addModal;
})

textArea.addEventListener('keydown',function(e){
    let key = e.key;
    if(key === "Enter"){
        if(textArea.value == ""){
            textArea.value = "";
            alert("Please Enter some task!");
            return;
        }
        generateTicket(textArea.value,taskColor);
        textArea.value = "";
        modal.style.display = 'none'
        addModal = true
    }
})

for(let i=0;i<allPriorityColor.length;i++){
    allPriorityColor[i].addEventListener("click",function(){
        for(let j=0;j<allPriorityColor.length;j++){
            allPriorityColor[j].classList.remove('active');
        }
        allPriorityColor[i].classList.add('active')
        taskColor = allPriorityColor[i].classList[1];
        console.log(taskColor)
    })
}

function generateTicket(task,priority,ticketId){
    let id;
    if(ticketId){
        id = ticketId
    }else{
        id = uid.rnd();
    }
     
    let ticketCont = document.createElement("div");
    ticketCont.className = "ticket-cont";
    ticketCont.innerHTML = `<div class="ticket-color ${priority}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="ticket-area">${task}</div>
                            <div class="lock-unlock"><i class="fa-solid fa-lock"></i></div>`
    console.log(ticketCont)
    mainCont.appendChild(ticketCont);
    if(!ticketId){
        ticketArr.push({id:id,task:task,color:taskColor});
        let stringifiedArr = JSON.stringify(ticketArr);
        localStorage.setItem('tasks',stringifiedArr);
        console.log(ticketArr);
    }

    let ticketColor = ticketCont.querySelector('.ticket-color');
    ticketColor.addEventListener('click',function(){
        let currentColor = ticketColor.classList[1];
        ticketColor.classList.remove(currentColor);
        let currentColorIndex;
        for(let i=0;i<colorArr.length;i++){
            if(colorArr[i] == currentColor){
                currentColorIndex = i;
                break;
            }
        }
        let nextColorIndex = (currentColorIndex+1)%colorArr.length;
        let nextColor = colorArr[nextColorIndex];
        ticketColor.classList.add(nextColor)
        let idx;
        for(let i=0;i<ticketArr.length;i++){
            if(id == ticketArr[i].id){
                idx = i;
            }
        }
        console.log(idx);
        ticketArr[idx].color = nextColor;
        console.log(ticketArr);
        updateLocalStorage();
    })

    let taskArea = ticketCont.querySelector('.ticket-area');
    let lockUnlockBtn = ticketCont.querySelector('.lock-unlock i');
    lockUnlockBtn.addEventListener('click',function(){
        if(lockUnlockBtn.classList.contains('fa-lock')){
            lockUnlockBtn.classList.remove('fa-lock');
            lockUnlockBtn.classList.add('fa-lock-open')
            taskArea.setAttribute('contentEditable','true')
        }else{
            lockUnlockBtn.classList.remove('fa-lock-open');
            lockUnlockBtn.classList.add('fa-lock')
            taskArea.setAttribute('contentEditable','false')
        }
        let updatedTask = taskArea.innerText;
        let idx;
        for(let i=0;i<ticketArr.length;i++){
            if(id == ticketArr[i].id){
                idx = i;
            }
        }
        ticketArr[idx].task = updatedTask;
        updateLocalStorage();
    })

    ticketCont.addEventListener('click',function(){
        if(removeBtnActive){
            ticketCont.remove();
            let idx;
            for(let i=0;i<ticketArr.length;i++){
                if(id == ticketArr[i].id){
                    idx = i;
                }
            }
            ticketArr.splice(idx,1);
            console.log(ticketArr);
            updateLocalStorage();
        }
    })
}

function updateLocalStorage(){
    let stringifiedArr = JSON.stringify(ticketArr);
    localStorage.setItem('tasks',stringifiedArr);
}
