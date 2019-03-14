let main = $(".main");
let table = $(".issues");
let message = $(".message");
let url = "http://redmine.mango.local/";

let settings = {
    "username": "",
    "password": "",
    "start_date": "",
    "end_date": "",
    "project_id": ""
};


function $(selector) {
    let elements = document.querySelectorAll(selector);
    if (elements.length == 1) {
        elements = elements[0];
    };

    return elements;
};


function summTime(data) {
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

function createSelect (id) {
    let status = {
        "11": "Ошибка",
        "18": "На тестировании",
        "5": "Закрыт",
        "14": "Отклонен",
        "7": "Протестирован",
        "1": "Новый",
        "2": "Реализован",
        "12": "Принят"
    };

    let select = "<select class='issueStatus'>";
    for (key in status) {
        select += `<option value=${key} ${(id == key) ? "selected" : ""}>${status[key]}</option>`;
    }
    select += "</select>";

    return select;
};

function createDate(param) {
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

function changeStatusIssue(e){
    let headers = new Headers({ 
        'Authorization': 'Basic ' + btoa(settings.username + ":" + settings.password),
        'Content-Type': 'application/json'
    });
    let target = event.target;
    if (target.className === "issueStatus") {
        let statusId = target.value;
        let id = target.parentNode.parentNode.id;

        fetch(url + "issues/"+ id + ".json", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({"issue": {"status_id": statusId}}),
        })
    }
}

function addWatcher(){
    table.addEventListener("change", changeStatusIssue)
}


function getIssues() {
    let headers = new Headers({ 'Authorization': 'Basic ' + btoa(settings.username + ":" + settings.password) });

    fetch(url + `issues.json?project_id=${settings.project_id}&status_id=open&tracker_id=59`, {
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
            let issues = res.issues;

            if (issues.length > 0) {

                for (let i in issues) {
                    let issue = issues[i];

                    let tr = document.createElement('tr');
                    tr.setAttribute("id", issue["id"]);
                    let created_on = issue["created_on"].split("T").join('\n');
                    tr.innerHTML = `<td><a href="${url + "issues/" +issue["id"]}">${issue["id"]}<a></td><td>${issue["subject"]}</td><td>${issue["author"]["name"]}</td>` +
                        `<td class="created_on">${created_on}</td><td>${createSelect(issue["status"]["id"])}</td>`;

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
        "project_id_redmine": ''
    }, function(items) {
        settings = {
            "username": items.username_redmine,
            "password": items.password_redmine,
            "start_date": start_date,
            "end_date": end_date,
            "project_id": items.project_id_redmine
        };
        addWatcher();
        getIssues();
    });

}

document.addEventListener("DOMContentLoaded", ready);