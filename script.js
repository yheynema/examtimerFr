var readingTimeStart, writingTimeStart, endTime;
//var state;
var interval;

function readConfig() {
	const readingTime = $("#config-reading-time").val();
	const writingTime = $("#config-writing-time").val();
	const timeEnd = $("#config-end-time").val();

	readingTimeStart = moment(readingTime, "HH:mm");
	writingTimeStart = moment(writingTime, "HH:mm");
	endTime = moment(timeEnd, "HH:mm");

	$("#exam-title").text($("#config-exam-title").val());
	$("#time-reading-start").text(readingTime);
	$("#time-writing-start").text(writingTime);
	$("#time-end").text(timeEnd);
}

function tick() {
	const now = moment.unix(Math.round(Date.now() / 1000));
	$("#clock").text(now.format("HH:mm"));

	const msToEnd = endTime.diff(now);
	if (msToEnd < 0) {
		// exam is finished
		// ...
		$("#countdown-seconds").text("00");
		$("#countdown").css("color","red");
		$("#countdown").fadeOut(500);
		$("#countdown").fadeIn(500);
		return;
	} else {
		$("#countdown").css("color","white");
	}

	let duration;
	const msToWriting = writingTimeStart.diff(now);
	if (msToWriting < 0) {
		// writing time has ended, exam started finished
		duration = moment.duration(msToEnd);
		const msToExam = endTime.diff(now);
		if (msToEnd>0) {
			$("#end-type").text("avant la fin de l'examen");
			//Mettre en blanc "time-reading-start"
			$("#time-reading-start").css("color","white");
			//Mettre en vert "time-writing-start"
			$("#time-writing-start").css("color","green");
			$("#time-end").css("color","red");
			
		} else {
			$("#end-type").text("TERMINÉ");
			//Mettre en blanc "time-reading-start"
			$("#time-reading-start").css("color","white");
			//Mettre en blanc "time-writing-start"
			$("#time-writing-start").css("color","red");
			//Mettre en rouge "time-end"
			$("#time-end").css("color","red");
		}
	} else {
		const msToReading = readingTimeStart.diff(now);
		if (msToReading < 0) {
			// reading time has started
			duration = moment.duration(msToWriting);
			$("#end-type").text("avant la fin de lecture");
			$("#time-writing-start").css("color","red");
			//Mettre en vert "time-reading-start"
			$("#time-reading-start").css("color","green");
		} else {
			// waiting for reading time
			duration = moment.duration(msToReading);
			$("#time-reading-start").css("color","white");
			$("#end-type").text("avant la lecture");
		}
	}
	// tenter de contrôler le format d'affichage ... 
    // Yh 22 oct 2024: tentative de limiter l'affichage des secondes... devra être revu, conjointement avec le html
/*	if (duration.hours() > 1) {
		$("#countdown-hours").text(duration.hours());
		$("#countdown-minutes").text(String(duration.minutes()).padStart(2, "0"));
		$("#countdown-seconds").text(" ");

	} else {
		$("#countdown-hours").text(" ");
		$("#countdown-minutes").text(String(duration.minutes()).padStart(2, "0"));
		$("#countdown-seconds").text(String(duration.seconds()).padStart(2, "0"));		
	}
*/
		$("#countdown-hours").text(duration.hours());
		$("#countdown-minutes").text(String(duration.minutes()).padStart(2, "0"));
		$("#countdown-seconds").text(String(duration.seconds()).padStart(2, "0"));
}

$(() => {
	readConfig();

	$("#config-form").submit(event => {
		readConfig();
		$("#configure").modal("hide");
		event.preventDefault();
	});

	tick();
	interval = setInterval(tick, 1000);
});
