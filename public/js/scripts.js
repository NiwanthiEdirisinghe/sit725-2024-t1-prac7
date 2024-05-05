
const clickMe = () => {
  alert("Thanks for clicking me. Hope you have a nice day!");
};
const submitForm = () => {
  let formData = {
    title: $("#title").val(),
    image: $("#path").val(),
    link: $("#color").val(),
    description: $("#des").val(),
  };

  // Send a POST request to add the new project
  $.post("/api/cards", formData, (response) => {
    if (response.statusCode === 201) {
      alert("New card was added successfully!");
      location.reload();
    } else {
      alert("Failed to add new card. Please try again later.");
    }
  });
};

const addCards = (items) => {
  items.forEach((item) => {
    let itemToAppend =
      '<div class="col s4 center-align">' +
      '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' +
      item.image +
      '">' +
      '</div><div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">more_vert</i></span><p><a href="#">' +
      item.link +
      "</a></p></div>" +
      '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">close</i></span>' +
      '<p class="card-text">' +
      item.description +
      "</p>" +
      "</div></div></div>";
    $("#card-section").append(itemToAppend);
  });
};

const getProjects = () => {
  $.get("/api/cards", (response) => {
    if (response.statusCode == 200) {
      addCards(response.data);
    }
  });
};

$(document).ready(function () {
  $(".materialboxed").materialbox();
  $("#formSubmit").click(() => {
    submitForm();
  });

  getProjects();

  $(".modal").modal();
});