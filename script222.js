document.addEventListener('DOMContentLoaded', function() {
    // ... (โค้ดคำนวณ BMR/TDEE) ...

    // เลือกเมนูอาหารจากหน้าเมนูอาหารที่ถูกต้อง
    const menuContainer = document.getElementById('menu-page-1'); // หรือ 'menu-page-2'
    const menuItems = menuContainer.querySelectorAll('.menu-item');
    const recommendedMenus = [];

    // เลือก 3 เมนูอาหารที่ถูกสุ่ม
    for (let i = 0; i < 3 && i < menuItems.length; i++) {
        recommendedMenus.push(menuItems[i]);
    }

    // แสดงผลเมนูอาหารที่แนะนำใน 2.html
    displayRecommendedMenus(recommendedMenus);
});

function displayRecommendedMenus(menus) {
    const resultContainer = document.getElementById('result');
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('recommended-menu-container');

    let totalCalories = 0; // ค่าแคลอรี่รวมของเมนูอาหารที่แนะนำ

    menus.forEach(menu => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('recommended-menu-item');

        const menuImage = menu.querySelector('img').cloneNode(true);
        const menuName = menu.querySelector('a').textContent;
        const calories = parseInt(menu.dataset.calories); // แปลงค่าเป็นตัวเลข
        const protein = menu.dataset.protein;
        const carbs = menu.dataset.carbs;
        const fat = menu.dataset.fat;
        const menuLink = menu.querySelector('a').href; // ดึงลิงก์เมนู

        totalCalories += calories; // คำนวณค่าแคลอรี่รวม

        menuItem.appendChild(menuImage);
        menuItem.innerHTML += `
            <span>${menuName}</span>
            <p>แคลอรี่: ${calories} kcal</p>
            <p>โปรตีน: ${protein} กรัม</p>
            <p>คาร์โบไฮเดรต: ${carbs} กรัม</p>
            <p>ไขมัน: ${fat} กรัม</p>
            <a href="${menuLink}" target="_blank">ดูสูตรอาหาร</a>
        `;

        menuContainer.appendChild(menuItem);
    });

    resultContainer.innerHTML = `<h3>เมนูอาหารที่แนะนำ (แคลอรี่รวม: ${totalCalories} kcal)</h3>`;
    resultContainer.appendChild(menuContainer);
    resultContainer.style.display = 'block';
}