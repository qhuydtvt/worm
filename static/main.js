
$(document).ready(()=>{
  getTable();
  clickbutton();
});

const clickbutton = () => {
  const point = '#members > tr > td'
  const form = $(`#form`)
  $(document).on('click', point, (e) => {
    e.preventDefault(); 
    form.empty();
    const valu = $(`#${e.target.id}`);
    form.append(`<input id='input' type="number" value=${e.target.innerText}>`);
    form.append(`<input id='submit' type="submit" value="Send">`);
    let input = $(`#input`);
    $("#submit").on('click',(event)=>{
      event.preventDefault();
      valu[0].innerText = input.val();
    })
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
  const courseOption = $("#course")
  courseOption.empty()
  courseOption.append(`<option value="choose"> choose...</option>`);
  list.forEach((course) => {
    value = course._id
    courseName = course.course + " " + course.classroom
    courseOption.append(OptionTemplates(courseName, value))
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
  pointList += point.map((eachpoint, ind) => {
    return PointTemplates(eachpoint, index, ind);
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

const PointTemplates = (point, index, ind) => {
  return (`
    <td id=${index}-${ind}> ${point}</td>
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