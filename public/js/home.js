//back-to-top
let backtotop = document.getElementById("back_to_top");
backtotop.addEventListener("click", () => {window.scrollTo(0,0)});

//user-dropdown
let user_button = document.getElementById("user_button");
let dropdown = document.getElementById("user_dropdown");
window.onclick = function(event) {
    if (user_button.contains(event.target)) {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}
