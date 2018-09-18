const context = {
  summary: null,
  loading: false
}

$(document).ready(() => {
  initDate();
  selectDate();
});

const initDate = (() => {
  $("#start_date").flatpickr({
    defaultDate: "today",
  });
  $("#stop_date").flatpickr({
    defaultDate: "today",
  }); 
});


const selectDate = (() => {
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
    url: `/api/log?time=${start_date}_${stop_date}`,
    type: "GET"
  });
  setLoading(false);

  if (res && res.data) {
    context.summary = res.data;
    console.log(context.summary);
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
