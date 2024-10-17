let currentPairIndex = 0;
let imageLoadTime = 0;
const responseTimes = [];
const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
let imagePairs = combinations(images);

function combinations(arr) {
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            result.push([arr[i], arr[j]]);
        }
    }
    return result.sort(() => Math.random() - 0.5); // 섞기
}

function displayNextImagePair() {
    if (currentPairIndex < imagePairs.length) {
        const [leftSrc, rightSrc] = imagePairs[currentPairIndex];
        document.getElementById('leftImage').src = 'images/' + leftSrc;
        document.getElementById('rightImage').src = 'images/' + rightSrc;
        imageLoadTime = performance.now();
    } else {
        window.location.href = 'complete.html';
    }
}

function handleImageClick() {
    const clickTime = performance.now();
    const responseTime = (clickTime - imageLoadTime) / 1000; // 밀리세컨 -> 세컨
    const [leftSrc, rightSrc] = imagePairs[currentPairIndex];
    responseTimes.push({
        responseTime,
        leftImage: leftSrc,
        rightImage: rightSrc
    });

    if (currentPairIndex < imagePairs.length - 1) {
        currentPairIndex++;
        displayNextImagePair();
    } else {
        saveResults();
    }
}

function saveResults() {
    // 결과가 저장될 수 있는 로직을 추가할 수 있습니다.
    console.log("Responses saved: ", responseTimes);

    // 데이터를 LocalStorage에 저장한 후에 페이지 이동
    localStorage.setItem('reponseTimes', JSON.stringify(responseTimes));
    
    // 저장이 완료된 후 페이지 이동
    window.location.href = 'complete.html';
}

// complete.html에서 CSV 다운로드 버튼 처리
window.addEventListener('DOMContentLoaded', function() {
    // complete.html에서 CSV 다운로드 버튼 처리
    if (window.location.pathname.includes('complete.html')) {
        // localStorage에서 데이터를 불러오기
        const storedData = localStorage.getItem('responseTimes');
        const responseTimes = storedData ? JSON.parse(storedData) : [];

        // 데이터가 제대로 로드되었는지 로그 확인
        console.log("Loaded responseTimes:", responseTimes);

        // CSV 다운로드 버튼 찾기
        const downloadBtn = document.getElementById('downloadCsvBtn');

        // 버튼에 이벤트 리스너 등록 (if-else 없이)
        downloadBtn.addEventListener('click', function() {
            // CSV 형식으로 변환
            const csvContent = convertToCSV(responseTimes);

            // Blob 객체 생성 (텍스트 데이터로 CSV 파일 구성)
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // 다운로드 링크 생성
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "response_times.csv");
            document.body.appendChild(link);

            // 링크 클릭하여 다운로드
            link.click();

            // 다운로드 후 링크 제거
            document.body.removeChild(link);
        });
    }
});

// 데이터를 CSV 형식으로 변환하는 함수
function convertToCSV(data) {
    const headers = ['Response Time (ms)', 'Left Image', 'Right Image'];
    const rows = data.map(item => [item.responseTime, item.leftImage, item.rightImage]);

    // CSV 포맷으로 변환
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    return csvContent;
}

document.getElementById('leftImage').addEventListener('click', handleImageClick);
document.getElementById('rightImage').addEventListener('click', handleImageClick);

displayNextImagePair();
