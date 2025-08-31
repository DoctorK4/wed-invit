const addToCalendar = () => {
  const eventDetails = {
    title: "희진 & 동률 결혼식",
    startDate: "20251102", // YYYYMMDD
    startTime: "120000", // HHMMSS
    endTime: "150000", // 약 4시간 후
    location: "DITTO 레스토랑, 서울특별시 서초구 명달로 94",
    description: "희진과 동률의 결혼식에 초대합니다."
  };

  // Google Calendar URL 생성
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}T${eventDetails.startTime}Z/${eventDetails.startDate}T${eventDetails.endTime}Z&location=${encodeURIComponent(eventDetails.location)}&details=${encodeURIComponent(eventDetails.description)}`;

  // Apple/Outlook용 ICS 파일 생성
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//Wedding Event//KR
BEGIN:VEVENT
UID:wedding-${Date.now()}@wedding-invitation.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${eventDetails.startDate}T${eventDetails.startTime}Z
DTEND:${eventDetails.startDate}T${eventDetails.endTime}Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

  // 사용자 에이전트에 따라 적절한 방법 선택
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    // iOS - ICS 파일 다운로드
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wedding-invitation.ics";
    link.click();
  } else if (userAgent.includes("Android")) {
    // Android - Google Calendar 열기
    window.open(googleCalendarUrl, "_blank");
  } else {
    // Desktop - 선택 옵션 제공
    if (confirm("Google Calendar로 이동하시겠습니까? (취소하면 ICS 파일을 다운로드합니다)")) {
      window.open(googleCalendarUrl, "_blank");
    } else {
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "wedding-invitation.ics";
      link.click();
    }
  }
};

export { addToCalendar }