// 검색창 눌렀을 때만 뜨는 창
const searchBox = document.querySelector(".searchBox>input");
const searchWindow = document.querySelector(".searchWindow");

searchBox.addEventListener("focus", () => {
    searchWindow.style.visibility = "visible";
    searchWindow.style.pointerEvents = "auto";
});

searchBox.addEventListener("blur", () => {
    searchWindow.style.visibility = "hidden";
    searchWindow.style.pointerEvents = "none";
});

// 복사 버튼 만들기, 복사 한 다음 텍스트 alert
// 복사할 텍스트 요소와 버튼을 선택
const copyText = document.querySelector("#copyText");
const copyButton = document.querySelector(".address>button");

// Clipboard API로 특정 텍스트를 복사시킬 수 있다. 신기
copyButton.addEventListener("click", () => {
    // #copyText 요소의 텍스트를 클립보드에 복사
    navigator.clipboard
        .writeText(copyText.textContent) // 텍스트를 클립보드에 복사
        .then(() => {
            // 복사 성공 시 텍스트 출력
            alert("주소가 복사되었습니다");
        })
        .catch((err) => {
            // 복사 실패 시 오류 메시지 출력
            console.error("Failed to copy text: ", err);
        });
});

// 기업/서비스 소개 더보기 버튼 누르면 정보 전체출력
const moreInfoBtn = document.querySelector(".companyDetailButton");
const moreInfoText = document.querySelector(".companyDetailText");
const textGradient = document.querySelector(".compnayDetailHide");
const expandIcon = moreInfoBtn.querySelector(".expandIcon"); // 펼치기 아이콘
const collapseIcon = moreInfoBtn.querySelector(".collapseIcon"); // 접기 아이콘
const buttonText = moreInfoBtn.querySelector(".buttonText"); // 버튼 내 텍스트 span

// 버튼 클릭 시 이벤트
collapseIcon.style.display = "none";
expandIcon.style.display = "inline-block";

moreInfoBtn.addEventListener("click", () => {
    const isExpanded = moreInfoBtn.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
        // 이미 열려있으면 닫기
        moreInfoText.style.maxHeight = "168px";
        moreInfoText.style.overflow = "hidden";
        textGradient.classList.add("gradient");
        moreInfoBtn.setAttribute("aria-expanded", "false");

        // 버튼 텍스트 변경 (SVG는 유지됨)
        buttonText.textContent = "더 보기";

        // SVG 변경
        expandIcon.style.display = "inline-block";
        collapseIcon.style.display = "none";
    } else {
        // 닫혀있으면 열기
        moreInfoText.style.maxHeight = "none";
        moreInfoText.style.overflow = "visible";
        textGradient.classList.remove("gradient");
        moreInfoBtn.setAttribute("aria-expanded", "true");

        // 버튼 텍스트 변경 (SVG는 유지됨)
        buttonText.textContent = "접기";

        // SVG 변경
        expandIcon.style.display = "none";
        collapseIcon.style.display = "inline-block";
    }
});

// 이미지 배너부분 이벤트

const imageBanner = document.querySelector(".imageBanner");
const leftButton = document.querySelector(".leftButton");
const rightButton = document.querySelector(".rightButton");
const bannerCount = document.querySelector(".bannerCount span");

const images = imageBanner.children; // 이미지가 들어있는 div 요소들
const totalImages = images.length; // 전체 이미지 개수
const imageWidth = images[0].offsetWidth; // 각 이미지의 너비

let currentIndex = 0; // 현재 이미지 인덱스
let scrollTimeout; // 스크롤 이벤트 딜레이용 타이머

// 배너 이동 및 상태 업데이트 함수
function updateBanner() {
    // 배너를 하던대로 transformX로 이동하려고 하니까 스크롤까지 통째로 이동해서 이미지가 저 멀리 가버림...
    // 원하는대로 하려면 div 자체 위치가 아니라 스크롤을 옮겨야함
    // 그럴때 scrollTo를 쓰면 특정 위치로 scroll을 한다고 함
    imageBanner.scrollTo({
        left: currentIndex * imageWidth, // 현재 배열번호에서 이미지 크기를 곱한만큼 왼쪽으로 이동
        behavior: "smooth", // smooth 한 애니메이션 적용...CSS에서는 scroll-behavior: smooth
    });

    // 숫자 변경을 부드럽게 처리
    updateCountAndButtons(true);
}

// 배너 카운트 및 버튼 상태 업데이트
// 바로 이벤트가 실행되니까 count가 덜덜거리면서 부자연스럽게 바뀌어서 딜레이 적용시킴
function updateCountAndButtons(smooth = false) {
    if (smooth) {
        setTimeout(() => {
            bannerCount.textContent = currentIndex + 1; // 배열번호에서 1 더해야 count가 1부터 시작함
        }, 100);
    } else {
        bannerCount.textContent = currentIndex + 1;
    }

    // 첫 번째 이미지일 때 왼쪽 버튼 비활성화
    // 투명도나 색 조절같은 style 변경은 사이트 보니까 필요없음
    leftButton.disabled = currentIndex === 0;

    // 마지막 이미지일 때 오른쪽 버튼 비활성화
    rightButton.disabled = currentIndex === totalImages - 1;
}

// 스크롤 이벤트 감지하여 자동 업데이트 (딜레이 적용)
imageBanner.addEventListener("scroll", () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        const scrollLeft = imageBanner.scrollLeft;
        // Math.round는 반올림해서 정수로 만드는... 함수
        const newIndex = Math.round(scrollLeft / imageWidth); // 스크롤 위치로 인덱스 계산

        // 스크롤한 인덱스가 현재 인덱스가 아니면 count 변경
        if (newIndex !== currentIndex) {
            // 인덱스를 Math.round로 계산한 인덱스로 변경
            currentIndex = newIndex;
            updateCountAndButtons(true);
        }
    }, 100);
});

// 왼쪽 버튼 클릭 이벤트
leftButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateBanner();
    }
});

// 오른쪽 버튼 클릭 이벤트
rightButton.addEventListener("click", () => {
    if (currentIndex < totalImages - 1) {
        currentIndex++;
        updateBanner();
    }
});

// 초기 상태 업데이트
updateCountAndButtons();
