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
	$("#clock").text(now.format("HH:mm:ss"));

	const msToEnd = endTime.diff(now);
	if (msToEnd < 0) {
		// exam is finished
		// ...
		$("#countdown-seconds").text("00");
		return;
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
			//Mettre en vert "time-writing-start"
			
		} else {
			$("#end-type").text("TERMINÉ");
			//Mettre en blanc "time-reading-start"
			//Mettre en blanc "time-writing-start"
			//Mettre en rouge "time-end"
		}
	} else {
		const msToReading = readingTimeStart.diff(now);
		if (msToReading < 0) {
			// reading time has started
			duration = moment.duration(msToWriting);
			$("#end-type").text("avant la fin de lecture");
			//Mettre en vert "time-reading-start"
		} else {
			// waiting for reading time
			duration = moment.duration(msToReading);
			$("#end-type").text("avant la lecture");
		}
	}

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
