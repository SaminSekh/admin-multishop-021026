/**
 * ============================================================================
 * SPIN & WIN REWARD SYSTEM - FULL GOOGLE APPS SCRIPT BACKEND
 * ============================================================================
 * Supports:
 * - Prize Records (Create, List, Update, Delete)
 * - Multi-Condition Wheel Settings (Save, Load)
 * - Members Club & Loyalty Credits (List, Save, Delete, Add Credits, Redeem)
 * - Transaction Credit Ledger History
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this entire code into Code.gs
 * 3. Click Deploy > New deployment
 * 4. Select type: Web app
 * 5. Set Description: "Spin & Win Backend v3.5"
 * 6. Set Execute as: "Me"
 * 7. Set Who has access: "Anyone" (CRITICAL: Do NOT select "Only me")
 * 8. Click Deploy and copy the Web App URL!
 * 9. Paste the URL into Settings > Business Settings > Google Sheet Data URL
 * ============================================================================
 */

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "list";
    var callback = params.callback;

    var result = {};

    if (action === "list") {
      result = getRecords();
    } else if (action === "settings") {
      result = getSettings();
    } else if (action === "members") {
      result = getMembers();
    } else if (action === "coupon_page") {
      return renderCouponPageHtml(params.recordId);
    } else {
      result = { ok: false, message: "Unknown action: " + action };
    }

    return createResponse(result, callback);
  } catch (err) {
    return createResponse({ ok: false, message: err.toString() }, e ? e.parameter.callback : null);
  }
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : "";
    var payload = {};
    if (contents) {
      try {
        payload = JSON.parse(contents);
      } catch (ex) {
        payload = {};
      }
    }

    var method = payload._method || "POST";
    var action = payload.action || (e.parameter ? e.parameter.action : "");
    var callback = e.parameter ? e.parameter.callback : null;

    var result = {};

    if (action === "create") {
      result = createRecord(payload.record);
    } else if (action === "update" || method === "PUT") {
      result = updateRecord(payload.recordId, payload.updates);
    } else if (action === "delete" || method === "DELETE") {
      result = deleteRecord(payload.recordId);
    } else if (action === "save_settings") {
      result = saveSettings(payload.settings);
    } else if (action === "save_member") {
      result = saveMember(payload.member);
    } else if (action === "delete_member") {
      result = deleteMember(payload.memberId);
    } else if (action === "add_credits") {
      result = addMemberCredits(payload.memberId, payload.credits, payload.purchaseAmount, payload.note, payload.txId, payload.name, payload.phone, payload.memberType);
    } else if (action === "deduct_credits") {
      result = deductMemberCredits(payload.memberId, payload.credits, payload.note, payload.redeemMode, payload.billAmount, payload.txId);
    } else if (action === "sync_members") {
      result = syncMembers(payload.members);
    } else {
      result = { ok: false, message: "Unknown POST action: " + action };
    }

    return createResponse(result, callback);
  } catch (err) {
    return createResponse({ ok: false, message: err.toString() }, null);
  }
}

function createResponse(data, callback) {
  var jsonString = JSON.stringify(data);
  if (callback) {
    var jsonpString = callback + "(" + jsonString + ")";
    return ContentService.createTextOutput(jsonpString)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// PRIZE RECORDS FUNCTIONS
// ==========================================

function getRecordsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Prize_Records");
  if (!sheet) {
    sheet = ss.insertSheet("Prize_Records");
    sheet.appendRow([
      "Record ID", "Shop Name", "Customer Name", "Phone Number",
      "Purchase Amount", "Prize Won", "Purchased Item", "Condition ID",
      "Status", "Spin Date ISO", "Expiry Date ISO", "Created At ISO", "Updated At ISO"
    ]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#f3f4f6");
  }
  return sheet;
}

function getRecords() {
  var sheet = getRecordsSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, records: [] };

  var records = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    records.push({
      recordId: String(row[0]),
      shopName: String(row[1] || ""),
      customerName: String(row[2] || ""),
      customerNumber: String(row[3] || ""),
      amount: Number(row[4] || 0),
      prize: String(row[5] || ""),
      purchasedItem: String(row[6] || ""),
      conditionId: String(row[7] || ""),
      status: String(row[8] || "Pending"),
      dateTimeIso: String(row[9] || ""),
      expiryIso: String(row[10] || ""),
      createdAtIso: String(row[11] || ""),
      updatedAtIso: String(row[12] || "")
    });
  }
  return { ok: true, records: records };
}

function createRecord(rec) {
  if (!rec || !rec.recordId) return { ok: false, message: "Invalid record data" };
  var sheet = getRecordsSheet();
  sheet.appendRow([
    rec.recordId,
    rec.shopName || "",
    rec.customerName || "",
    rec.customerNumber || "",
    rec.amount || 0,
    rec.prize || "",
    rec.purchasedItem || "",
    rec.conditionId || "",
    rec.status || "Pending",
    rec.dateTimeIso || new Date().toISOString(),
    rec.expiryIso || new Date().toISOString(),
    rec.createdAtIso || new Date().toISOString(),
    rec.updatedAtIso || new Date().toISOString()
  ]);
  return { ok: true, recordId: rec.recordId };
}

function updateRecord(recordId, updates) {
  if (!recordId || !updates) return { ok: false, message: "Missing recordId or updates" };
  var sheet = getRecordsSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(recordId)) {
      var rowNum = i + 1;
      if (updates.customerName !== undefined) sheet.getRange(rowNum, 3).setValue(updates.customerName);
      if (updates.customerNumber !== undefined) sheet.getRange(rowNum, 4).setValue(updates.customerNumber);
      if (updates.amount !== undefined) sheet.getRange(rowNum, 5).setValue(updates.amount);
      if (updates.prize !== undefined) sheet.getRange(rowNum, 6).setValue(updates.prize);
      if (updates.purchasedItem !== undefined) sheet.getRange(rowNum, 7).setValue(updates.purchasedItem);
      if (updates.status !== undefined) sheet.getRange(rowNum, 9).setValue(updates.status);
      if (updates.expiryIso !== undefined) sheet.getRange(rowNum, 11).setValue(updates.expiryIso);
      sheet.getRange(rowNum, 13).setValue(new Date().toISOString());
      return { ok: true, recordId: recordId };
    }
  }
  return { ok: false, message: "Record not found: " + recordId };
}

function deleteRecord(recordId) {
  if (!recordId) return { ok: false, message: "Missing recordId" };
  var sheet = getRecordsSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(recordId)) {
      sheet.deleteRow(i + 1);
      return { ok: true, recordId: recordId };
    }
  }
  return { ok: false, message: "Record not found: " + recordId };
}

// ==========================================
// SETTINGS FUNCTIONS
// ==========================================

function getSettingsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("app_settings") || ss.getSheetByName("Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Settings");
    sheet.appendRow(["Key", "Value"]);
    sheet.getRange("1:1").setFontWeight("bold");
  }
  return sheet;
}

function getSettings() {
  var sheet = getSettingsSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "GLOBAL_SETTINGS") {
      try {
        var settings = JSON.parse(data[i][1]);
        return { ok: true, settings: settings };
      } catch (e) {
        return { ok: false, message: "Failed to parse settings JSON" };
      }
    }
  }
  return { ok: true, settings: null };
}

function saveSettings(settingsObj) {
  if (!settingsObj) return { ok: false, message: "Invalid settings object" };
  var sheet = getSettingsSheet();
  var data = sheet.getDataRange().getValues();
  var jsonStr = JSON.stringify(settingsObj);
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "GLOBAL_SETTINGS") {
      sheet.getRange(i + 1, 2).setValue(jsonStr);
      return { ok: true, settings: settingsObj };
    }
  }
  sheet.appendRow(["GLOBAL_SETTINGS", jsonStr]);
  return { ok: true, settings: settingsObj };
}

// ==========================================
// MEMBERS CLUB & CREDITS FUNCTIONS
// ==========================================

function getMembersSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Members");
  if (!sheet) {
    sheet = ss.insertSheet("Members");
    sheet.appendRow([
      "Member ID", "Name", "Phone", "Type", "Active Credits",
      "Lifetime Earned", "Total Redeemed", "Total Cash Paid",
      "Notes", "Created At ISO", "Updated At ISO"
    ]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#e0e7ff");
  }
  return sheet;
}

function getMembers() {
  var sheet = getMembersSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, members: [] };

  var members = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    members.push({
      id: String(row[0]),
      name: String(row[1] || ""),
      phone: String(row[2] || ""),
      memberType: String(row[3] || "Direct Member"),
      credits: Number(row[4] || 0),
      totalEarned: Number(row[5] || 0),
      totalRedeemed: Number(row[6] || 0),
      totalCashPaid: Number(row[7] || 0),
      notes: String(row[8] || ""),
      createdAtIso: String(row[9] || ""),
      updatedAtIso: String(row[10] || "")
    });
  }
  return { ok: true, members: members };
}

function saveMember(mem) {
  if (!mem || !mem.id) return { ok: false, message: "Invalid member data" };
  var sheet = getMembersSheet();
  var data = sheet.getDataRange().getValues();
  var nowIso = new Date().toISOString();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(mem.id)) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 2).setValue(mem.name || "");
      sheet.getRange(rowNum, 3).setValue(mem.phone || "");
      sheet.getRange(rowNum, 4).setValue(mem.memberType || "Direct Member");
      sheet.getRange(rowNum, 5).setValue(mem.credits || 0);
      sheet.getRange(rowNum, 6).setValue(mem.totalEarned || 0);
      sheet.getRange(rowNum, 7).setValue(mem.totalRedeemed || 0);
      sheet.getRange(rowNum, 8).setValue(mem.totalCashPaid || 0);
      sheet.getRange(rowNum, 9).setValue(mem.notes || "");
      sheet.getRange(rowNum, 11).setValue(nowIso);
      return { ok: true, memberId: mem.id };
    }
  }

  sheet.appendRow([
    mem.id,
    mem.name || "",
    mem.phone || "",
    mem.memberType || "Direct Member",
    mem.credits || 0,
    mem.totalEarned || mem.credits || 0,
    mem.totalRedeemed || 0,
    mem.totalCashPaid || 0,
    mem.notes || "",
    mem.createdAtIso || nowIso,
    nowIso
  ]);
  return { ok: true, memberId: mem.id };
}

function syncMembers(membersList) {
  if (!Array.isArray(membersList)) return { ok: false, message: "Invalid members list" };
  for (var i = 0; i < membersList.length; i++) {
    saveMember(membersList[i]);
  }
  return { ok: true, count: membersList.length };
}

function deleteMember(memberId) {
  if (!memberId) return { ok: false, message: "Missing memberId" };
  var sheet = getMembersSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(memberId)) {
      sheet.deleteRow(i + 1);
      return { ok: true, memberId: memberId };
    }
  }
  return { ok: false, message: "Member not found: " + memberId };
}

function addMemberCredits(memberId, credits, purchaseAmount, note, txId, name, phone, memberType) {
  if (!memberId || !credits) return { ok: false, message: "Missing memberId or credits" };
  var sheet = getMembersSheet();
  var data = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(memberId)) {
      found = true;
      var rowNum = i + 1;
      var curCredits = Number(data[i][4] || 0);
      var curEarned = Number(data[i][5] || 0);

      sheet.getRange(rowNum, 5).setValue(curCredits + Number(credits));
      sheet.getRange(rowNum, 6).setValue(curEarned + Number(credits));
      sheet.getRange(rowNum, 11).setValue(new Date().toISOString());
      break;
    }
  }

  if (!found) {
    saveMember({
      id: memberId,
      name: name || "Member",
      phone: phone || "",
      memberType: memberType || "Direct Member",
      credits: Number(credits),
      totalEarned: Number(credits)
    });
  }

  logLedgerTx(memberId, "EARN", Number(credits), Number(credits) / 100, note || "Purchase Credit", txId);
  return { ok: true, memberId: memberId };
}

function deductMemberCredits(memberId, credits, note, redeemMode, billAmount, txId) {
  if (!memberId || !credits) return { ok: false, message: "Missing memberId or credits" };
  var sheet = getMembersSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(memberId)) {
      var rowNum = i + 1;
      var curCredits = Number(data[i][4] || 0);
      var curRedeemed = Number(data[i][6] || 0);
      var curCashPaid = Number(data[i][7] || 0);
      var cashWorth = Number(credits) / 100;

      if (curCredits < Number(credits)) {
        return { ok: false, message: "Insufficient credit balance" };
      }

      sheet.getRange(rowNum, 5).setValue(curCredits - Number(credits));
      sheet.getRange(rowNum, 6).setValue(curRedeemed + Number(credits));
      sheet.getRange(rowNum, 7).setValue(curCashPaid + cashWorth);
      sheet.getRange(rowNum, 11).setValue(new Date().toISOString());

      logLedgerTx(memberId, "REDEEM", -Number(credits), cashWorth, note || "Credit Redemption", txId);
      return { ok: true, memberId: memberId };
    }
  }
  return { ok: false, message: "Member not found: " + memberId };
}

function logLedgerTx(memberId, type, credits, cashVal, note, txId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Credit_Ledger");
  if (!sheet) {
    sheet = ss.insertSheet("Credit_Ledger");
    sheet.appendRow(["Tx ID", "Member ID", "Date ISO", "Type", "Credits", "Cash Worth", "Note"]);
    sheet.getRange("1:1").setFontWeight("bold");
  }
  sheet.appendRow([
    txId || ("TX_" + Date.now()),
    memberId,
    new Date().toISOString(),
    type,
    credits,
    cashVal,
    note || ""
  ]);
}
