String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};


const next_step = () => {
  document.querySelector(".step-1").style.display = "none";
  document.querySelector(".step-2").style.display = "block";
};

const elem = document.querySelector('.js-company-info-tabs');


if (elem) {

  let targetIds = [];
  let breakpoints = [];

  document.querySelectorAll(".tabs__item").forEach(el => targetIds.push(el.getAttribute("href")));

  const setBreakpoints = () => {
    breakpoints = targetIds.map((item) => {
      const item_offset = document.querySelector(item).getBoundingClientRect().top;
      let offset = item_offset + window.scrollY - 120;
      return [item, offset];
    });
  };

  const doResize = () => {
    const wscroll = window.scrollY;
    if (wscroll > 204) {
      elem.classList.add('sticky');

      document.querySelectorAll('.tabs__item').forEach(el => el.classList.remove("active"));

      for (let i = 0; i < breakpoints.length - 1; i++) {
        if (wscroll > breakpoints[i][1] && wscroll < breakpoints[i + 1][1]) {
          document.querySelectorAll(`.tabs__item[href="${breakpoints[i][0]}"]`)
              .forEach(el => el.classList.add("active"));
        } else if (wscroll > breakpoints[breakpoints.length - 1][1]) {
          document.querySelectorAll(`.tabs__item[href="${breakpoints[breakpoints.length - 1][0]}"]`)
              .forEach(el => el.classList.add("active"));
        }
      }
    } else {
      elem.classList.remove("sticky");
      document.querySelectorAll('.tabs__item').forEach(el => el.classList.remove("active"));
      document.querySelectorAll('.tabs__item[href="#_details"]').forEach(el => el.classList.add("active"));
    }
  };

  doResize();
  window.addEventListener("scroll", async () => {
    doResize();
    setTimeout(setBreakpoints, 10);
  });
}
async function loadLocalization(){
  const response = await fetch(`/localization/${window.lang ? window.lang : "en"}.json`);
  const a = await response.json();
  window.localization = a;
}
loadLocalization();
