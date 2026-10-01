// SmartDo — Apps Script সেটআপ (২ মিনিট)

অ্যাপ খোলা: https://alaminnazir99-jpg.github.io/SmartDO/

## ধাপ ১
https://script.google.com খুলুন → **New project**

## ধাপ ২
এই ফোল্ডারের **`Code.gs`** ফাইলের পুরো কোড কপি করে বাঁ পাশের `Code.gs`-এ পেস্ট করুন
(কোড পেতে: https://github.com/alaminnazir99-jpg/SmartDO/blob/main/smartdo-sync/Code.gs → **Raw**)

কোড বদলালে খেয়াল রাখবেন: `var CHUNK = 2000;` লাইনটা থাকতে হবে।

## ধাপ ৩
উপরে **Deploy** → **New deployment** → টাইপ **Web app** → **Add new deployment**

- **Execute as:** `Me`
- **Who has access:** `Anyone` ← **এটি না দিলে অ্যাপ কাজ করবে না**
- **Deploy** চাপুন

প্রাপ্ত `https://script.google.com/macros/s/......../exec` লিংকটি কপি করুন।

> কোড আবার বদলাতে চাইলে: **Deploy → Manage deployments → ✏️ → Version: `New version` → Deploy** (লিংক একই থাকবে)

## ধাপ ৪ (অ্যাপে)
SmartDo অ্যাপ → ⚙️ **সেটিংস** → **☁️ ক্লাউড সিঙ্ক** → লিংক পেস্ট → **💾 সংরক্ষণ ও টেস্ট**

✅ এরপর অ্যাপ খুললেই নিজে থেকেই সিঙ্ক হবে — মোবাইল ও ল্যাপটপে একই ডেটা।

## তথ্য

- ডেটা জমা হয় **এই স্ক্রিপ্টের নিজস্ব স্টোরেজে** (Script Properties) — কোনো Google Sheet বা Drive ফাইল লাগে না, বাড়তি অনুমতি (permission) চাওয়া হয় না
- লিংকটি যারা জানবে তারা ডেটা পড়তে/বদলাতে পারবে — **লিংকটি গোপন রাখুন**
- সিঙ্ক করতে ইন্টারনেট লাগে (অফলাইনে ডেটা নিজের ডিভাইসেই থাকে)
- ডেটার আকার সীমা প্রায় ৩ লাখ অক্ষর
- ফ্রি Apps Script কোটা: প্রতিদিন ~৫০,০০০ কল — দৈনিক ব্যবহারে যথেষ্ট

## কাজ না করলে

- লিংকটির শেষে `/exec` আছে কিনা দেখুন
- Deploy → **Manage deployments** থেকে লিংকটি আবার দেখুন
- Apps Script-এ ফাংশন ড্রপডাউন থেকে `testRun` একবার Run করুন, Execution log-এ **"SmartDo sync ready"** এলে সব ঠিক আছে
- অ্যাপের সিঙ্ক কার্ডে লাল বার্তা এলে সেখানে ব্যবহার হওয়া অনুমতি দেখুন
