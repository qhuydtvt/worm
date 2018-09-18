const context = {
  summary: [],
  loading: false
}

$(document).ready(() => {
  initDate();
  selectDate();
});

const initDate = (() => {
  $("#start_date").flatpickr();
  $("#stop_date").flatpickr({
    defaultDate: "today",
  }); 
});


const selectDate = (() => {
  $('#start_date').on('change', (event) => {
    console.log(event.target.value);
  });
});


const fetchSummary = async (time) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/api/log?time=${time}`,
    type: "GET"
  });
  setLoading(false);

  if (res && res.data) {
    context.summary = res.data;
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
