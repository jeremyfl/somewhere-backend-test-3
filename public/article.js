let ws = null;

$(function() {
  if (login()) {
    connect();
  }
});

function login() {
  const login = $.ajax({
    type: "POST",
    url: "auth/login",
    data: {
      email: "jeremylombogia7@gmail.com",
      password: "secret"
    },
    dataType: "JSON",
    success: response => {
      localStorage.setItem("token", response.data.token);

      return true;
    },
    error: () => {
      return false;
    }
  });

  return login;
}

function connect() {
  ws = adonis.Ws().connect();

  ws.on("open", () => {
    subscribeToChannel();
  });

  ws.on("error", () => {
    alert("Web socket lost");
  });
}

function subscribeToChannel() {
  const chat = ws.subscribe("article");

  chat.on("error", () => {
    alert("Failed to subscribe");
  });

  chat.on("article", article => {
    const audio = new Audio("alert.mp3");

    audio.play();
    $("#list-article").append(`
      <div class="card" style="margin-top: 20px">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <p class="card-text">${article.body}</p>
        </div>
      </div>
     `);
  });
}

$("#submit").click(function(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const user = jwt_decode(token);

  const data = {
    title: $("#title").val(),
    body: $("#body").val()
  };

  ws.getSubscription("article").emit("article", {
    title: data.title,
    body: data.body
  });

  $.ajax({
    type: "POST",
    url: "articles",
    data: {
      title: data.title,
      body: data.body
    },
    dataType: "JSON",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(response) {
      $("#title").val("");
      $("#body").val("");
    }
  });

  return;
});
