"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};
// cotroller/////////////////////////////////
function start() {
  //   console.log("ready");

  // TODO: Add event-listeners to filter buttons
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", chooseFilter));
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}
function chooseFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(filter);
  filterList(filter);
}
function filterList(animalType) {
  let filterList = allAnimals;
  if (animalType === "cat") {
    filterList = allAnimals.filter(onlyCats);
  } else if (animalType === "dog") {
    filterList = allAnimals.filter(onlyDogs);
  }
  displayList(filterList);
}
function onlyCats(animal) {
  return animal.type === "cat";
}
function onlyDogs(animal) {
  return animal.type === "dog";
}
//  model////////////////

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

// view////////////////////////////////////////
function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
