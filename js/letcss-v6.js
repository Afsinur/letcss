let varsArr = [];
let storeItmAndAddedClasses = [];
let setterPrefixGlobal = null;
let variablePrefixGlobal = null;
let loadLetAgain = false;
let loadSetAgain = false;

function let(...params) {
  return params;
}
function set(...params) {
  return params;
}
function remove(...params) {
  return { method: "remove", classes: params };
}
function add(...params) {
  return { method: "add", classes: params };
}
function updateClasses(itm, strArr, stringFnClass, action) {
  itm.classList.value = "";
  itm.classList.value = strArr.join(" ").trim();

  storeItmAndAddedClasses.push({
    addedClasses: strArr[1].split(" ").filter((cl) => cl != ""),
    itm,
    stringFnClass,
  });
}
function breakClasses(classValue, breakBasedBy) {
  let foundIndex = classValue.indexOf(`${breakBasedBy}(`);

  if (foundIndex != -1) {
    let firstPart = classValue.slice(0, foundIndex);

    let ourFnStr = classValue.slice(
      foundIndex,
      classValue.lastIndexOf(")") + 1
    );

    let lastPart = classValue.slice(
      firstPart.length + ourFnStr.length,
      classValue.length
    );

    return [firstPart.trim(), ourFnStr.trim(), lastPart.trim()];
  } else {
    return false;
  }
}
function loadLetCss(setterPrefix = "let", variablePrefix = "set") {
  try {
    setterPrefixGlobal = setterPrefix;
    variablePrefixGlobal = variablePrefix;
    let allElement = document.querySelectorAll("*");

    //let()
    function runLet() {
      allElement.forEach((itm) => {
        if (breakClasses(itm.classList.value, setterPrefix)) {
          let [firstPart, ourFnStr, lastPart] = breakClasses(
            itm.classList.value,
            setterPrefix
          );

          if (itm.classList.value.includes(setterPrefix)) {
            if (!ourFnStr.includes(variablePrefix)) {
              let arr = new Function(`return ${ourFnStr}`)();
              let middlePart = arr[1].trim();

              if (!arr[1].includes(variablePrefix)) {
                if (!varsArr.some((obj) => obj.varName == arr[0])) {
                  varsArr.push({ varName: arr[0], classes: middlePart });
                  updateClasses(
                    itm,
                    [firstPart, middlePart, lastPart],
                    ourFnStr,
                    setterPrefix
                  );
                }
              }
            } else {
              if (loadLetAgain) {
                let arr = new Function(`return ${ourFnStr}`)();
                let [realVar, setArr] = arr;

                let middlePart = setArr[0]
                  .split(" ")
                  .map(
                    (vr) =>
                      varsArr.filter((obj) => obj.varName == vr)[0].classes
                  )
                  .join(" ");

                setArr.forEach((itm) => {
                  if (typeof itm == "object") {
                    if (itm.method == "remove") {
                      itm.classes[0]
                        .split(" ")
                        .map((cl) => cl.trim())
                        .forEach((rcls) => {
                          middlePart = middlePart
                            .replace(`${rcls}`, "")
                            .split(" ")
                            .map((cl) => cl.trim())
                            .filter((cl) => cl != "")
                            .join(" ");
                        });
                    } else {
                      middlePart = `${middlePart} ${itm.classes[0]
                        .split(" ")
                        .map((cl) => cl.trim())
                        .filter((cl) => cl != "")
                        .join(" ")}`;
                    }
                  }
                });

                if (!varsArr.some((obj) => obj.varName == realVar)) {
                  varsArr.push({ varName: realVar, classes: middlePart });
                  updateClasses(
                    itm,
                    [firstPart, middlePart, lastPart],
                    ourFnStr,
                    setterPrefix
                  );
                }
              }

              loadLetAgain = true;
            }
          }
        }
      });
    }
    runLet();
    //set()
    function runSet() {
      allElement.forEach((itm) => {
        if (breakClasses(itm.classList.value, variablePrefix)) {
          let [firstPart, ourFnStr, lastPart] = breakClasses(
            itm.classList.value,
            variablePrefix
          );

          if (!itm.classList.value.includes(setterPrefix)) {
            if (itm.classList.value.includes(variablePrefix)) {
              let arr = new Function(`return ${ourFnStr}`)();
              let notFound = false;
              notFound = arr[0]
                .split(" ")
                .map((itm) => varsArr.some((obj) => obj.varName == itm))
                .includes(false);

              if (notFound) {
                loadSetAgain = true;
              } else {
                let middlePart = arr[0]
                  .split(" ")
                  .map(
                    (vr) =>
                      varsArr.filter((obj) => obj.varName == vr)[0].classes
                  )
                  .join(" ");

                arr.forEach((itm) => {
                  if (typeof itm == "object") {
                    if (itm.method == "remove") {
                      itm.classes[0]
                        .split(" ")
                        .map((cl) => cl.trim())
                        .forEach((rcls) => {
                          middlePart = middlePart
                            .replace(`${rcls}`, "")
                            .split(" ")
                            .map((cl) => cl.trim())
                            .filter((cl) => cl != "")
                            .join(" ");
                        });
                    } else {
                      middlePart = `${middlePart} ${itm.classes[0]
                        .split(" ")
                        .map((cl) => cl.trim())
                        .filter((cl) => cl != "")
                        .join(" ")}`;
                    }
                  }
                });

                updateClasses(
                  itm,
                  [firstPart, middlePart, lastPart],
                  ourFnStr,
                  variablePrefix
                );
              }
            }
          }
        }
      });
    }
    runSet();

    if (loadLetAgain) {
      runLet();
    }
    if (loadSetAgain) {
      runSet();
    }
  } catch (error) {
    //console.log(error);
  }
}
function watchForAnyChanges() {
  const targetElement = document.querySelectorAll("*");

  const onClassAdded = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      observer.disconnect();

      storeItmAndAddedClasses.forEach((obj) => {
        obj.itm.classList.remove(...obj.addedClasses);
        obj.itm.classList.value += ` ${obj.stringFnClass}`;
      });

      varsArr = [];
      storeItmAndAddedClasses = [];
      loadLetAgain = false;
      loadSetAgain = false;
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
