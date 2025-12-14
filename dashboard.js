/**
 * 📊 DASHBOARD & ANALYTICS ENGINE
 * Handles charts, progress tracking, and gamification stats.
 */

const Dashboard = {
  charts: {},

  init: () => {
    Dashboard.renderStructure();
    Dashboard.updateStats();
    Dashboard.initCharts();
    Dashboard.renderHeatmap();
  },

  renderStructure: () => {
    const container = document.getElementById("dashboard-container");
    if (!container) return;

    container.innerHTML = `
        <div class="dashboard-grid">
            <!-- Stats Cards -->
            <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-info">
                    <span class="stat-value" id="streak-val">0</span>
                    <span class="stat-label">Días Racha</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-info">
                    <span class="stat-value" id="xp-val">0</span>
                    <span class="stat-label">Total XP</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                    <span class="stat-value" id="hours-val">0h</span>
                    <span class="stat-label">Estudio Total</span>
                </div>
            </div>
            
            <!-- Charts -->
            <div class="chart-card wide">
                <h4>📈 Progreso Semanal</h4>
                <canvas id="progressChart"></canvas>
            </div>

            
        </div>
    `;
  },

  updateStats: () => {
    const xp = localStorage.getItem("userXP") || 0;
    const streak = localStorage.getItem("userStreak") || 0;
    const totalMinutes = localStorage.getItem("totalStudyMinutes") || 0;
    const hours = (totalMinutes / 60).toFixed(1);

    document.getElementById("xp-val").textContent = xp;
    document.getElementById("streak-val").textContent = streak;
    document.getElementById("hours-val").textContent = hours + "h";
  },

  initCharts: () => {
    // 1. Progress Chart (Line)
    const ctxProgress = document
      .getElementById("progressChart")
      .getContext("2d");

    const weeklyData = Dashboard.getWeeklyData();

    // Check if empty (all zeros)
    const isEmpty = weeklyData.every((val) => val === 0);

    if (isEmpty) {
      // Show "Haz tu primer test" message overlay
      const chartContainer =
        document.getElementById("progressChart").parentElement;
      if (!chartContainer.querySelector(".empty-msg")) {
        const msg = document.createElement("div");
        msg.className = "empty-msg";
        msg.style.position = "absolute";
        msg.style.top = "50%";
        msg.style.left = "50%";
        msg.style.transform = "translate(-50%, -50%)";
        msg.style.color = "var(--text-muted)";
        msg.style.textAlign = "center";
        msg.innerHTML =
          "📉 Aún no hay datos<br><small>Haz tu primer test para ver tu progreso</small>";
        chartContainer.style.position = "relative";
        chartContainer.appendChild(msg);
      }
    } else {
      // Remove message if exists
      const msg = document.querySelector(".empty-msg");
      if (msg) msg.remove();
    }

    if (Dashboard.charts.progress) {
      Dashboard.charts.progress.destroy();
    }

    Dashboard.charts.progress = new Chart(ctxProgress, {
      type: "line",
      data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [
          {
            label: "Promedio de Notas (%)",
            data: weeklyData,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: "rgba(255,255,255,0.1)" },
          },
          x: { grid: { display: false } },
        },
      },
    });

    // 2. Skills Chart (Radar)
    const ctxSkills = document.getElementById("skillsChart").getContext("2d");

    if (Dashboard.charts.skills) {
      Dashboard.charts.skills.destroy();
    }

    Dashboard.charts.skills = new Chart(ctxSkills, {
      type: "radar",
      data: {
        labels: ["Grammar", "Listening", "Speaking", "Vocabulary", "Reading"],
        datasets: [
          {
            label: "Nivel Actual",
            data: Dashboard.getSkillsData(), // [65, 59, 90, 81, 56]
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "#22c55e",
            pointBackgroundColor: "#22c55e",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.1)" },
            grid: { color: "rgba(255,255,255,0.1)" },
            pointLabels: { color: "#94a3b8" },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    });
  },

  renderHeatmap: () => {
    const grid = document.getElementById("heatmap-grid");
    if (!grid) return;

    const activityLog =
      JSON.parse(localStorage.getItem("englishActivityLog")) || [];

    // Helper to get average score for a date
    const getScoreForDate = (dateStr) => {
      // Filter logs for this specific date (YYYY-MM-DD)
      const dayLogs = activityLog.filter((log) => log.date.startsWith(dateStr));
      if (dayLogs.length === 0) return 0;

      const sum = dayLogs.reduce((acc, curr) => acc + curr.score, 0);
      return Math.round(sum / dayLogs.length);
    };

    // Generate last 60 days
    const today = new Date();
    let html = "";

    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (59 - i));
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

      const score = getScoreForDate(dateStr);

      // Determine intensity based on score
      let intensity = 0;
      if (score > 0) intensity = 1;
      if (score >= 50) intensity = 2;
      if (score >= 80) intensity = 3;
      if (score === 100) intensity = 4;

      html += `<div class="heatmap-cell level-${intensity}" title="${dateStr}: ${score}%"></div>`;
    }
    grid.innerHTML = html;
  },

  // Helpers to get data from localStorage
  getWeeklyData: () => {
    const activityLog =
      JSON.parse(localStorage.getItem("englishActivityLog")) || [];

    // Get current week's Monday
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const weeklyScores = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      const dateStr = currentDay.toISOString().split("T")[0];

      // Find logs for this day
      const dayLogs = activityLog.filter((log) => log.date.startsWith(dateStr));

      if (dayLogs.length > 0) {
        const sum = dayLogs.reduce((acc, curr) => acc + curr.score, 0);
        weeklyScores[i] = Math.round(sum / dayLogs.length);
      }
    }

    return weeklyScores;
  },
};

// Global update function called by other modules
window.updateDashboard = () => {
  Dashboard.updateStats();
  // Update charts if needed
};
