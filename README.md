## **Memory Matrix**

<!--

// Modal 'Settings'
data-attributes 
data-атрибуты
позволяют добавить на элемент специальные кастомные значения, которые не должны обрабатываться браузером
data-custom_name="value"
dataset.custom_name - получение значения
https://www.sitepoint.com/how-why-use-html5-custom-data-attributes/
;(() => {
    const menuBtnRef = document.querySelector("[data-menu-button]")
    const mobileMenuRef = document.querySelector("[data-menu]")
    menuBtnRef.addEventListener("click", () => {
        const expanded = menuBtnRef.getAttribute("aria-expanded") === "true" || false
        menuBtnRef.classList.toggle("is-open")
        menuBtnRef.setAttribute("aria-expanded", !expanded)
        mobileMenuRef.classList.toggle("is-open")
    })
})()

// Settings
Difficulty(msPerQuad): hard 400ms; medium 600ms; easy 800ms;
Cursor(antiCheat): anti-cheat;
Color:  random (default)
Size(quadSize):   tiny 40x40
        small 50x50
        medium 60x60
        large 70x70
        giant 80x80
Theme:  default light, dark, cyber

// Client Storage:
localStorage.setItem('settings', JSON.stringify(object));
localStorage.clear();
save level
save theme
save size
save anti-cheat toggle

// Theme:  default light, dark, cyber

// Alternative field:
random field rotate 90 (3x8 or 8x3)
object properties enable-disable and true-false
game.rotate: {enable, true}

// Extra levels
more than 20
enabled-disabled in settings

Choose level and click on the Start Game button to start!

// Drop Menu https://www.youtube.com/watch?v=bC6vOWWNoas

-->
