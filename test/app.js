function loadCustomTailwind() {
  let style = document.createElement("style");

  function marginOrPadding(model, direction, limit, multi) {
    const [start, end] = limit.split("-");

    let returnCss = "";

    for (let i = Number(start); i < Number(end) + 1; i++) {
      const value = `calc(${i}px * ${i * 2})`;

      function enDirection(d) {
        let dr = "";
        d == "x" && (dr = "left");
        d == "y" && (dr = "top");
        d == "l" && (dr = "left");
        d == "r" && (dr = "right");
        d == "b" && (dr = "bottom");
        return dr;
      }

      returnCss += `
        .${model}${direction ? direction : ``}-${i} {
                    ${model == "p" ? `padding` : `margin`}${
        direction ? `-${enDirection(direction)}` : ``
      }: ${value};

      ${
        multi
          ? direction
            ? `${model == "p" ? `padding` : `margin`}-${
                direction == "x" ? `right` : `bottom`
              }: ${value};`
            : ``
          : ``
      }                    
        }
        `;
    }

    return returnCss;
  }

  style.innerHTML = `
      * {margin: 0;padding: 0;box-sizing: border-box;}
      html, body {overflow-x:hidden;}
      ${marginOrPadding("p", null, "1-99")}
      ${marginOrPadding("m", null, "1-99")}
      ${marginOrPadding("p", "x", "1-99", "multi")}
      ${marginOrPadding("p", "y", "1-99", "multi")}
      ${marginOrPadding("m", "x", "1-99", "multi")}
      ${marginOrPadding("m", "y", "1-99", "multi")}
      ${marginOrPadding("m", "l", "1-99", null)}
  `.replace(/[\n\s]/g, "");

  document.head.insertAdjacentElement("afterend", style);
}
//window.addEventListener("DOMContentLoaded", loadCustomTailwind);
loadCustomTailwind();
