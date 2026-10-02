const fs = require('fs');

let code = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

// 1. Replace const el = { ... }; with an empty el object declaration and initDOM function
const elDeclaration = `const el = {};

function initDOM() {
  el.shopNameDisplay = byId("shopNameDisplay");
  el.customerName = byId("customerName");
  el.customerNumber = byId("customerNumber");
  el.purchaseAmount = byId("purchaseAmount");
  el.saveBtn = byId("saveBtn");
  el.downloadBtn = byId("downloadBtn");
  el.shareBtn = byId("shareBtn");
  el.wheelCanvas = byId("wheelCanvas");
  el.couponCanvas = byId("couponCanvas");
  el.resultEmpty = byId("resultEmpty");
  el.resultDetails = byId("resultDetails");
  el.resultRecordId = byId("resultRecordId");
  el.resultShop = byId("resultShop");
  el.resultCustomer = byId("resultCustomer");
  el.resultCustomerNumber = byId("resultCustomerNumber");
  el.resultAmount = byId("resultAmount");
  el.resultPrize = byId("resultPrize");
  el.resultStatus = byId("resultStatus");
  el.resultDate = byId("resultDate");
  el.resultExpiry = byId("resultExpiry");
  el.shopNameInput = byId("shopNameInput");
  el.shopLogoUrlInput = byId("shopLogoUrlInput");
  el.expiryHoursInput = byId("expiryHoursInput");
  el.appsScriptUrlInput = byId("appsScriptUrlInput");
  el.testAppsScriptBtn = byId("testAppsScriptBtn");
  el.appsScriptStatusMsg = byId("appsScriptStatusMsg");
  el.manualDateToggle = byId("manualDateToggle");
  el.manualDateInput = byId("manualDateInput");
  el.prizeTableBody = byId("prizeTableBody");
  el.addPrizeBtn = byId("addPrizeBtn");
  el.saveSettingsBtn = byId("saveSettingsBtn");
  el.resetDataBtn = byId("resetDataBtn");
  el.prizeRowTemplate = byId("prizeRowTemplate");
  el.recordSearchInput = byId("recordSearchInput");
  el.recordFilterSortSelect = byId("recordFilterSortSelect");
  el.refreshRecordsBtn = byId("refreshRecordsBtn");
  el.exportRecordsBtn = byId("exportRecordsBtn");
  el.recordsSummary = byId("recordsSummary");
  el.recordsTableBody = byId("recordsTableBody");
  el.selectAllRecords = byId("selectAllRecords");
  el.bulkActionSelect = byId("bulkActionSelect");
  el.applyBulkActionBtn = byId("applyBulkActionBtn");
  el.clearSelectionBtn = byId("clearSelectionBtn");
  el.editModal = byId("editModal");
  el.editRecordForm = byId("editRecordForm");
  el.editRecordId = byId("editRecordId");
  el.editCustomerName = byId("editCustomerName");
  el.editCustomerNumber = byId("editCustomerNumber");
  el.editPurchaseAmount = byId("editPurchaseAmount");
  el.editPrizeWon = byId("editPrizeWon");
  el.editExpiryDate = byId("editExpiryDate");
  el.cancelEditBtn = byId("cancelEditBtn");
  el.toastContainer = byId("toastContainer");
  el.bulkActionsBar = byId("bulkActionsBar");
  el.tabMenuToggle = byId("tabMenuToggle");
  el.tabNav = byId("tabNav");
  el.tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
  el.tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
  el.soundToggleBtn = byId("soundToggleBtn");
  el.soundIcon = byId("soundIcon");
  el.wheelPointer = byId("wheelPointer");
  el.confettiCanvas = byId("confettiCanvas");
  el.wheelWrap = document.querySelector(".wheel-wrap");
  el.spinDurationInput = byId("spinDurationInput");
  el.spinTimePills = byId("spinTimePills");
  el.winnerModal = byId("winnerModal");
  el.winnerPrizeName = byId("winnerPrizeName");
  el.winnerCustomerMsg = byId("winnerCustomerMsg");
  el.winnerRecordId = byId("winnerRecordId");
  el.winnerViewCouponBtn = byId("winnerViewCouponBtn");
  el.winnerSpinAgainBtn = byId("winnerSpinAgainBtn");
  el.recordsPaginationBar = byId("recordsPaginationBar");
  el.paginationRangeText = byId("paginationRangeText");
  el.pageSizeSelect = byId("pageSizeSelect");
  el.firstPageBtn = byId("firstPageBtn");
  el.prevPageBtn = byId("prevPageBtn");
  el.nextPageBtn = byId("nextPageBtn");
  el.lastPageBtn = byId("lastPageBtn");
  el.paginationPages = byId("paginationPages");
  el.spinConditionSelect = byId("spinConditionSelect");
  el.conditionTabsBar = byId("conditionTabsBar");
  el.conditionEditorCard = byId("conditionEditorCard");
  el.conditionBadgeActive = byId("conditionBadgeActive");
  el.conditionEditorTitle = byId("conditionEditorTitle");
  el.deleteConditionBtn = byId("deleteConditionBtn");
  el.conditionItemNameInput = byId("conditionItemNameInput");
  el.conditionLabelInput = byId("conditionLabelInput");
  el.conditionIconInput = byId("conditionIconInput");
  el.conditionMinAmountInput = byId("conditionMinAmountInput");
  el.addConditionBtn = byId("addConditionBtn");
  el.conditionProbSummary = byId("conditionProbSummary");
  el.winnerItemPill = byId("winnerItemPill");
  el.winnerItemText = byId("winnerItemText");

  // Members Section Elements
  el.statTotalMembers = byId("statTotalMembers");
  el.statMembersSubtitle = byId("statMembersSubtitle");
  el.statTotalCredits = byId("statTotalCredits");
  el.statCreditsWorth = byId("statCreditsWorth");
  el.statTotalEarned = byId("statTotalEarned");
  el.statEarnedWorth = byId("statEarnedWorth");
  el.statTotalCashPaid = byId("statTotalCashPaid");
  el.statRedeemedCredits = byId("statRedeemedCredits");
  el.memberSearchInput = byId("memberSearchInput");
  el.clearMemberSearchBtn = byId("clearMemberSearchBtn");
  el.memberFilterSelect = byId("memberFilterSelect");
  el.membersTableBody = byId("membersTableBody");
  el.selectAllMembers = byId("selectAllMembers");
  el.memberBulkActionsBar = byId("memberBulkActionsBar");
  el.memberBulkActionSelect = byId("memberBulkActionSelect");
  el.applyMemberBulkActionBtn = byId("applyMemberBulkActionBtn");
  el.clearMemberSelectionBtn = byId("clearMemberSelectionBtn");
  el.membersEmptyState = byId("membersEmptyState");
  el.membersEmptyMsg = byId("membersEmptyMsg");
  el.emptyAddMemberBtn = byId("emptyAddMemberBtn");
  el.openNewMemberModalBtn = byId("openNewMemberModalBtn");
  el.openAddCreditModalBtn = byId("openAddCreditModalBtn");
  el.openDeductModalBtn = byId("openDeductModalBtn");
  el.pushMembersBtn = byId("pushMembersBtn");
  el.refreshMembersBtn = byId("refreshMembersBtn");
  el.exportMembersBtn = byId("exportMembersBtn");
  el.membersPaginationBar = byId("membersPaginationBar");
  el.membersPaginationRangeText = byId("membersPaginationRangeText");
  el.membersPageSizeSelect = byId("membersPageSizeSelect");
  el.membersFirstPageBtn = byId("membersFirstPageBtn");
  el.membersPrevPageBtn = byId("membersPrevPageBtn");
  el.membersNextPageBtn = byId("membersNextPageBtn");
  el.membersLastPageBtn = byId("membersLastPageBtn");
  el.membersPaginationPages = byId("membersPaginationPages");

  // Member Modal
  el.memberModal = byId("memberModal");
  el.memberModalTitle = byId("memberModalTitle");
  el.memberForm = byId("memberForm");
  el.memberFormId = byId("memberFormId");
  el.memberFormName = byId("memberFormName");
  el.memberFormPhone = byId("memberFormPhone");
  el.memberFormType = byId("memberFormType");
  el.memberFormInitialCredits = byId("memberFormInitialCredits");
  el.memberInitialCreditsGroup = byId("memberInitialCreditsGroup");
  el.initialCreditsHint = byId("initialCreditsHint");
  el.memberFormNotes = byId("memberFormNotes");
  el.saveMemberBtn = byId("saveMemberBtn");

  // Credit Modal
  el.creditModal = byId("creditModal");
  el.creditForm = byId("creditForm");
  el.creditMemberSelect = byId("creditMemberSelect");
  el.creditQuickAddMemberBtn = byId("creditQuickAddMemberBtn");
  el.creditCurrentBalanceRow = byId("creditCurrentBalanceRow");
  el.creditCurrentBalanceText = byId("creditCurrentBalanceText");
  el.creditPurchaseAmount = byId("creditPurchaseAmount");
  el.creditAmountInput = byId("creditAmountInput");
  el.creditCashWorthPreview = byId("creditCashWorthPreview");
  el.creditNoteInput = byId("creditNoteInput");

  // Deduct Modal
  el.deductModal = byId("deductModal");
  el.deductForm = byId("deductForm");
  el.deductMemberSelect = byId("deductMemberSelect");
  el.deductAvailableText = byId("deductAvailableText");
  el.deductRedeemMode = byId("deductRedeemMode");
  el.modePurchaseDiscountBtn = byId("modePurchaseDiscountBtn");
  el.modeCashPayoutBtn = byId("modeCashPayoutBtn");
  el.purchaseDiscountFields = byId("purchaseDiscountFields");
  el.deductBillAmountInput = byId("deductBillAmountInput");
  el.deductCreditsInput = byId("deductCreditsInput");
  el.deductCashInput = byId("deductCashInput");
  el.deductValueLabel = byId("deductValueLabel");
  el.discountNetBanner = byId("discountNetBanner");
  el.deductNetPayableDisplay = byId("deductNetPayableDisplay");
  el.deductBreakdownDisplay = byId("deductBreakdownDisplay");
  el.cashPayoutBanner = byId("cashPayoutBanner");
  el.deductPayoutDisplay = byId("deductPayoutDisplay");
  el.deductNoteInput = byId("deductNoteInput");
  el.deductSendWhatsAppCheck = byId("deductSendWhatsAppCheck");
  el.confirmDeductBtn = byId("confirmDeductBtn");

  // Member History Modal
  el.memberHistoryModal = byId("memberHistoryModal");
  el.historyMemberName = byId("historyMemberName");
  el.historyMemberSub = byId("historyMemberSub");
  el.historyCurrentCredits = byId("historyCurrentCredits");
  el.historyCurrentCash = byId("historyCurrentCash");
  el.historyLifetimeEarned = byId("historyLifetimeEarned");
  el.historyLifetimeCashed = byId("historyLifetimeCashed");
  el.historyTableBody = byId("historyTableBody");

  // Cross-Tab Integration Elements
  el.customerMemberBadge = byId("customerMemberBadge");
  el.customerMemberBadgeText = byId("customerMemberBadgeText");
  el.customerMemberQuickCreditBtn = byId("customerMemberQuickCreditBtn");
  el.winnerAddMemberBtn = byId("winnerAddMemberBtn");

  // Prize History Direct Credit Modal Elements
  el.recordCreditModal = byId("recordCreditModal");
  el.recordCreditCustName = byId("recordCreditCustName");
  el.recordCreditCustPhone = byId("recordCreditCustPhone");
  el.recordCreditMemberStatusPill = byId("recordCreditMemberStatusPill");
  el.recordCreditBalanceRow = byId("recordCreditBalanceRow");
  el.recordCreditCurrentBal = byId("recordCreditCurrentBal");
  el.recordCreditCashWorth = byId("recordCreditCashWorth");
  el.recordCreditNotMemberNotice = byId("recordCreditNotMemberNotice");
  el.recordCreditRecId = byId("recordCreditRecId");
  el.recordCreditRecItem = byId("recordCreditRecItem");
  el.recordCreditRecAmount = byId("recordCreditRecAmount");
  el.recordCreditRecPrize = byId("recordCreditRecPrize");
  el.recordCreditAddBtn = byId("recordCreditAddBtn");
  el.recordCreditDeductBtn = byId("recordCreditDeductBtn");
  el.recordCreditViewMemberBtn = byId("recordCreditViewMemberBtn");
  el.recordCreditAddTitle = byId("recordCreditAddTitle");
  el.recordCreditAddSub = byId("recordCreditAddSub");
  el.recordCreditDeductTitle = byId("recordCreditDeductTitle");
  el.recordCreditDeductSub = byId("recordCreditDeductSub");

  if (typeof window !== 'undefined') {
    Object.keys(el).forEach((key) => {
      try {
        if (!(key in window)) {
          Object.defineProperty(window, key, {
            get() { return el[key]; },
            set(val) { el[key] = val; },
            configurable: true
          });
        }
      } catch (e) {}
    });
  }
}`;

// Replace const el = { ... };
code = code.replace(/const el = {[\s\S]*?};/, elDeclaration);

// 2. Make sure canvas contexts are initialized inside init() safely
let wheelCtxDecl = 'let wheelCtx = null;\nlet couponCtx = null;';
code = code.replace(/const wheelCtx = el\.wheelCanvas\.getContext\("2d"\);\s*const couponCtx = el\.couponCanvas\.getContext\("2d"\);/, wheelCtxDecl);

// Update init() function
code = code.replace(/function init\(\) {/, `function init() {
  initDOM();
  if (el.wheelCanvas) wheelCtx = el.wheelCanvas.getContext("2d");
  if (el.couponCanvas) couponCtx = el.couponCanvas.getContext("2d");`);

// Add DOMContentLoaded safety wrapper at the end
code += `\n\nif (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}\n`;

fs.writeFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', code, 'utf8');
console.log('Successfully updated js/spin.js with initDOM and global getters!');
