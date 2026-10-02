function applySettingsFromServer(serverSettings, keepCurrentUrl = true) {
  const currentUrl = safeText(state.settings.appsScriptUrl);
  const currentConditions = state.settings.conditions; // Preserve local conditions
  const next = { ...(serverSettings || {}) };
  if (keepCurrentUrl && !safeText(next.appsScriptUrl)) {
    next.appsScriptUrl = currentUrl;
  }
  // Preserve local conditions if server doesn't have them
  // (Google Sheets may not store conditions, only flat prizes)
  if (!Array.isArray(next.conditions) || !next.conditions.length) {
    next.conditions = currentConditions;
  }

  state.settings = mergeSettings(next);
  persistSettings();
  syncSettingsToInputs();
  initConditions();
  renderPrizeTable();
  populateSpinConditionSelect();
  drawWheel();
  renderResult();
  refreshUI();
}

function syncSettingsToInputs() {
  el.shopNameInput.value = state.settings.shopName || "";
  el.shopLogoUrlInput.value = state.settings.shopLogoUrl || "";
  el.expiryHoursInput.value = String(num(state.settings.expiryHours));
  if (el.spinDurationInput) {
    el.spinDurationInput.value = String(state.settings.spinDuration || 5);
  }
  updateSpinPillsUI();
  el.appsScriptUrlInput.value = state.settings.appsScriptUrl || "";
  el.manualDateToggle.checked = !!state.settings.manualDateEnabled;
  el.manualDateInput.value = state.settings.manualDateTime || "";
  el.manualDateInput.disabled = !state.settings.manualDateEnabled;
}

function renderPrizeTable() {
  el.prizeTableBody.innerHTML = "";
  const cond = getActiveCondition();
  const prizes = cond ? cond.prizes : [];
  prizes.forEach((prize) => {
    const row = el.prizeRowTemplate.content.firstElementChild.cloneNode(true);
    row.dataset.id = prize.id;
    row.querySelector(".prize-name-input").value = prize.name;
    row.querySelector(".prize-prob-input").value = String(num(prize.probability));
    row.querySelector(".prize-enabled-input").checked = !!prize.enabled;
    row.querySelector(".remove-prize-btn").addEventListener("click", () => {
      syncConditionDraftFromEditor();
      const activeCond = getActiveCondition();
      if (activeCond) {
        activeCond.prizes = activeCond.prizes.filter((p) => p.id !== prize.id);
      }
      renderPrizeTable();
      persistSettings();
      drawWheel();
      refreshUI();
    });
    el.prizeTableBody.appendChild(row);
  });
  updateConditionProbSummary();
}

function collectPrizesFromTable