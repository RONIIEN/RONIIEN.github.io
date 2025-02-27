document.addEventListener("DOMContentLoaded", function() {
  const menuLinks = document.querySelectorAll('nav ul li a');
  const testLink = document.querySelector('nav ul li a[href="2.html"]'); // ลิงก์ "ทำแบบทดสอบ"

  // การตรวจสอบหน้าที่เปิดอยู่
  menuLinks.forEach(link => {
      // ถ้าลิงก์ที่มี href ตรงกับ URL ของหน้า ให้เพิ่มคลาส active
      if (link.href === window.location.href) {
          link.classList.add('active');
      }

      // เพิ่ม event listener เมื่อมีการคลิก
      link.addEventListener('click', function(event) {
          // ลบคลาส active จากทุกลิงก์
          menuLinks.forEach(item => item.classList.remove('active'));

          // เพิ่มคลาส active ให้กับลิงก์ที่คลิก
          this.classList.add('active');
      });
  });

  // เพิ่ม event listener เมื่อเมาส์ออกจากพื้นที่ของเมนู
  const nav = document.querySelector('nav');
  nav.addEventListener('mouseleave', function() {
      // ถ้าไม่มีการชี้ไปที่เมนูใด ๆ จะกลับคลาส active ไปที่ลิงก์ "ทำแบบทดสอบ"
      if (testLink && !testLink.classList.contains('active')) {
          testLink.classList.add('active');
      }
  });

  // ลบคลาส active เมื่อเมาส์ชี้ไปที่ลิงก์
  menuLinks.forEach(link => {
      link.addEventListener('mouseover', function() {
          // ลบคลาส active เมื่อชี้เมาส์ไปที่ลิงก์
          menuLinks.forEach(item => item.classList.remove('active'));
      });
  });
});
