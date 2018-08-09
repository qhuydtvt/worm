$(document).ready(()=>{
  GetMembers()
});

const clickbutton = () => {
  $("#test").on('click',function() { 
    console.log("clicked");
    
    test_post();
  });
}

const GetMembers = async () => {
  const course_option = $("#course")
  const data = await getDataMember();
  course_option.empty()
  console.log(data.data);
  const list = data.data;
  list.forEach((course) => {
    value = course._id
    course_name = course.course + " " + course.classroom
    course_option.append(OptionTemplates(course_name, value))
  })

  const members = $("#members")

  $('#course').on('change', function() {
    var id = $(this).val();
    console.log(id);
    $(members).empty();
    list.forEach((course) => {
      if (course._id === id){
        course.members.forEach((member) => {
          members.append(MembersTemplates(member.username))  
        })
      }
    })
  });
}

const getDataMember = () => {
  const data = $.ajax({
    url: "http://localhost:8000/classroom",
    type: "GET",
  });
  return data
}

const OptionTemplates = (par, value) => {
  return (`
    <option value="${value}">${par}</option>
`)
}

const MembersTemplates = (member) => {
  return(
    `<tr class='info'>
      <td>${member}</td>
      <td>8</td>
     </tr>
    `
  )
}

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

const test_post = function()  {
  const a = {a : 'leu leu'};
  $.ajax({
    type : 'POST',
    url: '/classroom',
    data: JSON.stringify(a),
    contentType: 'application/json',
    dataType: 'JSON',
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    success : (res) => {
      console.log(res);
    }
  })
}