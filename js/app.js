setTimeout(() => {
  document.querySelector("[data-app-2]").classList.add("set('p1,p2')");

  setTimeout(() => {
    document.querySelector("[data-app-2]").classList.remove("set('p1,p2')");

    setTimeout(() => {
      document.querySelector(
        "[data-app]"
      ).innerHTML = `<div class="let('p3','bg-blue-500')">js <div class="set('p2')">css</div></div>`;
    }, 5000);
  }, 1000);
}, 2000);
