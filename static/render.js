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
    if (session === sessionMax - 1) {
      $(`
      <th class="table-dark" id="${session - 1}">P</th>
    `).appendTo('#tbl_grade_row_sessions');
    } else if (session === sessionMax) {
      $(`
      <th class="table-dark" id="${session - 1}">D</th>
    `).appendTo('#tbl_grade_row_sessions');
    } else {
      $(`
      <th class="table-dark" id="${session - 1}">${session}</th>
    `).appendTo('#tbl_grade_row_sessions');
    } 
  }
  countMember = 0;
  members.forEach((member) => {
    const tr = 
    $(`
      <tr id="${member._id}">
        <td id="${member._id}_name">
          ${member.firstName} ${member.lastName}
        </td>
      </tr>
    `);
    countMember += 1;
    if (!member.grades) {
      for(var session_index = 0; session_index < sessionMax; session_index++) {
        $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}">
            -
          </td>
        `).appendTo(tr);
      }
    }
     else {
      for(var session_index = 0; session_index < sessionMax; session_index++) {
        if (member.attendance[session_index] === 1) {
          $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}" attendance="1">
            <i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>
            ${member.grades[session_index] < 0 ? '-' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
        } else if(member.attendance[session_index] === 0){
          $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}" attendance="0">
            ${member.grades[session_index] < 0 ? '' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
        } else if (member.attendance[session_index] === 2) {
          $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}" attendance="2">
            <i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>
            ${member.grades[session_index] < 0 ? '-' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
        } else if (member.attendance[session_index] === 3) {
          $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}" attendance="3">
            <i class="fas fa-check-circle float-left pl-1" style="padding-top:2px; color:black"></i>
            ${member.grades[session_index] < 0 ? '-' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
        } else {
          $(`
          <td class="grade changable" id="${member._id}_${session_index}" member_id="${member._id}" session_index="${session_index}" x="${countMember}" y="${session_index + 1}" attendance="-1">
            ${member.grades[session_index] < 0 ? '-' : member.grades[session_index] }
          </td>
        `).appendTo(tr);
        };
      }
    }
    tr.appendTo('#tbl_grade_body');
  });
}


// Render control panel
const renderControlPanel = () => {
  if(context.submittable) {
    // $('#btn_grade').text('Submit');
    // $('#btn_grade').removeClass('btn-secondary');
    // $('#btn_grade').addClass('btn-primary');
    // $('#input_grade').attr('disabled', false);
    // $('#input_grade').css('background-color', '');
  }
  else {
    // $('#btn_grade').text('Enable Grade');
    // $('#btn_grade').addClass('btn-secondary');
    // $('#btn_grade').removeClass('btn-primary');
    // $('#input_grade').attr('disabled', true);
    // $('#input_grade').css('background-color', '#b5b5b5');
    $('#input_grade').val('');
  }
}


