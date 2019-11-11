console.log('JS');
$(document).ready(jq_init);

const employees = []; //holds all employee objects
let lastFocus = $(':focus'); //used for form position control
let totalMonthly = 0; //total monthly salaries
let budget = 20000; //budget for monthly salaries
let budgetOverdraw = false; //toggles on being overbudget and returning to within budget

function jq_init() {
  console.log('JQ');
  $('#in-btn').on('click',addEmployee);
  $('#fade-box').on('click','#alert-btn',closeAlertBox);
  $('#employee-table').on('click','.delete-btn', deleteEmployee);
}

function addEmployee() {
  event.preventDefault();

  //If values are in the inputs, then continue
  if ($('#in-fname').val()!='' && $('#in-lname').val()!='' && $('#in-id').val()!='' && $('#in-title').val()!='' && $('#in-salary').val()!='') {
    //Add the new employee to the array
    employees.push({
      fname: $('#in-fname').val(),
      lname: $('#in-lname').val(),
      id: $('#in-id').val(),
      title: $('#in-title').val(),
      salary: $('#in-salary').val()
    });

    //Calculate the monthly cost
    calculateTotalMonthly();
    //Append new values
    appendEmployees();

    //Reset input values
    $('#in-fname').val('');
    $('#in-lname').val('');
    $('#in-id').val('');
    $('#in-title').val('');
    $('#in-salary').val('');
    //Reset the focus
    $('#in-fname').focus();
  } else {alertBox('Please fill out the form!');}
}

function calculateTotalMonthly() {
  //Reset the monthly total
  totalMonthly = 0;
  //Add the monthly cost of each employee to the total
  for (employee of employees) {
    totalMonthly += Math.floor(Number(employee.salary)/12);
  }
  //Change the displayed monthly total
  $('#total-monthly').text(`$${numberWithCommas(totalMonthly.toFixed(2))}`);
  //Check for overdraw status
  switch(budgetOverdraw) {
    case true:
      if (totalMonthly<=budget) {
        console.log('Salaries are within budget.');
        $('#total-monthly').removeClass('red-text');
        budgetOverdraw = false;
      }
      break;
    case false:
      if (totalMonthly>budget) {
        console.log('Salaries are over budget!');
        $('#total-monthly').addClass('red-text');
        budgetOverdraw = true;
      }
      break;
  }
}

function appendEmployees() {
  //Empty the employee table
  $('#employee-table').empty();
  //Add each table row
  //NOTE: the name for the <tr> is used to identify the index of
  //the employee in the employees array.
  for (let i=0; i<employees.length; i++) {
    $('#employee-table').append(`
      <tr name="${i}">
        <td>${employees[i].fname}</td><td>${employees[i].lname}</td><td>${employees[i].id}</td><td>${employees[i].title}</td><td>$${numberWithCommas(employees[i].salary)}</td>
        <td><button class="delete-btn">Delete</button></td>
      </tr>
      `);
  }
}

function deleteEmployee() {
  //Find the position in the array from the row name
  const pos = $(this).closest('tr').attr('name');
  //Remove the element from the table
  $(this).closest('tr').remove();
  //Alert the user of the deletion
  alertBox(`${employees[pos].fname} ${employees[pos].lname} was removed.`)
  //Remove the employee from the array
  employees.splice(pos,1);
  //Recreate the employee table
  appendEmployees();
  //Recalculate the new monthly salary cost
  calculateTotalMonthly();

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function alertBox(text) {
  //Save the last focused element
  lastFocus = $(':focus');
  //Create the box HTML
  $('#fade-box').append(`
    <div class="fade-cover">
      <div class="alert-box">
        <button type="button" id="alert-btn"><i class="far fa-times-circle"></i></button>
        <div class="alert-text-box"><p class="alert-text text-monospace">${text}</p></div>
      </div>
    </div>
  `);
  //Focus on the alert close button
  $('#alert-btn').focus();
}
function closeAlertBox() {
  $('#fade-box').empty();
  lastFocus.focus();
}
