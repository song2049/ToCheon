document.addEventListener('DOMContentLoaded', function () {
  // 디스플레이 논 처리해둔 input창을 클릭해줌 이미지 누르면
  const fileInput = document.querySelector('#file-input');
  const uploadDiv = document.querySelector('#upload-div');

  uploadDiv.addEventListener('click', () => {
    fileInput.click(); 
  });
  // 별점 생성 함수
  function generateStars(rating) {
    const score = parseFloat(rating) || 0;
    const fullStars = Math.floor(score);
    const hasHalfStar = (score % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalfStar ? '★' : '') + '☆'.repeat(emptyStars);
  }

  // 모든 별점 요소 설정 (score-stars와 grid-stars 모두)
  const allStars = document.querySelectorAll('.score-stars, .grid-stars');
  allStars.forEach(element => {
    const rating = element.getAttribute('data-rating');
    if (rating) {
      element.textContent = generateStars(rating);
    }
  });

  // 바 그래프 애니메이션
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const score = parseFloat(bar.getAttribute('data-score')) || 0;
    const maxHeight = 88;
    const targetHeight = Math.round((score / 5) * maxHeight);

    // 초기 높이 0으로 설정
    bar.style.height = '0px';

    // 애니메이션 효과
    setTimeout(() => {
      bar.style.height = `${targetHeight}px`;
    }, 100);
  });
});

