document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const bmrResult = document.getElementById('bmr-result');
    const tdeeResult = document.getElementById('tdee-result');
    const proteinResult = document.getElementById('protein-result');
    const carbsResult = document.getElementById('carbs-result');
    const fatResult = document.getElementById('fat-result');
    const totalCaloriesResult = document.getElementById('total-calories-result');
    const proteinPercentage = document.getElementById('protein-percentage');
    const carbsPercentage = document.getElementById('carbs-percentage');
    const fatPercentage = document.getElementById('fat-percentage');

    calculateBtn.addEventListener('click', calculateBMRandTDEE);

    function calculateBMRandTDEE() {
        const gender = document.querySelector('input[name="gender"]:checked');
        const age = parseInt(document.getElementById('age').value);
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const activityLevel = document.getElementById('activity').value;

        if (!gender || isNaN(age) || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
            return;
        }

        const genderValue = gender.value;
        let bmr;

        // คำนวณ BMR ตามเพศ
        if (genderValue === "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age); // BMR สำหรับผู้ชาย
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age); // BMR สำหรับผู้หญิง
        }

        let activityFactor;
        switch (activityLevel) {
            case "low":
                activityFactor = 1.2;
                break;
            case "moderate_1_3":
                activityFactor = 1.375;
                break;
            case "moderate_4_5":
                activityFactor = 1.55;
                break;
            case "high_6_7":
                activityFactor = 1.725;
                break;
            case "very_high":
                activityFactor = 1.9;
                break;
            default:
                activityFactor = 1.2; // ค่าเริ่มต้น
        }

        // คำนวณ TDEE
        const tdee = bmr * activityFactor;

        // คำนวณสารอาหาร
        const protein = weight * 2.0; // โปรตีน 2 กรัมต่อกิโลกรัม
        const fat = weight * 0.8; // ไขมัน 0.8 กรัมต่อกิโลกรัม
        const carbs = (tdee - (protein * 4 + fat * 9)) / 4; // คาร์โบไฮเดรต (ใช้พลังงานจากโปรตีนและไขมัน)

        // คำนวณสัดส่วนสารอาหาร (เปอร์เซ็นต์)
        const totalCalories = protein * 4 + carbs * 4 + fat * 9;
        const proteinPercentageValue = (protein * 4 / totalCalories) * 100;
        const carbsPercentageValue = (carbs * 4 / totalCalories) * 100;
        const fatPercentageValue = (fat * 9 / totalCalories) * 100;

        // แสดงผลลัพธ์
        bmrResult.innerText = bmr.toFixed(2);
        tdeeResult.innerText = tdee.toFixed(2);
        proteinResult.innerText = protein.toFixed(2) + " กรัม";
        carbsResult.innerText = carbs.toFixed(2) + " กรัม";
        fatResult.innerText = fat.toFixed(2) + " กรัม";
        totalCaloriesResult.innerText = tdee.toFixed(2);
        proteinPercentage.innerText = proteinPercentageValue.toFixed(2) + "%";
        carbsPercentage.innerText = carbsPercentageValue.toFixed(2) + "%";
        fatPercentage.innerText = fatPercentageValue.toFixed(2) + "%";

        resultDiv.style.display = 'block';

        // แนะนำเมนูอาหาร
        recommendMenu(tdee);
    }

    function recommendMenu(tdee) {
        let recommendedMenus = [];
        let totalRecommendedCalories = 0;

        // ดึงข้อมูลเมนูทั้งหมดจาก JSON
        fetch('menu.json')
            .then(response => response.json())
            .then(data => {
                const menuItems = data;

                // สุ่มเลือก 3 เมนู
                while (recommendedMenus.length < 3 && menuItems.length > 0) {
                    const randomIndex = Math.floor(Math.random() * menuItems.length);
                    const selectedMenu = menuItems.splice(randomIndex, 1)[0];

                    // ตรวจสอบว่าแคลอรี่รวมไม่เกิน TDEE
                    if (totalRecommendedCalories + selectedMenu.calories <= tdee) {
                        recommendedMenus.push(selectedMenu);
                        totalRecommendedCalories += selectedMenu.calories;
                    }
                }

                // แสดงผลเมนูที่แนะนำ
                displayRecommendedMenus(recommendedMenus);
            })
            .catch(error => {
                console.error('Error fetching menu.json:', error);
            });
    }

    function displayRecommendedMenus(menus) {
        const recommendedMenusContainer = document.querySelector('#recommended-menus-container .recommended-menu-container');
        recommendedMenusContainer.innerHTML = ''; // เคลียร์เมนูอาหารที่แนะนำก่อนหน้านี้

        let totalCalories = 0; // ค่าแคลอรี่รวมของเมนูอาหารที่แนะนำ

        if (menus.length === 0) {
            recommendedMenusContainer.innerHTML = '<p>ไม่มีเมนูอาหารที่แนะนำในขณะนี้</p>'; // แสดงข้อความเมื่อไม่มีเมนู
            const recommendedMenusHeading = document.querySelector('#recommended-menus-container h3');
            recommendedMenusHeading.textContent = `เมนูอาหารที่แนะนำ (แคลอรี่รวม: 0 kcal)`;
            return;
        }

        menus.forEach(menu => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('recommended-menu-item');

            const menuImage = document.createElement('img');
            menuImage.src = menu.image;
            menuImage.alt = menu.name;

            const menuLink = document.createElement('a');
            menuLink.href = menu.link;
            menuLink.target = "_blank";
            menuLink.textContent = "ดูสูตรอาหาร";

            menuItem.appendChild(menuImage);
            menuItem.innerHTML += `
                <span>${menu.name}</span>
                <p>แคลอรี่: ${menu.calories} kcal</p>
                
            `;
            menuItem.appendChild(menuLink);

            recommendedMenusContainer.appendChild(menuItem);
            totalCalories += menu.calories;
        });

        const recommendedMenusHeading = document.querySelector('#recommended-menus-container h3');
        recommendedMenusHeading.textContent = `เมนูอาหารที่แนะนำ (แคลอรี่รวม: ${totalCalories} kcal)`;
    }
});