// 이미지 로드 시간을 기록
function recordLoadTime() {
    return performance.now();
}

// 반응 시간을 계산
function calculateResponseTime(loadTime, clickTime) {
    return clickTime - loadTime;
}

// 이미지 조합 생성
function generateCombinations(arr) {
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            result.push([arr[i], arr[j]]);
        }
    }
    return result.sort(() => Math.random() - 0.5); // 이미지 조합을 섞음
}