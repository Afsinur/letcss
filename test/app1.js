function loadCustomTailwind() {
  let allElement = document.querySelectorAll("*");
  let style = document.createElement("style");
  let styleString = "";
  let createdClass = [];
  let mediaQueryStr = [];

  function replacedClassFn(str) {
    return str
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\#/g, "\\#")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\,/g, "\\,")
      .replace(/\./g, "\\.")
      .replace(/\:/g, "\\:")
      .replace(/\%/g, "\\%");
  }

  function screenMe(screenW) {
    if (screenW == "sm") return "640";
    if (screenW == "md") return "768";
    if (screenW == "lg") return "1024";
    if (screenW == "xl") return "1280";
    if (screenW == "2xl") return "1536";
  }
  //makeString("md:grid-[2]");
  function responsiveText(screen, customClass, replacedClass) {
    let customSplited = customClass.split(":");
    let styleVal = makeString(customSplited[customSplited.length - 1]);
    let styles_ = `.${replacedClass.slice(
      0,
      replacedClass.indexOf(":")
    )}:${styleVal.slice(1, styleVal.length)}`;

    if (styles_.indexOf("2") == 1) {
      styles_ = ".\\" + `3${styles_.slice(1, styles_.length)}`;
    }

    str = `
        @media (min-width: ${screenMe(screen)}px) {${styles_}} 
        `;

    return str;
  }

  function makeString(cls) {
    let str = "";
    let splited = cls.split("-");
    let [start, end] = splited;

    if (splited.length > 2) {
      let lasterGulaEkKoroProthomTaBade = [];
      for (let i = 0; i < splited.length; i++) {
        const elm = splited[i];

        if (i > 0) {
          lasterGulaEkKoroProthomTaBade.push(elm);
        }
      }

      end = lasterGulaEkKoroProthomTaBade.join("-");
    }

    let replacedClass = replacedClassFn(cls);

    end && (end = end.replace(/[\[\]]/g, ""));

    //height and width
    {
      if (start == "w") {
        str = `.${replacedClass} { width: ${end} }`;
      }
      if (start == "h") {
        str = `.${replacedClass} { height: ${end} }`;
      }

      if (start == "maxW") {
        str = `.${replacedClass} { max-width: ${end} }`;
      }
    }
    //margin
    {
      if (start == "m") {
        str = `.${replacedClass} { margin: ${end.split("-").join(" ")} }`;
      }
      if (start == "mt") {
        str = `.${replacedClass} { margin-top: ${end} }`;
      }
      if (start == "mr") {
        str = `.${replacedClass} { margin-right: ${end} }`;
      }
      if (start == "mb") {
        str = `.${replacedClass} { margin-bottom: ${end} }`;
      }
      if (start == "ml") {
        str = `.${replacedClass} { margin-left: ${end} }`;
      }
      if (start == "mx") {
        str = `.${replacedClass} { margin-left: ${end}; margin-right: ${end} }`;
      }
      if (start == "my") {
        str = `.${replacedClass} { margin-top: ${end}; margin-bottom: ${end} }`;
      }
    }
    //padding
    {
      if (start == "p") {
        str = `.${replacedClass} { padding: ${end.split("-").join(" ")} }`;
      }
      if (start == "pt") {
        str = `.${replacedClass} { padding-top: ${end} }`;
      }
      if (start == "pr") {
        str = `.${replacedClass} { padding-right: ${end} }`;
      }
      if (start == "pb") {
        str = `.${replacedClass} { padding-bottom: ${end} }`;
      }
      if (start == "pl") {
        str = `.${replacedClass} { padding-left: ${end} }`;
      }
      if (start == "px") {
        str = `.${replacedClass} { padding-left: ${end}; padding-right: ${end} }`;
      }
      if (start == "py") {
        str = `.${replacedClass} { padding-top: ${end}; padding-bottom: ${end} }`;
      }
    }
    //background
    {
      if (start == "bg") {
        str = `.${replacedClass} { background: ${end} }`;
      }
    }
    //color
    {
      if (start == "text") {
        str = `.${replacedClass} { color: ${end} }`;
      }
    }
    //color
    {
      if (start == "text") {
        str = `.${replacedClass} { color: ${end} }`;
      }
    }
    //grid
    {
      if (start == "grid") {
        str = `.${replacedClass} { display: grid; grid-template-columns: repeat(${end}, 1fr) }`;
      }
      if (start == "gap") {
        str = `.${replacedClass} { gap: ${end} }`;
      }
      if (start == "place") {
        str = `.${replacedClass} { place-content: ${end} }`;
      }
    }
    //flex
    {
      if (start == "flex") {
        str = `.${replacedClass} { display: flex; flex-direction: ${end} }`;
      }
      if (start == "justify") {
        str = `.${replacedClass} { justify-content: ${end} }`;
      }
      if (start == "items") {
        str = `.${replacedClass} { align-items: ${end} }`;
      }
    }
    //ul
    {
      if (start == "list") {
        str = `.${replacedClass} { list-style: ${end} }`;
      }
    }
    //text-decoration
    {
      if (start == "decoration") {
        str = `.${replacedClass} { text-decoration: ${end} }`;
      }
    }
    //text-transform
    {
      if (start == "uppercase") {
        str = `.${replacedClass} { text-transform: uppercase }`;
      }
    }
    //responsive
    {
      if (start.includes(":")) {
        const [screen] = start.split(":");

        mediaQueryStr.push({
          str: responsiveText(screen, cls, replacedClass),
          order: Number(screenMe(screen)),
        });
      }
    }
    //cotainer
    {
      if (start == "container") {
        str = `.${replacedClass} { width: 100% }`;

        ["sm", "md", "lg", "xl", "2xl"].forEach((screen) => {
          str += `@media (min-width: ${screenMe(
            screen
          )}px){.container{max-width:${screenMe(screen)}px}} `;
        });
      }
    }
    //border-radius
    {
      console.log(start);
      if (start == "rounded") {
        str = `.${replacedClass} { border-radius: ${end} }`;
      }
    }
    //variables

    //last
    if (!createdClass.includes(str)) {
      styleString += str;

      createdClass.push(str);
    }

    return str;
  }

  allElement.forEach((itm) => Array.from(itm.classList).forEach(makeString));

  mediaQueryStr
    .sort((a, b) => a.order - b.order)
    .forEach((obj) => {
      styleString += obj.str;
    });

  style.innerHTML = `
  * {margin: 0;padding: 0;box-sizing: border-box;line-height: 120%;letter-spacing: 1px;}html, body {overflow-x:hidden;}${styleString}
`
    .replace(/\n/g, "")
    .replace(/\s{/g, "{")
    .replace(/}$\s/g, "}");

  document.head.append(style);
}

document.onreadystatechange = function () {
  document.readyState === "interactive" && loadCustomTailwind();
  document.readyState === "complete" &&
    (() => {
      // Target element you want to observe
      const targetElement = document.querySelectorAll("*");

      // Function to be called when a class is added
      const onClassAdded = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            document.head.lastChild.remove();
            loadCustomTailwind();
          }
        }
      };

      // Create a new MutationObserver with the callback function
      const observer = new MutationObserver(onClassAdded);

      // Configure the observer to watch for attribute changes on the target element
      const config = { attributes: true, attributeFilter: ["class"] };

      // Start observing the target element
      targetElement.forEach((itm) => {
        observer.observe(itm, config);
      });

      // Function to be called when the class is added

      // Remember to disconnect the observer when you no longer need it
      // observer.disconnect();
    })();
};
