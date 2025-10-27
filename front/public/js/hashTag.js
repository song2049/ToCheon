const hashtags = document.querySelectorAll('.hashtag');
const searchInput = document.querySelector('#searchInput');
const sectionRightSearch = document.querySelector('.section-right-search');

hashtags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        // 보낼때 # 제거해서 보내기
        const text = tag.textContent.replace('#','');
        // 인풋에 값 할당하기
        searchInput.value = text; 
        sectionRightSearch.submit();
    });
});