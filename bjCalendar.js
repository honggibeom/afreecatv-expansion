let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let startDate = null;
let endDate = null;
let bjName = null;
let plan = {};

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
  if (endDate !== null) {
    startDate = new Date(year, month - 1, e);
    endDate = null;
    duration.innerText = startDate.toISOString().split("T")[0];
  } else if (startDate !== null) {
    let tmp = new Date(year, month - 1, e);
    if (startDate - tmp > 0) {
      endDate = startDate;
      startDate = tmp;
    } else {
      endDate = tmp;
    }
    duration.innerText =
      startDate.toISOString().split("T")[0] +
      endDate.toISOString().split("T")[0];
  } else {
    startDate = new Date(year, month - 1, e);
    duration.innerText = startDate.toISOString().split("T")[0];
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
    p.setAttribute("class", "day");
    dateList.appendChild(p);
  }
  for (let i = 1; i <= datenum; i++) {
    let p = document.createElement("p");
    p.innerText = i;
    p.setAttribute("class", "day");
    p.onclick = () => {
      setDuration();
      updateCalendar();
    };
    dateList.appendChild(p);
  }

  for (let i = 6; i > endDay; i--) {
    let p = document.createElement("p");
    p.innerText = " ";
    p.setAttribute("class", "day");
    dateList.appendChild(p);
  }

  calendar.appendChild(dayList);
  calendar.appendChild(dateList);
  return calendar;
};

const updateCalendar = () => {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendar.appendChild(makeHeader());
  calendar.appendChild(makeDate());
};

const savePlan = () => {};

const loadPlan = () => {};

const africaSdkInit = () => {
  const SDK = window.AFREECA.ext;
  const extensionSdk = SDK();

  let isLoggedIn = false;
  let isBJ = false;
  let broadInfo = null; // 방송 정보
  let playerInfo = null; // 플레이어 상태 정보

  const init = (auth, broad, player) => {
    isLoggedIn = !!auth.obscureUserId;
    isBJ = auth.isBJ;
    broadInfo = broad;
    playerInfo = player;
    bjName = broad.bjNickname;
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
    if (action === "test") {
      console.log(message);
    }
  };
  extensionSdk.broadcast.listen(handleBroadcastReceived);
};

window.onload = () => {
  africaSdkInit();
  updateCalendar();
};
