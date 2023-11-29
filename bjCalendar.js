let SDK;
let extensionSdk;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let startDate = new Date();
let isBJ = false;

let bjName = null;
let bjNickname = null;
let bjImg = null;

let selectedBj = null;

let plan = {};
let bjImgObj = {};
let bjNicknameObj = {};

const day = ["월", "화", "수", "목", "금", "토", "일"];

const coustomConfrim = (message, exec, bj) => {
  let popupBack = document.createElement("div");
  popupBack.setAttribute("id", "popupBack");
  let popup = document.createElement("div");
  popup.setAttribute("id", "popup");

  let popupMessage = document.createElement("p");
  popupMessage.setAttribute("class", "popupMessage");
  popupMessage.innerText = message;

  let btn = document.createElement("div");
  btn.setAttribute("class", "btnContainer");
  let canclebtn = document.createElement("p");
  let confrimbtn = document.createElement("p");
  canclebtn.setAttribute("class", "confrimBtn red");
  confrimbtn.setAttribute("class", "confrimBtn");
  confrimbtn.innerText = "확인";
  canclebtn.innerText = "취소";

  confrimbtn.onclick = () => {
    if (bj === undefined) exec();
    else exec(bj);
    document.getElementById("popup").remove();
    document.getElementById("popupBack").remove();
  };

  canclebtn.onclick = () => {
    document.getElementById("popup").remove();
    document.getElementById("popupBack").remove();
  };

  popupBack.onclick = () => {
    document.getElementById("popup").remove();
    document.getElementById("popupBack").remove();
  };

  btn.appendChild(confrimbtn);
  btn.appendChild(canclebtn);
  popup.appendChild(popupMessage);
  popup.appendChild(btn);
  document.getElementsByTagName("body").item(0).appendChild(popup);
  document.getElementsByTagName("body").item(0).appendChild(popupBack);
};

const coustomAlert = (message) => {
  let popupBack = document.createElement("div");
  popupBack.setAttribute("id", "popupBack");
  let popup = document.createElement("div");
  popup.setAttribute("id", "popup");

  let popupMessage = document.createElement("p");
  popupMessage.setAttribute("class", "popupMessage");
  popupMessage.innerText = message;

  popup.appendChild(popupMessage);

  document.getElementsByTagName("body").item(0).appendChild(popup);
  document.getElementsByTagName("body").item(0).appendChild(popupBack);

  popup.style.transition = "0.7s";
  popup.style.opacity = 1;
  popupBack.style.transition = "0.7s";
  popupBack.style.opacity = 1;

  setTimeout(() => {
    document.getElementById("popup").style.opacity = 0;
    document.getElementById("popupBack").style.opacity = 0;
  }, 800);

  setTimeout(() => {
    document.getElementById("popup").remove();
    document.getElementById("popupBack").remove();
  }, 1500);
};

const getDateNum = () => {
  let tmp = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  let dateNum = [31, tmp, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return dateNum[month - 1];
};

const getDay = () => {
  let dateObj = new Date(year, month - 1, 1);
  return dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1;
};

const makeHeader = () => {
  let header = document.createElement("div");
  header.setAttribute("class", "caleandarHeader");

  let leftIcon = document.createElement("img");
  leftIcon.setAttribute("src", "./img/left.svg");
  leftIcon.setAttribute("alt", "decreaseYear");
  leftIcon.onclick = () => {
    if (month === 1) {
      year -= 1;
      month = 12;
    } else month -= 1;

    updateCalendar();
  };

  let yearText = document.createElement("p");
  yearText.setAttribute("class", "text");
  yearText.innerText = year + "." + month.toString().padStart(2, "0");

  let rightIcon = document.createElement("img");
  rightIcon.setAttribute("src", "./img/right.svg");
  rightIcon.setAttribute("alt", "increaseYear");
  rightIcon.onclick = () => {
    if (month === 12) {
      year += 1;
      month = 1;
    } else month += 1;
    updateCalendar();
  };
  console.log(year, month);
  header.appendChild(leftIcon);
  header.appendChild(yearText);
  header.appendChild(rightIcon);
  return header;
};

const setDuration = (e) => {
  let duration = document.getElementById("selectedDate");
  const offset = new Date().getTimezoneOffset() * 60000;
  startDate = new Date(year, month - 1, e, 0, 0, 0, 0);
  startDate = new Date(startDate - offset);
  duration.innerText = startDate.toISOString().split("T")[0];
  loadSelectedDateInfo(e);
};

// 선택된 날짜에 대한 정보를 가져옴
// 이때 bjName과 selectedBj가 다를 경우와 같을 경우 상세 페이지 정보를 다르게 보여줌
const loadSelectedDateInfo = (selectedDate) => {
  let tmp_day = String(selectedDate).padStart(2, "0");
  let tmp_month = String(month).padStart(2, "0");
  const currentDate = year + "-" + tmp_month + "-" + tmp_day;

  if (isBJ && selectedBj === bjName) {
    // 본인일 경우
    document.getElementById("categoryInput").disabled = false;
    document.getElementById("detailTextarea").disabled = false;
    document.getElementById("ampm").disabled = false;
    document.getElementById("hour").disabled = false;
    document.getElementById("minute").disabled = false;

    document.getElementsByClassName("saveBtn").item(0).style.display = "block";
    document.getElementsByClassName("detailColor").item(0).style.display =
      "block";
    document.getElementsByClassName("deleteBtn").item(0).style.display =
      "block";
    document.getElementById("time").style.display = "block";
    document.getElementById("noTime").style.display = "none";
    document.getElementById("showTime").style.display = "none";

    if (
      plan[selectedBj] &&
      plan[selectedBj][currentDate] !== undefined &&
      plan[selectedBj][currentDate] !== null
    ) {
      // 현재 날짜에 지정된 방송 유형과 방송 설명 가져오기
      const selectedDayInfo = plan[selectedBj][currentDate];
      document.getElementById("categoryInput").value =
        selectedDayInfo.type || "";
      document.getElementById("detailTextarea").value =
        selectedDayInfo.content || "";

      // 현재 날짜에 지정된 방송 시간 가져오기
      const startTime = selectedDayInfo.startTime || "";

      let hour = 0;
      let minute = 0;
      let ampm = "";

      if (startTime !== "") {
        const timeParts = startTime.split(":");
        hour = parseInt(timeParts[0]);
        minute = parseInt(timeParts[1]);

        if (hour >= 12) {
          // 12 ~ 23시
          ampm = "PM";
          if (hour > 12) hour -= 12;
        }
        // 0 ~ 11시
        else {
          ampm = "AM";
          if (hour === 0) hour += 12;
        }
      }

      document.getElementById("ampm").value = ampm;
      document.getElementById("hour").value = hour;
      document.getElementById("minute").value = minute;

      // 현재 날짜에 지정된 배경색 가져오기
      const selectedColor = selectedDayInfo.background || "";
      const colorButtons = document.querySelectorAll(".circleBtn");

      const colorList = {
        "": 0,
      };
      let idx = 0;
      for (const e of colorButtons) {
        let tmp_color =
          e.style.backgroundColor === "white"
            ? "white"
            : e.style.backgroundColor;
        colorList[tmp_color] = idx;
        idx++;
        e.style.border = "3px solid " + tmp_color;
      }
      colorButtons[colorList[selectedColor]].style.border = "3px solid #000000";
    } else {
      // 값이 없을 경우 전부 빈 값으로 초기화
      document.getElementById("categoryInput").value = "";
      document.getElementById("detailTextarea").value = "";
      document.getElementById("ampm").value = "AM";
      document.getElementById("hour").value = "12";
      document.getElementById("minute").value = "00";

      const colorButtons = document.querySelectorAll(".circleBtn");
      for (const e of colorButtons) {
        let tmp_color =
          e.style.backgroundColor === "white"
            ? "white"
            : e.style.backgroundColor;
        e.style.border = "3px solid " + tmp_color;
      }
      colorButtons[0].style.border = "3px solid #000000";
    }
  } else {
    // 본인이 아닐 경우
    document.getElementById("categoryInput").disabled = true;
    document.getElementById("detailTextarea").disabled = true;
    document.getElementById("ampm").disabled = true;
    document.getElementById("hour").disabled = true;
    document.getElementById("minute").disabled = true;

    document.getElementsByClassName("saveBtn").item(0).style.display = "none";
    document.getElementsByClassName("detailColor").item(0).style.display =
      "none";
    document.getElementsByClassName("deleteBtn").item(0).style.display = "none";
    document.getElementById("time").style.display = "none";
    document.getElementById("noTime").style.display = "none";

    if (
      plan[selectedBj] &&
      plan[selectedBj][currentDate] !== undefined &&
      plan[selectedBj][currentDate] !== null
    ) {
      const selectedDayInfo = plan[selectedBj][currentDate];

      document.getElementById("categoryInput").value =
        selectedDayInfo.type || "";
      document.getElementById("detailTextarea").value =
        selectedDayInfo.content || "";

      const startTime = selectedDayInfo.startTime || "";
      let hour = 0;
      let minute = 0;
      let ampm = "";

      if (startTime !== "") {
        const timeParts = startTime.split(":");
        hour = parseInt(timeParts[0]);
        minute = parseInt(timeParts[1]);

        if (hour >= 12) {
          // 12 ~ 23시
          ampm = "PM";
          if (hour > 12) hour -= 12;
        }
        // 0 ~ 11시
        else {
          ampm = "AM";
          if (hour === 0) hour += 12;
        }
      }

      document.getElementById("ampm").value = ampm;
      document.getElementById("hour").value = hour;
      document.getElementById("minute").value = minute;

      const showTime =
        (ampm === "PM" ? "오후 " : "오전 ") + hour + "시 " + minute + "분";
      document.getElementById("showTime").style.display = "block";
      document.getElementById("showTime").innerText = showTime;
    } else {
      document.getElementById("categoryInput").value = "방송 유형이 없습니다.";
      document.getElementById("detailTextarea").value = "방송 설명이 없습니다.";
      document.getElementById("time").style.display = "none";
      document.getElementById("noTime").style.display = "block";
      document.getElementById("showTime").style.display = "none";
    }
  }
};

const makeDate = () => {
  let datenum = getDateNum();
  let startDay = getDay();
  let endDay = (getDay() + datenum) % 7;
  let calendar = document.createElement("div");
  let dayList = document.createElement("div");

  dayList.setAttribute("class", "dayList");

  let dateList = document.createElement("div");
  dateList.setAttribute("class", "dateList");

  for (const e of day) {
    let p = document.createElement("p");
    p.innerText = e;
    p.setAttribute("class", "day");
    dayList.appendChild(p);
  }

  for (let i = 0; i < startDay; i++) {
    let p = document.createElement("p");
    p.innerText = " ";
    p.setAttribute("class", "emptyday");
    dateList.appendChild(p);
  }

  for (let i = 1; i <= datenum; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "todayContainer");

    let p = document.createElement("p");
    p.setAttribute("class", "day");

    let circle = document.createElement("p");
    circle.innerText = i;
    circle.setAttribute("class", "circle");

    let today = document.createElement("p");
    today.setAttribute("class", "today");

    let type = getDurationType(i);
    let tmp_month = String(month).padStart(2, "0");
    let tmp_day = String(i).padStart(2, "0");

    if (
      plan[selectedBj] !== undefined &&
      plan[selectedBj] !== null &&
      plan[selectedBj][year + "-" + tmp_month + "-" + tmp_day] !== undefined &&
      plan[selectedBj][year + "-" + tmp_month + "-" + tmp_day] !== null
    ) {
      circle.style.background =
        plan[selectedBj][year + "-" + tmp_month + "-" + tmp_day]["background"];
      if (
        circle.style.background === "" ||
        circle.style.background === "#ffffff"
      )
        circle.style.color = "#000000";

      if (type === 0) {
        circle.style.border = "1px solid #000000";
      }
      today.innerText =
        plan[selectedBj][year + "-" + tmp_month + "-" + tmp_day].type;
      p.appendChild(circle);
    } else {
      if (type === 0) {
        circle.style.backgroundColor = "white";
        circle.style.color = "black";
        circle.style.border = "1px solid #000000";
        p.appendChild(circle);
      } else if (type === -1) {
        p.innerText = i;
      }
    }

    div.onclick = () => {
      setDuration(i);
      updateCalendar();
    };

    div.appendChild(p);
    div.appendChild(today);

    let now = new Date();
    if (
      now.getDate() === i &&
      now.getFullYear() === year &&
      now.getMonth() + 1 === month
    ) {
      let today1 = document.createElement("p");
      today1.setAttribute("class", "today");
      today1.innerText = "today";
      div.appendChild(today1);
    }

    dateList.appendChild(div);
  }

  for (let i = 6; i > endDay; i--) {
    let p = document.createElement("p");
    p.innerText = " ";
    p.setAttribute("class", "emptyday");
    dateList.appendChild(p);
  }
  calendar.appendChild(dayList);
  calendar.appendChild(dateList);
  return calendar;
};

const savePlan = () => {
  let plandata = JSON.stringify({
    plan: plan,
    bjImgObj: bjImgObj,
    bjNicknameObj: bjNicknameObj,
  });
  localStorage.setItem("afreecaCalendar", plandata);
  updateCalendar();
};

const loadPlan = () => {
  const calendarList = document.getElementById("calendarList");

  let plandata = JSON.parse(localStorage.getItem("afreecaCalendar"));
  if (plandata !== undefined && plandata !== null) {
    plan = plandata.plan;
    bjImgObj = plandata.bjImgObj;
    bjNicknameObj = plandata.bjNicknameObj;
  }

  if (
    isBJ &&
    bjName !== null &&
    (plan[bjName] === undefined || plan[bjName] === null)
  )
    plan[bjName] = {};

  bjImgObj[bjName] = bjImg;
  bjNicknameObj[bjName] = bjNickname;
  calendarList.innerHTML = "";
  for (const e of Object.keys(plan)) {
    const bjCalendar = document.createElement("div");
    bjCalendar.setAttribute("class", "bjCalendar");
    const bjProfileImg = document.createElement("img");
    bjProfileImg.setAttribute("class", "bjimg");
    bjProfileImg.setAttribute("src", "#");
    bjProfileImg.setAttribute("alt", "bjImg");
    bjProfileImg.setAttribute("loading", "lazy");
    bjProfileImg.onerror = (e) => {
      e.target.src = "./img/afreecaImg.gif";
    };

    const info = document.createElement("div");
    info.setAttribute("class", "info");

    const name = document.createElement("p");
    name.setAttribute("class", "bjName");
    name.innerText = bjNicknameObj[e];

    const next = document.createElement("p");
    next.setAttribute("class", "deleteBjCalendar");

    const nextIcon = document.createElement("img");
    nextIcon.setAttribute("src", "./img/close.svg");
    nextIcon.setAttribute("alt", "delete");

    next.onclick = () => {
      coustomConfrim(
        bjNicknameObj[e] + "님의 캘린더를 삭제하시겠습니까?",
        removeCalendar,
        e
      );
    };

    name.onclick = () => {
      document.getElementById("slider").style.transform = "translate(-100vw)";
      if (e == bjName) document.getElementById("share").style.display = "flex";
      document.getElementById("backIcon").style.display = "flex";
      selectedBj = e;
      document.getElementsByClassName("headerTitle").item(0).innerText =
        bjNicknameObj[e] + "님의 Calendar";
      updateCalendar();
      loadSelectedDateInfo(startDate.getDate());
    };

    bjProfileImg.onclick = () => {
      document.getElementById("slider").style.transform = "translate(-100vw)";
      if (e == bjName) document.getElementById("share").style.display = "flex";
      document.getElementById("backIcon").style.display = "flex";
      selectedBj = e;
      document.getElementsByClassName("headerTitle").item(0).innerText =
        bjNicknameObj[e] + "님의 Calendar";
      updateCalendar();
      loadSelectedDateInfo(startDate.getDate());
    };

    next.appendChild(nextIcon);
    info.appendChild(name);
    info.appendChild(next);
    bjCalendar.appendChild(info);
    bjCalendar.appendChild(bjProfileImg);

    calendarList.appendChild(bjCalendar);
  }
  const bottom = document.createElement("P");
  bottom.setAttribute("class", "bottom");
  calendarList.appendChild(bottom);
};

const getDurationType = (e) => {
  // 0 시작일, 1 중간 , 2 종료일 , -1 그 외
  if (startDate === null) return -1;

  let startYear = startDate.getFullYear();
  let startMonth = startDate.getMonth() + 1;
  let date = startDate.getDate();

  if (startYear === year && startMonth == month && date === e) return 0;

  return -1;
};

// 특정 bj 캘린더 삭제
const removeCalendar = (bj) => {
  delete plan[bj];
  savePlan();
  document.getElementById("share").style.display = "none";
  document.getElementById("backIcon").style.display = "none";
  selectedBj = null;
  loadPlan();
  updateCalendar();
  coustomAlert("삭제되었습니다");
};

// 특정 날짜의 일정 삭제
const removeDayPlan = () => {
  delete plan[selectedBj][startDate.toISOString().split("T")[0]];
  savePlan();
  updateCalendar();
  setDuration(startDate.getDate());
  coustomAlert("삭제되었습니다");
};

const africaSdkInit = () => {
  SDK = window.AFREECA.ext;
  extensionSdk = SDK();
  let isLoggedIn = false;
  let broadInfo = null; // 방송 정보
  let playerInfo = null; // 플레이어 상태 정보

  const sendCalendar = () => {
    let plandata = localStorage.getItem("afreecaCalendar");
    if (plandata !== undefined && plandata !== null) {
      let jsonPlan = JSON.parse(plandata);
      let tmp_data = {
        plan: {},
        bjImgObj: {},
        bjNicknameObj: {},
      };
      let plan_tmp =
        jsonPlan["plan"][bjName] === undefined ? {} : jsonPlan["plan"][bjName];

      let bjimg_tmp =
        jsonPlan["bjImgObj"][bjName] === undefined
          ? "#"
          : jsonPlan["bjImgObj"][bjName];

      let bjnickname_tmp =
        jsonPlan["bjNicknameObj"][bjName] === undefined
          ? "닉네임 없음"
          : jsonPlan["bjNicknameObj"][bjName];
      tmp_data["plan"][bjName] = plan_tmp;
      tmp_data["bjImgObj"][bjName] = bjimg_tmp;
      tmp_data["bjNicknameObj"][bjName] = bjnickname_tmp;
      let stringData = JSON.stringify(jsonPlan);
      extensionSdk.broadcast.send("responseBjCalendar", stringData);
      coustomAlert("시청자와 공유되었습니다");
    } else {
      extensionSdk.broadcast.send("noDataBjCalendar", "nothing");
      coustomAlert("저장된 캘린더가 없습니다");
    }
  };

  const init = (auth, broad, player) => {
    isLoggedIn = !!auth.obscureUserId;
    isBJ = auth.isBJ;
    broadInfo = broad;
    playerInfo = player;
    bjName = broad.bjId;
    bjNickname = broad.bjNickname;
    bjImg = broad.bjThumbnail;
    loadPlan();
    const share = document.getElementById("shareIcon");
    const reload = document.getElementById("reloadIcon");

    share.onclick = () => {
      sendCalendar();
    };

    reload.onclick = () => {
      extensionSdk.broadcast.send("requestBjCalendar", "request");
    };
  };

  extensionSdk.handleInitialization(init);

  const handleBroadcastReceived = (action, message, fromId) => {
    if (action === "requestBjCalendar") {
      sendCalendar();
    } else if (action === "responseBjCalendar") {
      let plandata = JSON.parse(message);

      if (plandata !== undefined && plandata !== null) {
        let afreecaCalendar = localStorage.getItem("afreecaCalendar");
        if (afreecaCalendar === null || afreecaCalendar === undefined)
          afreecaCalendar = { plan: {}, bjImgObj: {}, bjNicknameObj: {} };
        else afreecaCalendar = JSON.parse(afreecaCalendar);

        let tmp_data = { ...afreecaCalendar };

        tmp_data["plan"][bjName] = {
          ...tmp_data["plan"][bjName],
          ...plandata["plan"][bjName],
        };

        tmp_data["bjImgObj"] = {
          ...tmp_data["bjImgObj"],
          ...plandata["bjImgObj"],
        };

        tmp_data["bjNicknameObj"] = {
          ...tmp_data["bjNicknameObj"],
          ...plandata["bjNicknameObj"],
        };

        localStorage.setItem("afreecaCalendar", JSON.stringify(tmp_data));
        coustomAlert("연동이 완료되었습니다");
        loadPlan();
        updateCalendar();
      }
    } else if (action === "noDataBjCalendar") {
      coustomAlert("데이터가 없습니다");
    }
  };

  extensionSdk.broadcast.listen(handleBroadcastReceived);
};

const attachEvent = () => {
  let back = document.getElementById("back");
  back.addEventListener("click", () => {
    document.getElementById("slider").style.transform = "translate(0vw)";
    document.getElementById("share").style.display = "none";
    document.getElementById("backIcon").style.display = "none";
    document.getElementsByClassName("headerTitle").item(0).innerText =
      "afreecatv calendar";
    selectedBj = null;
  });

  // 시간에 대한 max, min 값 조정
  const hourInput = document.getElementById("hour");
  const minuteInput = document.getElementById("minute");

  hourInput.addEventListener("change", () => {
    const value = parseInt(hourInput.value);
    if (value > parseInt(hourInput.max)) {
      hourInput.value = hourInput.max;
    } else if (value < parseInt(hourInput.min)) {
      hourInput.value = hourInput.min;
    }
  });

  minuteInput.addEventListener("change", () => {
    const value = parseInt(minuteInput.value);
    if (value > parseInt(minuteInput.max)) {
      minuteInput.value = minuteInput.max;
    } else if (value < parseInt(minuteInput.min)) {
      minuteInput.value = minuteInput.min;
    }
  });

  const saveButtons = document.querySelector(".saveBtn");
  let selectedColor = "";

  // 배경색 설정
  const colorButtons = document.querySelectorAll(".circleBtn");

  for (const e of colorButtons) {
    let tmp_color =
      e.style.backgroundColor === "white" ? "white" : e.style.backgroundColor;
    e.style.border = "3px solid " + tmp_color;

    e.onclick = (event) => {
      const colorButtons = document.querySelectorAll(".circleBtn");
      for (const e of colorButtons) {
        let tmp_color =
          e.style.backgroundColor === "" ? "white" : e.style.backgroundColor;
        if (event.target.style.backgroundColor === tmp_color)
          e.style.border = "3px solid #000000";
        else e.style.border = "3px solid " + tmp_color;
      }
      selectedColor = event.target.style.backgroundColor;
    };
  }

  // 저장 버튼 클릭 시 해당 날짜 일정 저장
  saveButtons.addEventListener("click", () => {
    const currentDate = startDate.toISOString().split("T")[0];
    if (!plan[selectedBj][currentDate]) {
      plan[selectedBj][currentDate] = {};
    }

    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);
    const ampm = document.getElementById("ampm").value;
    let adjustedHour = 0;
    if (ampm === "PM" && hour < 12) {
      adjustedHour = hour + 12;
    } else if (ampm === "AM" && hour === 12) {
      adjustedHour = hour - 12;
    } else adjustedHour = hour;

    const hourString = adjustedHour.toString().padStart(2, "0");
    const minuteString = minute.toString().padStart(2, "0");

    const startTime = hourString + ":" + minuteString;
    const categoryInput = document.getElementById("categoryInput").value;
    const detailTextarea = document.getElementById("detailTextarea").value;

    plan[selectedBj][currentDate].type = categoryInput;
    plan[selectedBj][currentDate].content = detailTextarea;
    plan[selectedBj][currentDate].background = selectedColor;
    plan[selectedBj][currentDate].startTime = startTime;

    savePlan();
    selectedColor = "";
    coustomAlert("저장되었습니다");
  });

  // 삭제 버튼 클릭 시 해당 날짜 일정 삭제
  document.querySelector(".deleteBtn").addEventListener("click", () => {
    coustomConfrim("일정을 삭제하시겠습니까?", removeDayPlan);
  });
};

const updateCalendar = () => {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendar.appendChild(makeHeader());
  calendar.appendChild(makeDate());
  const share = document.getElementById("shareIcon");
  const reload = document.getElementById("reloadIcon");
  if (isBJ && bjName === selectedBj) {
    share.style.display = "block";
    reload.style.display = "none";
  } else if (!isBJ && bjName === selectedBj) {
    share.style.display = "none";
    reload.style.display = "block";
  } else {
    share.style.display = "none";
    reload.style.display = "none";
  }
};

window.onload = () => {
  setDuration(startDate.getDate());
  africaSdkInit();
  attachEvent();
  updateCalendar();
};
