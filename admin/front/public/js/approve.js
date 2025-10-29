const awaitingRows = document.querySelectorAll(".awaiting-row");

awaitingRows.forEach((form) => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const storeId = e.target.storeId.value;
        const imgurl = e.target.imgurl.value;
        const open = e.target.open.value;
        const close = e.target.close.value;
        const eattime = open + close;

        if (imgurl.length === 0 || open.length === 0 || close.length === 0) {
            alert("이미지 주소 또는 영업시간이 올바르게 입력되지 않았습니다.")
            return
        }

        try {
            const { data } = await axios.post("/admin/approve", {
                ID: storeId,
                IMAGE_URL: imgurl,
                EATING_TIME: eattime
            });
            alert(data.message);
            window.location.href = "http://localhost:3001/admin"
        } catch (error) {
            console.log(error)
            alert("승인 처리에 실패하였습니다.");
        }
    });
});