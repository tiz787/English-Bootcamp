class PomodoroTimer {
  constructor() {
    this.timeLeft = 25 * 60;
    this.totalTime = 25 * 60;
    this.isRunning = false;
    this.interval = null;
    this.mode = "pomodoro"; // pomodoro, short, long, custom
    this.stats = this.loadStats();
    this.chart = null;

    this.settings = {
      pomodoro: 25,
      short: 5,
      long: 15,
      custom: 45,
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.renderChart();
  }

  setupEventListeners() {
    // Controls
    document
      .getElementById("pomo-start")
      .addEventListener("click", () => this.start());
    document
      .getElementById("pomo-pause")
      .addEventListener("click", () => this.pause());
    document
      .getElementById("pomo-reset")
      .addEventListener("click", () => this.reset());
    /*         document.getElementById('pomo-fullscreen').addEventListener('click', () => this.toggleFullscreen()); */
    document
      .getElementById("pomo-close")
      .addEventListener("click", () => this.closeModal());

    // Modes
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setMode(e.target.dataset.mode);
        document
          .querySelectorAll(".mode-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    // Settings inputs
    document
      .getElementById("setting-pomodoro")
      .addEventListener("change", (e) =>
        this.updateSettings("pomodoro", e.target.value)
      );
    document
      .getElementById("setting-short")
      .addEventListener("change", (e) =>
        this.updateSettings("short", e.target.value)
      );
    document
      .getElementById("setting-long")
      .addEventListener("change", (e) =>
        this.updateSettings("long", e.target.value)
      );

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterChart(e.target.dataset.filter);
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  }

  updateSettings(mode, value) {
    this.settings[mode] = parseInt(value);
    if (this.mode === mode) {
      this.reset();
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.reset();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
    this.updateControls();
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.updateControls();
  }

  reset() {
    this.pause();
    this.timeLeft = this.settings[this.mode] * 60;
    this.totalTime = this.timeLeft;
    this.updateDisplay();
  }

  complete() {
    this.pause();
    this.playAlarm();
    this.logSession();
    alert("¡Tiempo completado! 🎉");
    this.reset();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    document.getElementById("pomo-display").textContent = timeString;
    document.title = `${timeString} - Pomodoro`;

    // Update progress ring if we had one, or just title
  }

  updateControls() {
    const startBtn = document.getElementById("pomo-start");
    const pauseBtn = document.getElementById("pomo-pause");

    if (this.isRunning) {
      startBtn.style.display = "none";
      pauseBtn.style.display = "flex";
    } else {
      startBtn.style.display = "flex";
      pauseBtn.style.display = "none";
    }
  }

  toggleFullscreen() {
    const container = document.querySelector(".pomodoro-container");
    container.classList.toggle("fullscreen");
  }

  openModal() {
    document.getElementById("pomodoro-modal").classList.add("active");
  }

  closeModal() {
    document.getElementById("pomodoro-modal").classList.remove("active");
  }

  // Analytics
  loadStats() {
    return JSON.parse(localStorage.getItem("pomodoroStats")) || [];
  }

  logSession() {
    const session = {
      date: new Date().toISOString(),
      duration: this.settings[this.mode], // in minutes
      mode: this.mode,
    };
    this.stats.push(session);
    localStorage.setItem("pomodoroStats", JSON.stringify(this.stats));
    this.updateChart();
  }

  getChartData(filter = "week") {
    const now = new Date();
    const data = {};

    // Initialize labels based on filter
    let labels = [];
    let daysToLookBack = 7;

    if (filter === "day") daysToLookBack = 1; // Hourly breakdown for today? Or just today vs yesterday? Let's do last 7 days for 'week', last 30 for 'month'
    if (filter === "week") daysToLookBack = 7;
    if (filter === "month") daysToLookBack = 30;

    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
      });
      labels.push(dateStr);
      data[dateStr] = 0;
    }

    this.stats.forEach((session) => {
      const sessionDate = new Date(session.date);
      const diffTime = Math.abs(now - sessionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= daysToLookBack) {
        const dateStr = sessionDate.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
        });
        if (data[dateStr] !== undefined) {
          data[dateStr] += session.duration;
        }
      }
    });

    return {
      labels: labels,
      values: labels.map((l) => data[l]),
    };
  }

  renderChart() {
    const ctx = document.getElementById("pomodoroChart").getContext("2d");
    const chartData = this.getChartData("week");

    this.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Minutos de Enfoque",
            data: chartData.values,
            backgroundColor: "rgba(99, 102, 241, 0.5)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#94a3b8",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#94a3b8",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#f8fafc",
            },
          },
        },
      },
    });
  }

  updateChart() {
    const activeFilter =
      document.querySelector(".filter-btn.active").dataset.filter;
    this.filterChart(activeFilter);
  }

  filterChart(filter) {
    const chartData = this.getChartData(filter);
    this.chart.data.labels = chartData.labels;
    this.chart.data.datasets[0].data = chartData.values;
    this.chart.update();
  }

  playAlarm() {
    // Simple beep or notification
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play().catch((e) => console.log("Audio play failed", e));
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.pomodoroApp = new PomodoroTimer();
});

// Global function for the toolbar button
function openPomodoroModal() {
  window.pomodoroApp.openModal();
}
