var data = [];
var emailRegex =
  /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

$(document).ready(function () {
  data = [];
  var name = "",
    email = "",
    category = "",
    dateOfBirth = "",
    number = "";

  //Alphabet valdation for name
  $("#name").on("keypress", (e) => {
    var key = e.keyCode;
    if (!((key >= 65 && key <= 90) || (key >= 97 && key <= 122) || key == 32)) {
      e.preventDefault();
    }
  });

  //Bootstrap datepicker
  $("#dateOfBirth").datetimepicker({
    timepicker: false,
    datepicker: true,
    format: "d-m-Y",
  });

  //validation for number
  $("#number").on("keypress", (e) => {
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

    //add data to array
    data.push({
      name: name,
      email: email,
      category: category,
      dateOfBirth: dateOfBirth,
      number: number,
    });

    //calling print table function
    showTable();

    toastr.success("Data added successfully");
    console.log("After add");
    console.log(data);
    console.log("After add");
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

//---------------------------------Delete Details Modal Function-----------------------------------//
function deleteData(index) {
  console.log(index);

  //delete from array
  data.splice(index, 1);

  //print table
  showTable();

  //append greeting div
  if (data.length == 0) {
    $("tbody").append(
      `<tr id="hello">
        <td colspan="7">Hello😄 Enter Some Data</td>
      </tr>`
    );
  }
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
  $("#edDateOfBirth").datetimepicker({
    timepicker: false,
    datepicker: true,
    format: "d-m-Y",
  });
}

//---------------------------------Save Details Modal Function-----------------------------------//
function saveData(index) {
  $("#saveButton").removeAttr("data-dismiss");
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
      (new Date() - new Date($("#dateOfBirth").val())) /
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

  data[index].name = $("#edName").val().replace(/\s+/g, " ").trim();
  data[index].email = $("#edEmail").val().replace(/\s+/g, " ").trim();
  data[index].category = $("#edCategory").val();
  data[index].dateOfBirth = $("#edDateOfBirth").val();
  data[index].number = $("#edNumber").val();
  showTable();
  toastr.success("Data edited successfully");
  $("#saveButton").attr("data-dismiss", "modal");
}

//-------------------------------------View Details Modal Function----------------------------------//
function viewDetails(index) {
  $("#showInfo").html(
    `<div class="container-fluid">
      <div class="viewName row mx-0 w-100 text-capitalize">
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

//-------------------------------------Print Table in page Function---------------------------------//
function showTable() {
  $("tbody").html("");
  for (let i = 0; i < data.length; i++) {
    $("#tbody").append(
      `<tr id="row${i + 1}">
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${i + 1}
        </td>
        <td
          style="text-transform:capitalize"
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${data[i].name}
        </td>
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${data[i].email}
        </td>
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${data[i].category}
        </td>
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${data[i].dateOfBirth}
        </td>
        <td
          onclick="viewDetails(${i})"
          data-toggle="modal"
          data-target="#infoModal"
        >
          ${data[i].number}
        </td>
        <td class="d-flex align-items-center h-100">
          <button
            class="btn remove p-0"
            type="button"
            id="remove${i + 1}"
            onclick="delData(${i})"
            data-toggle="modal"
            data-target="#removeModal"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>

          <button
            class="btn edit p-0"
            type="button"
            id="edit${i + 1}"
            onclick="editData(${i})"
            data-toggle="modal"
            data-target="#editModal"
          >
            <i class="fa fa-edit"></i>
          </button>
        </td>
      </tr>`
    );
    if (data[i].category == "Developer") {
      $(`#row${i + 1}`).css("background", "rgba(0, 255, 128,.2)");
    } else if (data[i].category == "QA/Tester") {
      $(`#row${i + 1}`).css("background", "#fffbe1");
    } else if (data[i].category == "HR") {
      $(`#row${i + 1}`).css("background", "rgba(255, 211, 229,.5)");
    } else {
      console.log("error");
    }
  }
}
