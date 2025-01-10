let varsArr = [];
let storeItmAndAddedClasses = [];
let itmG = null;
let setterPrefixGlobal = null;
let variablePrefixGlobal = null;

function let(...params) {
  let [vars, str] = params;
  let classes;

  if (typeof str == "string") {
    classes = str.split(",");

    if (!varsArr.some((obj) => obj.vars == vars)) {
      itmG.classList.add(...classes);
      varsArr.push({ vars, classes });
    }
  } else {
    classes = Array.from(str.lastItmClas).filter(
      (itm) => !itm.includes(setterPrefixGlobal)
    );

    if (!varsArr.some((obj) => obj.vars == vars)) {
      itmG.classList.add(...classes);
      varsArr.push({ vars, classes });
    }
  }

  storeItmAndAddedClasses.push({
    classes,
    itm: itmG,
    action: setterPrefixGlobal,
  });
  return { classes, vars };
}
function set(...params) {
  let [varName, ...restArr] = params;
  let addedClasses = [];

  varName.split(",").forEach((vn) => {
    itmG.classList.add(...varsArr.filter((obj) => obj.vars == vn)[0].classes);
    addedClasses.push(...varsArr.filter((obj) => obj.vars == vn)[0].classes);
  });

  restArr.forEach((obj) => {
    if (obj.fnName == "remove") {
      itmG.classList.remove(...obj.clsArr);

      obj.clsArr.forEach((ob) => {
        addedClasses = addedClasses.filter((it) => it != ob);
      });
    }

    if (obj.fnName == "add") {
      itmG.classList.add(...obj.clsArr);

      obj.clsArr.forEach((ob) => {
        addedClasses.push(ob);
      });
    }
  });

  storeItmAndAddedClasses.push({
    classes: addedClasses,
    itm: itmG,
    action: variablePrefixGlobal,
  });
  return { varNames: varName.split(","), lastItmClas: addedClasses };
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
    //console.log(error);
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
      observer.disconnect();

      storeItmAndAddedClasses.forEach((obj) => {
        obj.itm.classList.remove(...obj.classes);
      });
      varsArr = [];
      storeItmAndAddedClasses = [];
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
