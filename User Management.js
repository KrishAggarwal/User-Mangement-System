var data = []; // All functionalities like searching,sorting etc are performed on this array.
var originalArray = []; // Original Array which modifies only on editing,deleting and adding.
var pagedData = []; // Array for showing pagination
var emailRegex =
  /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var nameOrder = false;
var emailOrder = false;
var numberOrder = false;
var dateOfBirthOrder = false;
var currentPage = 1;
var from, //starting point of slicing data array
  to, // Ending point of slicing data array
  oldPageAnchor, // current page.
  newPageAnchor, // future current page. Both changes dynamically on clicking
  noOfRows = 5; //rows on a page
$(document).ready(function () {
  data = [];
  var name = "",
    email = "",
    category = "",
    dateOfBirth = "",
    number = "";

  //Changing search cancel and filter button
  setInterval(function () {
    x = window.innerWidth;
    if (x <= 576) {
      $(".searchButton").html(`<i class="fas fa-search"></i>`);
      $(".cancelButton").html(`<i class="fa fa-times" aria-hidden="true"></i>`);
      $(".filterButton").html(
        `<i class="fa fa-filter" aria-hidden="true"></i>`
      );
    } else {
      $(".searchButton").html("Search");
      $(".cancelButton").html("Cancel");
      $(".filterButton").html(`Filter`);
    }
  }, 100);
  //Alphabet validation for name
  $("#name").on("keypress", (e) => {
    var key = e.keyCode;
    if (!((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 32)) {
      e.preventDefault();
    }
  });

  //Alphabet validation for name in edit modal
  $("#edName").on("keypress", (e) => {
    var key = e.keyCode;
    if (!((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 32)) {
      e.preventDefault();
    }
  });

  //Bootstrap datepicker
  $("#dateOfBirth")
    .datepicker({
      autoclose: true,
      todayHighlight: true,
    })
    .datepicker("update", new Date());

  //validation for number
  $("#number").on("keypress", (e) => {
    var key = e.keyCode;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  });

  //Number validation for phone number in edit modal
  $("#edNumber").on("keypress", (e) => {
    var key = e.keyCode;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  });
  //validation for row counter
  $("#rowInput").on("keypress", (e) => {
    var key = e.keyCode;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  });

  // jQuery button clck event to add a row
  $("#add").on("click", function () {
    //Getting all the values form input and checking if its empty
    if ($("#name").val() != "") {
      name = $("#name").val().replace(/\s+/g, " ").trim();
    } else {
      toastr.warning("Enter Name First");
      return false;
    }

    if ($("#email").val() != "") email = $("#email").val();
    else {
      toastr.warning("Enter Email First");
      return false;
    }

    if ($("#category").val() != "Choose Category")
      category = $("#category").val();
    else {
      toastr.warning("Enter Category First");
      return false;
    }

    if ($("#dateOfBirth").val() != "") dateOfBirth = $("#dateOfBirth").val();
    else {
      toastr.warning("Enter Date Of Birth First");
      return false;
    }

    if ($("#number").val() != "") number = $("#number").val();
    else {
      toastr.warning("Enter Phone Number First");
      return false;
    }

    //checking email format
    if (!emailRegex.test(email)) {
      console.log("email error");
      toastr.error("Enter valid email");
      return false;
    } else if (checkDuplicateEmail(email)) {
      toastr.error("Email already exists");
      return false;
    }

    //checking date of birth
    if (
      Math.floor(
        (new Date() - new Date($("#dateOfBirth").val())) /
          (365.25 * 24 * 60 * 60 * 1000)
      ) < 10
    ) {
      console.log("Birthday error");
      toastr.error("User must be minimum 10 years old");
      return false;
    }

    //checking number's length
    if (number.length != 10) {
      console.log("number error");
      toastr.error("Enter valid number");
      return false;
    } else if (checkDuplicateNumber(number)) {
      console.log("number error");
      toastr.error("Number already exists");
      return false;
    }

    //remove greeting row
    $("#hello").remove();

    //clearing search value on adding every new data
    $("#search").val();

    // Remove sorting icon from name header
    $("#headerName").html(
      "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerEmail").html(
      "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerDateOfBirth").html(
      "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerNumber").html(
      "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );

    //Unsorting array
    if (originalArray.length != 0) {
      for (let i = 0; i < originalArray.length; i++) {
        data[i] = originalArray[i];
      }
    }

    //add data to array
    data.push({
      name: name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      email: email,
      category: category,
      dateOfBirth: dateOfBirth,
      number: number,
    });

    //Calling function for showing data and pagination
    showPageNav();
    showPage(1);

    //Adding selected class to page 1.
    newPageAnchor = document.getElementById("pg" + currentPage);
    newPageAnchor.className = "pg-selected";

    // Showing search and row filter
    $(".functionWrapper").css("visibility", "visible");

    //storing original data in a temporary array for sorting
    for (let i = 0; i < data.length; i++) {
      originalArray[i] = data[i];
    }

    //calling print table function
    // showTable(data);
    toastr.success("Data added successfully");
    console.log("After adding data");
    console.log(data);
  });
});

//-------------------------------Function to get index to pass in modal-------------------------------//
var delIndex;
function delData(index) {
  delIndex = index;
}

//-------------------------------Function to check duplicity-------------------------------//
function checkDuplicateEmail(checkEmail) {
  for (let i = 0; i < data.length; i++)
    if (data[i].email == checkEmail) return true;
  return false;
}

function checkDuplicateNumber(checkNumber) {
  for (let i = 0; i < data.length; i++)
    if (data[i].number == checkNumber) return true;
  return false;
}

//-------------------------------------Search data in table Function---------------------------------//
function searchTable() {
  let content = $("#search").val().toLowerCase();
  if (content != "") {
    // Searching for matched rows and updating data array.
    data = originalArray.filter((item) => {
      return (
        item.name.toLowerCase().includes(content) ||
        item.email.toLowerCase().includes(content) ||
        item.category.toLowerCase().includes(content) ||
        item.dateOfBirth.toLowerCase().includes(content) ||
        item.number.toLowerCase().includes(content)
      );
    });

    //Calling function for showing data and pagination
    showPageNav();
    showPage(1);

    console.log("Original array after search");
    console.log(originalArray);
    console.log("Search Results");
    console.log(data);
  }
  // If search input in empty.
  else toastr.info("Please enter something to search");
}
//----------------------------------If user clears the search bar or row filter------------------------------------//
$("#search").on("keyup", () => {
  if ($("#search").val() == "") cancelSearch();
});

$("#rowInput").on("keyup", () => {
  if ($("#rowInput").val() == "") {
    noOfRows = 5;
    $("#rowInput").val(noOfRows);
  }

  //Calling function for showing data and pagination
  showPageNav();
  showPage(1);
});
//-------------------------------Cancel table search function------------------------------//
function cancelSearch() {
  // Emptying search and No data found row
  $("#search").val("");
  $("#empty").remove();
  for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];

  //Calling function for showing data and pagination
  showPageNav();
  showPage(1);

  console.log("After canceling search");
  console.log(data);
}

//---------------------------------Delete Details Modal Function-----------------------------------//
function deleteData(index) {
  //deleting form original Array.
  for (let i = 0; i < originalArray.length; i++) {
    if (data[index].email == originalArray[i].email) originalArray.splice(i, 1);
  }

  //delete from data array
  data.splice(index, 1);

  // if only one element matches search
  if (data.length == 0) {
    for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
  }

  //Calling function for showing data and pagination
  showPageNav();
  if (data.length % noOfRows == 0 && pagedData.length == 1)
    showPage(Math.ceil(data.length / noOfRows));
  else showPage(currentPage);

  //append greeting div
  if (originalArray.length == 0) {
    $("#uploadButton").css("display", "block");
    $("tbody").append(
      `<tr id="hello">
        <td colspan="7">😄😄Welcome Sir. Please Enter Data😄😄</td>
      </tr>`
    );

    // Changing icons of header columns to unsorted
    $(".functionWrapper").css("visibility", "hidden");
    $("#headerName").html(
      "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerEmail").html(
      "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerDateOfBirth").html(
      "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerNumber").html(
      "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
  }

  // clearing search box;
  $("#search").val("");

  console.log("original array after deletion");
  console.log(originalArray);
  console.log("Array after deletion");
  console.log(data);
}

//---------------------------------Edit Details Modal Function-----------------------------------//
function editData(index) {
  delIndex = index;

  //Edit data modal form
  $("#editInfo").html(
    `<div class="container-fluid">
    <form class="form-horizontal">
      <div class="editName form-group text-capitalize">
        <label for="name">Name: </label>
        <input type="text" class="form-control" id="edName" name="name" value="${data[index].name}" />
      </div>
      <div class="editEmail form-group">
        <label for="email">Email: </label>
        <input type="text" class="form-control" id="edEmail" name="email" value="${data[index].email}" />
      </div>
      <div class="editCategory form-group">
        <label for="category">Category: </label>
        <select name="category" class="form-control" id="edCategory">
          <option value="${data[index].category}">
            ${data[index].category}
          </option>
          <option value="Developer">Developer</option>
          <option value="QA/Tester">QA/Tester</option>
          <option value="HR">HR</option>
        </select>
      </div>
      <div class="editDob form-group">
        <label for="dateOfBirth">Date of Birth: </label>
        <input
          type="text"
          class="form-control"
          id="edDateOfBirth"
          name="dateOfBirth"
          placeholder="Select Date"
          value="${data[index].dateOfBirth}"
        />
      </div>
      <div class="editPhone form-group">
        <label for="number">Number: </label>
        <input
          type="text"
          class="form-control mb-0"
          id="edNumber"
          name="number"
          value="${data[index].number}"
          maxlength="10"
        />
      </div>
      </form>
    </div>`
  );

  //Bootstrap datepicker
  $("#edDateOfBirth").datepicker({
    autoclose: true,
    //  defaultDate: `"${data[index].dateOfBirth}"`,
    defaultDate: "08/07/2001",
  });
}

//---------------------------------update Details Modal Function-----------------------------------//
function updateData(index) {
  //modal will not close unless you fill all data
  $("#updateButton").removeAttr("data-dismiss");

  //Validating if data is'nt empty
  if ($("#edName").val() == "") {
    toastr.warning("Enter Name First");
    return false;
  }

  if ($("#edEmail").val() == "") {
    toastr.warning("Enter Email First");
    return false;
  }

  if ($("#edDateOfBirth").val() == "") {
    toastr.warning("Enter Date Of Birth First");
    return false;
  }

  if ($("#edNumber").val() == "") {
    toastr.warning("Enter Phone Number First");
    return false;
  }

  //checking email format
  if (!emailRegex.test($("#edEmail").val())) {
    console.log("email error");
    toastr.error("Enter valid email");
    return false;
  } else if (checkEditedEmail($("#edEmail").val())) {
    toastr.error("Email already exists");
    return false;
  }

  //checking minimum age of user
  if (
    Math.floor(
      (new Date() - new Date($("#edDateOfBirth").val())) /
        (365.25 * 24 * 60 * 60 * 1000)
    ) < 10
  ) {
    console.log("Birthday error");
    toastr.error("User must be minimum 10 years old");
    return false;
  }

  //checking number's length
  if ($("#edNumber").val().length != 10) {
    console.log("number error");
    toastr.error("Enter valid number");
    return false;
  } else if (checkEditedNumber($("#edNumber").val())) {
    toastr.error("Number already exists");
    return false;
  }

  //check duplicate email
  function checkEditedEmail(checkEmail) {
    for (let i = 0; i < data.length; i++)
      if (data[i].email == checkEmail && i != index) return true;
    return false;
  }

  //check duplicate number
  function checkEditedNumber(checkNumber) {
    for (let i = 0; i < data.length; i++)
      if (data[i].number == checkNumber && i != index) return true;
    return false;
  }

  //Updating data in array
  data[index].name = $("#edName")
    .val()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\s+/g, " ") //trim all extra white spaces
    .trim();
  data[index].email = $("#edEmail").val().replace(/\s+/g, " ").trim();
  data[index].category = $("#edCategory").val();
  data[index].dateOfBirth = $("#edDateOfBirth").val();
  data[index].number = $("#edNumber").val();

  //unsorting every time after updating a row
  unsort();

  //Calling function for showing data
  showRecords(from, to);

  toastr.success("Data edited successfully");
  $("#updateButton").attr("data-dismiss", "modal");
  console.log("Original array after editing");
  console.log(originalArray);
  console.log("Array After Editing");
  console.log(data);
}

//-------------------------------------View Details Modal Function----------------------------------//
function viewDetails(index) {
  $("#showInfo").html(
    `<div class="container-fluid">
      <div class="viewName row mx-0 w-100">
        <p>Name: ${data[index].name}</p>
      </div>
      <div class="viewEmail row mx-0 w-100">
        <p>Email: ${data[index].email}</p>
      </div>
      <div class="viewCategory row m-auto w-100">
        <p>Category: ${data[index].category}</p>
      </div>
      <div class="viewDob row mx-0 w-100">
        <p>Date Of Birth: ${data[index].dateOfBirth}</p>
      </div>
      <div class="viewPhone row mx-0 w-100">
        <p class="mb-0">Phone Number: ${data[index].number}</p>
      </div>
    </div>`
  );
}

//-----------------------------------------Sorting on basis of Name-----------------------------------------//
function nameSort() {
  // toggle order for aesc and desc search
  nameOrder = !nameOrder;

  if (data.length != 0) {
    if (nameOrder) {
      //changing icon of name header according to sort
      $("#headerName").html(`Name <i class="fa-solid fa-arrow-down-a-z"></i>`);
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    } else {
      $("#headerName").html(`Name <i class="fa-solid fa-arrow-down-z-a"></i>`);
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    }

    //sorting in aesc and desc
    nameOrder
      ? data.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
        );

    //Calling function for showing data
    showRecords(from, to);

    console.log("Original array after sorting by name");
    console.log(originalArray);
    console.log("Array after sorting");
    console.log(data);
  }
}

//-----------------------------------------Sorting on basis of Email-----------------------------------------//
function emailSort() {
  // toggle order for aesc and desc search
  emailOrder = !emailOrder;

  if (data.length != 0) {
    if (emailOrder) {
      //changing icon of email header according to sort
      $("#headerEmail").html(
        `Email <i class="fa-solid fa-arrow-down-a-z"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    } else {
      $("#headerEmail").html(
        `Email <i class="fa-solid fa-arrow-down-z-a"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    }

    //sorting in aesc and desc
    emailOrder
      ? data.sort((a, b) =>
          a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.email.toLowerCase() < b.email.toLowerCase() ? 1 : -1
        );

    //Calling function for showing data
    showRecords(from, to);

    console.log("Original array after sorting by email");
    console.log(originalArray);
    console.log("Array after sorting");
    console.log(data);
  }
}

//-----------------------------------------Sorting on basis of Birthday-----------------------------------------//
function dateOfBirthSort() {
  // toggle order for aesc and desc search
  dateOfBirthOrder = !dateOfBirthOrder;

  if (data.length != 0) {
    //changing icon of birthday header according to sort
    if (dateOfBirthOrder) {
      $("#headerDateOfBirth").html(
        `Birthday <i class="fa-solid fa-arrow-down-1-9"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    } else {
      $("#headerDateOfBirth").html(
        `Birthday <i class="fa-solid fa-arrow-down-9-1"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerNumber").html(
        "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    }

    //sorting in aesc and desc
    dateOfBirthOrder
      ? data.sort((a, b) =>
          new Date(a.dateOfBirth).getTime() > new Date(b.dateOfBirth).getTime()
            ? 1
            : -1
        )
      : data.sort((a, b) =>
          new Date(a.dateOfBirth).getTime() < new Date(b.dateOfBirth).getTime()
            ? 1
            : -1
        );

    //Calling function for showing data
    showRecords(from, to);

    console.log("Original array after sorting by date of birth");
    console.log(originalArray);
    console.log("Array after sorting");
    console.log(data);
  }
}

//-------------------------------------------Sorting on basis of Number-------------------------------------------//
function numberSort() {
  // toggle order for aesc and desc search
  numberOrder = !numberOrder;
  if (data.length != 0) {
    //changing icon of number header according to sort
    if (numberOrder) {
      $("#headerNumber").html(
        `Number <i class="fa-solid fa-arrow-down-1-9"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    } else {
      $("#headerNumber").html(
        `Number <i class="fa-solid fa-arrow-down-9-1"></i>`
      );
      $("#headerName").html(
        "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerEmail").html(
        "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
      $("#headerDateOfBirth").html(
        "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
      );
    }
    //sorting in aesc and desc
    numberOrder
      ? data.sort((a, b) =>
          a.number.toLowerCase() > b.number.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.number.toLowerCase() < b.number.toLowerCase() ? 1 : -1
        );

    //Calling function for showing data
    showRecords(from, to);

    console.log("Original array after sorting by number");
    console.log(originalArray);
    console.log("Array after sorting");
    console.log(data);
  }
}

//-------------------------------------Print Table in page Function---------------------------------//
function showTable(array) {
  //Printing data of array on page.
  $("tbody").html("");
  for (let i = 0; i < array.length; i++) {
    $("#tbody").append(
      `<tr id="row${i + 1}">
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${(currentPage - 1) * noOfRows + i + 1}
        </td>
        <td
          style="text-transform:capitalize"
          onclick="viewDetails(${(currentPage - 1) * noOfRows + i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${array[i].name}
        </td>
        <td
          onclick="viewDetails(${(currentPage - 1) * noOfRows + i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${array[i].email}
        </td>
        <td
          onclick="viewDetails(${(currentPage - 1) * noOfRows + i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${array[i].category}
        </td>
        <td
          onclick="viewDetails(${(currentPage - 1) * noOfRows + i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${array[i].dateOfBirth}
        </td>
        <td
          onclick="viewDetails(${(currentPage - 1) * noOfRows + i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${array[i].number}
        </td>
        <td class="d-flex align-items-center h-100">
          <button
            class="btn remove p-0"
            type="button"
            id="remove${(currentPage - 1) * noOfRows + i}"
            onclick="delData(${(currentPage - 1) * noOfRows + i})"
            data-toggle="modal"
            data-target="#removeModal"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>

          <button
            class="btn edit p-0"
            type="button"
            id="edit${(currentPage - 1) * noOfRows + i}"
            onclick="editData(${(currentPage - 1) * noOfRows + i})"
            data-toggle="modal"
            data-target="#editModal"
          >
            <i class="fa fa-edit"></i>
          </button>
        </td>
      </tr>`
    );
    // Giving row colors according to job role.
    if (array[i].category == "Developer") {
      $(`#row${i + 1}`).css("background", "rgba(0, 255, 128,.2)");
    } else if (array[i].category == "QA/Tester") {
      $(`#row${i + 1}`).css("background", "#fffbe1");
    } else if (array[i].category == "HR") {
      $(`#row${i + 1}`).css("background", "rgba(255, 211, 229,.5)");
    } else {
      console.log("Color Error");
    }
  }
}

//-------------------------------------Unsort table in original array Function---------------------------------//
function unsort() {
  //Changing sorted icon to unsorted
  if (originalArray.length != 0) {
    $("#headerName").html(
      "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerEmail").html(
      "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerDateOfBirth").html(
      "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );
    $("#headerNumber").html(
      "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
    );

    //checking if user is not unsorting with search applied
    if ($("#search").val() == "") {
      for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
      showPageNav();
      showPage(1);
    }
    // Case for unsorting while search is applied
    else {
      searchTable();
    }
    //changing sort order of all columns.
    nameOrder = emailOrder = dateOfBirthOrder = numberOrder = false;
  }
}

//------------------------------------------Row Filter------------------------------------//
function showRows() {
  //Checking no of rows that are going to be on page.
  noOfRows = $("#rowInput").val();
  //Calling function for showing data and pagination
  showPageNav();
  showPage(1);
}

//------------------------------------------Pagination-------------------------------------//

//------------------------------------------ Showing Rows on page ------------------------------------------//
function showRecords(from, to) {
  // Changing cursor to blocked on next prev first last button according to current page.
  if (Math.ceil(data.length / noOfRows) > 1) {
    if (from == 0) {
      $("#pg-prev").css("cursor", "not-allowed");
      $("#pg-first").css("cursor", "not-allowed");
      $("#pg-next").css("cursor", "pointer");
      $("#pg-last").css("cursor", "pointer");
    } else if (data.length <= to) {
      $("#pg-next").css("cursor", "not-allowed");
      $("#pg-last").css("cursor", "not-allowed");
      $("#pg-prev").css("cursor", "pointer");
      $("#pg-first").css("cursor", "pointer");
    } else {
      $("#pg-prev").css("cursor", "pointer");
      $("#pg-first").css("cursor", "pointer");
      $("#pg-next").css("cursor", "pointer");
      $("#pg-last").css("cursor", "pointer");
    }
  } else {
    $("#pg-prev").css("cursor", "not-allowed");
    $("#pg-first").css("cursor", "not-allowed");
    $("#pg-next").css("cursor", "not-allowed");
    $("#pg-last").css("cursor", "not-allowed");
  }

  //Data that will be on page.
  pagedData = data.slice(from, to);

  //calling showTable function to print table data.
  showTable(pagedData);

  //Information about no. of entries on current page.
  $("#range").css("display", "block");
  if (data.length < to)
    $("#range").html(
      `Showing ${from + 1} to ${data.length} entries from total ${
        data.length
      } entries`
    );
  else {
    $("#range").html(
      `Showing ${from + 1} to ${to} entries from total ${data.length} entries`
    );
  }
}
//------------------------------------------ For Current page OR switching pages ------------------------------------//
function showPage(pageNumber) {
  if (data.length != 0) {
    //checking if oldPageAnchor becomes null.
    //For search cases where no.of searched pages are less than total pages.
    if (currentPage <= Math.ceil(data.length / noOfRows)) {
      oldPageAnchor = document.getElementById("pg" + currentPage);
      oldPageAnchor.className = "pg-normal";
    }
    currentPage = pageNumber; //changing current page.
    //Updating pagination bar
    showPageNav();
    newPageAnchor = document.getElementById("pg" + currentPage);
    newPageAnchor.className = "pg-selected";
    from = (pageNumber - 1) * noOfRows;
    to = parseInt((pageNumber - 1) * noOfRows) + parseInt(noOfRows);

    // Showing data in array
    showRecords(from, to);
  } else {
    //when nothing matches search input
    $("#tbody").html("");
    $("#tbody").append(
      `<tr id="empty">
          <td colspan="7">Oops!! No data found</td>
        </tr>`
    );
    $("#range").html(`Showing 0 entries from total 0 entries`);
  }
}

// For jumping directly on First page | << |
function firstPage() {
  showPage(1);
}

// For previous page
function prev() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}

// For next page
function next() {
  if (currentPage < data.length / noOfRows) {
    showPage(currentPage + 1);
  }
}

// For jumping directly on Last page | >> |
function lastPage() {
  showPage(Math.ceil(data.length / noOfRows));
}

//------------------------------------------------- For pagination bar ---------------------------------------//
function showPageNav() {
  var pagerHtml =
    '<span onclick="firstPage()" id="pg-first" class="pg-normal"><<</span>' + // | << |
    '<span onclick="prev()" id="pg-prev" class="pg-normal">Prev</span>'; // | Prev |
  if (Math.ceil(data.length / noOfRows) > 5) {
    if (currentPage >= 4) {
      pagerHtml +=
        '<span id="pg1"' +
        'class="pg-normal"' +
        'onclick="showPage(1)">' +
        "1" +
        "</span> " +
        '<span id="other"' +
        'class="pg-normal">' +
        "..." +
        "</span> ";
      if (currentPage <= Math.ceil(data.length / noOfRows) - 4) {
        for (var page = currentPage - 1; page <= currentPage + 1; page++) {
          pagerHtml +=
            '<span id="pg' +
            page +
            '" class="pg-normal" onclick="showPage(' +
            page +
            ')">' +
            page +
            "</span> ";
        }
        pagerHtml +=
          '<span id="other"' + 'class="pg-normal">' + "..." + "</span> "; // | ... |
        pagerHtml +=
          '<span id="pg' +
          Math.ceil(data.length / noOfRows) +
          '" class="pg-normal" onclick="showPage(' +
          Math.ceil(data.length / noOfRows) +
          ')">' +
          Math.ceil(data.length / noOfRows) +
          "</span> ";
      } else {
        for (
          var page = Math.ceil(data.length / noOfRows) - 4;
          page <= Math.ceil(data.length / noOfRows);
          page++
        ) {
          pagerHtml +=
            '<span id="pg' +
            page +
            '" class="pg-normal" onclick="showPage(' +
            page +
            ')">' +
            page +
            "</span> ";
        }
      }
    } else {
      for (var page = 1; page <= 3; page++) {
        pagerHtml +=
          '<span id="pg' +
          page +
          '" class="pg-normal" onclick="showPage(' +
          page +
          ')">' +
          page +
          "</span> ";
      }
      pagerHtml +=
        '<span id="other"' + 'class="pg-normal">' + "..." + "</span> ";
      pagerHtml +=
        '<span id="pg' +
        Math.ceil(data.length / noOfRows) +
        '" class="pg-normal" onclick="showPage(' +
        Math.ceil(data.length / noOfRows) +
        ')">' +
        Math.ceil(data.length / noOfRows) +
        "</span> ";
    }
  } else {
    for (var page = 1; page <= Math.ceil(data.length / noOfRows); page++) {
      pagerHtml +=
        '<span id="pg' +
        page +
        '" class="pg-normal" onclick="showPage(' +
        page +
        ')">' +
        page +
        "</span> ";
    }
  }

  pagerHtml +=
    '<span onclick="next()" class="pg-normal" id="pg-next"> Next</span>' + //  | Next |
    '<span onclick="lastPage()" id="pg-last" class="pg-normal">>></span>'; //   | >> |
  $("#paginationWrapper").html(pagerHtml);
  $("#other").css("cursor", "not-allowed"); //changing cursor type of | ... | button to blocked.
}
//------------------------------------Upload hard coded data--------------------------------//
function uploadData() {
  //Adding data to original array.
  originalArray.push(
    {
      name: "John",
      email: "john@gmail.com",
      category: "Developer",
      dateOfBirth: "01/02/2000",
      number: "1234567890",
    },
    {
      name: "Harry",
      email: "harry@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "03/04/2001",
      number: "1234567891",
    },
    {
      name: "Chris",
      email: "chris@gmail.com",
      category: "HR",
      dateOfBirth: "05/06/2002",
      number: "1234567892",
    },
    {
      name: "Zoe",
      email: "zoe@gmail.com",
      category: "Developer",
      dateOfBirth: "07/08/2003",
      number: "1234567893",
    },
    {
      name: "Raven",
      email: "raven@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "09/10/2004",
      number: "1234567894",
    },
    {
      name: "John1",
      email: "john1@gmail.com",
      category: "Developer",
      dateOfBirth: "01/02/2000",
      number: "1234567895",
    },
    {
      name: "Harry1",
      email: "harry1@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "03/04/2001",
      number: "1234567896",
    },
    {
      name: "Chris1",
      email: "chris1@gmail.com",
      category: "HR",
      dateOfBirth: "05/06/2002",
      number: "1234567897",
    },
    {
      name: "Zoe1",
      email: "zoe1@gmail.com",
      category: "Developer",
      dateOfBirth: "07/08/2003",
      number: "1234567898",
    },
    {
      name: "Raven1",
      email: "raven1@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "09/10/2004",
      number: "1234567899",
    },
    {
      name: "John2",
      email: "john2@gmail.com",
      category: "Developer",
      dateOfBirth: "01/02/1999",
      number: "2234567895",
    },
    {
      name: "Harry2",
      email: "harry2@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "03/04/1998",
      number: "2234567896",
    },
    {
      name: "Chris2",
      email: "chris2@gmail.com",
      category: "HR",
      dateOfBirth: "05/06/1997",
      number: "2234567897",
    },
    {
      name: "Zoe2",
      email: "zoe2@gmail.com",
      category: "Developer",
      dateOfBirth: "07/08/1995",
      number: "2234567898",
    },
    {
      name: "Raven2",
      email: "raven2@gmail.com",
      category: "QA/Tester",
      dateOfBirth: "09/10/1994",
      number: "2234567899",
    }
  );
  //Pushing into data array
  for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
  $(".functionWrapper").css("visibility", "visible");

  //if you want to add more data comment below line
  //but it will behave unusually because email and number will be same.
  //$("#uploadButton").css("display", "none");

  // Adding/Changing sorted icon in th header
  $("#headerSNo").html(
    "S.No <i class='fa-solid fa-arrow-down-up-across-line'></i>"
  );
  $("#headerName").html(
    "Name <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
  );
  $("#headerEmail").html(
    "Email <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
  );
  $("#headerDateOfBirth").html(
    "Birthday <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
  );
  $("#headerNumber").html(
    "Number <i class='fa-solid fa-arrow-down'></i><i class='fa-solid fa-arrow-up'></i>"
  );

  //Calling function for showing data and pagination
  showPageNav();
  showPage(1);

  //Adding selected class to page 1.
  newPageAnchor = $(`#pg${currentPage}`);
  newPageAnchor.className = "pg-selected";
  console.log("Original array after upload");
  console.log(originalArray);
  console.log("Data array after upload");
  console.log(data);
}

//---------------------------------------css for toastr---------------------------------//
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
