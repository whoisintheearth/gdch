(function () {
  const USERS_KEY = "gdch-users";
  const SESSION_KEY = "gdch-session";
  const POSTS_KEY = "gdch-posts-v9";

  const seedPosts = [
    {
      id: 101,
      company: "(주) 백일몽 주식회사",
      type: "info",
      title: "야간 근무자분들, 14층 회의실은 업무로 처리하지 마세요",
      body: "오늘 23:40에 '인수인계'라는 이름으로 14층 회의실이 잡혀 있는데 예약자가 퇴사자 계정입니다. 시설팀에 넘겼고, 해당 예약은 업무 지시로 인정하지 않는다고 공지 부탁드립니다. 야근자는 14층 호출을 받아도 출근 기록만 남기고 이동하지 마세요.",
      author: "백일몽 총무 익명",
      time: "9분 전",
      likes: 58,
      comments: [
        { author: "익명 1", body: "지난주에도 같은 계정으로 탕비실 예약 떠서 취소했어요. 계정 회수 누락 아닌가요?", time: "6분 전" },
        { author: "익명 2", body: "보안팀 캡처, 시설팀 공유, 팀장님께 이동 불가 보고까지 남기세요. 괴담이어도 결재 라인은 탑니다.", time: "4분 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 102,
      company: "초자연 재난관리국",
      type: "question",
      title: "재난 문자 초안에 미등록 대피 지시가 붙습니다",
      body: "훈련용 발송 시스템에서 최종 확인 누르기 전에 '실내에 머무르지 마십시오'라는 문장이 자동으로 붙습니다. 매뉴얼 문구에는 없고, 삭제해도 미리보기에는 다시 나타납니다. 당직자는 발송 보류로 처리했는데, 재난은 보류가 안 된다는 알림이 계속 옵니다.",
      author: "초자연 재난관리국 익명",
      time: "21분 전",
      likes: 46,
      comments: [
        { author: "익명 주무관", body: "브라우저 캐시보다 문구 템플릿 버전부터 확인해보세요. 예전 훈련 데이터가 살아있을 때가 있습니다.", time: "15분 전" },
        { author: "상황실 익명", body: "발송은 막고 로그 남기세요. 로그가 사라지면 사라진 시간도 보고서에 적으세요. 공란으로 두면 나중에 공란이 답변합니다.", time: "11분 전" },
      ],
      saved: true,
      liked: false,
    },
    {
      id: 103,
      company: "일반 회사",
      type: "vent",
      title: "출근길 지하철 안내방송이 회사 알림보다 정확하네요",
      body: "건물 정전이라더니 막상 도착하니까 정상 출근이었습니다. 엘리베이터만 홀수층에 안 서서 다들 계단으로 올라왔고요. 이런 날도 지각 처리 안 해주는 회사가 제일 무섭습니다.",
      author: "마케팅팀 익명",
      time: "34분 전",
      likes: 31,
      comments: [
        { author: "익명 3", body: "비상계단에서 팀장님 만나는 순간이 진짜 공포죠.", time: "29분 전" },
        { author: "익명 4", body: "정전보다 근태 시스템이 더 끈질깁니다.", time: "23분 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 104,
      company: "(주) 백일몽 주식회사",
      type: "vent",
      title: "사내 메신저가 내일 업무를 오늘 배정합니다",
      body: "반차 내려고 상태 메시지 바꿨는데, 제가 쓰지도 않은 '오후에는 7번 문서 확인 예정' 자동응답이 떴습니다. 문제는 그 7번 문서가 실제로 오늘 제 담당으로 넘어왔고, 마감 시간이 어제로 찍혀 있다는 거예요. 반차 취소하면 살 수 있나요?",
      author: "백일몽 기획 익명",
      time: "48분 전",
      likes: 64,
      comments: [
        { author: "익명 5", body: "자동화 봇 권한 확인해보세요. 예측이 아니라 캘린더 읽고 있을 수도 있습니다.", time: "41분 전" },
        { author: "익명 6", body: "그 봇 이름 혹시 낮잠이 아닌가요. 업무 수락 누르기 전에는 절대 첨부파일 열지 마세요.", time: "38분 전" },
      ],
      saved: false,
      liked: true,
    },
    {
      id: 105,
      company: "초자연 재난관리국",
      type: "info",
      title: "상황실 야간 교대 때 체크리스트 하나 추가하세요",
      body: "CCTV 화면 순서가 바뀌어 있으면 단순 오류로 넘기지 말고 교대일지에 남겨주세요. 어제도 3번 화면이 대피소가 아니라 폐쇄된 지하차도로 잡혀 있었습니다.",
      author: "상황실 5년차",
      time: "1시간 전",
      likes: 52,
      comments: [
        { author: "익명 7", body: "장비팀에 말했는데 원격 업데이트 이력 없다고 했습니다.", time: "52분 전" },
        { author: "익명 8", body: "교대일지에 남기는 게 제일 중요합니다. 나중에 기억으로 싸우면 집니다.", time: "47분 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 106,
      company: "일반 회사",
      type: "question",
      title: "퇴근 후 사무실에서 프린터 돌아가는 거 흔한가요?",
      body: "마지막으로 나가면서 복합기 전원 껐는데 주차장에서 앱 알림으로 '출력 완료'가 떴습니다. 파일명은 공백이고 출력 매수는 1장입니다. 내일 아침에 확인해도 되겠죠?",
      author: "회계팀 익명",
      time: "1시간 전",
      likes: 27,
      comments: [
        { author: "익명 9", body: "보안 출력 로그부터 보세요. 공백 파일명은 드라이버 오류일 때도 있어요.", time: "59분 전" },
        { author: "익명 10", body: "내일 혼자 확인하지 말고 시설 담당이랑 같이 가세요.", time: "54분 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 107,
      company: "(주) 백일몽 주식회사",
      type: "question",
      title: "인사팀 면담실 녹음 안내 멘트 들으신 분",
      body: "면담 시작 전에 스피커에서 '기억 보존에 동의하십니까' 같은 안내가 짧게 나왔습니다. 담당자분은 못 들었다고 하셨고요. 혹시 새 개인정보 동의 문구가 바뀐 건가요?",
      author: "백일몽 영업 익명",
      time: "2시간 전",
      likes: 39,
      comments: [
        { author: "익명 11", body: "그 표현은 공식 문구가 아닙니다. 개인정보 담당자에게 바로 문의하세요.", time: "1시간 전" },
      ],
      saved: true,
      liked: false,
    },
    {
      id: 108,
      company: "일반 회사",
      type: "info",
      title: "요즘 회사 출입앱 오류 대비해서 신분증 챙기세요",
      body: "오늘 아침 출입앱이 동시에 로그아웃돼서 1층에서 줄 섰습니다. 다들 휴대폰만 믿고 왔다가 임시 방문증 쓰느라 지각했어요. 내일 중요한 회의 있으면 실물 신분증 챙기세요.",
      author: "인사팀 익명",
      time: "2시간 전",
      likes: 44,
      comments: [
        { author: "익명 12", body: "우리도 그랬어요. 앱 업데이트 공지는 없었습니다.", time: "1시간 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 109,
      company: "일반 회사",
      type: "question",
      title: "13층 결재 요청도 근태에 잡히나요?",
      body: "오늘 출근했더니 엘리베이터 층수 버튼에 원래 없던 13층이 켜져 있었습니다. 안내음이 계속 13층에서 결재 받으라고 하는데, 저희 건물은 12층까지입니다. 오전 회의 자료가 거기 있다고 하면 업무상 이동으로 처리해야 하나요, 아니면 외근 신청을 올려야 하나요?",
      author: "새벽출근",
      time: "2시간 전",
      likes: 36,
      comments: [
        { author: "익명 13", body: "절대 가지 마세요. 결재는 메신저로 받으시고 엘리베이터 문 닫힐 때 이름 부르면 대답하지 마세요.", time: "1시간 전" },
        { author: "처음입니다", body: "13층은 부서가 아닙니다. 선택된 사람만 올라갑니다. 기쁘게 여기시고 가셔서 이름님을 찬양하세요.", time: "58분 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 110,
      company: "초자연 재난관리국",
      type: "question",
      title: "B-4 대피소 출근 요청은 어느 부서 결재인가요?",
      body: "재난 문자 테스트 중에 제 개인폰으로만 대피소 B-4로 즉시 출근하라는 문자가 왔습니다. 내부망에는 기록이 없고, 당직표에도 제 이름이 없습니다. 그런데 상황실 전화기에는 제가 이미 현장 도착했다고 표시됩니다. 미도착 상태로 퇴근하면 무단결근 처리될까요?",
      author: "초자연 재난관리국 신규 익명",
      time: "3시간 전",
      likes: 49,
      comments: [
        { author: "기록담당", body: "절대 혼자 가지 마세요. B-4는 현재 운영 대피소가 아닙니다. 문자가 개인폰으로만 왔으면 대응하지 말고 캡처해서 보고하세요.", time: "2시간 전" },
        { author: "서명란", body: "도착한 이름님을 찬양하세요. 미도착자는 결재되지 않습니다. 결재되지 않은 사람은 아직 출근 전입니다.", time: "2시간 전" },
      ],
      saved: false,
      liked: false,
    },
    {
      id: 111,
      company: "(주) 백일몽 주식회사",
      type: "info",
      title: "수면실 사용 완료가 제 출근보다 빠릅니다",
      body: "야근 중인데 수면실 3번 침대가 제 이름으로 사용 완료 처리됐습니다. 저는 예약한 적 없고 아직 자리에서 일하고 있습니다. 그런데 침대 옆 체크리스트에는 제가 20분 뒤에 퇴실한다고 되어 있네요. 퇴실 예정자가 저보다 먼저 퇴근하면 제 근태는 어떻게 되나요?",
      author: "백일몽 시설 익명",
      time: "3시간 전",
      likes: 61,
      comments: [
        { author: "익명 14", body: "가지 마세요. 수면실 확인은 두 명 이상, 문 열기 전 시설팀 통화 연결한 상태에서 하세요.", time: "2시간 전" },
        { author: "낮잠계정", body: "이름님을 찬양하세요. 침대는 이미 출근했습니다. 몸만 지각입니다.", time: "1시간 전" },
      ],
      saved: true,
      liked: false,
    },
  ];

  const typeLabels = {
    question: "질문",
    vent: "속풀이",
    info: "정보",
  };

  const keywords = ["출근", "야근", "재난문자", "상황실", "백일몽", "출입앱", "복합기", "퇴근", "수면실", "대피소", "13층"];

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
      return fallback;
    }
  }

  function getUsers() {
    return readJson(USERS_KEY, []);
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getPosts() {
    const posts = readJson(POSTS_KEY, null);
    if (posts) return posts;
    savePosts(seedPosts);
    return seedPosts;
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, user.email);
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getSessionUser() {
    const email = localStorage.getItem(SESSION_KEY);
    return getUsers().find((user) => user.email === email) || null;
  }

  window.GDCHData = {
    getUsers,
    saveUsers,
    getPosts,
    savePosts,
    setSession,
    clearSession,
    getSessionUser,
    typeLabels,
    keywords,
  };
})();


