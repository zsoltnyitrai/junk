const API_URL = {
    START: '/time-frame/start',
    STOP: '/time-frame/stop',
    INPROGRESS: '/time-frame/inprogress',
    GETALL: '/time-frame/getAll',
    GETTIME: '/time-frame/getTime',
    GETEVENTTOTAL: '/time-frame/getEventTotal'
};


$(".start-button").on('click', function (e) {
    const event = this.parentElement.id;
    const time = getCurrentTime();
    console.log('start e: ', event);

    start(event, time);

    // this.style.display = 'none';
    $(this).hide();
    //TODO show stop button
    $(`#${event} .stop-button`).show();
});

$(".stop-button").on('click', function (e) {
    const event = this.parentElement.id;
    const time = getCurrentTime();
    console.log('stop e: ', event);

    stop(event, time);

    //this.style.display = 'none';
    $(this).hide();
    $(`#${event} .start-button`).show();
});

function getCurrentTime() {
    let dNow = new Date();
    let currentTime = (dNow.getFullYear()+'-'+ (dNow.getMonth() + 1) + '-' +dNow.getDate()  + ' ' + dNow.getHours() + ':' + dNow.getMinutes()+ ':' + dNow.getSeconds());
    return currentTime;
}


function start(event, time) {
    $.ajax({
        url: API_URL.START,
        method: 'POST',
        data: {
            event: event,
            // TODO remove from js currentTime
            currentTime: time
        }
    }).done(function (response) {
        console.log('response', response);
    });
}

function stop(event, time) {
    $.ajax({
        url: API_URL.STOP,
        method: 'POST',
        data: {
            event: event,
            currentTime: time
        }
    }).done(function (response) {
        console.log('response', response);
    });
}

function getInProgress() {
    $.ajax({
        url: API_URL.INPROGRESS,
        method: 'GET'
    }).done(function (inProgressActions) {
        console.log('response', inProgressActions);
        $(`.container .start-button`).show();
        inProgressActions.forEach(function(inProgressAction) {
            const event = inProgressAction.event;
            console.info(event);
            $(`#${event} .stop-button`).show();
            $(`#${event} .start-button`).hide();
        });
    });
}

getInProgress();


function getAll() {
    $.ajax({
        url: API_URL.GETALL,
        method: 'GET'
    }).done(function (data) {
        console.log('response', data);
        let table = '<table>';
        data.forEach(function (row) {
            table += '<tr style="border: 1px solid red">';
            table += '<td style="border: 1px solid black">' + row.id + '</td>';
            table += '<td style="border: 1px solid black">' + row.event + '</td>';
            table += '<td style="border: 1px solid black">' + row.start + '</td>';
            table += '<td style="border: 1px solid black">' + row.stop + '</td>';
            table += '</tr>';
        });
        table += '</table>';
        $(`#stats_content`).html(table);
    });
}


function getTime(event) {
    $.ajax({
        url: API_URL.GETTIME,
        method: 'GET',
        data: {
            event: event,
        }
    }).done(function (data) {
        console.log('response',data);
        let table='<table>';
        data.forEach(function(row) {
            table+='<tr>';
            table+='<td>'+row.event+'</td>';
            table+='<td>'+row.diff+'</td>';
            table+='</tr>';
        });
        table+='</table>';
        $(`#getTime_content`).html(table);
    });
}

function getEventTotal(event) {
    $.ajax({
        url: API_URL.GETEVENTTOTAL,
        method: 'GET',
        data: {
            event: event,
        }
    }).done(function (data) {
        console.log('response',data);
        let table='<table>';
        data.forEach(function(row) {
            table+='<tr>';
            table+='<td>'+row.event+'</td>'
            let timeinsec=row.timeStampDiff;
            let sec=timeinsec%60;
            let timeinmin= Math.floor(timeinsec/60);
            let min= timeinmin%60;
            let hour=Math.floor(timeinmin/60);
            table+='<td> '+'---'+''+hour+" : "+ (min<10?"0":"") + min+" : "+ (sec<10?"0":"") + sec +'</td>'
            table+='</tr>';
        });
        table+='</table>';
        $(`#getEventTotal_content`).html(table);
    });
}

function getEventTotalPerWeek(event) {
    $.ajax({
        url: API_URL.GETEVENTTOTAL+"PerWeek",
        method: 'GET',
    }).done(function (data) {
        console.log('response',data);

        var ctx = $("#myChart");
        let myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                datasets: [
                    {
                        label: 'work',
                        defaultFontColor:  "red",
                        borderColor: 'rgba(20, 196, 255, 1)',
                        data: [0,0,0,0,0,0,0]
                    },
                    {
                        label: 'sleep',
                        borderColor: 'rgba( 20,255, 28, 1)',
                        data: [0,0,0,0,0,0,0]
                    },
                    {
                        label: 'relax',
                        borderColor: 'rgba( 255, 251, 28, 1)',
                        data: [0,0,0,0,0,0,0]
                    },
                    {
                        label: 'family',
                        borderColor: 'rgba( 255, 20, 20, 1)',
                        data: [0,0,0,0,0,0,0]
                    }
                ]
            },
            options: {}
        });


        const events = ['work', 'sleep', 'relax', 'family'];
        data.forEach(function(row) {
            let eventIndex = events.indexOf(row.event);
            myLineChart.data.datasets[eventIndex].data[row.day - 1]=row.timeStampDiff;
        });

        myLineChart.update();

        console.log('update',myLineChart.data.datasets);
    });
}