var availableBlocks = ["lightCoral", "lightBlue", "lightSlateGrey"];
var grid = [["lightCoral", "white", "white", "lightBlue", "white", "white", "lightSlateGrey"],
            ["white", "lightCoral", "white", "lightBlue", "white", "lightSlateGrey", "white"],
            ["white", "white", "lightCoral", "lightBlue", "lightSlateGrey", "white", "white"],
            ["white", "white", "white", "lightBlue", "white", "white", "white"],
            ["white", "white", "lightCoral", "lightBlue", "lightSlateGrey", "white", "white"],
            ["white", "lightCoral", "white", "lightBlue", "white", "lightSlateGrey", "white"],
            ["lightCoral", "white", "white", "lightBlue", "white", "white", "lightSlateGrey"]];

var index;
var rowIndex;
var colIndex;
var listIndex;
var fromGrid = true;
var data = "";

for(var i = 0; i < availableBlocks.length; i++) {
    var blockList = document.getElementById("availableBlocks");
    var block = document.createElement("DIV");
    block.setAttribute("class", "singleBlock");
    block.setAttribute("id", "free" + i);
    block.draggable = "true";
    block.ondragstart = function() { drag(event); };
    block.style.backgroundColor = availableBlocks[i];
    blockList.append(block);
}

for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
        var gridDiv = document.getElementById("grid");
        var block = document.createElement("DIV");
        block.setAttribute("class", "singleBlock");
        block.setAttribute("id", i.toString() + j.toString());
        block.style.backgroundColor = grid[i][j];

        if (grid[i][j] !== "white") {
          block.draggable = "true";
        }
        else {
          block.ondrop = function() { drop(event); };
          block.ondragover = function() { allowDrop(event); };
        }

        block.ondragstart = function() { drag(event); };
        gridDiv.append(block);
    }
}

calculateData();

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    index = ev.target.id;

    if (index.charAt(0) !== 'f') {
      fromGrid = true;
      rowIndex = index.charAt(0);
      colIndex = index.charAt(1);
      rowIndex = parseInt(rowIndex, 10);
      colIndex = parseInt(colIndex, 10);
      ev.dataTransfer.setData("text", ev.target.id);
    }
    else {
      fromGrid = false;
      listIndex = index.charAt(4);
      listIndex = parseInt(listIndex, 10);
      ev.dataTransfer.setData("text", ev.target.id)
    }
}

function drop(ev) {
    ev.preventDefault();
    var dropIndex = ev.target.id;

    if (dropIndex.charAt(0) === 'a') {
      // going from the grid to the list
      if (fromGrid) {
        gridToList();
      }
    }
    else {
      var dropRowIndex = dropIndex.charAt(0);
      var dropColIndex = dropIndex.charAt(1);
      dropRowIndex = parseInt(dropRowIndex, 10);
      dropColIndex = parseInt(dropColIndex, 10);
      var dropColor = grid[dropRowIndex][dropColIndex];

      // going from the grid to the grid
      if (fromGrid) {
        gridToGrid(dropIndex, dropRowIndex, dropColIndex, dropColor);
      }
      // going from the list to the grid
      else {
        listToGrid(dropIndex, dropRowIndex, dropColIndex, dropColor);
      }
    }

    calculateData();
}

function gridToGrid(dropIndex, dropRowIndex, dropColIndex, dropColor) {
  var dragColor = grid[rowIndex][colIndex];

  document.getElementById(index).style.backgroundColor = dropColor;
  document.getElementById(dropIndex).style.backgroundColor = dragColor;

  document.getElementById(index).setAttribute('draggable', false);
  document.getElementById(dropIndex).setAttribute('draggable', true);
  document.getElementById(index).ondrop = function() { drop(event); };
  document.getElementById(index).ondragover = function() { allowDrop(event); };
  document.getElementById(dropIndex).ondrop = function() {};
  document.getElementById(dropIndex).ondragover = function() {};

  grid[rowIndex][colIndex] = dropColor;
  grid[dropRowIndex][dropColIndex] = dragColor;
}

function listToGrid(dropIndex, dropRowIndex, dropColIndex, dropColor) {
  var dragColor = availableBlocks[listIndex];
  document.getElementById(dropIndex).style.backgroundColor = dragColor;
  grid[dropRowIndex][dropColIndex] = dragColor;

  if (dropColor === "white") {
    document.getElementById(dropIndex).setAttribute('draggable', true);
    document.getElementById(dropIndex).ondrop = function() {};
    document.getElementById(dropIndex).ondragover = function() {};

    var element = document.getElementById("free" + listIndex);
    element.parentNode.removeChild(element);

    for (var i = listIndex; i < availableBlocks.length - 1; i++) {
      availableBlocks[i] = availableBlocks[i+1];
      var j = i + 1;
      document.getElementById("free" + j).setAttribute("id", "free" + i);
    }

    availableBlocks.pop();
  }

}

function gridToList() {
  var dragColor = grid[rowIndex][colIndex];
  var blockList = document.getElementById("availableBlocks");
  var block = document.createElement("DIV");
  block.setAttribute("class", "singleBlock");
  block.setAttribute("id", "free" + availableBlocks.length);
  block.draggable = "true";
  block.ondragstart = function() { drag(event); };
  block.style.backgroundColor = dragColor;
  blockList.append(block);

  document.getElementById(index).ondrop = function() { drop(event); };
  document.getElementById(index).ondragover = function() { allowDrop(event); };

  grid[rowIndex][colIndex] = "white";
  document.getElementById(index).style.backgroundColor = "white";
  availableBlocks.push(dragColor);
}

function calculateData() {
  data = "";
  for (var i = 0; i < grid.length; i++) {
    var rowNum = i + 1;
    for (var j = 0; j < grid.length; j++) {
      var colNum = j + 1;
      data += rowNum;
      data += colNum;
      data += " " + grid[i][j] + "\n";
    }
  }
}

function putDataOnPage() {
  document.getElementById("hiddenData").value = data;
}
