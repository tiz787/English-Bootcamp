/**
 * Enhanced Study Plan Renderer
 * Parses the simple text descriptions into rich, pedagogical UI components
 */

function parseStudyPlan(text) {
  // Regex to find time blocks like "20 min:" or "1 hora:"
  const timeBlockRegex = /(\d+\s*(?:min|hora|h|m))/gi;

  // Split by the time blocks, but keep the delimiters
  const parts = text.split(timeBlockRegex);
  const blocks = [];

  let currentBlock = null;

  for (let i = 1; i < parts.length; i += 2) {
    const time = parts[i];
    const content = parts[i + 1]
      ? parts[i + 1].trim().replace(/^[:.]\s*/, "")
      : "";

    // Determine icon and type based on content keywords
    let type = "generic";
    let icon = "📝";
    let title = "Actividad";

    const lowerContent = content.toLowerCase();

    if (lowerContent.includes("video") || lowerContent.includes("watch")) {
      type = "video";
      icon = "📺";
      title = "Input Comprensible";
    } else if (
      lowerContent.includes("escribe") ||
      lowerContent.includes("write") ||
      lowerContent.includes("redacta")
    ) {
      type = "writing";
      icon = "✍️";
      title = "Producción Escrita";
    } else if (
      lowerContent.includes("shadowing") ||
      lowerContent.includes("pronunciación") ||
      lowerContent.includes("speak")
    ) {
      type = "speaking";
      icon = "🎤";
      title = "Práctica Oral";
    } else if (
      lowerContent.includes("quiz") ||
      lowerContent.includes("test") ||
      lowerContent.includes("examen")
    ) {
      type = "quiz";
      icon = "🧪";
      title = "Evaluación";
    } else if (
      lowerContent.includes("flashcards") ||
      lowerContent.includes("vocabulario")
    ) {
      type = "vocab";
      icon = "🃏";
      title = "Repaso Espaciado";
    }

    blocks.push({
      time,
      content,
      type,
      icon,
      title,
    });
  }

  // If no blocks were found (simple text), return it as a single generic block
  if (blocks.length === 0) {
    return [
      {
        time: "1h",
        content: text,
        type: "generic",
        icon: "🧠",
        title: "Sesión de Estudio",
      },
    ];
  }

  return blocks;
}

function renderEnhancedStudyPlan(description) {
  if (!description) return "";

  const blocks = parseStudyPlan(description);

  // Add extra time block
  blocks.push({
    time: "45m - 1h",
    content:
      "Repasar los temas que siguen el día siguiente o repasar lo que se vio en ese día.",
    type: "review",
    icon: "🔄",
    title: "Tiempo Extra",
  });

  let html = `<div class="study-block-card">
        <h4 style="margin-bottom: 15px; color: var(--primary-400);">📅 Plan de Sesión Diario</h4>
        <div class="study-timeline">`;

  blocks.forEach((block) => {
    html += `
            <div class="timeline-item">
                <div class="timeline-icon">${block.icon}</div>
                <div class="timeline-content">
                    <span class="timeline-time">⏱️ ${block.time}</span>
                    <span class="timeline-title">${block.title}</span>
                    <p class="timeline-desc">${block.content}</p>
                </div>
            </div>
        `;
  });

  html += `</div></div>`;
  return html;
}

// Override the original renderLessons function from main.js
// We need to wait for main.js to load, so we'll wrap this or just redefine it.
// Since this file will be loaded AFTER main.js, we can redefine the function.

const originalRenderLessons = window.renderLessons; // Save if needed, but we'll likely just overwrite

window.renderLessons = function () {
  const container = document.getElementById("lessons-container");
  if (!container) return;

  let html = "";

  // Access global variables from main.js
  // Assuming curriculum and dailyTopics are global
  if (typeof curriculum === "undefined" || typeof dailyTopics === "undefined") {
    console.error(
      "Curriculum or dailyTopics not found. Make sure main.js is loaded first."
    );
    return;
  }

  curriculum.forEach((week, index) => {
    const weekNum = index + 1;
    const startDate = week.start.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
    const endDate = new Date(week.start);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = endDate.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });

    html += `
          <div class="week-section" id="week-${weekNum}">
              <div class="week-header">
                  <span class="week-badge">SEMANA ${weekNum}</span>
                  <div class="week-title">${week.title} (${startDate} - ${endDateStr})</div>
                  <button class="btn-exam" onclick="startWeeklyExam(${weekNum})">📝 Examen Semana ${weekNum}</button>
              </div>
              
              <div class="ai-prompt-container">
                  <span class="prompt-label">🤖 Prompt Semanal:</span>
                  <div class="prompt-code" id="p${weekNum}">
                      "Act as an English teacher. Week ${weekNum} Focus: ${week.focus}. Help me practice conversation and correct my mistakes."
                  </div>
                  <button class="btn-action" onclick="copyToClipboard('p${weekNum}')">Copiar</button>
              </div>
          `;

    // Days for this week
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, 52); // Assuming TOTAL_DAYS is 52 or similar

    for (let d = startDay; d <= endDay; d++) {
      const dayData = dailyTopics.find((t) => t.d === d) || {
        title: "Práctica General",
        topic: "General",
      };
      const date = new Date(week.start);
      date.setDate(date.getDate() + (d - startDay));
      const dateStr = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      // Use the new Enhanced Renderer for the description/plan
      const studyPlanHtml = renderEnhancedStudyPlan(
        dayData.block1h || dayData.description
      );

      html += `
              <div class="day-card" id="card-d${d}">
                  <div class="day-header" onclick="toggleDay('d${d}')">
                      <div>
                          <span class="day-date">${dateStr}</span>
                          <span class="day-title">Día ${d}: ${
        dayData.title
      }</span>
                      </div>
                      <div class="toggle-icon">+</div>
                  </div>
                  <div class="day-body" id="d${d}">
                      <div id="summary-d${d}" class="result-box"></div>
                      
                      <div class="pedagogy-box">
                          <div class="pedagogy-title">🧠 Clase del Día: ${
                            dayData.topic
                          }</div>
                          <p><strong>Contexto:</strong> ${
                            dayData.context ||
                            (typeof getContext !== "undefined"
                              ? getContext(dayData.topic)
                              : "")
                          }</p>
                          <p><strong>Cómo responder:</strong> ${
                            dayData.response ||
                            (typeof getResponse !== "undefined"
                              ? getResponse(dayData.topic)
                              : "")
                          }</p>
                          <p><strong>¿Por qué funciona?</strong> ${
                            dayData.why ||
                            (typeof getWhy !== "undefined"
                              ? getWhy(dayData.topic)
                              : "")
                          }</p>
  
                          <!-- NEW: Enhanced Study Plan Section -->
                          ${studyPlanHtml}

                          <!-- Interactive Exercise Container -->
                          ${
                            dayData.exercise
                              ? `<div id="exercise-d${d}" style="margin-top: 20px;"></div>`
                              : ""
                          }

                          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                              <p><strong>📺 Material de Estudio:</strong> ${
                                dayData.material || "N/A"
                              }</p>
                          </div>
                      </div>
  
                      <!-- Quiz Section -->
                      <div class="quiz-section">
                          <h4>📝 Mini-Test del Día</h4>
                          <div id="quiz-container-d${d}">
                              <button class="btn-action" onclick="startDailyQuiz(${d})">Comenzar Test</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
    }
    html += `</div>`;
  });

  container.innerHTML = html;

  // Initialize Interactive Exercises
  if (typeof Exercises !== "undefined") {
    dailyTopics.forEach((day) => {
      if (day.exercise) {
        const containerId = `exercise-d${day.d}`;
        if (day.exercise.type === "drag-drop") {
          Exercises.renderDragAndDrop(containerId, day.exercise.data);
        } else if (day.exercise.type === "fill-blanks") {
          Exercises.renderFillInBlanks(
            containerId,
            day.exercise.text,
            day.exercise.hidden
          );
        }
      }
    });
  }

  // Re-initialize any state if needed (like checking completed days)
  if (typeof updateUI === "function") updateUI();
};
