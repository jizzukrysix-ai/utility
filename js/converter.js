(() => {
  const category = document.getElementById("unit-category");
  if (!category) return;
  const from = document.getElementById("unit-from"), to = document.getElementById("unit-to");
  const value = document.getElementById("unit-value"), result = document.getElementById("unit-result");
  const full = document.getElementById("unit-result-full");
  const units = {
    length: {meter: ["Meters", 1], kilometer: ["Kilometers", 1000], centimeter: ["Centimeters", .01], millimeter: ["Millimeters", .001], mile: ["Miles", 1609.344], yard: ["Yards", .9144], foot: ["Feet", .3048], inch: ["Inches", .0254]},
    weight: {kilogram: ["Kilograms", 1], gram: ["Grams", .001], milligram: ["Milligrams", .000001], pound: ["Pounds", .45359237], ounce: ["Ounces", .028349523125], metricton: ["Metric tons", 1000]},
    temperature: {celsius: ["Celsius"], fahrenheit: ["Fahrenheit"], kelvin: ["Kelvin"]}
  };
  let current = "length";
  function fill(select, selected) {
    select.innerHTML = "";
    Object.entries(units[current]).forEach(([key, data]) => {
      const option = document.createElement("option"); option.value = key; option.textContent = data[0];
      if (key === selected) option.selected = true;
      select.appendChild(option);
    });
  }
  function convertTemperature(v, a, b) {
    let c = a === "fahrenheit" ? (v - 32) * 5 / 9 : a === "kelvin" ? v - 273.15 : v;
    return b === "fahrenheit" ? c * 9 / 5 + 32 : b === "kelvin" ? c + 273.15 : c;
  }
  function calculate() {
    const n = Number(value.value);
    if (!Number.isFinite(n)) { result.textContent = "—"; full.textContent = "Enter a valid number"; return; }
    let answer;
    if (current === "temperature") answer = convertTemperature(n, from.value, to.value);
    else answer = n * units[current][from.value][1] / units[current][to.value][1];
    const rounded = Number(answer.toPrecision(8));
    result.textContent = rounded.toLocaleString(undefined, {maximumSignificantDigits: 8});
    full.textContent = `${result.textContent} ${units[current][to.value][0].toLowerCase()}`;
  }
  category.addEventListener("click", e => {
    const button = e.target.closest("[data-category]"); if (!button) return;
    current = button.dataset.category;
    category.querySelectorAll("button").forEach(b => b.classList.toggle("selected", b === button));
    const keys = Object.keys(units[current]); fill(from, keys[0]); fill(to, keys[1] || keys[0]); calculate();
  });
  [from, to, value].forEach(el => el.addEventListener("input", calculate));
  document.getElementById("copy-conversion").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(full.textContent); window.SUD.toast("Result copied."); }
    catch { window.SUD.toast("Clipboard access is unavailable."); }
  });
  fill(from, "meter"); fill(to, "foot"); calculate();
})();
