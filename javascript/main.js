// fetch(`https://api.example.com/data`)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {console.log("Erreur lors de la récup des données :", error);
// })

// =-=-=-=-=-| variables |-=-=-=-=-=

let inputTaskName = document.querySelector('.input-text')
let datePicker = document.getElementById('date-picker')
let textArea = document.getElementById('textarea')
let confirmTask = document.querySelector('.confirm-task')

// let taskName = document.querySelector('.list-task-name')
// let taskDate = document.querySelector('.list-task-date')
// let taskDesc = document.querySelector('.list-task-desc')

let taskListHtml = document.querySelector('.task-list')
let taskDetails = document.querySelector('.task-list--details')
let CompleteTaskDetails = document.querySelector('.task-list--details-done')

let taskList = JSON.parse(localStorage.getItem('taskList')) || []
let ongoingtaskList = JSON.parse(localStorage.getItem('ongoingtaskList')) || []
let doneTaskList = JSON.parse(localStorage.getItem('doneTaskList')) || []


// =-=-=-=-=-=-=-=| functions |=-=-=-=-=-=-=-=

// =-=-=| localStorage
function storageLocal() {
  // create a list in localstorage and convert it into string the list 
  localStorage.setItem('ongoingtaskList', JSON.stringify(ongoingtaskList))
  localStorage.setItem('doneTaskList', JSON.stringify(doneTaskList))
}

// =-=-=| add a task new task to the html task-list
function addHtmlTask() {
  storageLocal()

  for (let i = 0; i < ongoingtaskList.length; i++) {
    taskDetails.innerHTML += ` 
      <details draggable="true">
        <summary>
          <div>
            <input type="checkbox" name="check" class="checkbox" data-state="incomplete" data-name="${ongoingtaskList[i].taskname}"> 
            <span class="list-task-name">${ongoingtaskList[i].taskname}</span>
          </div>
          <p class="list-task-date">${ongoingtaskList[i].taskdate}</p>
        </summary>
        <p class="list-task-desc">${ongoingtaskList[i].tastdescription}</p>
      </details>
    `
  }

  for (let i = 0; i < doneTaskList.length; i++) {
    CompleteTaskDetails.innerHTML += ` 
      <details>
        <summary>
          <div>
            <input type="checkbox" name="check" class="checkbox" data-state="complete" data-name="${doneTaskList[i].taskname}" checked> 
            <span class="list-task-name completed">${doneTaskList[i].taskname}</span>
          </div>
          <p class="list-task-date">${doneTaskList[i].taskdate}</p>
        </summary>
        <p class="list-task-desc">${doneTaskList[i].tastdescription}</p>
      </details>      
    `
  }
  console.log(taskList);
  console.log(ongoingtaskList);
  console.log(doneTaskList);
  console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
  console.log(localStorage);
  
}
if (ongoingtaskList.length >= 0) {
  addHtmlTask()
}


// =-=-=-=-=-=-=-=| addEventListeners |=-=-=-=-=-=-=-=
// =-=-=| push to the taskList informations + addHtmlTask()
confirmTask.addEventListener('click', () => {

  // Ajouter comme condition que si le nom existe déja => else

  if (inputTaskName.value != "" /*&& datePicker.value != ""*/) {
  
    
    taskList.push({
      'taskname' : `${inputTaskName.value}`,
      'taskdate' : `${datePicker.value}`,
      'tastdescription' : `${textArea.value}`,
    })

    ongoingtaskList.push({
      'taskname' : `${inputTaskName.value}`,
      'taskdate' : `${datePicker.value}`,
      'tastdescription' : `${textArea.value}`,
    })

    // Delete html-list to print it all over again, probablly not rlly optimal but works ¯\_(ツ)_/¯ 
    taskDetails.innerHTML = ''
    CompleteTaskDetails.innerHTML = ''
    addHtmlTask()

  } else if (inputTaskName.value == "" || datePicker.value == "" || inputTaskName.value == " "){
    alert('you must enter a name and a date');

  } else(
    alert(`You can't have the same name as another task`)
  )

  inputTaskName.value = ""
  datePicker.value = ""
  textArea.value = ""
})


// =-=-=| Change from ongoing Tasks to done Tasks and vise versa
let checkBox = document.querySelectorAll('.checkbox')
  
taskListHtml.addEventListener('change', function(e) {

  if (e.target.hasAttribute('data-state')) {
    // addHtmlTask()

    dataState = e.target.getAttribute('data-state')
    console.log("data-state of clicked element is '" + dataState + "'");

    dataNameFromList = e.target.getAttribute('data-name')
    console.log("data-name of clicked element is '" + dataNameFromList + "'");

    if (dataState == "incomplete") {
      console.log('==> inside incomplete condition');
      // Copy-pase element to donetasklist and delete it from ongoingtaskList

      // Cherche l'item avec le nom(item.taskname) qui est dans la data-name du target(dataNameFromList), 
      // Prend l'objet entier qui a ce nom comme valeur et le copy dans la list Done,
      // Ensuite change son attribut 'incomplete' to 'complete'
      doneTaskList.push(ongoingtaskList.find(item => item.taskname === `${dataNameFromList}`))
      e.target.setAttribute('data-state', 'complete')

      // prendre l'index d'ou le nom(item.taskname) se situe dans la liste ongoingtaskList
      const indexToRemove = ongoingtaskList.findIndex(item => item.taskname === `${dataNameFromList}`);
      console.log(indexToRemove);

      // pour ensuite l'utilisé et supprime cet element seul avec .splice
      // si trouve pas d'element avec .findIndex, return -1, d'ou la condition (indexToRemove !== -1) avant de splice
      if (indexToRemove !== -1) {
        ongoingtaskList.splice(indexToRemove, 1);
      }
      
    } else if (dataState == "complete"){
      console.log('==> inside complete condition');
      // Copy-pase element to ongoingtaskList and delete if from doneTaskList

      ongoingtaskList.push(doneTaskList.find(item => item.taskname === `${dataNameFromList}`))
      e.target.setAttribute('data-state', 'incomplete')

      const indexToRemove = doneTaskList.findIndex(item => item.taskname === `${dataNameFromList}`);

      if (indexToRemove !== -1) {
        doneTaskList.splice(indexToRemove, 1);
      }
    }

    // Supprime tout de l'Html et relance la fonction addHtmlTask() pour tout ré-imprimer chacun dans leur zone (done/ongoing task)
    taskDetails.innerHTML = ''
    CompleteTaskDetails.innerHTML = ''
    addHtmlTask()

  }
})


document.querySelector('.sort-button').addEventListener('click', () => {
  // localStorage.clear()
}) 

// =-=-=-=-=-=-=-=| drag&drop |=-=-=-=-=-=-=-=
// https://cepegra-labs.be/webdesign/fed2023/olivier/js/drag-drop/

let dragUs = document.querySelectorAll('.wrapper details') // element to drag&drop
console.log(dragUs);
let wrapper = document.querySelector('.wrapper') // wrapper of element to drag&drop

dragUs.forEach(dragMe => {

  dragMe.addEventListener('dragstart', () => {
    console.log("drag start")
    dragMe.classList.add('dragging')
  })
  
  dragMe.addEventListener('dragend', () => {
    dragMe.classList.remove('dragging')
  })
})

wrapper.addEventListener('dragover', e => {
  // On empêche le comportement par défaut de l'événement (si ça avait été un a ça aurait cliqué par ex)
  e.preventDefault();
  // On lance la fonction getDragAfterElement avec ses 2 arguments (zone de drop & les coordonnées verticales )
  const afterElement = getDragAfterElement(wrapper, e.clientY);
  const draggable = document.querySelector('.dragging');

  if (afterElement == null) {
    wrapper.appendChild(draggable);
  } else {
    wrapper.insertBefore(draggable, afterElement);
  }

})

function getDragAfterElement(container, y) {
  // On regroupe tous les li qui n'ont pas de classe dragging
  const draggableElements = [...container.querySelectorAll('.wrapper details:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}








// test list copy to other list :

// let firstList = []
// let secondList = []

// firstList.push({
//   'taskname' : `Name of List 1`,
//   'taskdate' : `13-12-2024`,
//   'tastdescription' : `My next birth day date`,
// })

// firstList.push({
//   'taskname' : `Name of List 2`,
//   'taskdate' : `13-12-2025`,
//   'tastdescription' : `My next-next birth day date`,
// })

// secondList.push(firstList.find(item => item.taskname === 'Name of List 2')) // <-- fonctionnera pas

// const indexToRemove = firstList.findIndex(item => item.taskname === 'Name of List 2');

// // si trouve pas d'element avec .findIndex, return -1, d'ou le indexToRemove !== -1 pour remove de la liste
// if (indexToRemove !== -1) {
//   firstList.splice(indexToRemove, 1);
// }

// console.log(firstList);
// console.log(secondList);



// code que j'ai du chercher :
// .checked --> stackoverflow :)
// .find() --> tutorialrepublic :)
// .findIndex --> gpt :)