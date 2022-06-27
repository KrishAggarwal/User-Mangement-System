var data = [];
var originalArray = [];
var pagedData = [];
var emailRegex =
  /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var nameOrder = false;
var emailOrder = false;
var numberOrder = false;
var dateOfBirthOrder = false;
var currentPage = 1;
var from,
  to,
  oldPageAnchor,
  newPageAnchor,
  noOfRows = 5;
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
    $("#headerName").html("Name <i class='fas fa-sort'></i>");
    $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
    $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
    $("#headerNumber").html("Number <i class='fas fa-sort'></i>");

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

    showPageNav();
    showPage(1);
    var newPageAnchor = document.getElementById("pg" + currentPage);
    newPageAnchor.className = "pg-selected";

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
    data = originalArray.filter((item) => {
      return (
        item.name.toLowerCase().includes(content) ||
        item.email.toLowerCase().includes(content) ||
        item.category.toLowerCase().includes(content) ||
        item.dateOfBirth.toLowerCase().includes(content) ||
        item.number.toLowerCase().includes(content)
      );
    });
    showPageNav();
    showPage(1);
    console.log("Original array after search");
    console.log(originalArray);
    console.log("Search Results");
    console.log(data);
  } else toastr.info("Please enter something to search");
}
//----------------------------------If user clears the search bar or row filter------------------------------------//
$("#search").on("keyup", () => {
  if ($("#search").val() == "") cancelSearch();
});
$("#rowInput").on("keyup", () => {
  if ($("#rowInput").val() == "") noOfRows = 5;
  showPageNav();
  showPage(1);
});
//-------------------------------Cancel table search function------------------------------//
function cancelSearch() {
  $("#search").val("");
  $("#empty").remove();
  for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
  showPageNav();
  showPage(1);
  console.log("After canceling search");
  console.log(data);
}

//---------------------------------Delete Details Modal Function-----------------------------------//
function deleteData(index) {
  for (let i = 0; i < originalArray.length; i++) {
    if (data[index].email == originalArray[i].email) originalArray.splice(i, 1);
  }

  //delete from array
  data.splice(index, 1);

  // if only one element matches search
  if (data.length == 0) {
    for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
  }
  //print table
  // showTable(data);
  console.log("fd"+pagedData.length);
  showPageNav();
  if(data.length % noOfRows==0 && pagedData.length==1)
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
    $(".functionWrapper").css("visibility", "hidden");
    $("#headerName").html("Name <i class='fas fa-sort'></i>");
    $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
    $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
    $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
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
  $("#updateButton").removeAttr("data-dismiss");
  //checking validation of edited data
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

  data[index].name = $("#edName")
    .val()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  data[index].email = $("#edEmail").val().replace(/\s+/g, " ").trim();
  data[index].category = $("#edCategory").val();
  data[index].dateOfBirth = $("#edDateOfBirth").val();
  data[index].number = $("#edNumber").val();

  //printing table
  // showTable(data);
  unsort();
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
  nameOrder = !nameOrder;
  if (data.length != 0) {
    if (nameOrder) {
      $("#headerName").html(
        `Name <i class="fa fa-sort-asc" aria-hidden="true"></i>`
      );
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    } else {
      $("#headerName").html(
        `Name <i class="fa fa-sort-desc" aria-hidden="true"></i>`
      );
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    }

    nameOrder
      ? data.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
        );

    // showTable(da);
    showRecords(from, to);
    console.log("Original array after sorting by name");
    console.log(originalArray);

    console.log("Array after sorting");
    console.log(data);
  }
}

//-----------------------------------------Sorting on basis of Email-----------------------------------------//
function emailSort() {
  emailOrder = !emailOrder;
  if (data.length != 0) {
    if (emailOrder) {
      $("#headerEmail").html(
        `Email <i class="fa fa-sort-asc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    } else {
      $("#headerEmail").html(
        `Email <i class="fa fa-sort-desc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    }
    emailOrder
      ? data.sort((a, b) =>
          a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.email.toLowerCase() < b.email.toLowerCase() ? 1 : -1
        );

    // showTable(data);
    showRecords(from, to);
    console.log("Original array after sorting by email");
    console.log(originalArray);

    console.log("Array after sorting");
    console.log(data);
  }
}

//-----------------------------------------Sorting on basis of Birthday-----------------------------------------//
function dateOfBirthSort() {
  dateOfBirthOrder = !dateOfBirthOrder;
  if (data.length != 0) {
    if (dateOfBirthOrder) {
      $("#headerDateOfBirth").html(
        `Birthday <i class="fa fa-sort-asc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    } else {
      $("#headerDateOfBirth").html(
        `Birthday <i class="fa fa-sort-desc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    }
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
    // showTable(data);
    showRecords(from, to);
    console.log("Original array after sorting by date of birth");
    console.log(originalArray);

    console.log("Array after sorting");
    console.log(data);
  }
}

//-------------------------------------------Sorting on basis of Number-------------------------------------------//
function numberSort() {
  numberOrder = !numberOrder;
  if (data.length != 0) {
    if (numberOrder) {
      $("#headerNumber").html(
        `Number <i class="fa fa-sort-asc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
    } else {
      $("#headerNumber").html(
        `Number <i class="fa fa-sort-desc" aria-hidden="true"></i>`
      );
      $("#headerName").html("Name <i class='fas fa-sort'></i>");
      $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
      $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
    }
    numberOrder
      ? data.sort((a, b) =>
          a.number.toLowerCase() > b.number.toLowerCase() ? 1 : -1
        )
      : data.sort((a, b) =>
          a.number.toLowerCase() < b.number.toLowerCase() ? 1 : -1
        );

    // showTable(data);
    showRecords(from, to);
    console.log("Original array after sorting by number");
    console.log(originalArray);

    console.log("Array after sorting");
    console.log(data);
  }
}

//-------------------------------------Print Table in page Function---------------------------------//
function showTable(array) {
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
  if (originalArray.length != 0) {
    $("#headerName").html("Name <i class='fas fa-sort'></i>");
    $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
    $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
    $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
    if ($("#search").val() == "") {
      for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
      console.log("hello");
      showPageNav();
      showPage(1);
    }
    // Case for unsorting while search is applied
    else {
      searchTable();
    }
  }
}
var noOfRows = 5;
function showRows() {
  noOfRows = $("#rowInput").val();
  showPageNav();
  showPage(1);
}
//pagination

function showRecords(from, to) {
  if (from == 0) {
    $("#pg-prev").css("cursor", "not-allowed");
    $("#pg-first").css("cursor", "not-allowed");
    $("#pg-next").css("cursor", "pointer");
    $("#pg-last").css("cursor", "pointer");
  } else if (to == originalArray.length) {
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

  pagedData = data.slice(from, to);
  showTable(pagedData);
  $("#range").css("display", "block");
  if (data.length < to)
    $("#range").html(
      `Showing ${from + 1} to ${data.length} entries from ${
        data.length
      } entries`
    );
  else {
    $("#range").html(
      `Showing ${from + 1} to ${to} entries from total ${data.length} entries`
    );
  }
}

function showPage(pageNumber) {
  console.log("page " + pageNumber);
  console.log(currentPage);
  if (data.length != 0) {
    if (currentPage <= Math.ceil(data.length / noOfRows)) {
      oldPageAnchor = document.getElementById("pg" + currentPage);
      oldPageAnchor.className = "pg-normal";
    }
    currentPage = pageNumber;
    newPageAnchor = document.getElementById("pg" + currentPage);
    newPageAnchor.className = "pg-selected";
    from = (pageNumber - 1) * noOfRows;
    to = parseInt((pageNumber - 1) * noOfRows) + parseInt(noOfRows);
    console.log(currentPage);
    showRecords(from, to);
  } else {
    $("#tbody").html("");
    $("#tbody").append(
      `<tr id="empty">
          <td colspan="7">Oops!! No data found</td>
        </tr>`
    );
    $("#range").html(`Showing 0 entries from total 0 entries`);
  }
}
function firstPage() {
  showPage(1);
}
function prev() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}
function next() {
  if (currentPage < data.length / noOfRows) {
    showPage(currentPage + 1);
  }
}

function lastPage() {
  showPage(Math.ceil(data.length / noOfRows));
}

function showPageNav() {
  var pagerHtml =
    '<span onclick="firstPage()" id="pg-first" class="pg-normal"><<</span>' +
    '<span onclick="prev()" id="pg-prev" class="pg-normal">Previous</span>';
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
  pagerHtml +=
    '<span onclick="next()" class="pg-normal" id="pg-next"> Next</span>' +
    '<span onclick="lastPage()" id="pg-last" class="pg-normal">>></span>';
  element = $("#paginationWrapper").html(pagerHtml);
}

//css for toastr
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

function uploadData() {
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
  for (let i = 0; i < originalArray.length; i++) data[i] = originalArray[i];
  $(".functionWrapper").css("visibility", "visible");
  //$('#uploadButton').css("display", "none");
  // Remove sorting icon from name header
  $("#headerSNo").html(
    "S.No <i class='fa-solid fa-arrow-down-up-across-line'></i>"
  );
  $("#headerName").html("Name <i class='fas fa-sort'></i>");
  $("#headerEmail").html("Email <i class='fas fa-sort'></i>");
  $("#headerDateOfBirth").html("Birthday <i class='fas fa-sort'></i>");
  $("#headerNumber").html("Number <i class='fas fa-sort'></i>");
  showPageNav();
  showPage(1);
  var newPageAnchor = document.getElementById("pg" + currentPage);
  newPageAnchor.className = "pg-selected";
  console.log("Original array after upload");
  console.log(originalArray);
  console.log("Data array after upload");
  console.log(data);
}
