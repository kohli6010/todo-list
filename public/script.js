// selecting all components
let todo1 = document.querySelector("#todo");
let price1 = document.querySelector("#price");
let quantity1 = document.querySelector("#quantity");
let btn = document.querySelector(".fa-plus");
let shoppingList = document.querySelector(".shoppingList");

// Making initial list
let arr = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : dataDb();
console.log(arr);
localStorage.setItem("items", JSON.stringify(arr));
const result = JSON.parse(localStorage.getItem("items"));
result.forEach(i => {
  limaker(i);
});

// Making the post request to the server to store li on database
btn.addEventListener("click", function() {
  let todo = todo1.value;
  let price = price1.value;
  let quantity = quantity1.value;
  todo1.value = "";
  price1.value = "";
  quantity.value = "";
  fetch("/addItem", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ todo, price, quantity })
  })
    .then(data => data.json())
    .then(data => {
      addtolocal(data);
    });
});

// Adding items to localStorage
function addtolocal(data) {
  arr.push(data);
  localStorage.setItem("items", JSON.stringify(arr));
  let arr2 = JSON.parse(localStorage.getItem("items"));
  let item = arr2[arr2.length - 1];
  limaker(item);
}

// creating a li DOM element
function limaker(i) {
  let updater = document.createElement("span");
  updater.setAttribute("class", "update")
  let li = document.createElement("li");
  let inp = document.createElement("INPUT");
  inp.setAttribute("type", "text");
  inp.setAttribute("class", "input");
  inp.setAttribute("name", "todo");
  inp.style.display = 'none';
  let span = document.createElement("span");
  span.setAttribute("class", "icon");
  span.innerHTML = `
    <span class="inp"><i class="fas fa-trash"></i></span>
  `;

  let pencil = document.createElement("span");
  pencil.setAttribute("class", "pencil");
  pencil.innerHTML = `
    <span><i class="fas fa-pencil-alt"></i></span>
  `;

  span.addEventListener("click", function() {
    let index = arr.indexOf(i);
    remove(index, i);
    shoppingList.removeChild(this.parentElement);
  });

  pencil.addEventListener("mouseover", function() {
    inp.style.display = "inline";
  });

  pencil.addEventListener("mouseout", function() {
    inp.style.display = "none";
  });

  inp.addEventListener("mouseover", function() {
    inp.style.display = "inline";
  });

  inp.addEventListener("mouseout", function() {
    inp.style.display = "none";
  });
  let span1 = document.createElement("span");
  let text = document.createTextNode(` item: ${i.todo}`);
  span1.appendChild(text);
  let span2 = document.createElement("span");
  let text2 = document.createTextNode(` price: ${i.price}`);
  span2.appendChild(text2);
  let span3 = document.createElement("span");
  let text3 = document.createTextNode(` quantity: ${i.quantity}`);
  span3.appendChild(text3);
  let span4 = document.createElement("span");
  let text4 = document.createTextNode(` total: ${i.total}`);
  span4.appendChild(text4);
  li.appendChild(span);
  li.appendChild(span1);
  li.appendChild(span2);
  li.appendChild(span3);
  li.appendChild(span4);
  updater.appendChild(inp)
  updater.appendChild(pencil);
  li.appendChild(updater);
  pencil.addEventListener("click", function(e) {
    let updatedvalue = inp.value;
    arr = JSON.parse(localStorage.getItem("items"));
    fetch(`/update/${i._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ todo: updatedvalue })
    })
      .then(data => data.json())
      .then(data => {
        arr.forEach(i => {
          if (i._id === data._id) {
            let index = arr.indexOf(i);
            arr[index].todo = data.todo;
            localStorage.setItem("items", JSON.stringify(arr));
            text.textContent = ` item: ${data.todo}`;
            console.log(JSON.parse(localStorage.getItem("items")));
          }
        });
      });
  });
  shoppingList.appendChild(li);
}

// Removing the li from localStorage and Database and from DOM
function remove(index, data) {
  const id = data._id;
  arr.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(arr));
  fetch(`/delete/${id}`, {
    method: "DELETE"
  });
}

// Getting Data from Database
function dataDb() {
  const arr2 = [];
  fetch("/getdata")
    .then(data => data.json())
    .then(data => {
      data.forEach(i => arr2.push(i));
    });
  return arr2;
}

