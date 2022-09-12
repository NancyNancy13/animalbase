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

  // TODO:  event-listeners to filter buttons
  registerButtons();

  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", chooseFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", chooseSort));
}
async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

// adding sorting

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
function chooseFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(filter);
  filterList(filter);
}
function filterList(filterBy) {
  let filterList = allAnimals;
  if (filterBy === "cat") {
    // create the filter list only for cats
    filterList = allAnimals.filter(onlyCats);
    // create the filter list only for dogs
  } else if (filterBy === "dog") {
    filterList = allAnimals.filter(onlyDogs);
  }
  displayList(filterList);
}
// only cats
function onlyCats(animal) {
  return animal.type === "cat";
}
// only dogs
function onlyDogs(animal) {
  return animal.type === "dog";
}

// adding sorting//////////////////////
function chooseSort(event) {
  const sort = event.target.dataset.sort;
  console.log(sort);
  sortList(sort);
}
function sortList(sortBy) {
  let sortedList = allAnimals;
  if (sortBy === "name") {
    sortedList = sortedList.sort(sortByName);
  } else if (sortBy === "type") {
    sortedList = sortedList.sort(sortByType);
  }

  displayList(sortedList);
}
// sort by name
function sortByName(animalA, animalB) {
  if (animalA.name < animalB.name) {
    return -1;
  } else {
    return 1;
  }
}
// sort by type
function sortByType(animalA, animalB) {
  if (animalA.type < animalB.type) {
    return -1;
  } else {
    return 1;
  }
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
