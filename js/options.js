function save_options(e) {
  e.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user_id = document.getElementById('user_id').value;

  chrome.storage.sync.set({
    "username_redmine": username,
    "password_redmine": password,
    "user_id_redmine": user_id
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function restore_options() {
  chrome.storage.sync.get({
    "username_redmine": '',
    "password_redmine": '',
    "user_id_redmine": '',
    }, function(items) {
    document.getElementById('username').value = items.username_redmine;
    document.getElementById('password').value = items.password_redmine;
    document.getElementById('user_id').value = items.user_id_redmine;
  });
}



document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);