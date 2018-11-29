const context = {
  classRooms: [],
  selectedClassroom: null,
  loading: false,
  submittable: false,
  gradeDisabled: false,
  timeRunning: false, 
  selectedGrade: {
    tdId: "",
    xTd: 0,
    yTd: 0,
    value: "",
    attendance: -1,
    submitted: false
  },
  time: {
    seconds: 0,
    minutes: 0,
    hours: 0,
  },
  selectedMemberID: "",
  lastMemberID: "",
  role: null,
  currentSession: null,
  sessionMax: null
};

$(document).ready(async () => {
  renderGrades(); // Render empty grade tables
  initClassroomSelection(); // Config classroom => when users select classrooms
  initGradeCellSelection(); // Config grade cell => when users select grade
  // initGradeProcess(); // Config grading: CLick start => Edit grade => Submit
  await fetchClassrooms(); // Load classrooms
  checkAdmin();
  initSelectOptions();  
  checkBox();
  hover();
  setLoading(false);
});