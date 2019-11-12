$(document).ready(function() {


    // $(".help-toggle-class-2").hide();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            });
    }
    if (!JSON.parse(sessionStorage.getItem('data'))) {
        data = [];
        data.push({
            checkID: 0,
            checkType: "placeHolder",
            checkName: "placeHolder",
            checkPeriod: "placeHolder",
            checkStatus: 0,
            checkgoal: 1,
            message: "This is a placeholder",
            finished: true
        });
        sessionStorage.setItem('data', JSON.stringify(data));
    } else {
        data = JSON.parse(sessionStorage.getItem('data'));
    }

    // test
    var button = document.getElementById("notifications");
    button.addEventListener('click', function(e) {
        Notification.requestPermission().then(function(result) {
            if (result === 'granted') {
                randomNotification();
            }
        });
    });

    // Setting up random Notification
    function randomNotification() {
        var randomItem = Math.floor(Math.random() * data.length);
        // var notifTitle = games[randomItem].name;
        var notifTitle = data[randomItem].checkName;

        var notifBody = `You have ${data[randomItem].checkStatus} / ${data[randomItem].checkgoal} in to do list!`;
        
        // var notifImg = 'data/img/' + games[randomItem].slug + '.jpg';
        var options = {
            body: notifBody
            // icon: notifImg
        }
        var notif = new Notification(notifTitle, options);
        setTimeout(randomNotification, 30000);
    };
    // test

    var checkTemplate = ({ checkID, checkType, checkName, checkPeriod, checkStatus, checkgoal, message }) =>
        `<div class="build-component"  id="check${checkID}">
                    <div class="build-component-progress-bar build-progress-help-class-three" style="">
                    </div>
                    <div class="btn-container">
                        <button class="btn checks-button checks-dec-control " name="${checkID}">&#8722;</button>
                        <button class="btn checks-button checks-plus-control" name="${checkID}">&#43;</button>
                    </div>
                    <div class="build-component-text-container">
                        <P class="build-component-title">${checkName}</P>
                        <p class="build-component-text"> ${checkPeriod}: ${checkStatus}/${checkgoal}</p>
                    </div>
                </div>`


    $('.list-items').append(data.filter(function(x) {
        return x["finished"] == false;
    }).map(checkTemplate).join(''));


    $('.checks-dec-control').on('click', function(event) {
        // console.log(event.target.name); 
        var newId = Number(event.target.name);
        console.log(newId);
        data[newId]["checkStatus"]--;
        if (Number(data[newId]["checkStatus"]) < 0) {
            alert(data[newId]["message"])
        } else {


            $('.list-items').empty();
            $('.list-items').append(data.filter(function(x) {
                return x["finished"] == false;
            }).map(checkTemplate).join(''));
            sessionStorage.setItem('data', JSON.stringify(data));
            location.reload();
        }
    });

    $('.checks-plus-control').on('click', function(event) {
        // console.log(event.target.name); 
        var newId = Number(event.target.name);
        console.log(newId);
        data[newId]["checkStatus"]++;
        if (data[newId]["checkStatus"] == data[newId]["checkgoal"]) {
            data[newId]["finished"] = true;
            $('.list-items').empty();
            $('.list-items').append(data.filter(function(x) {
                return x["finished"] == false;
            }).map(checkTemplate).join(''));
            sessionStorage.setItem('data', JSON.stringify(data));
            location.reload();
        } else {
            $('.list-items').empty();
            $('.list-items').append(data.filter(function(x) {
                return x["finished"] == false;
            }).map(checkTemplate).join(''));
            sessionStorage.setItem('data', JSON.stringify(data));
            location.reload();
        }
    });
    $(".toggle-btn-class-create").click(
        function() {
            $(".help-toggle-class-list").show();
            $(".help-toggle-class-create").hide();
        }
    );
    $(".toggle-btn-class-list").click(
        function() {
            $(".help-toggle-class-list").hide();
            $(".help-toggle-class-create").show();
        }
    );
    $("#submitBtn").click(
        function() {
            var newCheckName = $("input[name=checking-name]").val();
            var newCheckType = $("input[name=checking-type]").val();
            var newCheckPeriod = $("input[name=checking-period]").val();
            var newCheckGoal = $("input[name=checking-goal]").val();
            data.push({
                checkID: data.length,
                checkType: newCheckType,
                checkName: newCheckName,
                checkPeriod: newCheckPeriod,
                checkStatus: 0,
                checkgoal: newCheckGoal,
                message: "Let's go, start your first step to finish you checks!",
                finished: false
            })
            console.log(data);

            sessionStorage.setItem('data', JSON.stringify(data));

            data = JSON.parse(sessionStorage.getItem('data'));
            $('.list-items').empty();
            $('.list-items').append(data.filter(function(x) {
                return x["finished"] == false;
            }).map(checkTemplate).join(''));
            $("input[name=checking-name]").val("");
            $("input[name=checking-type]").val("");
            $("input[name=checking-goal]").val(0);
            location.reload();
            // console.log(JSON.parse(sessionStorage.getItem('data')));
            // window.location.href = "list.html";

        }
    )

});