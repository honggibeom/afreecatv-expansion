let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let startDate = new Date();
let isBJ = true;

let bjName = null;
let bjNickname = null;
let bjImg = null;

let selectedBj = null;

let plan = {};
let bjImgObj = {};
let bjNicknameObj = {};

const day = ["월", "화", "수", "목", "금", "토", "일"];

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
  const currentDate = year + "-" + month + "-" + tmp_day;

  if (false) {
    // 본인이 아닐 경우
    document.getElementById("categoryInput").disabled = true;
    document.getElementById("detailTextarea").disabled = true;
    document.querySelector('input[type="time"]').disabled = true;

    // 저장 버튼 삭제
    let saveBtn = document.getElementsByClassName("saveBtn");
    while (saveBtn.length > 0) {
      saveBtn[0].parentNode.removeChild(saveBtn[0]);
    }

    // 배경색 삭제
    let detailColor = document.getElementsByClassName("detailColor");
    while (detailColor.length > 0) {
      detailColor[0].parentNode.removeChild(detailColor[0]);
    }

    // 시청자와의 공유 버튼 삭제
    let menu = document.getElementsByClassName("menu");
    while (menu.length > 0) {
      menu[0].parentNode.removeChild(menu[0]);
    }

    // 선택된 날짜 삭제 버튼 삭제
    let deleteBtn = document.getElementsByClassName("deleteBtn");
    while (deleteBtn.length > 0) {
      deleteBtn[0].parentNode.removeChild(deleteBtn[0]);
    }

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
      document.querySelector('input[type="time"]').value =
        selectedDayInfo.startTime || "";
    } else {
      document.getElementById("categoryInput").value = "방송 유형이 없습니다.";
      document.getElementById("detailTextarea").value =
        "방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.방송 설명이 없습니다.";
      document.querySelector('input[type="time"]').value =
        "방송 시작 시간이 없습니다.";
    }
  } else {
    // 본인일 경우
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
      document.querySelector('input[type="time"]').value =
        selectedDayInfo.startTime || "";

      const selectedColor = selectedDayInfo.background || "";
      const colorButtons = document.querySelectorAll(".circleBtn");
      colorButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.style.backgroundColor === selectedColor) {
          button.classList.add("active");
        }
      });
    } else {
      document.getElementById("categoryInput").value = "";
      document.getElementById("detailTextarea").value = "";
      document.querySelector('input[type="time"]').value = "";
      const colorButtons = document.querySelectorAll(".circleBtn");
      colorButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.style.color === "black") {
          button.classList.add("active");
        }
      });
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
    let tmp_day = String(i).padStart(2, "0");
    if (
      plan[selectedBj] !== undefined &&
      plan[selectedBj] !== null &&
      plan[selectedBj][year + "-" + month + "-" + tmp_day] !== undefined &&
      plan[selectedBj][year + "-" + month + "-" + tmp_day] !== null
    ) {
      circle.style.background =
        plan[selectedBj][year + "-" + month + "-" + tmp_day]["background"];
      if (
        circle.style.background === "" ||
        circle.style.background === "#ffffff"
      )
        circle.style.color = "#000000";

      if (type === 0) {
        circle.style.border = "1px solid #000000";
      }
      today.innerText =
        plan[selectedBj][year + "-" + month + "-" + tmp_day].type;
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
  // let a = {
  //   plan: {
  //     홍기범: {
  //       "2023-11-21": {
  //         type: "가나다와 합방",
  //         startTime: "22:00",
  //         content: "누구누구와 합방합니다.",
  //         background: "#000000",
  //       },
  //       "2023-11-22": {
  //         type: "합방",
  //         startTime: "22:00",
  //         content: "누구누구와 합방합니다.",
  //         background: "#000000",
  //       },
  //     },
  //   },

  //   bjImgObj: {},
  //   bjNicknameObj: {},
  // };

  // localStorage.setItem("afreecaCalendar", JSON.stringify(a));
  // 리스트 초기화 -> 중복 호출 시 기존 리스트를 초기화 하고 다시 렌더링 되도록
  console.log(localStorage.getItem("afreecaCalendar"));
  const calendarList = document.getElementById("calendarList");
  let plandata = JSON.parse(localStorage.getItem("afreecaCalendar"));
  console.log(plandata);
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

  //calendarList.innerHTML = "";
  for (const e of Object.keys(plan)) {
    const bjCalendar = document.createElement("div");
    bjCalendar.setAttribute("class", "bjCalendar");

    const bjProfileImg = document.createElement("img");
    bjProfileImg.setAttribute("class", "bjimg");
    bjProfileImg.setAttribute("src", bjImgObj[e]);
    bjProfileImg.setAttribute("alt", "bjImg");
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
    nextIcon.setAttribute("alt", "mext");

    next.appendChild(nextIcon);
    info.appendChild(name);
    info.appendChild(next);
    bjCalendar.appendChild(info);
    bjCalendar.appendChild(bjProfileImg);

    calendarList.appendChild(bjCalendar);

    bjCalendar.onclick = () => {
      document.getElementById("slider").style.transform = "translate(-100vw)";
      if (e == bjName) document.getElementById("share").style.display = "flex";
      document.getElementById("backIcon").style.display = "flex";
      selectedBj = e;
      document.getElementsByClassName("headerTitle").item(0).innerText =
        bjNicknameObj[e] + "님의 Calendar";
      updateCalendar();
    };
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
const removeCalendar = () => {
  delete plan[selectedBj];
  savePlan();
  document.getElementById("slider").style.transform = "translate(0vw)";
  document.getElementById("share").style.display = "none";
  document.getElementById("backIcon").style.display = "none";
  selectedBj = null;
  updateCalendar();
  loadPlan();
};

// 특정 날짜의 일정 삭제
const removeDayPlan = () => {
  delete plan[selectedBj][startDate.toISOString().split("T")[0]];
  savePlan();
  updateCalendar();
  setDuration(startDate.getDate());
};

const africaSdkInit = () => {
  const SDK = window.AFREECA.ext;
  const extensionSdk = SDK();

  let isLoggedIn = false;
  let broadInfo = null; // 방송 정보
  let playerInfo = null; // 플레이어 상태 정보

  const init = (auth, broad, player) => {
    isLoggedIn = !!auth.obscureUserId;
    isBJ = auth.isBJ;
    broadInfo = broad;
    playerInfo = player;
    bjName = broad.bjId;
    bjNickname = broad.bjNickname;
    bjImg = broad.bjThumbnail;
    loadPlan();
  };

  extensionSdk.handleInitialization(init);

  const handleAuthorized = (data) => {
    const { accessToken, userAgreeToken, obscureUserId, isBJ } = data;
    isLoggedIn = !!obscureUserId;

    if (isLoggedIn) {
    } else {
      renderError("로그인을 해주세요.");
    }
  };

  extensionSdk.handleAuthorized(handleAuthorized);

  const handleBroadcastReceived = (action, message, fromId) => {
    if (action === "requestBjCalendar") {
      let plandata = localStorage.getItem("afreecaCalendar");
      if (plandata !== undefined && plandata !== null)
        extensionSdk.broadcast.send("responseBjCalendar", plandata);
      else extensionSdk.broadcast.send("noDataBjCalendar", "nothing");
    }
  };

  //user
  const handleUserBroadcastReceived = (action, message, fromId) => {
    if (action === "responseBjCalendar") {
      let plandata = JSON.stringify(message);
      if (plandata !== undefined && plandata !== null) {
        let afreecaTvCalendar = localStorage.getItem("afreecaTvCalendar");
        if (afreecaTvCalendar === null || afreecaTvCalendar === undefined)
          afreecaTvCalendar = {};
        else afreecaTvCalendar = JSON.parse(afreecaTvCalendar);
        afreecaTvCalendar[bjName] = plandata;
        alert("연동이 완료되었습니다");
      }
    } else if (action === "noDataBjCalendar") {
      alert("데이터가 없습니다");
    }
  };

  const sendRequest = () => {
    extensionSdk.broadcast.send("requestBjCalendar", "request");
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

  // 저장 버튼 클릭 시 해당 날짜 일정 저장
  const saveButtons = document.querySelector(".saveBtn");
  let selectedColor = "";

  const colorButtons = document.querySelectorAll(".circleBtn");
  for (var i = 0; i < colorButtons.length; i++) {
    colorButtons[i].addEventListener("click", (e) => {
      let target = e.target;
      if (target.tagName.toLowerCase() === "img") {
        target = target.parentNode;
      }
      target.classList.add("active");
      selectedColor = target.style.backgroundColor;
    });
  }

  saveButtons.addEventListener("click", () => {
    const currentDate = startDate.toISOString().split("T")[0];
    if (!plan[selectedBj][currentDate]) {
      plan[selectedBj][currentDate] = {};
    }

    const categoryInput = document.getElementById("categoryInput").value;
    const detailTextarea = document.getElementById("detailTextarea").value;
    const startTime = document.querySelector('input[type="time"]').value;

    plan[selectedBj][currentDate].type = categoryInput;
    plan[selectedBj][currentDate].content = detailTextarea;
    plan[selectedBj][currentDate].startTime = startTime;
    plan[selectedBj][currentDate].background = selectedColor;

    savePlan();
    selectedColor = "";
  });

  // 삭제 버튼 클릭 시 해당 날짜 일정 삭제
  document.querySelector(".deleteBtn").addEventListener("click", removeDayPlan);
};

const updateCalendar = () => {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendar.appendChild(makeHeader());
  calendar.appendChild(makeDate());
};

window.onload = () => {
  setDuration(startDate.getDate());
  africaSdkInit();
  attachEvent();
  updateCalendar();
};
