$(document).ready(()=>{
  getTable();
  clickButton();
  submit();
});
let flag = false;
const clickButton = () => {
  const point = '#members > tr > td:not(:first-child)'
  const form = $(`#form`)
  $(document).on('click', point, (e) => {
    if (!flag){
    time.start();
    getTime();
    flag = true;
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
    time.stop();
    
    const currentClassroom = $('#course').val();
    gradeJson = getClassJSON();
    membersList = members[0].children;
    for (let i = 0; i < membersList.length; i++) {
      memberJSON = getMemberJSON();
      membId = '#' + membersList[i].id;
      membInfo = $(membId);
      infoList = membInfo[0].children;
      memberJSON.member._id = infoList[0].id;
      for (let j = 1; j < infoList.length; j++) {
        memberJSON.grades.push(infoList[j].innerText)
      }
      gradeJson.data.push(memberJSON)
    }
    
    postGradeJson(currentClassroom, JSON.stringify(gradeJson))
  })
}

const getClassJSON = () => {
  gradesData = `{    
   "data": []
  }`;
  gradesJson = JSON.parse(gradesData);
  return gradesJson;
}

const getMemberJSON = () => {
  member = `
   {
     "member": {
       "_id": ""
     },
     "grades": []
   }`;
  memberJSON = JSON.parse(member);
  return memberJSON;
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
    let id = $(this).val() ;
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


getTime = function() {
  time.getTimePass();
  $(`#time`).empty();
  $(`#time`).append(`<span>${time.passedTime}</span>`);
  setTimeout(() => {
    getTime();    
  }, 1000);
}



function Stopwatch() {
  this.startTime = [];
  this.endTime = [];
  this.passedTime = null;
}

Stopwatch.prototype.start = function() {
  this.startTime = [];
  const t = new Date();
  let hours = t.getHours();
  let mins = t.getMinutes();
  let secs = t.getSeconds();
  this.startTime.push(hours, mins, secs);
  return this.startTime;
}

Stopwatch.prototype.getTimePass = function() {
  let now = this.stop();
  //convet time to second
  let nowSecs = (+now[0]) * 60 * 60 + (+now[1]) * 60 + (+now[2]); 
  let startSecs = (+this.startTime[0]) * 60 * 60 + (+this.startTime[1]) * 60 + (+this.startTime[2]); 
  let time = nowSecs - startSecs
  // convert second to HH:MM:SS format
  let hours = Math.floor(time/60/60);
  let mins = Math.floor(time/60);
  let secs = Math.floor(time%60);
  
  this.passedTime = `${hours}:${mins}:${secs}`
  
  return this.passedTime;
}

Stopwatch.prototype.stop = function() {
  this.endTime = [];
  const t = new Date();
  let hours = t.getHours();
  let mins = t.getMinutes();
  let secs = t.getSeconds();
  this.endTime.push(hours, mins, secs);
  return this.endTime;
}
time = new Stopwatch()

