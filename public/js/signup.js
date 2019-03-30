let pass = document.getElementById("password");
let conf_pass = document.getElementById("confirm_password");
let message = document.getElementById("message");
let submit =document.getElementById('submit');

function check_password_match() {
  if (pass.value == conf_pass.value) {
    message.style.color = 'green';
    message.innerHTML = 'matching';
    submit.disabled = false;
  } else {
    message.style.color = 'red';
    message.innerHTML = 'not matching';
    submit.disabled = true;
  }
}

pass.addEventListener("keyup", check_password_match);
conf_pass.addEventListener("keyup", check_password_match);
