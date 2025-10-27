const sectionRightSearch = document.querySelector(".section-right-search");

sectionRightSearch.addEventListener("submit", async(e) => {
    e.preventDefault();
    const stores = e.target.stores.value
    
    try {
        await axios.post("/search", {
            stores: stores
        });
    } catch (error) {
        console.log(err);
    }
})