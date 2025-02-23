
// إظهار النموذج عند الضغط على زر "تعديل المعلومات"
document.getElementById('edit-info').addEventListener('click', function() {
    document.getElementById('edit-modal').style.display = 'none';
});

// إخفاء النموذج عند الضغط على زر "إلغاء"
document.getElementById('cancel-edit').addEventListener('click', function() {
    document.getElementById('edit-modal').style.display = 'none';
});

// حفظ التعديلات باستخدام AJAX
document.getElementById('save-changes').addEventListener('click', function() {
    var formData = {
        name: document.getElementById('edit-name').value,
        age: document.getElementById('edit-age').value,
        gender: document.getElementById('edit-gender').value,
        country: document.getElementById('edit-country').value,
        language: document.getElementById('edit-language').value,
        phone: document.getElementById('edit-phone').value,
        programming_languages: document.getElementById('edit-skills').value,
        portfolio: document.getElementById('edit-portfolio').value
    };

    // إرسال البيانات إلى السيرفر باستخدام AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/edit-profile', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('تم تحديث المعلومات بنجاح!');
            document.getElementById('edit-modal').style.display = 'none';

            // تحديث البيانات في الصفحة بدون إعادة تحميل
            document.getElementById('username').innerText = formData.name;
            document.getElementById('age').innerText = formData.age;
            document.getElementById('gender').innerText = formData.gender;
            document.getElementById('country').innerText = formData.country;
            document.getElementById('language').innerText = formData.language;
            document.getElementById('skills').innerText = formData.programming_languages;
            document.getElementById('phone').innerText = formData.phone;
        }
    };
    xhr.send(JSON.stringify(formData));
});
