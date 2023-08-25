function solve(){
    const BASE_URL="http://localhost:3030/jsonstore/tasks/";

    let currentVacationId;
    const inputDomElements={
        name:document.getElementById("name"),
        days:document.getElementById("num-days"),
        date:document.getElementById("from-date")
    }

    const otherDomElements={
        addBtn:document.getElementById("add-vacation"),
        editBtn:document.getElementById("edit-vacation"),
        loadBtn:document.getElementById("load-vacations"),
        confirmedVacationsContainer:document.getElementById("list")
    }

    otherDomElements.loadBtn.addEventListener("click", loadVacations);
    otherDomElements.addBtn.addEventListener("click", addNewVacation);
    otherDomElements.editBtn.addEventListener("click", editVacation);

    function loadVacations(){
        clearContainer();
        fetch(BASE_URL).then((data)=>data.json())
        .then((vacationsRes)=>Object.values(vacationsRes).forEach((vacation)=>{
            const div=createElement("div", otherDomElements.confirmedVacationsContainer, null, ["container"], vacation._id);
            createElement("h2", div, vacation.name);
            createElement("h3", div, vacation.date);
            createElement("h3", div, vacation.days);

            const changeBtn=createElement("button", div, `Change`, ["change-btn"]);
            const doneBtn=createElement("button", div, `Done`, ["done-btn"]);

            changeBtn.addEventListener("click", changeVacation);
            doneBtn.addEventListener("click", doneVacation);
        })).catch((err)=>{
            console.error(err);
        })
    }

    function addNewVacation(e){
        e.preventDefault();

        const everyInputHasValue=Object.values(inputDomElements)
        .every((input)=>input.value!=="");

        if(!everyInputHasValue){
            return;
        }

         const name=inputDomElements.name.value;
         const days=inputDomElements.days.value;
         const date=inputDomElements.date.value;

         const httpHeaders={
            method:"POST",
            body:JSON.stringify({name:name, days:days, date:date})
         }

         fetch(BASE_URL, httpHeaders)
         .then(()=>loadVacations(),
         clearAllInputs())
         .catch((err)=>{
            console.error(err);
         })
    }

    function changeVacation(){
        const parent=this.parentNode;
        currentVacationId=parent.id;

        const[name, date, days, _changeBtn, _doneBtn]=Array.from(parent.children);

        inputDomElements.name.value=name.textContent;
        inputDomElements.date.value=date.textContent;
        inputDomElements.days.value=days.textContent;

        otherDomElements.addBtn.setAttribute("disabled", true);
        otherDomElements.editBtn.removeAttribute("disabled");
    }

    function editVacation(e){
        e.preventDefault();
        
        const name=inputDomElements.name.value;
        const days=inputDomElements.days.value;
        const date=inputDomElements.date.value;

        const httpHeaders={
            method:"PUT",
            body:JSON.stringify({name:name, days:days, date:date})
        }

        fetch(`${BASE_URL}${currentVacationId}`, httpHeaders)
        .then(()=>loadVacations()
        ,clearAllInputs()),
        otherDomElements.addBtn.removeAttribute("disabled"),
        otherDomElements.editBtn.setAttribute("disabled", true)
        .catch((err)=>{
            console.error(err);
        })
    }

    function doneVacation(){
        const id=this.parentNode.id;

        const httpHeaders={
            method:"DELETE"
        }

        fetch(`${BASE_URL}${id}`, httpHeaders)
        .then(()=>loadVacations())
        .catch((err)=>{
            console.error(err);
        })
    }

    function clearContainer(){
        otherDomElements.confirmedVacationsContainer.innerHTML="";
    }

    function clearAllInputs(){
        Object.values(inputDomElements)
        .forEach((input)=>{
            input.value="";
        })
    }
    
    function createElement(type, parentNode, content, classes, id, attributes, useInnerHtml) {
        const htmlElement = document.createElement(type);
      
        if (content && useInnerHtml) {
          htmlElement.innerHTML = content;
        } else {
          if (content && type !== 'input') {
            htmlElement.textContent = content;
          }
      
          if (content && type === 'input') {
            htmlElement.value = content;
          }
        }
      
        if (classes && classes.length > 0) {
          htmlElement.classList.add(...classes);
        }
      
        if (id) {
          htmlElement.id = id;
        }
      
        if (attributes) {
          for (const key in attributes) {
            htmlElement.setAttribute(key, attributes[key])
          }
        }
      
        if (parentNode) {
          parentNode.appendChild(htmlElement);
        }
      
        return htmlElement;
      }
}

solve();