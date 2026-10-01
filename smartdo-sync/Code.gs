/**
 * SmartDo — ক্লাউড সিঙ্ক ব্যাকএন্ড (Google Apps Script, ফ্রি)
 *
 * সেটআপ (২টি ধাপ):
 *  1) https://script.google.com → New project
 *  2) এই কোডটি Code.gs-এ পেস্ট করুন → Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *     → যে /exec লিংক পাবেন সেটাই অ্যাপে বসাতে হবে।
 *     (কোড বদলালে: Deploy → Manage deployments → ✏️ → Version: New version → Deploy)
 *
 * ডেটা কোথায় জমা হয়: এই স্ক্রিপ্টের নিজস্ব স্টোরেজে (Script Properties)।
 * কোনো Google Sheet, কোনো Drive ফাইল, কোনো বাড়তি অনুমতি — কিছুই লাগে না।
 */

var CHUNK = 2000;      // প্রতি টুকরায় ২০০০ অক্ষর (নিরাপদ)
var MAX_CHUNKS = 150;  // সর্বোচ্চ ~৩ লাখ অক্ষর
var KEY_COUNT = 'sdChunkCount';
var KEY_HEAD = 'sdChunk';
var KEY_AT = 'sdUpdatedAt';

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function readStore_() {
  var props = PropertiesService.getScriptProperties();
  var n = Number(props.getProperty(KEY_COUNT) || 0);
  if (!n) return { updatedAt: 0, data: {}, note: 'store-empty' };
  var text = '';
  for (var i = 0; i < n; i++) text += (props.getProperty(KEY_HEAD + i) || '');
  try {
    var j = JSON.parse(text);
    return {
      updatedAt: Number(j.updatedAt) || Number(props.getProperty(KEY_AT) || 0) || 0,
      data: j.data || {},
      note: 'ok',
      bytes: text.length
    };
  } catch (e) {
    return { updatedAt: 0, data: {}, note: 'parse-error: ' + String(e) };
  }
}

function writeStore_(obj) {
  var text = JSON.stringify(obj);
  var n = Math.ceil(text.length / CHUNK);
  if (n > MAX_CHUNKS) throw new Error('ডেটা অনেক বড় (' + text.length + ' অক্ষর)');
  var props = PropertiesService.getScriptProperties();
  var old = Number(props.getProperty(KEY_COUNT) || 0);
  for (var i = old - 1; i >= 0; i--) props.deleteProperty(KEY_HEAD + i);
  for (var k = 0; k < n; k++) props.setProperty(KEY_HEAD + k, text.substr(k * CHUNK, CHUNK));
  props.setProperty(KEY_COUNT, String(n));
  props.setProperty(KEY_AT, String(Number(obj.updatedAt) || Date.now()));
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

/** লিংক যাচাই: ফাংশন ড্রপডাউন থেকে testRun একবার Run করুন, Execution log-এ "SmartDo sync ready" দেখাবে */
function testRun() {
  var s = readStore_();
  Logger.log('SmartDo sync ready | note=' + s.note + ' | updatedAt=' + s.updatedAt + ' | bytes=' + (s.bytes || 0));
}
