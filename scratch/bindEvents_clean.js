function bindEvents() {
  el.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tabTarget);
    });
  });

  if (el.tabMenuToggle && el.tabNav) {
    el.tabMenuToggle.addEventListener("click", () => {
      const shouldOpen = !el.tabNav.classList.contains("open");
      toggleTabMenu(shouldOpen);
    });
  }

  document.addEventListener("click", (event) => {
    if (!el.tabNav || !el.tabNav.classList.contains("open")) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".tab-nav-wrap") || target.closest("#tabMenuToggle")) return;
    toggleTabMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      toggleTabMenu(false);
    }
  });

  if (el.wheelCanvas) {
    el.wheelCanvas.addEventListener("click", onWheelClick);
    el.wheelCanvas.addEventListener("mouseenter", () => {
      if (!state.spinning) {
        state.wheelHovered = true;
        drawWheel();
      }
    });
    el.wheelCanvas.addEventListener("mouseleave", () => {
      state.wheelHovered = false;
      drawWheel();
    });
  }

  if (el.wheelWrap) {
    el.wheelWrap.addEventListener("click", (e) => {
      if (e.target !== el.wheelCanvas) {
        onWheelClick(e);
      }
    });
  }

  if (el.spinTimePills) {
    el.spinTimePills.addEventListener("click", (e) => {
      const btn = e.target.closest(".time-pill-btn");
      if (!btn) return;
      const dur = parseInt(btn.dataset.duration, 10);
      if (dur > 0) {
        setSpinDuration(dur);
      }
    });
  }

  if (el.spinDurationInput) {
    el.spinDurationInput.addEventListener("input", () => {
      const val = Math.max(2, Math.min(15, parseInt(el.spinDurationInput.value || "5", 10)));
      setSpinDuration(val, false);
    });
  }

  if (el.winnerViewCouponBtn) {
    el.winnerViewCouponBtn.addEventListener("click", () => {
      closeWinnerModal();
      scrollToCouponPreview();
    });
  }

  if (el.winnerSpinAgainBtn) {
    el.winnerSpinAgainBtn.addEventListener("click", () => {
      closeWinnerModal();
      resetFormForNewSpin();
    });
  }

  if (el.winnerModal) {
    el.winnerModal.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.getAttribute("data-close-winner-modal") === "true") {
        closeWinnerModal();
      }
    });
  }

  if (el.winnerAddMemberBtn) {
    el.winnerAddMemberBtn.addEventListener("click", onAddWinnerToMembers);
  }

  if (el.customerMemberQuickCreditBtn) {
    el.customerMemberQuickCreditBtn.addEventListener("click", () => {
      const memId = el.customerMemberQuickCreditBtn.dataset.memberId;
      if (memId) {
        setActiveTab("members");
        openCreditModal(memId, el.purchaseAmount.value);
      }
    });
  }

  bindMembersEvents();

  el.saveBtn.addEventListener("click", onSaveClick);
  el.downloadBtn.addEventListener("click", onDownloadCoupon);
  el.shareBtn.addEventListener("click", onShareWhatsApp);

  el.addPrizeBtn.addEventListener("click", () => {
    syncConditionDraftFromEditor();
    const cond = getActiveCondition();
    if (cond) {
      cond.prizes.push({
        id: uid(),
        name: "",
        probability: 0,
        enabled: true
      });
    }
    renderPrizeTable();
    persistSettings();
    refreshUI();
  });

  // Condition management events
  if (el.addConditionBtn) {
    el.addConditionBtn.addEventListener("click", onAddCondition);
  }
  if (el.deleteConditionBtn) {
    el.deleteConditionBtn.addEventListener("click", onDeleteCondition);
  }
  if (el.conditionTabsBar) {
    el.conditionTabsBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".condition-tab-chip");
      if (!chip) return;
      const condId = chip.dataset.conditionId;
      if (condId) {
        switchSettingsCondition(condId);
      }
    });
  }
  if (el.conditionItemNameInput) {
    el.conditionItemNameInput.addEventListener("input", syncConditionFieldsToActive);
  }
  if (el.conditionLabelInput) {
    el.conditionLabelInput.addEventListener("input", syncConditionFieldsToActive);
  }
  if (el.conditionIconInput) {
    el.conditionIconInput.addEventListener("input", syncConditionFieldsToActive);
  }
  if (el.conditionMinAmountInput) {
    el.conditionMinAmountInput.addEventListener("input", syncConditionFieldsToActive);
  }

  // Customer Spin tab: condition selector
  if (el.spinConditionSelect) {
    el.spinConditionSelect.addEventListener("change", () => {
      const condId = el.spinConditionSelect.value;
      if (condId) {
        state.selectedConditionId = condId;
        drawWheel();
        showToast(`Wheel switched to ${getConditionLabel(condId)}`, "info");
      }
    });
  }

  el.saveSettingsBtn.addEventListener("click", () => void onSaveSettings());
  if (el.testAppsScriptBtn) {
    el.testAppsScriptBtn.addEventListener("click", () => void testAppsScriptConnection());
  }
  el.resetDataBtn.addEventListener("click", onResetData);
  el.customerName.addEventListener("input", onEntryChange);
  el.customerNumber.addEventListener("input", onEntryChange);
  el.purchaseAmount.addEventListener("input", onEntryChange);
  el.shopNameInput.addEventListener("input", () => {
    el.shopNameDisplay.textContent = safeText(el.shopNameInput.value, DEFAULT_SETTINGS.shopName);
  });

  el.manualDateToggle.addEventListener("change", () => {
    el.manualDateInput.disabled = !el.manualDateToggle.checked;
  });

  el.recordSearchInput.addEventListener("input", () => {
    state.recordsPage = 1;
    renderRecordsTable();
  });
  el.recordFilterSortSelect.addEventListener("change", () => {
    state.recordsPage = 1;
    renderRecordsTable();
  });

  if (el.pageSizeSelect) {
    el.pageSizeSelect.addEventListener("change", () => {
      const size = parseInt(el.pageSizeSelect.value, 10);
      state.recordsPageSize = size > 0 ? size : 10;
      state.recordsPage = 1;
      renderRecordsTable();
    });
  }

  if (el.firstPageBtn) {
    el.firstPageBtn.addEventListener("click", () => goToRecordsPage(1));
  }
  if (el.prevPageBtn) {
    el.prevPageBtn.addEventListener("click", () => goToRecordsPage(state.recordsPage - 1));
  }
  if (el.nextPageBtn) {
    el.nextPageBtn.addEventListener("click", () => goToRecordsPage(state.recordsPage + 1));
  }
  if (el.lastPageBtn) {
    el.lastPageBtn.addEventListener("click", () => goToRecordsPage(getLastRecordsPage()));
  }
  if (el.exportRecordsBtn) {
    el.exportRecordsBtn.addEventListener("click", exportRecordsToCSV);
  }
  el.refreshRecordsBtn.addEventListener("click", async () => {
    await loadSettingsFromSheets(false);
    await loadRecordsFromSheets(true);
  });
  el.recordsTableBody.addEventListener("click", onRecordsActionClick);
  el.recordsTableBody.addEventListener("change", onRecordSelectionChange);
  if (el.selectAllRecords) {
    el.selectAllRecords.addEventListener("change", onSelectAllVisibleChange);
  }
  if (el.applyBulkActionBtn) {
    el.applyBulkActionBtn.addEventListener("click", () => void onApplyBulkAction());
  }
  if (el.clearSelectionBtn) {
    el.clearSelectionBtn.addEventListener("click", onClearSelection);
  }

  el.editRecordForm.addEventListener("submit", onEditRecordSubmit);
  el.cancelEditBtn.addEventListener("click", closeEditModal);
  el.editModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.getAttribute("data-close-modal") === "true") {
      closeEditModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEditModal();
      closeWinnerModal();
      closeAllMemberModals();
    }
  });

  if (el.soundToggleBtn) {
    el.soundToggleBtn.addEventListener("click", () => {
      state.soundMuted = !state.soundMuted;
      localStorage.setItem("spinwin_sound_muted", String(state.soundMuted));
      updateSoundButtonUI();
    });
    updateSoundButtonUI();
  }
}

}
