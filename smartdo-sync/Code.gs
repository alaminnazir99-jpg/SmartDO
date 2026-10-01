/**
 * SmartDo — ক্লাউড সিঙ্ক ব্যাকএন্ড (Google Apps Script, ফ্রি)
 *
 * সেটআপ:
 *  1) https://script.google.com → নতুন প্রজেক্ট
 *  2) এই পুরো কোডটি Code.gs ফাইলে পেস্ট করুন
 *  3) "Deploy" → "New deployment" → টাইপ "Web app"
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4) Deploy করুন, তারপর যে লিংক পাবেন সেটা SmartDo অ্যাপের
 *     সেটিংস → "ক্লাউড সিঙ্ক"-এ পেস্ট করে সেভ করুন।
 *
 * ডেটা যায় একটি শীটে: A1 = updatedAt, B1 = ডেটা JSON
 */

var SHEET_NAME = 'SmartDo';

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/** অ্যাপ খুললে এটি চালু হয় (ফ্রি কোয়োটার ৫০K ডেটা ধরে) */
function doGet(e) {
  try {
    var sh = getSheet_();
    var stamp = sh.getRange('A1').getValue();
    var payload = sh.getRange('B1').getValue();
    var data = {};
    if (payload) {
      try { data = JSON.parse(String(payload)); } catch (err) { data = {}; }
    }
    return jsonOut({ ok: true, updatedAt: Number(stamp) || 0, data: data });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** অ্যাপে কিছু সেভ হলে এটি চালু হয় */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var at = Number(body.updatedAt) || Date.now();
    var data = body.data || {};
    var text = JSON.stringify(data);
    if (text.length > 45000) {
      return jsonOut({ ok: false, error: 'ডেটা অনেক বড় (সর্বোচ্চ ~৪৫ হাজার অক্ষর)' });
    }
    var sh = getSheet_();
    sh.getRange('A1').setValue(at);
    sh.getRange('B1').setValue(text);
    return jsonOut({ ok: true, updatedAt: at, size: text.length });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}
