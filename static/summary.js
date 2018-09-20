const context = {
  summaryTeachers: null,
  loading: false,
  incorrect: false,
  totalDays: 0,
  seconds: 0,
  time: null,
}

$(document).ready(() => {
  initDate();
  selectDate();
  // renderTeachers();
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
  teachers.forEach((teacher) => {
    if (teacher.time === null) {
      teacher.time = "0";
      avgHour = 0;
      context.time = "0";
    } else {
      convertTimeToSecond(teacher.time);
      avgHour = context.seconds / context.totalDays;
      convertSecondToTime(avgHour);
    }
    const tr = 
    $(`
      <tr id="${teacher._id}">
        <td>${teacher.lastName}</td>
        <td>${teacher.time}</td>
        <td>${context.time}</td>
      </tr>
    `).appendTo($('#tbl_teacher_body'));
  })
  
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
    if (res && res.teachers && res.total_days) {
      context.summaryTeachers = res.teachers;
      context.totalDays = res.total_days;      
      renderTeachers();
    };
  };
};

const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#loading_indicator').removeClass('invisible');
  } else {
    $('#loading_indicator').addClass('invisible');
  };
};

const setIncorrect = (incorrect) => {
  context.incorrect = incorrect;
  if (context.incorrect) {
    $('#incorrect').removeClass('invisible');
  } else {
    $('#incorrect').addClass('invisible');
  }
}


const convertTimeToSecond = (timeString) => {  
  const timeSplit = timeString.split(':'); 
  const seconds = (+timeSplit[0]) * 60 * 60 + (+timeSplit[1]) * 60 + (+timeSplit[2]); 
  context.seconds = seconds;
}


const convertSecondToTime = (tick) => {
  let hours = Math.floor(tick/3600);
  let mins = Math.floor(tick/60);
  let secs = tick % 60;
  context.time =  hours + ":"  + mins + ":" + secs;
}
