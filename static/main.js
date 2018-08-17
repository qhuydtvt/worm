$(document).ready(()=>{
  GetMembers()
  GetPoint()
  clickbutton()
});

const clickbutton = () => {
  $('#button-big').on('click',function() {
    for (i=0; i <6; i++){ 
    $(`#grade-${i} > td:not(:first)`).replaceWith(`<td><input></input><td>`);
    }
  });
}


const GetMembers = async () => {
  const data = await getDataMember();
  const list = data.data;
  CourseOption(list);
  MembersSessions(list);
}

const GetPoint = async () => {
  const currentClassroom = $('#course').val();
  const dataPoint = await getDataPoint(currentClassroom);
  const listPoint = dataPoint.data;
  listPoint.forEach((classroom) => {
    
    if(classroom.classroom_id === currentClassroom) {
      classroom.grades.forEach((member, index) => {
        const pointss = $(`#grade-${index}`);
        let pointList = `<td>${member.name}</td>`;
        pointList += member.point.map((eachPoint) => {
          return PointTemplates(eachPoint);
        });
        pointss.html(pointList);
      })
    }
  })
}

////////////////////////////////////////////////////////////// GET API
const getDataMember = () => {
  const data = $.ajax({
    url: "/classroom",
    type: "GET",
  });
  return data;
} 

const getDataPoint = (classroom_id) => {
  const dataPoint = $.ajax({
    url: `/grades/${classroom_id}`,
    type: "GET",
  });
  return dataPoint;
}


///////////////////////////////////////////// TEMPLATE
const OptionTemplates = (par, value) => {
  return (`
    <option value="${value}">${par}</option>
`)
}

const MembersTemplates = (member, index) => {
  return(
    `<tr id="grade-${index}">
      <td>${member}</td>
    </tr>
    `
  )
}

const PointTemplates = (point) => {
  return(`
    <td>${point}</td>
    `)
}

const SessionsTemplates = (session) => {
  return (
    `
    <th>${session}</th>
    `
  )
}


/////////////////////////////////////////////////// FUNCTION
const CourseOption = (list) => {
  const course_option = $("#course")
  course_option.empty()
  course_option.append(`<option value="choose"> choose...</option>`);
  list.forEach((course) => {
    value = course._id
    course_name = course.course + " " + course.classroom
    course_option.append(OptionTemplates(course_name, value))
  })
}


const MembersSessions = (list) => {
  const members = $("#members")
  const session = $("#session")
  $('#course').on('change', function () {
    var id = $(this).val();
    $(members).empty();
    $(session).empty();
    session.append(SessionsTemplates(""))
    list.forEach((course) => {
      if (course._id === id) {
        course.members.forEach((member, index) => {
          members.append(MembersTemplates(member.username, index))
        });
        for (i = 1; i <= course.session; i++) {
          session.append(SessionsTemplates(i));
        }
      }
      if (id === 'choose') {
        $(session).empty();
        $(members).empty();
      }
    });
    GetPoint();
  });

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

// const test_post = function()  {
//   const a = {a : 'leu leu'};
//   $.ajax({
//     type : 'POST',
//     url: '/classroom',
//     data: JSON.stringify(a),
//     contentType: 'application/json',
//     dataType: 'JSON',
//     headers: { "X-CSRFToken": getCookie("csrftoken") },
//     success : (res) => {
//       console.log(res);
//     }
//   })
// }