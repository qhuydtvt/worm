$(document).ready(()=>{
  getTable();
  clickButton();
  submit();
});


const clickButton = () => {
  const point = '#members > tr > td:not(:first-child)'
  const form = $(`#form`)
  $(document).on('click', point, (e) => {
    if (!started){
    startTime();
    started = true;
    }
    e.preventDefault(); 
    form.empty();
    let valu = $(`#${e.target.id}`);
    valu.css({ color : `red` })
    form.append(`<input id='input' type="number" value=${e.target.innerText} autofocus>`);
    form.append(`<input id='submit' type="submit">`);
    let input = $(`#input`);
    $("#submit").on('click',(event)=>{
      event.preventDefault();
      valu[0].innerText = input.val();
      valu.css({ color : `black` });
    });
  });
}


const submit = () => {
  const submit = $('#btn-big');
  members = $('#members');
  submit.on('click', () => {
    const submitTime = $("#time");
    teacherJSON = getTeacherJSON();
    teacherJSON.time = submitTime[0].innerText;

    const currentClassroom = $('#course').val();
    gradeJSON = getClassJSON();
    membersList = members[0].children;
    for (let i = 0; i < membersList.length; i++) {
      memberJSON = getMemberJSON();
      membId = '#' + membersList[i].id;
      membInfo = $(membId);
      infoList = membInfo[0].children;
      memberJSON._id = infoList[0].id;
      for (let j = 1; j < infoList.length; j++) {
        memberJSON.grades.push(infoList[j].innerText)
      }
      gradeJSON.data.member.push(memberJSON)
    }
    gradeJSON.data.teacher.push(teacherJSON)
    console.log(gradeJSON);
    
    postGradeJson(currentClassroom, JSON.stringify(gradeJSON))
  })
}

const getClassJSON = () => {
  gradesData = `{    
   "data": {
     "teacher": [],
     "member":[]
   }
 }`;
  gradesJson = JSON.parse(gradesData);
  return gradesJson;
}

const getTeacherJSON = () => {
  teacher = `
    {
      "_id": "!@#!@#!@#",
      "time": "0.3"
    }`;
  teacherJSON = JSON.parse(teacher);
  return teacherJSON;
}

const getMemberJSON = () => {
  member = `
    {
      "_id": "",
      "grades": []
    }`;
  memberJSON = JSON.parse(member);
  return memberJSON;
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
    let id = member.member._id
    let firstName = member.member.firstName;
    let lastName = member.member.lastName;
    let username = `${firstName} ${lastName}`;
    let point = member.grades;
    $(`#members`).append(MembersTemplates(username, index))
    getPoint(id, username, point, index);
  });
}

////////////////////////////////////////////////////////////// API
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

const postGradeJson = (classroom_id, gradeJSON) => {
  $.ajax({
    url: `api/grades?classroom_id=${classroom_id}`,
    type: "POST",
    data: gradeJSON,
    dataType: "json",
    contentType: "application/json",
  });
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

const getPoint  = (id, username, point, index) => {
  let pointList = `<td id=${id}>${username}</td>`;
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

/////////////////////////// TIMING
let time = 0;
let started = false
const startTime = () => {
    setTimeout(() => {
    time++;
    let hours = Math.floor(time/10/60/60);
    let secs = Math.floor(time/10%60);
    let mins = Math.floor(time/10/60);
    if (mins < 10) {
      mins = `0${mins}`;
    }
    if (secs < 10) {
      secs = `0${secs}`;
    }
    $(`#time`).empty();
    $(`#time`).append(`${hours}:${mins}:${secs}`);
    startTime();
  },100);
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