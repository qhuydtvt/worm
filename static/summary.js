const context = {
  summaryTeachers: null,
  loading: false,
  incorrect: false,
  // strToSec: 0,
}

$(document).ready(() => {
  initDate();
  selectDate();
});

const initDate = (() => {
  $("#start_date").flatpickr({
    maxDate: "today",
    defaultDate: "today",
  });
  $("#stop_date").flatpickr({
    maxDate: "today",
    defaultDate: "today",
  }); 
});


const selectDate = (() => {
  start_date = (($('#start_date')[0].value));
  stop_date = (($('#stop_date')[0].value));
  $('#start_date').on('change', (event) => {
    start_date = event.target.value;
    fetchSummary(start_date, stop_date);
  });
  $('#stop_date').on('change', (event) => {
    stop_date = event.target.value;
    fetchSummary(start_date, stop_date);
  });
  
});


const renderTeachers = (() => {
  $('#tbl_teacher_body').empty();
  teachers = context.summaryTeachers;
  totalSec = 0;
  teachers.forEach((teacher) => {
    if (teacher.time === null) {
      teacher.time = [0,0];
    }
    const tr = 
    $(`
      <tr id="${teacher._id}">
        <td>${teacher.lastName}</td>
        <td>${teacher.time[0]}</td>
        <td>${teacher.time[1]}</td>
      </tr>
    `).appendTo($('#tbl_teacher_body'));
  })
  
  const trAvg = $(`
      <tr>
        <td>Average Time</td>
        <td></td>
      </tr>
    `)
  
})


const fetchSummary = async (start_date, stop_date) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/api/log?start_time=${start_date}&stop_time=${stop_date}`,
    type: "GET"
  });
  setLoading(false);
  if(res.success === 0) {
    setIncorrect(true);
  } else {
    setIncorrect(false);
    if (res && res.teachers) {
      context.summaryTeachers = res.teachers;    
      renderTeachers();
    };
  };
};

const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#noti').removeClass('invisible');
    $('#noti')[0].innerText = "Loading...";  
  } else {
    $('#noti').addClass('invisible');
  };
};

const setIncorrect = (incorrect) => {
  context.incorrect = incorrect;
  if (context.incorrect) {
    $('#noti').removeClass('invisible');
    $('#noti')[0].innerText = "Not found logs or incorrect date :(";  
  } else {
    $('#noti').addClass('invisible');
  }
}


// const strToSec = (strTime) => { 
//   let a = strTime.split(':');
//   let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
//   context.strToSec = seconds;
// }