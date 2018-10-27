const context = {
  summaryTeachers: null,
  summaryClassrooms: null,
  loading: false,
  incorrect: false,
  totalDays: 0,
  timeRounded: ""
}

$(document).ready(() => {
  initDate();
  selectDate();
  fetchSummary(($('#start_date')[0].value), ($('#stop_date')[0].value));
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
  totalSecPerDay = 0;
  teachers.forEach((teacher) => {
    if (teacher.time === null) {
      teacher.time = ["0:00:00","0:00:00"];
    }
    round2Decimal(teacher.time[1]);
    
    const tr = 
    $(`
      <tr id="${teacher._id}">
        <td>${teacher.lastName}</td>
        <td>${teacher.time[0]}</td>
        <td>${context.timeRounded}</td>
      </tr>
    `).appendTo($('#tbl_teacher_body'));
    secondsTotal = strToSec(teacher.time[0]);
    secondsTotalPerDay = strToSec(teacher.time[1]);
    totalSec += secondsTotal;
    totalSecPerDay += secondsTotalPerDay;
  })
  avgTotalSecond = (totalSec / teachers.length);
  avgTotalSecondPerDay = (totalSecPerDay / teachers.length)
  strAvgTotalSecond = new Date(avgTotalSecond * 1000).toISOString().substr(11, 8);
  strAvgTotalSecondPerDay = new Date(avgTotalSecondPerDay * 1000).toISOString().substr(11, 8);
  const trAvg = $(`
      <tr class="font-weight-bold">
        <td>Average Time</td>
        <td>${strAvgTotalSecond}</td>
        <td>${strAvgTotalSecondPerDay}</td>
      </tr>
    `).appendTo($('#tbl_teacher_body'));
})


const renderClassrooms = (() => {
  $('#tbl_classroom_body').empty();
  classrooms = context.summaryClassrooms;
  totalSec = 0;
  totalSecPerDay = 0;
  classrooms.forEach((classroom) => {
    if (classroom.time === null) {
      classroom.time = ["0:00:00","0:00:00"];
    }
    round2Decimal(classroom.time[1]);
    const tr = 
    $(`
      <tr id="${classroom._id}">
        <td>${classroom.course + " " + classroom.classroom}</td>
        <td>${classroom.time[0]}</td>
        <td>${context.timeRounded}</td>
      </tr>
    `).appendTo($('#tbl_classroom_body'));
    secondsTotal = strToSec(classroom.time[0]);
    secondsTotalPerDay = strToSec(classroom.time[1]);
    totalSec += secondsTotal;
    totalSecPerDay += secondsTotalPerDay;
  })
  avgTotalSecond = (totalSec / classrooms.length);
  avgTotalSecondPerDay = (totalSecPerDay / classrooms.length)
  strAvgTotalSecond = new Date(avgTotalSecond * 1000).toISOString().substr(11, 8);
  strAvgTotalSecondPerDay = new Date(avgTotalSecondPerDay * 1000).toISOString().substr(11, 8);
  const trAvg = $(`
      <tr class="font-weight-bold">
        <td>Average Time</td>
        <td>${strAvgTotalSecond}</td>
        <td>${strAvgTotalSecondPerDay}</td>
      </tr>
    `).appendTo($('#tbl_classroom_body'))
})


const fetchSummary = async (start_date, stop_date) => {
  $('#tbl_teacher_body').empty();
  $('#tbl_classroom_body').empty();
  setLoading(true);
  const res = await $.ajax({
    url: `/worm/api/log?start_time=${start_date}&stop_time=${stop_date}`,
    type: "GET"
  });
  setLoading(false);
  if(res.success === 0) {
    setIncorrect(true);
  } else {
    setIncorrect(false);
    if (res && res.teachers && res.classrooms) {
      context.summaryTeachers = res.teachers;
      context.summaryClassrooms = res.classrooms;
      context.totalDays = res.total_days;
      renderTeachers();
      renderClassrooms();
    };
  };
};

const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#noti').removeClass('invisible');
    $('#noti').removeClass('text-danger');
    $('#noti')[0].innerText = "Loading...";  
  } else {
    $('#noti').addClass('invisible');
  };
};

const setIncorrect = (incorrect) => {
  context.incorrect = incorrect;
  if (context.incorrect) {
    $('#noti').removeClass('invisible');
    $('#noti').addClass('text-danger');
    $('#noti')[0].innerText = "Not found logs or incorrect date :(";  
  } else {
    $('#noti').addClass('invisible');
    $('#noti').removeClass('text-danger');
  }
}


const strToSec = (strTime) => {
  let a = strTime.split(':');
  let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
  return seconds;
}


const round2Decimal = (time) => {
  timeSplited = time.split(":");
  secondRounded = Math.round(timeSplited[2]*100)/100;
  timeSplited[2] = secondRounded;
  timeRounded = timeSplited[0] + ":" + timeSplited[1] + ":" + timeSplited[2]
  context.timeRounded = timeRounded;
}