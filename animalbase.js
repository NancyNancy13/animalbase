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
// global variables as an obj
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
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
  // filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  // let filterList = allAnimals;
  if (settings.filterBy === "cat") {
    // create the filter list only for cats
    filteredList = allAnimals.filter(onlyCats);
    // create the filter list only for dogs
  } else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(onlyDogs);
  }
  return filteredList;
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
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user select ${sortBy}, ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  // let sortedList = allAnimals;
  // if (sortBy === "name") {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);
  // } else if (sortBy === "type") {
  // sortedList = sortedList.sort(sortByType);
  // }

  // sort by getting all values( like by name, type, desc and age)

  function sortByProperty(animalA, animalB) {
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

// adding buildlist to combine the sorting and filtering
function buildList() {
  const currentList = filterList(allAnimals);
  const sortedList = sortList(currentList);
  displayList(sortedList);
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
