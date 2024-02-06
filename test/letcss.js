let varsArr = [];
let itmG = null;
let setterPrefixGlobal = null;
let variablePrefixGlobal = null;

function let(...params) {
  let [vars, str] = params;

  if (typeof str == "string") {
    if (!varsArr.some((obj) => obj.vars == vars)) {
      let classes = str.split(",");

      itmG.classList.add(...classes);
      varsArr.push({ vars, classes, itm: itmG });
    }
  } else {
    if (!varsArr.some((obj) => obj.vars == vars)) {
      let classes = Array.from(str.lastItmClas).filter(
        (itm) => !itm.includes(setterPrefixGlobal)
      );

      itmG.classList.add(...classes);
      varsArr.push({ vars, classes, itm: itmG });
    }
  }
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

  return { varNames: varName.split(","), lastItmClas: itmG.classList };
}
function add(str) {
  let clsArr = str.split(",");

  return { fnName: "add", clsArr };
}
function remove(str) {
  let clsArr = str.split(",");

  return { fnName: "remove", clsArr };
}
function setItmGlobalCreateFunctionAndRemoveClass(cls, itm) {
  itmG = itm;

  try {
    let setVarsClass = new Function(cls);
    setVarsClass();
  } catch (error) {
    console.log(error);
  }
}
function loadLetCss(setterPrefix = "let", variablePrefix = "set") {
  setterPrefixGlobal = setterPrefix;
  variablePrefixGlobal = variablePrefix;
  let allElement = document.querySelectorAll("*");

  //let()
  allElement.forEach((itm) => {
    Array.from(itm.classList).forEach((cls) => {
      if (cls.includes(setterPrefix)) {
        setItmGlobalCreateFunctionAndRemoveClass(cls, itm);
      }
    });
  });
  //set()
  allElement.forEach((itm) => {
    Array.from(itm.classList).forEach((cls) => {
      if (cls.includes(variablePrefix)) {
        setItmGlobalCreateFunctionAndRemoveClass(cls, itm);
      }
    });
  });
}
function watchForAnyChanges() {
  const targetElement = document.querySelectorAll("*");

  const onClassAdded = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        console.log(
          mutation.oldValue
          //mutation.target
          //mutation.target.classList,
          //previousClasses
        );

        if (mutation.oldValue) {
          if (
            mutation.oldValue
              .split(" ")
              .filter((itm) => itm.includes(variablePrefixGlobal)).length > 0
          ) {
            let str = mutation.oldValue
              .split(" ")
              .filter((itm) => itm.includes(variablePrefixGlobal))[0];
            let fn = new Function(`return ${str}`);

            itmG = mutation.target;
            fn().varNames.forEach((vr) => {
              let fn = new Function(
                `set('${vr}',remove('${varsArr
                  .filter((obj) => obj.vars == vr)[0]
                  .classes.join(",")}'))`
              );
              fn();
            });
          }
        }
      }

      observer.disconnect();
      loadLetCss();
      startMe();
    }
  };
  const observer = new MutationObserver(onClassAdded);
  //const config = { attributes: true, attributeFilter: ["class"] };
  const config = {
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["class"],
    subtree: true,
  };
  const startMe = () => {
    targetElement.forEach((itm) => {
      observer.observe(itm, config);
    });
  };

  startMe();
}

window.addEventListener("DOMContentLoaded", () => {
  loadLetCss();
  watchForAnyChanges();
});

// window.addEventListener("DOMSubtreeModified", () => {
//   loadLetCss();
// });
