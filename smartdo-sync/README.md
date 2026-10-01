// SmartDo — Apps Script সেটআপ (৩টি ধাপ, ২ মিনিট)

অ্যাপ খোলা: https://alaminnazir99-jpg.github.io/SmartDO/

## ধাপ ১
https://script.google.com খুলুন → **New project**

## ধাপ ২
এই ফোল্ডারের **`Code.gs`** ফাইলের পুরো কোড কপি করে বাঁ পাশের `Code.gs`-এ পেস্ট করুন
(কোড পেতে: https://github.com/alaminnazir99-jpg/SmartDO/blob/main/smartdo-sync/Code.gs → Raw)

## ধাপ ৩
উপরে **Deploy** → **New deployment** → টাইপ **Web app** → **Add new deployment**

- **Execute as:** `Me`
- **Who has access:** `Anyone` ← **এটি না দিলে অ্যাপ কাজ করবে না**
- **Deploy** চাপুন

প্রাপ্ত `https://script.google.com/macros/s/......../exec` লিংকটি কপি করুন।

## ধাপ ৪ (অ্যাপে)
SmartDo অ্যাপ → ⚙️ **সেটিংস** → **☁️ ক্লাউড সিঙ্ক** → লিংক পেস্ট → **💾 সংরক্ষণ ও টেস্ট**

✅ এরপর অ্যাপ খুললেই নিজে থেকেই সিঙ্ক হবে — মোবাইল ও ল্যাপটপে একই ডেটা।

## তথ্য

- কোনো Google Sheet লাগে না; ডেটা যায় আপনার Drive-এর `smartdo-sync-data.json` ফাইলে
- লিংকটি যারা জানবে তারা ডেটা পড়তে/বদলাতে পারবে — **লিংকটি গোপন রাখুন**
- সিঙ্ক করতে ইন্টারনেট লাগে (অফলাইনে ডেটা নিজের ডিভাইসেই থাকে)
- ফ্রি Apps Script কোটা: প্রতিদিন ~৫০,০০০ কল — দৈনিক ব্যবহারে যথেষ্ট

## কাজ না করলে

- অ্যাপে লাল বার্তা এলে লিংকের শেষে `/exec` আছে কিনা দেখুন
- Deploy → **Manage deployments** থেকে লিংকটি আবার দেখুন
- Apps Script-এ ফাংশন ড্রপডাউন থেকে `testRun` একবার Run করুন, Execution log-এ **"SmartDo sync ready"** এলে সব ঠিক আছে
