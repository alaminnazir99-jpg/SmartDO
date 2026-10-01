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
 *
 * কোনো Google Sheet লাগে না — ডেটা যায় Drive-এর একটি ফাইলে।
 */

var FILE_NAME = 'smartdo-sync-data.json';

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function findFile_() {
  var files = DriveApp.getFilesByName(FILE_NAME);
  return files.hasNext() ? files.next() : null;
}

function readStore_() {
  var f = findFile_();
  if (!f) return { updatedAt: 0, data: {} };
  try {
    var j = JSON.parse(f.getBlob().getContentAsString('UTF-8'));
    return { updatedAt: Number(j.updatedAt) || 0, data: j.data || {} };
  } catch (e) {
    return { updatedAt: 0, data: {} };
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
  } else {
    DriveApp.createFile(Utilities.newBlob(text, 'application/json', FILE_NAME));
  }
}

/** অ্যাপ খুললে চালু হয় */
function doGet(e) {
  try {
    var s = readStore_();
    return jsonOut({ ok: true, updatedAt: s.updatedAt, data: s.data });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** অ্যাপে কিছু সেভ হলে চালু হয় */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var at = Number(body.updatedAt) || Date.now();
    writeStore_({ updatedAt: at, data: body.data || {} });
    return jsonOut({ ok: true, updatedAt: at });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** লিংক যাচাই: এই ফাংশনটি রান করলে Execution log-এ "SmartDo sync ready" দেখাবে */
function testRun() {
  var s = readStore_();
  Logger.log('SmartDo sync ready. file=' + !!findFile_() + ' updatedAt=' + s.updatedAt);
}
