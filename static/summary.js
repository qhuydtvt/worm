const context = {
  summaryTeachers: null,
  loading: false,
  incorrect: false,
  totalDays: 0,
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
    const tr = 
    $(`
      <tr id="${teacher._id}">
        <td>${teacher.lastName}</td>
        <td>${teacher.time}</td>

      </tr>
    `)
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
    if (res) {
      context.summaryTeachers = res.teachers;
      context.totalDays = res.total
      console.log(context.summaryTeachers);
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