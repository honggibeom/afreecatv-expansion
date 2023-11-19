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

const handleBroadInfoChanged = (broadInfo) => {
  console.log("CHANGE TEST");
  console.log(broadInfo);
};

const handleRankInfo = (action, nickname, num, message) => {
  if (rank[action][nickname] !== undefined && rank[action][nickname] !== null)
    rank[action][nickname] += num;
  else rank[action][nickname] = num;
  document.getElementById("main").innerHTML =
    nickname + "<br/>" + rank[action][nickname];
};

extensionSdk.handleBroadInfoChanged(handleBroadInfoChanged);

const handleChatInfoReceived = (action, message) => {
  console.log(action);
  switch (action) {
    case "MESSAGE":
      getSpeech(message.message);
      handleRankInfo(action, message.userNickname, 12, message);
      break;
    case "BALLOON_GIFTED": // 별풍선 선물
      handleRankInfo(action, message.userNickname, message.count);
      break;
    case "ADBALLOON_GIFTED": // 애드벌룬 선물
      break;
    case "FANLETTER_GIFTED": // 스티커
      break;
    case "QUICKVIEW_GIFTED": // 퀵뷰
      break;
    case "VIDEOBALLOON_GIFTED": // 영상풍선 선물
      break;
    case "OGQ_EMOTICON_GIFTED": // 이모티콘
      break;
    case "SUBSCRIPTION_GIFTED": // 구독권 선물
      break;
    case "SUBSCRIBED": // 구독
      break;
    case "KEEP_SUBSCRIBED": // 연속 구독
      break;
    case "BATTLE_MISSION_GIFTED": // 대결 미션
      break;
    case "CHALLENGE_MISSION_GIFTED": // 도전 미션
      break;
  }
};

extensionSdk.chat.listen(handleChatInfoReceived);

const getSpeech = (text) => {
  let voices = [];

  //디바이스에 내장된 voice를 가져온다.
  const setVoiceList = () => {
    voices = window.speechSynthesis.getVoices();
  };

  setVoiceList();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    //voice list에 변경됐을때, voice를 다시 가져온다.
    window.speechSynthesis.onvoiceschanged = setVoiceList;
  }

  const speech = (txt) => {
    const lang = "ko-KR";
    const utterThis = new SpeechSynthesisUtterance(txt);
    //rate : speech 속도 조절 (기본값 1 / 조절 0.1 ~ 10 -> 숫자가 클수록 속도가 빠름 )
    const rate = 0.8;

    utterThis.lang = lang;
    utterThis.rate = rate;

    /* 한국어 vocie 찾기
          디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
      */
    const kor_voice = voices.find(
      (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
    );

    //한국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
    if (kor_voice) {
      utterThis.voice = kor_voice;
    } else {
      return;
    }

    //utterance를 재생(speak)한다.
    window.speechSynthesis.speak(utterThis);
  };

  speech(text);
};

const userList = [];

const handleBroadcastReceived = (action, message, fromId) => {
  if (action === "test") {
    console.log(message);
  }
};
extensionSdk.broadcast.listen(handleBroadcastReceived);
/*

*/
