
$(document).ready(()=>{
  getTable()
  clickbutton()
});

const clickbutton = () => {
  const point = '#members > tr > td'
  $(document).on('click', point, (e) => { 
    console.log(e.target.innerText);
  });

}

const getTable = async () => {
  const data = await getDataMember();
  const dataMember = data.data;
  getCourse(dataMember);
  getSessions(dataMember);
  getMember();

}

const getMember = async () => {
  const currentClassroom = $('#course').val();
  const dataPoint = await getDataPoint(currentClassroom);
  const listDataPoint = dataPoint.data;  
  listDataPoint.forEach((member, index) => {
    let firstName = member.member.firstName;
    let lastName = member.member.lastName;
    let username = `${firstName} ${lastName}`;
    let point = member.grades;
    $(`#members`).append(MembersTemplates(username, index))
    getPoint(username, point, index);
  });
}

////////////////////////////////////////////////////////////// GET API
const getDataMember = () => {
  const data = $.ajax({
    url: "/api/classroom",
    type: "GET",
  });
  return data;
} 

const getDataPoint = (classroom_id) => {
  const dataPoint = $.ajax({
    url: `api/grades?classroom_id=${classroom_id}`,
    type: "GET",
  });
  return dataPoint;
}

/////////////////////////////////////////////////// FUNCTION
const getCourse = (list) => {
  const course_option = $("#course")
  course_option.empty()
  course_option.append(`<option value="choose"> choose...</option>`);
  list.forEach((course) => {
    value = course._id
    course_name = course.course + " " + course.classroom
    course_option.append(OptionTemplates(course_name, value))
  })
}


const getSessions = (list) => {
  const members = $("#members")
  const session = $("#session")
  $('#course').on('change', function () {
    var id = $(this).val();
    getMember(id);
    $(members).empty();
    $(session).empty();
    session.append(SessionsTemplates(""))
    list.forEach((course) => {
      if (course._id === id) {
        for (i = 1; i <= course.session; i++) {
          session.append(SessionsTemplates(i));
        }
      }
      if (id === 'choose') {
        $(session).empty();
      }
    });
  });

}

const getPoint  = (username, point, index) => {
  let pointList = `<td>${username}</td>`;
  const grades = $(`#grade-${index}`);
  pointList += point.map((eachpoint) => {
    return PointTemplates(eachpoint);
  });
  grades.html(pointList);
}


///////////////////////////////////////////// TEMPLATE
const OptionTemplates = (par, value) => {
  return (`
    <option value="${value}">${par}</option>
`)
}

const MembersTemplates = (member, index) => {
  return (
    `<tr id="grade-${index}">
      <td>${member}</td>
    </tr>
    `
  )
}

const PointTemplates = (point) => {
  return (`
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