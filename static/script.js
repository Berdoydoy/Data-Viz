fetch('/column_names')
  .then(response => response.json())
  .then(columnNames => {
    // Update the data points
    const dataPointsContainer = document.getElementById('data-points');
    dataPointsContainer.innerHTML = '';

    columnNames.forEach(columnName => {
      const div = document.createElement('div');
      div.textContent = columnName;
      div.style.color = '#fff';
      div.draggable = true; // Enable dragging

      // Add event listeners for dragging
      div.addEventListener('dragstart', dragStartHandler);
      div.addEventListener('dragend', dragEndHandler);

      dataPointsContainer.appendChild(div);
    });
  });

let draggedItem = null;
function dragStartHandler(event) {
event.dataTransfer.effectAllowed = 'move';
event.dataTransfer.setData('text/plain', event.target.textContent);
draggedItem = event.target;
}
function dragEndHandler(event) {
draggedItem = null;
}
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', dragOverHandler);
dropZone.addEventListener('drop', dropHandler);

function dragOverHandler(event) {
event.preventDefault();
}
function dropHandler(event) {
    event.preventDefault();
    const droppedData = draggedItem.textContent;
  
    if (event.target.classList.contains('drop-zone')) {      // Update the text of the drop zone based on the dropped data
      event.target.textContent = droppedData;
  
      // Add the dropped item's text to the form submission
    const form = document.getElementById('graph-form');
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = event.target.id; // Use the drop zone's ID as the input name
    input.value = droppedData;
    form.appendChild(input);
  
      // Append the dropped item to the drop zone
    } else {
      // Snap back the dragged item to its original position
      draggedItem.parentNode.appendChild(draggedItem);
    }
  }
  const form = document.getElementById('upload-form');
  const fileInput = document.getElementById('file-input');

  form.addEventListener('submit', (event) => {
    if (fileInput.files.length === 0) {
      event.preventDefault(); // Prevent form submission
      alert('Please select a file.'); // Display an error message
    }
  });

function updateDataSource(){
    var fileInput = document.getElementById("file-input");
    var dataSource = document.getElementById("data-source")

    if(fileInput.files.length >0){
        dataSource.textContent = fileInput.files[0].name;
    }else{
        dataSource.textContent = "Data Source"
    }
}
  
function uploadFile(){
    var file = document.getElementById("file-ipunt")
    $.ajax({
        url: '/upload',
        type: 'POST',
        data:{ file: file},
        success: function(response){

        },
        error: function(xhr,status,error){
            console.log('Error:',error)
        }
    });
}
  function createGraph() {
    var y_axis = document.getElementById("y-axis-drop-zone").innerText.trim();
    var x_axis = document.getElementById("x-axis-drop-zone").innerText.trim();
    $.ajax({
      url: '/create_graph',
      type: 'POST',
      data: { y_axis: y_axis, x_axis: x_axis }, // Pass the values in the data object
      success: function(response) {
        var img = $('<img>').attr('src', 'data:image/png;base64,' + response.image_data);
        $('#graph-image').attr('src', img.attr('src'));
      },
      error: function(xhr, status, error) {
        console.error('Error:', error);
      }
    });
  }


  
  
  
  
  