let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;

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

const getDatePosition = (e) => {
  let datebuf = new Date(year, month - 1, e);
  let type = -1;
  if (props.startDate !== null && props.endDate !== null) {
    let startGap = props.startDate - datebuf;
    let endGap = props.endDate - datebuf;
    if (startGap === 0) type = 1;
    else if (startGap < 0 && endGap > 0) type = 0;
    else if (endGap === 0) type = 2;
  } else if (props.startDate !== null) {
    let startGap = props.startDate - datebuf;
    if (startGap === 0) type = 3;
  }
  return type;
};

const updateCalendar = () => {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendar.appendChild(makeHeader());
  calendar.appendChild(makeDate());
};

const africaSdkInit = () => {
  const SDK = window.AFREECA.ext;
  const extensionSdk = SDK();
  const rank = {
    MESSAGE: {},
    BALLOON_GIFTED: {},
    ADBALLOON_GIFTED: {},
    FANLETTER_GIFTED: {},
    QUICKVIEW_GIFTED: {},
    VIDEOBALLOON_GIFTED: {},
    OGQ_EMOTICON_GIFTED: {},
    SUBSCRIPTION_GIFTED: {},
    SUBSCRIBED: {},
    KEEP_SUBSCRIBED: {},
    BATTLE_MISSION_GIFTED: {},
    CHALLENGE_MISSION_GIFTED: {},
  };

  let isLoggedIn = false;
  let isBJ = false;
  let broadInfo = null; // 방송 정보
  let playerInfo = null; // 플레이어 상태 정보

  const init = (auth, broad, player) => {
    isLoggedIn = !!auth.obscureUserId;
    isBJ = auth.isBJ;

    broadInfo = broad;
    playerInfo = player;
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
  updateCalendar();
};
