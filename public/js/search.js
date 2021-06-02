const search = async (element_id) => {
  const countryList = document.getElementById("countrySearch");
  const searchQuery = document.getElementById(element_id);
  const curCountry = window.location.pathname.split("/")[2];

  // Pass country of system language
  const country = curCountry
    ? curCountry
    : countryList
    ? countryList.value
    : "kz";
  const query = searchQuery ? searchQuery.value : "error";
  window.location.pathname.indexOf("person") !== -1
      ? window.location.href = `/persons/${country}/${query}`
      : window.location.href = `/search/${country}/${query}`
};

document.addEventListener("DOMContentLoaded", (e) => {
  const searchseletor =
    window.location.pathname === "/" ? "#query" : "#search-query";
  const formselector =
    window.location.pathname === "/" ? "#main-search" : "#header-search";
  const search = document.querySelector(searchseletor);
  const form = document.querySelector(formselector);

  const snippetsElem = form.parentNode.querySelector("#search-snippets");
  search.addEventListener("keydown", async (e) => {
    if(e.target.value.length>1){
      setTimeout(async () => {
        const snippets = await fetch("/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: e.target.value }),
        });
        try {
          const { data } = await snippets.json();
          if (data && data.length > 0) {
            let snipData = data;
            snipData.filter(Boolean);
            snippetsElem.innerHTML = "";
            snipData.forEach((el) => {
              snippetsElem.innerHTML += `
            <li>
              <a href="/companies/${el.jurisdiction.toLowerCase()}/${el.id}">
                ${
                  el.name &&
                  el.name
                      .split(" ")
                      .map((inv) =>
                          inv.replace(
                              new RegExp(e.target.value.toUpperCase()),
                              `<span class="selected">${e.target.value.toUpperCase()}</span>`
                          )
                      )
                      .join(" ")
              }
                ${
                  el.area &&
                  `· <span style="color:gray!important;">${el.area}</span>`
              } ${el.type_code.data.type_ru !== 'ИИН' && `· <span  style="color:gray!important;">${
                  (el.type_code.data.type_ru || "") + " " +  el.identifier
              }</span>` || ''}
              </a>
            </li>`;
            });
          } else {
            snippetsElem.innerHTML=`<li><a  href="/search/kz/${encodeURIComponent(e.target.value)}">${e.target.value}</a></li>`
          }
        }catch (error){
          snippetsElem.innerHTML=`<li ><a href="/search/kz/${encodeURIComponent(e.target.value)}">${e.target.value}</a></li>`
        }
      }, 50);
    }

  });
});
