const hashtags = document.querySelectorAll('.hashtag');
const searchInput = document.querySelector('#searchInput');
const sectionRightSearch = document.querySelector('.section-right-search');

hashtags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        // 인풋창에 넣기전에 해시태그 먼저 삭제하기
        const text = tag.textContent.replace('#','');
        // 그 값을 검색창에 붙여넣기
        searchInput.value = text;
        // 그리고 submit으로 제출하면 기존 검색창 입력한 것과 같은 로직으로 감
        sectionRightSearch.submit();
    });
});