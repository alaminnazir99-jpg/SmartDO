/**
 * SmartDo — ক্লাউড সিঙ্ক ব্যাকএন্ড (Google Apps Script, ফ্রি)
 *
 * সেটআপ (৩টি ধাপ):
 *  1) https://script.google.com → New project
 *  2) এই কোডটি Code.gs-এ পেস্ট করুন
 *  3) Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *     → Deploy করলে যে /exec লিংক পাবেন সেটাই অ্যাপে বসাতে হবে।
 *     (কোড আপডেট করলে: Deploy → Manage deployments → ✏️ → Version: New version → Deploy)
 *
 * কোনো Google Sheet লাগে না — ডেটা যায় Drive-এর একটি ফাইলে।
 */

var FILE_NAME = 'smartdo-sync-data.json';
var PROP_ID = 'smartdoFileId';   // ফাইলের ID এখানে মনে রাখা হয় (খোঁজা দ্রুত ও নির্ভরযোগ্য হয়)

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function findFile_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_ID);
  if (id) {
    try {
      return DriveApp.getFileById(id);
    } catch (e) {
      props.deleteProperty(PROP_ID);
    }
  }
  var files = DriveApp.getFilesByName(FILE_NAME);
  if (!files.hasNext()) return null;
  var f = files.next();
  try { props.setProperty(PROP_ID, f.getId()); } catch (e) { }
  return f;
}

function readStore_() {
  var f = findFile_();
  if (!f) return { updatedAt: 0, data: {}, note: 'no-file' };
  try {
    var txt = f.getBlob().getContentAsString('UTF-8');
    if (!txt) return { updatedAt: 0, data: {}, note: 'file-empty' };
    var j = JSON.parse(txt);
    return { updatedAt: Number(j.updatedAt) || 0, data: j.data || {}, note: 'ok' };
  } catch (e) {
    return { updatedAt: 0, data: {}, note: 'parse-error: ' + String(e) };
  }
}

function writeStore_(obj) {
  var text = JSON.stringify(obj);
  if (text.length > 400000) {
    throw new Error('ডেটা অনেক বড়');
  }
  var f = findFile_();
  if (f) {
    f.setContent(text);
    return;
  }
  var nf = DriveApp.createFile(Utilities.newBlob(text, 'application/json', FILE_NAME));
  try { PropertiesService.getScriptProperties().setProperty(PROP_ID, nf.getId()); } catch (e) { }
}

/** অ্যাপ খুললে চালু হয় */
function doGet(e) {
  try {
    var s = readStore_();
    return jsonOut({ ok: true, updatedAt: s.updatedAt, data: s.data, note: s.note });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** অ্যাপে কিছু সেভ হলে চালু হয় */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var at = Number(body.updatedAt);
    if (!isFinite(at) || at <= 0) at = Date.now();
    writeStore_({ updatedAt: at, data: body.data || {} });
    return jsonOut({ ok: true, updatedAt: at, note: 'saved' });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** লিংক যাচাই: এই ফাংশনটি রান করলে Execution log-এ "SmartDo sync ready" দেখাবে */
function testRun() {
  var f = findFile_();
  var s = readStore_();
  Logger.log('SmartDo sync ready | file=' + (f ? f.getId() : 'none') + ' | note=' + s.note + ' | bytes=' + (f ? f.getSize() : 0));
}
