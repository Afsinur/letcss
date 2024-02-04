let varsArr = [];
let itmG = null;

function let(...params) {
  let [vars, str] = params;
  let classes = str.split(",");

  itmG.classList.add(...classes);
  varsArr.push({ vars, classes });
}
function set(...params) {
  let [varName, ...restArr] = params;
  varName.split(",").forEach((vn) => {
    itmG.classList.add(...varsArr.filter((obj) => obj.vars == vn)[0].classes);
  });

  restArr.forEach((obj) => {
    if (obj.fnName == "remove") {
      itmG.classList.remove(...obj.clsArr);
    }

    if (obj.fnName == "add") {
      itmG.classList.add(...obj.clsArr);
    }
  });
}
function add(str) {
  let clsArr = str.split(",");

  return { fnName: "add", clsArr };
}
function remove(str) {
  let clsArr = str.split(",");

  return { fnName: "remove", clsArr };
}

window.addEventListener("DOMContentLoaded", () => {
  function loadLetCss(setterPrefix = "let", variablePrefix = "set") {
    let allElement = document.querySelectorAll("*");

    //let()
    allElement.forEach((itm) => {
      Array.from(itm.classList).forEach((cls) => {
        if (cls.includes(setterPrefix)) {
          itmG = itm;

          let setVarsClass = new Function(cls);
          setVarsClass();
        }
      });
    });
    //set()
    allElement.forEach((itm) => {
      Array.from(itm.classList).forEach((cls) => {
        if (cls.includes(variablePrefix)) {
          itmG = itm;

          let setVarsClass = new Function(cls);
          setVarsClass();
        }
      });
    });
  }

  loadLetCss();

  function watchForAnyChanges() {
    const targetElement = document.querySelectorAll("*");
    const onClassAdded = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          observer.disconnect();
          loadLetCss();
          startMe();
        }
      }
    };
    const observer = new MutationObserver(onClassAdded);
    const config = { attributes: true, attributeFilter: ["class"] };
    const startMe = () => {
      targetElement.forEach((itm) => {
        observer.observe(itm, config);
      });
    };

    startMe();
  }

  watchForAnyChanges();
});
