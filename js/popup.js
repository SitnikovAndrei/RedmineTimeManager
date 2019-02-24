let $ = (selector) => {
    let elements = document.querySelectorAll(selector);
    if (elements.length == 1) {
        elements = elements[0];
    };

    return elements;
};


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

let main = $(".main");

let getData = (items) => {
    console.log(items);
    let headers = new Headers({ 'Authorization': 'Basic ' + btoa(items.username + ":" + items.password) });
    var message = $(".message");

    fetch(`http://redmine.mango.local/time_entries.json?user_id=${items.user_id}&from=${items.start_date}&to=${items.end_date}&limit=100`, {
            method: 'GET',
            headers: headers
        })
        .then(function(response) {
            let status = response.status;
            if (status == 200) {
                return response.json();
            }
            throw new Error(status);
        })
        .then(function(res) {
            console.log("res: " + JSON.stringify(res));
            // console.log(res);
            let table = $(".time");

            let time_entries = res.time_entries;
            let job_time = summTime(time_entries);

            for (let i in job_time) {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>${i}</td><td>${job_time[i]}</td>`;
                table.appendChild(tr);
            }
        })
        .catch(e => {
            main.classList.add("hide");
            message.classList.remove("hide");
            message.innerHTML = e;
        });


    fetch(`http://redmine.mango.local/issues.json?project_id=${items.project_id}&status_id=1&tracker_id=10&cf_36=Проблема&assigned_to_id=194`, {
            method: 'GET',
            headers: headers
        })
        .then(function(response) {
            let status = response.status;
            if (status == 200) {
                return response.json();
            }
            throw new Error(status);
        })
        .then(function(res) {
            let table = $(".issues");

            let issues = res.issues;

            if (issues.length > 0) {
                // table.classList.remove("hide");

                for (let i in issues) {
                    let tr = document.createElement('tr');
                    let issue = issues[i];
                    let created_on = issue["created_on"].split("T").join('\n');
                    tr.innerHTML = `<td>${issue["id"]}</td><td>${issue["author"]["name"]}</td><td>${created_on}</td><td>${issue["priority"]["name"]}</td>`;
                    table.appendChild(tr);
                }
            }
        })
        .catch(e => {
            main.classList.add("hide");
            message.classList.remove("hide");
            message.innerHTML = e;
        });
}


function ready() {
    let start_date = createDate();
    let end_date = createDate("now");

    chrome.storage.sync.get({
        "username_redmine": '',
        "password_redmine": '',
        "user_id_redmine": '',
        "project_id_redmine": ''
    }, function(items) {
        let params = {
            "username": items.username_redmine,
            "password": items.password_redmine,
            "user_id": items.user_id_redmine,
            "start_date": start_date,
            "end_date": end_date,
            "project_id": items.project_id_redmine
        };
        getData(params);
    });

}

document.addEventListener("DOMContentLoaded", ready);