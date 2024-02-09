setTimeout(() => {
  console.log(document.querySelector("[data-fst]"));
  document.querySelector(
    "[data-fst]"
  ).classList.value += ` let('title-5',set('title-1'))`;
}, 1000);
