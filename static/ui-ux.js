// Loading indicator
const submitUI = () => {
  $('#loading_indicator').removeClass('ui active indeterminate inline loader');
  $('#loading_indicator').removeClass('invisible');
  $('#loading_indicator').addClass('text-success');
  $('#loading_indicator').css({
    height: "33.8px",
    paddingTop: "10px",
    paddingLeft: "1px"
  })
  $('#loading_indicator')[0].innerHTML = "Update Success!";
}


// Loading status
const setLoading = (loading) => {
  context.loading = loading;
  if (context.loading) {
    $('#loading_indicator').addClass('ui active indeterminate inline loader');
    $('#loading_indicator')[0].innerHTML = "";
    $('#loading_indicator').removeClass("invisible");
    $('.ui.dropdown').addClass("disabled");
    // $('#btn_grade').attr('disabled', true);
    $('#check_circle').off('click');
    $('#times_circle').off('click');
    $('#tbl_grade_body').off('click');
    $('#input_grade').attr('disabled', true);
  } else {
    initGradeCellSelection();
    checkBox();
    $('.ui.dropdown').removeClass("disabled");
    $('#input_grade').attr('disabled', false);
    // $('#btn_grade').attr('disabled', false);
    if (context.role === 0) {
      adminUI();
    } else {
      $('#loading_indicator').addClass("invisible");
    }
  }
}


// UI for Admin Role
const adminUI = () => {
  // $('#btn_grade').hide();
  $('#input_grade').hide();
  $('#time').hide();
  $('#loading_indicator').removeClass('ui active indeterminate inline loader');
  $('#loading_indicator').removeClass('invisible');
  $('#loading_indicator').addClass('text-warning');
  $('#loading_indicator').css({
    height: "33.8px",
    paddingTop: "10px",
    paddingLeft: "1px"
  })
  $('#loading_indicator')[0].innerHTML = "You're not teacher. Please login as teacher to grade!";
}


// Animation for Select-Options element
const initSelectOptions = () => {
  $('#slt_classrooms').dropdown();
}


// Highlight column and row
const hightLight = (oldColumn, oldRow, column, row) => {
  oldColumn.css('background-color', '');
  oldRow.css('background-color', '');
  column.css('background-color', 'rgb(145, 145, 255)');
  row.css('background-color', 'rgb(145, 145, 255)');
}


// Hover
const hover = () => {
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
  )
}


// Attendance icons
const attendanceIcons = () => {
  $('#check_circle').css({
    "background-color": "",
    "color": "black",
    "border-radius": "0%"
  });
  $('#times_circle').css({
    "background-color": "",
    "color": "black",
    "border-radius": "0%"
  });
  $('#times_circle, #check_circle').hover(
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
}