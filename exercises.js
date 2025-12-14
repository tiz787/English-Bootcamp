/**
 * 🧩 INTERACTIVE EXERCISES ENGINE
 * Handles Drag & Drop, Fill in Blanks, Flashcards, and TTS.
 */

const Exercises = {
  /**
   * 🔊 Text-to-Speech
   */
  speak: (text, lang = "en-US") => {
    if (!window.speechSynthesis) {
      console.error("Web Speech API not supported");
      return;
    }
    window.speechSynthesis.cancel(); // Stop previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for learning
    window.speechSynthesis.speak(utterance);
  },

  /**
   * 🖱️ Drag and Drop Sentence Builder
   */
  renderDragAndDrop: (containerId, sentence) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const words = sentence.split(" ").sort(() => Math.random() - 0.5);

    let html = `
      <div class="exercise-box">
        <h4>🧩 Ordena la oración</h4>
        <div class="draggable-container" id="${containerId}-source">
          ${words
            .map(
              (word, i) =>
                `<div class="draggable-item" draggable="true" data-word="${word}" id="${containerId}-w${i}">${word}</div>`
            )
            .join("")}
        </div>
        <div class="draggable-container drop-zone" id="${containerId}-target"></div>
        <div class="exercise-controls">
            <button class="btn-check" onclick="Exercises.checkDragAndDrop('${containerId}', '${sentence.replace(
      /'/g,
      "\\'"
    )}')">Verificar</button>
            <button class="btn-icon" onclick="Exercises.speak('${sentence.replace(
              /'/g,
              "\\'"
            )}')">🔊 Escuchar</button>
        </div>
        <div id="${containerId}-feedback" class="feedback-msg"></div>
      </div>
    `;

    container.innerHTML = html;
    Exercises.initDragEvents(containerId);
  },

  initDragEvents: (containerId) => {
    const draggables = document.querySelectorAll(
      `#${containerId}-source .draggable-item`
    );
    const containers = document.querySelectorAll(
      `#${containerId}-source, #${containerId}-target`
    );

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });

    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = Exercises.getDragAfterElement(
          container,
          e.clientY
        );
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      });
    });
  },

  getDragAfterElement: (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".draggable-item:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  },

  checkDragAndDrop: (containerId, correctSentence) => {
    const targetContainer = document.getElementById(`${containerId}-target`);
    const feedback = document.getElementById(`${containerId}-feedback`);

    const currentWords = [
      ...targetContainer.querySelectorAll(".draggable-item"),
    ].map((el) => el.dataset.word);
    const currentSentence = currentWords.join(" ");

    if (currentSentence === correctSentence) {
      feedback.textContent = "¡Correcto! 🎉 +10 XP";
      feedback.className = "feedback-msg feedback-success";
      Exercises.addXP(10);
    } else {
      feedback.textContent = "Inténtalo de nuevo. ❌";
      feedback.className = "feedback-msg feedback-error";
    }
  },

  /**
   * ✍️ Fill in the Blanks
   */
  renderFillInBlanks: (containerId, text, hiddenWords) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let processedText = text;
    hiddenWords.forEach((word, index) => {
      const inputHtml = `<input type="text" class="blank-input" data-answer="${word}" id="${containerId}-input-${index}" autocomplete="off">`;
      // Replace only the first occurrence or use a more complex regex if needed
      processedText = processedText.replace(word, inputHtml);
    });

    let html = `
        <div class="exercise-box">
            <h4>✍️ Completa los espacios</h4>
            <div class="fill-blanks-container">
                ${processedText}
            </div>
            <div class="exercise-controls">
                <button class="btn-check" onclick="Exercises.checkFillInBlanks('${containerId}')">Verificar</button>
            </div>
            <div id="${containerId}-feedback" class="feedback-msg"></div>
        </div>
    `;
    container.innerHTML = html;
  },

  checkFillInBlanks: (containerId) => {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll(".blank-input");
    let allCorrect = true;

    inputs.forEach((input) => {
      const userAnswer = input.value.trim().toLowerCase();
      const correctAnswer = input.dataset.answer.toLowerCase();

      if (userAnswer === correctAnswer) {
        input.classList.add("correct");
        input.classList.remove("incorrect");
      } else {
        input.classList.add("incorrect");
        input.classList.remove("correct");
        allCorrect = false;
      }
    });

    const feedback = document.getElementById(`${containerId}-feedback`);
    if (allCorrect) {
      feedback.textContent = "¡Perfecto! 🧠 +15 XP";
      feedback.className = "feedback-msg feedback-success";
      Exercises.addXP(15);
    } else {
      feedback.textContent = "Revisa las palabras en rojo.";
      feedback.className = "feedback-msg feedback-error";
    }
  },

  /**
   * 🃏 Flashcards
   */
  renderFlashcard: (containerId, front, back, hint = "") => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
        <div class="flashcard-container" onclick="this.classList.toggle('flipped')">
            <div class="flashcard">
                <div class="flashcard-front">
                    <div class="flashcard-title">Concepto</div>
                    <div class="flashcard-content">${front}</div>
                    <div class="flashcard-hint">Click para voltear</div>
                </div>
                <div class="flashcard-back">
                    <div class="flashcard-title">Significado</div>
                    <div class="flashcard-content">${back}</div>
                    ${hint ? `<div class="flashcard-hint">${hint}</div>` : ""}
                    <button class="btn-icon" style="margin-top:10px" onclick="event.stopPropagation(); Exercises.speak('${front.replace(
                      /'/g,
                      "\\'"
                    )}')">🔊</button>
                </div>
            </div>
        </div>
      `;
    container.innerHTML = html;
  },

  /**
   * 🎮 Gamification System
   */
  addXP: (amount) => {
    let currentXP = parseInt(localStorage.getItem("userXP") || "0");
    currentXP += amount;
    localStorage.setItem("userXP", currentXP);

    // Update UI if dashboard exists
    if (typeof updateDashboard === "function") {
      updateDashboard();
    }

    // Show toast notification (simple alert for now, can be improved)
    // console.log(`Gained ${amount} XP! Total: ${currentXP}`);
  },
};
