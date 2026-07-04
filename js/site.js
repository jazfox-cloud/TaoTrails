const checklist = document.querySelector("[data-checklist]");
if (checklist) {
  const boxes = [...checklist.querySelectorAll("input[type='checkbox']")];
  const bar = checklist.querySelector("[data-progress]");
  const label = checklist.querySelector("[data-progress-label]");
  const update = () => {
    const checked = boxes.filter((box) => box.checked).length;
    const percent = Math.round((checked / boxes.length) * 100);
    bar.style.width = `${percent}%`;
    label.textContent = `${checked} of ${boxes.length} etiquette points checked`;
  };
  boxes.forEach((box) => box.addEventListener("change", update));
  update();
}

const timer = document.querySelector("[data-tea-timer]");
if (timer) {
  const teas = {
    green: { label: "Green tea", seconds: 75 },
    oolong: { label: "Rock oolong", seconds: 45 },
    puer: { label: "Ripe puer", seconds: 20 }
  };

  let selected = "green";
  let remaining = teas[selected].seconds;
  let interval = null;

  const display = timer.querySelector("[data-time]");
  const status = timer.querySelector("[data-status]");
  const optionButtons = [...timer.querySelectorAll("[data-tea]")];
  const startButton = timer.querySelector("[data-start]");
  const pauseButton = timer.querySelector("[data-pause]");
  const resetButton = timer.querySelector("[data-reset]");

  const format = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const render = () => {
    display.textContent = format(remaining);
    status.textContent = `${teas[selected].label}: first mindful infusion`;
    optionButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tea === selected);
    });
  };

  const stop = () => {
    clearInterval(interval);
    interval = null;
  };

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.tea;
      remaining = teas[selected].seconds;
      stop();
      render();
    });
  });

  startButton.addEventListener("click", () => {
    if (interval) return;
    interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        remaining = 0;
        stop();
        status.textContent = "Infusion complete. Pour fully before the next round.";
      }
      display.textContent = format(remaining);
    }, 1000);
  });

  pauseButton.addEventListener("click", stop);
  resetButton.addEventListener("click", () => {
    remaining = teas[selected].seconds;
    stop();
    render();
  });

  render();
}

const sacredMap = document.querySelector("[data-sacred-map]");
if (sacredMap) {
  const filters = [...sacredMap.querySelectorAll("[data-map-filter]")];
  const pins = [...sacredMap.querySelectorAll("[data-map-tags]")];

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.mapFilter;
      filters.forEach((item) => item.classList.toggle("active", item === button));
      pins.forEach((pin) => {
        const tags = pin.dataset.mapTags.split(" ");
        pin.classList.toggle("is-dimmed", filter !== "all" && !tags.includes(filter));
      });
    });
  });
}
