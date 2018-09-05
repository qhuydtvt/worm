const context = {
  classRooms: [],
  selectedClassroom: null,
  loading: false,
  submittable: false,
  gradeDisabled: false,
};

$(document).ready(() => {
  renderGrades();
  initClassroomSelection();
  initGradeCellSelection();
  initGradeProcess();
  fetchClassrooms();
});

const initGradeProcess = () => {
  $('#btn_grade').on('click', (event) => {
    if (context.submittable) {
      context.submittable = false;
      contex.gradeDisabled = true;
    }
    else {
      context.submittable = true;
    }
    renderControlPanel();
  });

  $('#input_grade').keydown(() => {
    const val = parseFloat($('#input_grade').val());
    $('#input_grade').val(val);
  });
}

const initClassroomSelection = () => {
  $('#slt_classrooms').on('change', () => {
    const classRoomId = $('#slt_classrooms option:selected').attr('id');
    context.selectedClassroom = context.classRooms.find(classroom => classroom._id === classRoomId);
    context.submittable = false;
    renderControlPanel();
    renderGrades();
    fetchGrades(classRoomId);
  });
};

const initGradeCellSelection = () => {
  $('#tbl_grade_body').on('click', 'td.grade.changable', (event) => {
    const text = $(event.target).text();
    const grade = text.trim() === "-" ? 0 : parseFloat(text);
    $('#input_grade').val(grade);
    
    const oldGradeId = $('#input_grade').attr('grade_id');
    $(`#${oldGradeId}`).removeClass('highlight');
    $(event.target).addClass('highlight');
    $('#input_grade').attr('grade_id', event.target.id);
  });
}

const fetchClassrooms = async () => {
  setLoading(true);
  const res = await $.ajax({
    url: "/api/classroom",
    type: "GET",
  });
  setLoading(false);
  if (res && res.data) {
    context.classRooms = res.data;
    renderClassroomSelections();
  }
};

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
  }
}

const renderClassroomSelections = () => {
  $('#slt_classrooms').empty();
  $(`
      <option>...</option>
    `).appendTo('#slt_classrooms')
  context.classRooms.forEach((classroom) => {
    $(`
      <option id=${classroom._id}>${classroom.course} ${classroom.classroom}</option>
    `).appendTo('#slt_classrooms')
  });
}

const renderGrades = () => {
  $('#tbl_grade_row_sessions').empty();
  $('#tbl_grade_body').empty();
  $(`
      <th class="table-info">Name</th>
    `).appendTo('#tbl_grade_row_sessions');

  if (!context.selectedClassroom) return;

  const sessionMax = context.selectedClassroom.session;
  const members = context.selectedClassroom.members;
  
  for(var session = 1; session <= sessionMax; session++) {
    $(`
      <th class="table-info">${session}</th>
    `).appendTo('#tbl_grade_row_sessions');
  }

  members.forEach((member) => {
    const tr = 
    $(`
      <tr>
        <td>
          ${member.lastName}
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

  if (context.gradeDisabled) {
    $('#btn_grade').attr('disabled', true);
  }
  else {
    $('#btn_grade').attr('disabled', false);
  }
}

const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#loading_indicator').removeClass('invisible');
  } else {
    $('#loading_indicator').addClass('invisible');
  }
}