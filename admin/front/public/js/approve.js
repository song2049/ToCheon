const awaitingRows = document.querySelectorAll(".awaiting-row");
const rejectBtn = document.q

awaitingRows.forEach((form) => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const storeId = e.target.storeId.value;
        const imgurl = e.target.imgurl.value;
        const open = e.target.open.value;
        const close = e.target.close.value;
        const eatTime = `${open} ~ ${close}`;

        if (imgurl.length === 0 || open.length === 0 || close.length === 0) {
            alert("이미지 주소 또는 영업시간이 올바르게 입력되지 않았습니다.")
            return
        }

        try {
            const { data } = await axios.post("/admin/approve", {
                ID: storeId,
                IMAGE_URL: imgurl,
                EATING_TIME: eatTime
            });

            alert(data);
            window.location.href = "http://localhost:3001/admin"
        } catch (error) {
            console.log(error)
            alert("승인 처리에 실패하였습니다.");
        }
    });
});

awaitingRows.forEach((form) => {
    const rejectBtn = form.querySelector(".reject-btn");

    rejectBtn.addEventListener("click", async () => {

        const ID = form.querySelector("input[name='storeId']").value;
        const rejectConfirm = confirm(`해당 ${ID} 번 대기 목록을 거절 하시겠습니까?`);
        if(!rejectConfirm) {return};

        if (!rejectConfirm) { return };
        try {
            if (!ID) {
                throw new Error("ID 값이 없습니다.")
            }
            const { data } = await axios.post("/admin/reject", {
                ID: ID
            });

            alert(data);
            window.location.href = "http://localhost:3001/admin"

        } catch (error) {
            console.log(error)
            alert("거절 처리에 실패하였습니다.");
        }


    });
});