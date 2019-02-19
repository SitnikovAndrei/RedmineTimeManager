let summTime = (data) => {
    let jobTime = {};
    data.forEach(function(i) {
        let date = i.spent_on;
        if (jobTime[date]) {
            jobTime[date] += i.hours;
        } else {
            jobTime[date] = i.hours;
        }
    });
    return jobTime;
}


let createDate = (param) => {
    let date = new Date()
    let checkTime = (i) => {
        if (i < 10) { i = "0" + i }
        return i;
    }

    let hours = checkTime(date.getHours());
    let minutes = checkTime(date.getMinutes());
    let seconds = checkTime(date.getSeconds());
    let day = (param == "now") ? checkTime(date.getDate()) : "01";
    let month = checkTime(date.getMonth() + 1);
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
};


let getData = (items) => {
    console.log(items);
    let headers = new Headers({'Authorization': 'Basic ' + btoa(items.username + ":" + items.password)});
    fetch(`http://redmine.mango.local/time_entries.json?user_id=${items.user_id}&from=${items.start_date}&to=${items.end_date}&limit=100`, {
            method: 'GET',
            headers: headers
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(res) {
            let table = document.querySelector("#customers");
            let time_entries = res.time_entries;
            let job_time = summTime(time_entries);

            for (let i in job_time) {
                var tr = document.createElement('tr');
                tr.innerHTML = `<td>${i}</td><td>${job_time[i]}</td>`;
                table.appendChild(tr);
            }
        })
        .catch(alert);
}


function ready() {
    let start_date = createDate();
    let end_date   = createDate("now");

    chrome.storage.sync.get({
        "username_redmine": '',
        "password_redmine": '',
        "user_id_redmine": '',
    }, function(items) {
        let params = {
          "username": items.username_redmine,
          "password": items.password_redmine,
          "user_id": items.user_id_redmine,
          "start_date": start_date,
          "end_date": end_date
        };
        getData(params);
    });

}

let width = 260;
let height = 500;

document.addEventListener("DOMContentLoaded", ready);
window.onresize = function(event) {
    window.resizeTo(width,height);
};