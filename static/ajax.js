// GET one classroom
const fetchGrades = async (classroomId) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/worm/api/grades?classroom_id=${classroomId}`,
    type: "GET",
  });
  if (res && res.data) {
    context.selectedClassroom = await res.data;
    await renderGrades();
    context.sessionMax = res.data.session;
  };
  setLoading(false);
};


// GET all classrooms
const fetchClassrooms = async () => {
  setLoading(true);
  const res = await $.ajax({
    url: "/worm/api/classroom",
    type: "GET",
  });
  if (res && res.data) {
    context.classRooms = res.data.class;
    renderClassroomSelections();
  }
  setLoading(false);
};


// POST Attendance
const submitAttendance = async (attendanceJSON) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/worm/api/attendance`,
    type: "POST",
    data: attendanceJSON,
    dataType: "json",
    contentType: "application/json",
  });
  setLoading(false);
  jumpTd();
}


// POST when user click Submit button
const submit = async (classroom_id, gradeJSON) => {
  setLoading(true);
  const res = await $.ajax({
    url: `/worm/api/grades?classroom_id=${classroom_id}`,
    type: "POST",
    data: gradeJSON,
    dataType: "json",
    contentType: "application/json",
  });
  setLoading(false);
  submitUI();
  // jumpTd();
}


// GET to check user is admin or not
const checkAdmin = async () => {
  setLoading(true);
  const res = await $.ajax({
    url: "/worm/api/grades",
    type: "GET",
  });
  if (res) {
    context.role = res.role;
    if (context.role === 0) {
      adminUI();
    }
  }
  setLoading(false);
}