$(document).ready(()=>{
  Test()
});

const Test = async () => {
  const a = $("#quanml")
  a.append(`<div>Loading</div>`)
  const data = await getDataMember();
  a.empty();
  console.log(data.data);
  const list = data.data[0].members;
  list.forEach((member) => {
    a.append(HTMLtemplates(member.username))
  })
}

const getDataMember = () => {
  const data = $.ajax({
    url: "http://localhost:8000/classroom",
    type: "GET",
  });
  return data
}

const HTMLtemplates = (par) => {
  return (`
  <p>${par}</p>
`)
}

