const users = {
    "متابع1": "N2026_1", "متابع2": "N2026_2", "متابع3": "N2026_3", "متابع4": "N2026_4", "متابع5": "N2026_5"
};

const allCriteria = {
    manager: [
        "توزيع ومتابعة الأدوار يوميا على فريق العمل", "نسبة المبيعات/تحقيق الهدف البيعى/التحديات",
        "التميز في طلب المنتجات / المشتريات", "مستوي إدارة المخزون الموجود",
        "التميز في تصريف الراكد", "التعاون مع الفروع في المخزون (تدوير المخزون)",
        "نظافة (إطارات /ارضيات/حوائط/معدات/حمامات)", "ترتيب (إطارات/معدات/أدوات / اثاث / ملفات)",
        "مستوى الخدمة المقدمة بالفرع", "مستوى رضاء العملاء عن الفرع"
    ],
    sales: [
        "مستوي المبيعات اليومية/التحديات", "تحقيق الهدف البيعي /الشهر",
        "المشاركة في طلب الأصناف الصحيحة", "المشاركة في إدارة المخزون",
        "التعاون في الطلب من الفروع (تدوير المخزون)", "التعاون مع مدير الفرع إداريا",
        "التعاون مع فريق العمل", "مستوى خدمة العميل قبل وأثناء وبعد البيع",
        "دعم ولاء العميل للنهدى", "كسب عملاء جدد"
    ],
    worker: [
        "مستوى جودة الخدمة المقدمة", "الوقت المستغرق سريع/مناسب/بطئ",
        "مستوى العناية بالمعدة في العمل", "مستوى نظافة المعدة والأدوات",
        "الالتزام بقواعد العمل داخل الفرع", "التعاون مع ادارة الفرع",
        "التعاون مع فريق العمل", "الالتزام بالنظافة الشخصية والزي",
        "طريقة التعامل مع العميل قبل/اثناء/بعد الخدمة", "مستوى رضاء العملاء عن الخدمة المقدمة"
    ],
    driver: [
        "عدد مرات التوصيل /تحديات", "جودة قيادة المركبة",
        "العناية بالصيانة الدورية بالمركبة", "نسبة المخالفات المرورية",
        "الالتزام بالتعليمات وقواعد العمل", "التعاون مع فريق العمل",
        "العناية بنظافة المركبة", "العناية بالنظافة الشخصية والزي",
        "مستوى رضاء خدمة العملاء", "خدمات اخرى"
    ]
};

let currentMgr = "";

function handleLogin() {
    const u = document.getElementById('userInput').value;
    const p = document.getElementById('passInput').value;
    if (users[u] && users[u] === p) {
        currentMgr = u;
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('evalSection').style.display = "flex";
        document.getElementById('activeMgr').innerText = "المقيم: " + u;
    } else { alert("بيانات الدخول غير صحيحة"); }
}

function generateCriteria() {
    const job = document.getElementById('empJob').value;
    const list = document.getElementById('criteriaList');
    list.innerHTML = "";
    if (allCriteria[job]) {
        allCriteria[job].forEach((text, index) => {
            const div = document.createElement('div');
            div.className = "criteria-card";
            div.innerHTML = `<span>${index + 1}. ${text}</span>
                <select class="score-val" onchange="calculate()">
                    ${Array.from({length: 11}, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                </select>`;
            list.appendChild(div);
        });
        calculate();
    }
}

function calculate() {
    const scores = document.querySelectorAll('.score-val');
    let total = 0;
    scores.forEach(s => total += parseInt(s.value));
    document.getElementById('totalScore').innerText = total;
    document.getElementById('progressBar').style.width = total + "%";
    const rText = document.getElementById('ratingText');
    if(total >= 90) rText.innerText = "الحالة: ممتاز";
    else if(total >= 75) rText.innerText = "الحالة: جيد جداً";
    else if(total >= 50) rText.innerText = "الحالة: مقبول";
    else rText.innerText = "الحالة: ضعيف";
}

document.getElementById('evalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzno3g9LVs-PIL-XxXS0gpjFnoT_ORAZuqgDaSyzHYzihh1RuEscnJAVzH-PoGD-FnPZQ/exec'; 
    const btn = document.querySelector('.btn-submit');
    const photoInput = document.getElementById('evalPhotos');

    btn.disabled = true;
    btn.innerText = "جاري الحفظ...";

    const scores = Array.from(document.querySelectorAll('.score-val')).map(s => s.value);
    const params = new URLSearchParams();
    params.append('manager', currentMgr);
    params.append('employee', document.getElementById('empName').value);
    params.append('job', document.getElementById('empJob').value);
    params.append('total', document.getElementById('totalScore').innerText);
    params.append('status', document.getElementById('ratingText').innerText);
    
    // إرسال عدد الصور المرفقة للشيت
    params.append('images', photoInput.files.length > 0 ? photoInput.files.length + " صور" : "لا يوجد");

    scores.forEach((val, i) => params.append('s' + (i + 1), val));

    fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: params })
    .then(() => {
        alert("تم حفظ التقييم بنجاح!");
        
        // تصفير البيانات بدون تسجيل خروج
        document.getElementById('empName').value = "";
        document.getElementById('empJob').value = "";
        document.getElementById('criteriaList').innerHTML = "";
        document.getElementById('totalScore').innerText = "0";
        document.getElementById('progressBar').style.width = "0%";
        photoInput.value = ""; // تصفير حقل الصور
        
        btn.disabled = false;
        btn.innerText = "إرسال تقييم موظف جديد";
    })
    .catch(() => {
        alert("خطأ في الاتصال");
        btn.disabled = false;
    });
});