let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let startDate = new Date();
let isBJ = true;
let bjName = "bj1";
let selectedBj = "bj1";
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
  const offset = new Date().getTimezoneOffset() * 60000;
  startDate = new Date(year, month - 1, e, 0, 0, 0, 0);
  startDate = new Date(startDate - offset);
  duration.innerText = startDate.toISOString().split("T")[0];
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
    p.setAttribute("class", "day");

    let circle = document.createElement("span");
    circle.innerText = i;
    circle.setAttribute("class", "circle");
    let type = getDurationType(i);
    if (Object.hasOwn(plan[selectedBj], year + "-" + month + "-" + i)) {
      if (type === -1)
        circle.style.background =
          plan[selectedBj][year + "-" + month + "-" + i]["background"];

      p.appendChild(circle);
    } else {
      if (type === 0) {
        p.appendChild(circle);
      } else if (type === -1) {
        p.innerText = i;
      }
    }

    p.onclick = () => {
      setDuration(i);
      attachEvent();
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

const savePlan = () => {
  const categoryInput = document.getElementById("categoryInput").value;
  console.log(categoryInput);
  
  if (!plan[selectedBj]) {
    plan[selectedBj] = {};
  }

  plan[selectedBj].type = categoryInput;

  let plandata = JSON.stringify(plan);
  localStorage.setItem("afreecaCalendar", plandata);
};

const loadPlan = () => {
  let plandata = localStorage.getItem("afreecaCalendar");
  if (plandata !== undefined && plandata !== null) {
    plan = JSON.parse(plandata);
    if (isBJ && !Object.hasOwn(plan, bjName)) plan[bjName] = {};
    const calendarList = document.getElementById("calendarList");
    for (const e of Object.keys(plan)) {
      const bjCalendar = document.createElement("div");
      bjCalendar.setAttribute("class", "bjCalendar");

      const name = document.createElement("p");
      name.setAttribute("class", "bjName");
      name.innerText = e;

      const next = document.createElement("p");
      next.setAttribute("class", "next");

      const nextIcon = document.createElement("img");
      nextIcon.setAttribute("src", "./img/right.svg");
      nextIcon.setAttribute("alt", "mext");

      next.appendChild(nextIcon);
      bjCalendar.appendChild(name);
      bjCalendar.appendChild(next);
      calendarList.appendChild(bjCalendar);

      bjCalendar.onclick = () => {
        document.getElementById("slider").style.transform = "translate(-100vw)";
        document.getElementById("share").style.display = "block";
        document.getElementById("backIcon").style.display = "block";
        selectedBj = e;
        updateCalendar();
      };
    }
  }
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

const makeDetail = () => {
  if (Object.hasOwn(plan[selectedBj], startDate.toISOString().split("T")[0])) {
    plan[selectedBj][startDate.toISOString().split("T")[0]]; //현재 선택한 날짜의 일정



    // 상세 페이지 업데이트
  }
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
    if (action === "requestBjCalendar") {
      let plandata = localStorage.getItem(bjName + "Calendar");
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
    selectedBj = null;
  });

  var buttons = document.querySelectorAll(".circle-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {
      buttons.forEach((button) => button.classList.remove("active"));
      e.target.classList.add("active");
      switch (i) {
        case 0:
          console.log(0);
          //selectedColor = "#FF0000";
          break;
        case 1:
          console.log(1);
          //selectedColor = "#00FF00";
          break;
        case 2:
          console.log(2);
          //selectedColor = "#0000FF";
          break;
        default:
        //selectedColor = "#981c26";
      }
    });
  }
};

const updateCalendar = () => {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendar.appendChild(makeHeader());
  calendar.appendChild(makeDate());
};

window.onload = () => {
  let a = {
    홍기범: {
      "2023-11-21": {
        type: "합방",
        "방송 시작": "22:00",
        content: "누구누구와 합방합니다.",
        background: "#000000",
      },
      "2023-11-22": {
        type: "합방",
        "방송 시작": "22:00",
        content: "누구누구와 합방합니다.",
        background: "#000000",
      },
    },
  };
  localStorage.setItem("afreecaCalendar", JSON.stringify(a));
  setDuration(startDate.getDate());
  africaSdkInit();
  loadPlan();
  attachEvent();
  updateCalendar();
  console.log(plan);
};
