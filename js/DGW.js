const downButton = document.querySelectorAll(".open_contents");
const contents = document.querySelectorAll(".contents");

function openContent(e) {
  const id = e.target.id;

  if (contents[id].style.display === "block") {
    contents[id].style.display = "none";
    downButton[id].value = "▼";
  } else {
    contents[id].style.display = "block";
    downButton[id].value = "▲";
  }
}

downButton.forEach((x) => {
  x.addEventListener("click", openContent);
});
