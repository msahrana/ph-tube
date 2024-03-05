const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const errorContainer = document.getElementById("error-element");
const sortBtn = document.getElementById("sort-btn");

let selectedCategory = 1000;
let sortByView = false;
/* sort button from api */
sortBtn.addEventListener("click", () => {
  sortByView = true;
  fetchDataByCategory(selectedCategory, sortByView);
});
/* search category from api */
const fetchCategory = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await res.json();
  const allCategory = data.data;
  displayCategory(allCategory);
};
/* display category from api */
const displayCategory = (allCategory) => {
  allCategory.forEach((btn) => {
    const newBtn = document.createElement("button");
    newBtn.className =
      "btn btn-ghost bg-slate-700 text-white text-lg category-btn";
    newBtn.innerText = btn.category;
    newBtn.addEventListener("click", () => {
      fetchDataByCategory(btn.category_id);
      const allBtn = document.querySelectorAll(".category-btn");
      for (const btn of allBtn) {
        btn.classList.remove("bg-red-600");
      }
      newBtn.classList.add("bg-red-600");
    });
    btnContainer.appendChild(newBtn);
  });
};
/* search category id from api */
const fetchDataByCategory = async (categoryID, sortByView) => {
  selectedCategory = categoryID;
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryID}`
  );
  const data = await res.json();
  const allData = data.data;
  displayData(allData, sortByView);
};
/* search all data from api */
const displayData = (allData, sortByView) => {
  /* sortByView button apply */
  if (sortByView) {
    allData.sort((a, b) => {
      const totalViewFirstStr = a.others?.views;
      const totalViewSecondStr = b.others?.views;
      const totalViewFirstNumber =
        parseFloat(totalViewFirstStr.replace("K", "")) || 0;
      const totalViewSecondNumber =
        parseFloat(totalViewSecondStr.replace("K", "")) || 0;
      return totalViewSecondNumber - totalViewFirstNumber;
    });
  }
  /* if we get empty data from api */
  if (allData.length === 0) {
    errorContainer.classList.remove("hidden");
  } else {
    errorContainer.classList.add("hidden");
  }
  /* all data reset after searching from api */
  cardContainer.innerText = "";
  allData.forEach((card) => {
    /* verified check from api */
    let verifiedBadge = "";
    if (card.authors[0].verified) {
      verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt="" />`;
    }

    /* card create and show from api */
    const newCard = document.createElement("div");
    newCard.innerHTML = `
    <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full" src=${card.thumbnail} alt="Shoes" />
                    <h6 id="post-date" class="absolute bottom-[40%] right-12 bg-black text-white px-1 rounded-lg">${
                      card?.others?.posted_date
                        ? convertMsToTime(card.others.posted_date)
                        : ""
                    }</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src=${
                              card.authors[0].profile_picture
                            } alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${card.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${card.authors[0].profile_name}</p>
                                ${verifiedBadge}
                            </div>
                            <p class="mt-3">${card.others.views}</p>
                        </div>
                    </div>
                </div>
            </div>
    `;
    cardContainer.appendChild(newCard);
  });
};

/* time format */
const convertMsToTime = (ms) => {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return `${hours} hrs ${minutes} min ${seconds} sec ago`;
};
console.log(convertMsToTime(300000));

fetchCategory();
fetchDataByCategory(selectedCategory, sortByView);
