## **Memory Matrix**

<!--
1 start screen
2 Progress Bar above main field

hover btns svg color
#ababab disabled
#767676 active
#000000 hover

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

button "start" display countdown and then 'go!'

style next btn (play again)
don't need icon arrow right - delete em all
next btn (disappear)

close.svg insert in svg tag

// UNDO
double click undo (toggle 'click')
enabled-disabled in settings

// Interface

Settings

// Settings
Difficulty: hard 400ms; medium 600ms; easy 800ms;
Cursor: anti-cheat;
color: random (default)

// Theme
default light, dark, cyber

// Size:
small 40x40 8 20
medium 50x50 10 25
large 60x60 12 20

// Client Storage:
localStorage.setItem('settings', JSON.stringify(object));
localStorage.clear();
save level
save theme
save quad color

// Alternative field:
random field rotate 90 (3x8 or 8x3)
object properties enable-disable and true-false
game.rotate: {enable, true}

// Extra levels
more than 20
enabled-disabled in settings

-->

<!-- DONE:
favicon
logo
-->
