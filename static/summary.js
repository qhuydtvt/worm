const context = {
  summary: null,
  loading: false,
  incorrect: false
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
    if (res && res.data) {
      context.summary = res.data;
      console.log(context.summary);
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