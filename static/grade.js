const context = {
  classRooms: [],
  selectedClassroom: null,
  loading: false,
  submittable: false,
  gradeDisabled: false,
  timeRunning: false, 
  selectedGrade: {
    tdId: "",
    value: ""
  },
  time: {
    seconds: 0,
    minutes: 0,
    hours: 0,
  },
  selectedMemberID: "",
  role: null,
};

$(document).ready(() => {
  renderGrades(); // Render empty grade tables
  initClassroomSelection(); // Config classroom => when users select classrooms
  initGradeCellSelection(); // Config grade cell => when users select grade
  initGradeProcess(); // Config grading: CLick start => Edit grade => Submit
  fetchClassrooms(); // Load classrooms 
  checkAdmin();
  initSelectOptions();
});

// API /////////////////////////////////////////////

// GET one classroom
const fetchGrades = async (classroomId) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/api/grades?classroom_id=${classroomId}`,
    type: "GET",
  });
  setLoading(false);
  if (res && res.data) {
    context.selectedClassroom = res.data;
    renderGrades();
  };
};


// GET all classrooms
const fetchClassrooms = async () => {
  setLoading(true);
  const res = await $.ajax({
    url: "/api/classroom",
    type: "GET",
  });
  setLoading(false);
  if (res && res.data) {
    context.classRooms = res.data.class;
    renderClassroomSelections();
  }
};


// POST when user click Submit button
const submit = async (classroom_id, gradeJSON) => {
  setLoading(true);
  const res = await $.ajax({
    url: `api/grades?classroom_id=${classroom_id}`,
    type: "POST",
    data: gradeJSON,
    dataType: "json",
    contentType: "application/json",
  });
  setLoading(false);
  submitUI();
}


// GET to check user is admin or not
const checkAdmin = async () => {
  setLoading(true);
  const res = await $.ajax({
    url: "/api/grades?classroom",
    type: "GET",
  });
  setLoading(false);
  
  if (res) {
    context.role = res.role;
    if (context.role === 0) {
      adminUI();
    }
  }
}



// UI/UX ////////////////////////////////////////////////

// User click Submit button
const submitUI = () => {
  $('#loading_indicator').removeClass('ui active indeterminate inline loader');
  $('#loading_indicator').removeClass('invisible');
  $('#loading_indicator').addClass('text-success');
  $('#loading_indicator')[0].innerHTML = "Update Success!";
}


// Loading data
const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#loading_indicator').addClass('ui active indeterminate inline loader');
    $('#loading_indicator')[0].innerHTML = "";
    $('#loading_indicator').removeClass('invisible');
    $('.ui.dropdown').addClass("disabled");
    $('#btn_grade').attr('disabled', true);  
  } else {
    $('.ui.dropdown').removeClass("disabled");
    $('#btn_grade').attr('disabled', false);
    if (context.role === 0) {
      adminUI();
    } else {
      $('#loading_indicator').addClass('invisible');
    }
  }
}


// Login with role admin
const adminUI = () => {
  $('#btn_grade').hide();
  $('#input_grade').hide();
  $('#time').hide();
  $('#loading_indicator').removeClass('ui active indeterminate inline loader');
  $('#loading_indicator').removeClass('invisible');
  $('#loading_indicator').addClass('text-warning');
  $('#loading_indicator')[0].innerHTML = "You're not teacher. Please login as teacher to grade!";
}


// Animation for Select-Options element
const initSelectOptions = () => {
  $('#slt_classrooms').dropdown();
}


// Highlight column and row
const hightLight = (column, row) => {
  column.css('background-color', 'rgb(145, 145, 255)');
  row.css('background-color', 'rgb(145, 145, 255)');
}

// RENDER //////////////////////////////////////////////////

// Render classrooms selections
const renderClassroomSelections = () => {
  $('#slt_classrooms').empty();
  $(`
      <option id="...">...</option>
    `).appendTo('#slt_classrooms')

  context.classRooms.forEach((classroom) => {
    $(`
      <option id=${classroom._id}>${classroom.course} ${classroom.classroom}</option>
    `).appendTo('#slt_classrooms')
  });
}


// Render table grade
const renderGrades = () => {
  $('#tbl_grade_row_sessions').empty();
  $('#tbl_grade_body').empty();
  $(`
      <th class="table-dark">Name</th>
    `).appendTo('#tbl_grade_row_sessions');

  if (!context.selectedClassroom) return;

  const sessionMax = context.selectedClassroom.session;
  const members = context.selectedClassroom.members;
  
  for(var session = 1; session <= sessionMax; session++) {
    $(`
      <th class="table-dark" id="${session - 1}">${session}</th>
    `).appendTo('#tbl_grade_row_sessions');
  }

  members.forEach((member) => {
    const tr = 
    $(`
      <tr id="${member._id}">
        <td id="${member._id}_name">
          ${member.firstName} ${member.lastName}
        </td>
      </tr>
    `);

    if (!member.grades) {
      for(var session_index = 0; session_index < sessionMax; session_index++) {
        $(`
          <td class="grade" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}">
            -
          </td>
        `).appendTo(tr);
      }
    } else {
      for(var session_index = 0; session_index < sessionMax; session_index++) {
        $(`
          <td class="grade" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}">
            ${member.grades[session_index] < 0 ? '-' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
      }
    }
    tr.appendTo('#tbl_grade_body');
  });
}


// Render control panel
const renderControlPanel = () => {
  if(context.submittable) {
    $('#tbl_grade_body .grade').addClass('changable');
    $('#btn_grade').text('Submit');
    $('#btn_grade').removeClass('btn-secondary');
    $('#btn_grade').addClass('btn-primary');
    $('#input_grade').attr('disabled', false);
  }
  else {
    $('#tbl_grade_body .grade').removeClass('changable');
    $('#btn_grade').text('Start');
    $('#btn_grade').addClass('btn-secondary');
    $('#btn_grade').removeClass('btn-primary');
    $('#input_grade').attr('disabled', true);
    $('#input_grade').val('');
  }
}



// ACTIONS /////////////////////////////////////////

// Stopwatch
const stopWatch = (timeVal) => {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  const runTime = () => {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    context.time.seconds = seconds > 9 ? seconds : "0" + seconds;
    context.time.minutes = minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00";
    context.time.hours = hours ? (hours > 9 ? hours : "0" + hours) : "00";
    timer = setTimeout(runTime, 1000);
    timeVal[0].innerText = context.time.hours + ":" + context.time.minutes + ":" + context.time.seconds;
  }
  if (context.timeRunning) { 
    timeVal[0].innerText = "00:00:00";
    timer = setTimeout(runTime, 1000);
  } else {
    clearTimeout(timer);    
  }
}


// Grade process
const initGradeProcess = () => {
  $('#btn_grade').on('click', (event) => {
    if (context.submittable) {
      context.submittable = false;
      context.gradeDisabled = true;
      context.timeRunning = false;
      context.selectedClassroom.time = context.time.hours + ":" + context.time.minutes + ":" + context.time.seconds;
      submit(context.selectedClassroom._id, JSON.stringify(context.selectedClassroom));
    }
    else {
      context.submittable = true;
      context.timeRunning = true;
    }
    stopWatch($('#time'));
    renderControlPanel();
  });
}


// Cell selections
const initGradeCellSelection = () => {
  $('#tbl_grade_body').on('click', 'td.grade.changable', (event) => {
    const text = $(event.target).text();
    const grade = text.trim() === "-" ? 0 : parseFloat(text);
    $('#input_grade').val(grade);
    $('#input_grade').focus();
    $('#input_grade').select();
    
    editGrade(event.target.attributes[2].nodeValue, event.target.id, $('#input_grade').val());
    
    const oldGradeId = $('#input_grade').attr('grade_id');
    $(`#${oldGradeId}`).removeClass('highlight');
    $(event.target).addClass('highlight');
    $('#input_grade').attr('grade_id', event.target.id);
    
    sessionIndex = $(`#${event.target.id}`).attr('session_index');
    memberID = $(`#${event.target.id}`).attr('member_id');
    column = $(`#${sessionIndex}`)
    row = $(`#${memberID + "_name"}`);
    hightLight(column, row);
  });
}


// Auto focus
const initInput = () => {
  $('#input_grade').on('focusout', function() {
    $('#input_grade').off("input", handleGradeInput);
  });
}


// Input
const handleGradeInput = (event) => {
  const tdId = context.selectedGrade.tdId;
  const inputVal = $('#input_grade').val();
  if (inputVal === ""){
    $(tdId).prevObject[0].all[tdId].innerText = "-";    
  } else {
    if (inputVal < 0) {
      context.selectedGrade.value = 0;
    } else if (inputVal > 10) {
      context.selectedGrade.value = 10;
    } else {
      context.selectedGrade.value = inputVal;  
    }
    tdValue = context.selectedGrade.value;
    $(tdId).prevObject[0].all[tdId].innerText = parseFloat(tdValue);
  }
  tdIndex = parseInt(tdId.split("_")[1]);
  context.selectedClassroom.time = context.time.hours + ":" + context.time.minutes + ":" + context.time.seconds;
  
  members = context.selectedClassroom.members;
  members.forEach((member) => {
    if (member._id === context.selectedMemberID) {
      member.grades[tdIndex] = tdValue;
    }
  })
}


// Edit grade
const editGrade = (memberID, gradeID, inputValue) => {
  context.selectedGrade.tdId = gradeID;
  context.selectedGrade.value = inputValue;
  context.selectedMemberID = memberID;
  $("#input_grade").on("input", handleGradeInput);
}


// Select classroom
const initClassroomSelection = () => {
  $('#slt_classrooms').on('change', () => {
    if(context.timeRunning) {
      $('#btn_grade').click();
      $('#time')[0].innerText = "00:00:00";
    }
    const classRoomId = $('#slt_classrooms option:selected').attr('id');
    context.selectedClassroom = context.classRooms.find(classroom => classroom._id === classRoomId);
    context.submittable = false;
    renderControlPanel();
    renderGrades(); // render empty grades of class, only members shown
    fetchGrades(classRoomId);
  });
};