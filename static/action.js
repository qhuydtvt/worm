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
// const initGradeProcess = () => {
//   $('#btn_grade').on('click', (event) => {
//     if (context.submittable) {
//       context.submittable = false;
//       context.gradeDisabled = true;
//       context.timeRunning = false;
//       context.selectedClassroom.time = context.time.hours + ":" + context.time.minutes + ":" + context.time.seconds;
//       submit(context.selectedClassroom._id, JSON.stringify(context.selectedClassroom));
//     }
//     else {
//       context.submittable = true;
//       context.timeRunning = true;
//     }
//     // stopWatch($('#time'));
//     renderControlPanel();
//   });
// }


// Cell selections
const initGradeCellSelection = () => {
  $('#tbl_grade_body').on('click', 'td.grade.changable', (event) => {
    
    context.currentSession = event.currentTarget.cellIndex;
    context.currentMembIndex = event.target.parentElement.rowIndex;
    
    const tdId = event.target.id;
    const xTd = parseInt(event.target.attributes[4].nodeValue);
    const yTd = parseInt(event.target.attributes[5].nodeValue);
    
    const text = $(event.target).text();
    const grade = text.trim() === "-" ? "" : parseFloat(text);
    $('#input_grade').unbind();
    $('#input_grade').val(grade);
    $('#input_grade').focus();
    $('#input_grade').select();
    
    editGrade(event.target.attributes[2].nodeValue, tdId, xTd, yTd, $('#input_grade').val());
    
    const oldGradeId = $('#input_grade').attr('grade_id');
    $(`#${oldGradeId}`).removeClass('highlight');
    $(event.target).addClass('highlight');
    $('#input_grade').attr('grade_id', tdId);
    
    sessionIndex = $(`#${tdId}`).attr('session_index');
    memberID = $(`#${tdId}`).attr('member_id') + "_name";
    column = $(`#${sessionIndex}`)
    row = $(`#${memberID}`);
    const oldSessionIndex = $('#input_grade').attr('column_id')
    const oldMemberID = $('#input_grade').attr('row_id')
    
    $('#input_grade').attr('column_id', sessionIndex);
    $('#input_grade').attr('row_id', memberID);
    const oldColumn = $(`#${oldSessionIndex}`)
    const oldRow = $(`#${oldMemberID}`)
    hightLight(oldColumn, oldRow, column, row)

    attendance = parseInt($(`#${tdId}`).attr('attendance'));
    
    if(context.selectedGrade.attendance === 0) {
      $('#check_circle').css({
        "background-color": "",
        "color": "black",
        "border-radius": "0%"
      });
      $('#times_circle').css({
        "background-color": "black",
        "color": "white",
        "border-radius": "100%"
      });
      $('#times_circle').hover(
        function() {
          $(this).css({backgroundColor: "black",
            color: "white",
            borderRadius: "100%"})
        }
      );
      $('#check_circle').hover(
        function() {
          $(this).css({backgroundColor: "black",
            color: "white",
            borderRadius: "100%"})
        },
        function() {
          $(this).css({backgroundColor: "",
            color: "black",
            borderRadius: "0%"})
        }
      );
    } else if (context.selectedGrade.attendance === -1){
      attendanceIcons();
    } else {
      $('#check_circle').css({
        "background-color": "black",
        "color": "white",
        "border-radius": "100%"
      });
      $('#check_circle').hover(
        function() {
          $(this).css({backgroundColor: "black",
            color: "white",
            borderRadius: "100%"})
        }
      );
      $('#times_circle').hover(
        function() {
          $(this).css({backgroundColor: "black",
            color: "white",
            borderRadius: "100%"})
        },
        function() {
          $(this).css({backgroundColor: "",
            color: "black",
            borderRadius: "0%"})
        }
      );
      $('#times_circle').css({
        "background-color": "",
        "color": "black",
        "border-radius": "0%"
      })
    } 
  });
}



// click Attendance
const checkBox = () => {
  $('#check_circle').on('click', (event) => {
    tdId = context.selectedGrade.tdId;
    memberID = context.selectedMemberID;
    memberIndex = $(`#${tdId}`)[0].parentNode.sectionRowIndex;
    attendance = context.selectedClassroom.members[memberIndex].attendance;
    classroomID = context.selectedClassroom._id;

    if($(`#${tdId}`)[0].children.length === 1) {
      jumpTd();
    } else {
      if(parseInt($(`#${tdId}`).attr('y')) === context.sessionMax - 1) {
        attendance[context.currentSession - 1] = 2;
        context.selectedGrade.attendance = 2;
        $(`#${tdId}`).attr('attendance', 2);
      } else if (parseInt($(`#${tdId}`).attr('y')) === context.sessionMax) {
        attendance[context.currentSession - 1] = 3;
        context.selectedGrade.attendance = 3;
        $(`#${tdId}`).attr('attendance', 3);
      } else {
        attendance[context.currentSession - 1] = 1;
        context.selectedGrade.attendance = 1;
        $(`#${tdId}`).attr('attendance', 1);
      }
      $(`<i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>`).appendTo($(`#${tdId}`));            
      attendanceJSON = JSON.stringify({
        member_id: memberID,
        classroom_id: classroomID,
        attendance: attendance,
        currentIndex: context.currentSession - 1,
      });
      submitAttendance(attendanceJSON);
    }
  });

  $('#times_circle').on('click', (event) => {
    tdId = context.selectedGrade.tdId;
    memberID = context.selectedMemberID;
    memberIndex = $(`#${tdId}`)[0].parentNode.sectionRowIndex;
    attendance = context.selectedClassroom.members[memberIndex].attendance;
    fullName = context.selectedClassroom.members[memberIndex].fullName;
    phoneNumber = context.selectedClassroom.members[memberIndex].phoneNumber;
    linkFb = context.selectedClassroom.members[memberIndex].linkFB;
    className = context.selectedClassroom.course + " " + context.selectedClassroom.classroom;
    classroomID = context.selectedClassroom._id;
    
    if($(`#${tdId}`)[0].children.length === 1) {
      $('#times_circle').css({
        "background-color": "black",
        "color": "white",
        "border-radius": "100%"
      });
      $('#check_circle').css({
        "background-color": "",
        "color": "black",
        "border-radius": "0%"
      });
      // $(`#${tdId} i`).remove();
    }
    $(`#${tdId}`).empty();
    attendance[context.currentSession - 1] = 0;
    context.selectedGrade.attendance = 0;
    $(`#${tdId}`).attr('attendance', 0);
    attendanceJSON = JSON.stringify({
      member_id: memberID,
      member_fullname: fullName,
      member_phone:phoneNumber,
      member_fb:linkFb,
      member_class: className,
      classroom_id: classroomID,
      attendance: attendance,
      currentIndex: context.currentSession - 1
    });
    submitAttendance(attendanceJSON);
  });
}


// Init input
const initInput = () => {
  $('#input_grade').on('focusout', function() {
    $('#input_grade').off("input", handleGradeInput);
  });
}


// Input
const handleGradeInput = (event) => {
  context.selectedGrade.submitted = false;
  const tdId = context.selectedGrade.tdId;
  const inputVal = $('#input_grade').val();

  if (inputVal === ""){
    context.selectedGrade.value = "-";

  } else {
    if (inputVal < 0) {
      context.selectedGrade.value = 0;
    } else if (inputVal > 10) {
      context.selectedGrade.value = 10;
    } else {
      context.selectedGrade.value = inputVal;  
    }
  }
  tdValue = context.selectedGrade.value;
  
  
  if($(`#${tdId}`)[0].children.length === 1) {
    if(tdValue === "-") {
      $(tdId).prevObject[0].all[tdId].innerHTML = '<i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>' + "-";
    } else {
      $(tdId).prevObject[0].all[tdId].innerHTML = '<i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>' + parseFloat(tdValue);
    }
  }
  
  else { 
    $(tdId).prevObject[0].all[tdId].innerHTML = tdValue; 
  }
  tdIndex = parseInt(tdId.split("_")[1]);
  // context.selectedClassroom.time = context.time.hours + ":" + context.time.minutes + ":" + context.time.seconds;
  
  members = context.selectedClassroom.members;
  members.forEach((member) => {
    if (member._id === context.selectedMemberID) {
      if (tdValue === "-") {
        member.grades[tdIndex] = -1;        
      } else {
        member.grades[tdIndex] = tdValue;
      }
    }
  })
  
  console.log(context.selectedGrade.tdId);
  

  if (event.keyCode === 13) {
    $('#input_grade').unbind();
    console.log(context.selectedGrade.submitted);
    if (!context.selectedGrade.submitted) {
      submit(context.selectedClassroom._id, JSON.stringify(context.selectedClassroom)).then(() => {
        jumpTd();
        context.selectedGrade.submitted = true;
      });
    } else {
      jumpTd();
    }
  } 
  else {
    setTimeout(() => {
        $('#input_grade').unbind();
        submit(context.selectedClassroom._id, JSON.stringify(context.selectedClassroom))
        .then(() => {
          context.selectedGrade.submitted = true;
          $(`[x|='${context.selectedGrade.xTd}'][y|='${context.selectedGrade.yTd}']`).click();
        });
      }, 2000);
  }
}


// Edit grade
const editGrade = (memberID, gradeID, xTd, yTd, inputValue) => {
  context.selectedGrade.tdId = gradeID;
  context.selectedGrade.xTd = xTd;
  context.selectedGrade.yTd = yTd;
  context.selectedGrade.value = inputValue;
  context.selectedMemberID = memberID;
  $('#input_grade').on('keyup', handleGradeInput);
}


// Select classroom
const initClassroomSelection = () => {
  $('#slt_classrooms').on('change', () => {
    $('#input_grade').unbind();
    if(context.timeRunning) {
      // $('#btn_grade').click();
      $('#time')[0].innerText = "00:00:00";
    }
    if ($('#slt_classrooms')[0].value !== "...") {
      $('#tbl_grade').css('display','block');
    };
    
    
    const classRoomId = $('#slt_classrooms option:selected').attr('id');
    context.selectedClassroom = context.classRooms.find(classroom => classroom._id === classRoomId);
    context.submittable = false;
    renderControlPanel();
    renderGrades(); // render empty grades of class, only members shown
    fetchGrades(classRoomId);
  });
};


// Td cell Jump
const jumpTd = () => {
  const nextXTd = context.selectedGrade.xTd + 1;
  const nextYTd = context.selectedGrade.yTd;
  $(`[x|='${nextXTd}'][y|='${nextYTd}']`).click();
}

