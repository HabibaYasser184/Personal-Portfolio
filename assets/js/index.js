document.addEventListener("DOMContentLoaded", () => {
var html = document.documentElement;
var body = document.body;
var header = document.getElementById("header");
var themeToggle = document.getElementById("theme-toggle-button");
var scrollTopButton = document.getElementById("scroll-to-top");
var settingsToggle = document.getElementById("settings-toggle");
var settingsSidebar = document.getElementById("settings-sidebar");
var settingsClose = document.getElementById("close-settings");
var colorsGrid = document.getElementById("theme-colors-grid");
var resetButton = document.getElementById("reset-settings");
var navLinks = [...document.querySelectorAll('#header a[href^="#"]')];
var sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
var defaultTheme = html.classList.contains("dark") ? "dark" : "light";
var palette = [
{ name: "Indigo", primary: "#6366f1", secondary: "#8b5cf6", accent: "#ec4899" },
{ name: "Blue", primary: "#2563eb", secondary: "#06b6d4", accent: "#14b8a6" },
{ name: "Emerald", primary: "#059669", secondary: "#10b981", accent: "#f59e0b" },
{ name: "Rose", primary: "#e11d48", secondary: "#f43f5e", accent: "#8b5cf6" },
{ name: "Orange", primary: "#ea580c", secondary: "#f59e0b", accent: "#ec4899" },
{ name: "Violet", primary: "#7c3aed", secondary: "#a855f7", accent: "#06b6d4" },
{ name: "Teal", primary: "#0f766e", secondary: "#14b8a6", accent: "#f97316" },
{ name: "Slate", primary: "#475569", secondary: "#64748b", accent: "#0ea5e9" }
];
var activeColor = 0;
var savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
else setTheme(defaultTheme);
var savedFont = localStorage.getItem("portfolio-font") || "tajawal";
setFont(savedFont);
var savedColor = Number(localStorage.getItem("portfolio-color"));
if (Number.isInteger(savedColor) && savedColor >= 0 && savedColor < palette.length) activeColor = savedColor;
applyColor(activeColor);
buildColorOptions();
function setTheme(theme) {
var isDark = theme === "dark";
html.classList.toggle("dark", isDark);
if (themeToggle) {
themeToggle.setAttribute("aria-pressed", String(isDark));
themeToggle.setAttribute("aria-label", isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن");
}
localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
}
if (themeToggle) {
themeToggle.addEventListener("click", () => setTheme(html.classList.contains("dark") ? "light" : "dark"));
}
function setFont(font) {
var allowed = ["alexandria", "tajawal", "cairo"];
var selected = allowed.includes(font) ? font : "tajawal";
html.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
html.classList.add(`font-${selected}`);
document.querySelectorAll(".font-option").forEach(button => {
var active = button.dataset.font === selected;
button.classList.toggle("active", active);
button.setAttribute("aria-checked", String(active));
});
localStorage.setItem("portfolio-font", selected);
}
document.querySelectorAll(".font-option").forEach(button => {
button.addEventListener("click", () => setFont(button.dataset.font));
});
function applyColor(index) {
var color = palette[index];
if (!color) return;
activeColor = index;
html.style.setProperty("--color-primary", color.primary);
html.style.setProperty("--color-secondary", color.secondary);
html.style.setProperty("--color-accent", color.accent);
html.style.setProperty("--tw-color-primary", color.primary);
document.querySelectorAll(".theme-color-option").forEach((button, buttonIndex) => {
var active = buttonIndex === index;
button.classList.toggle("active", active);
button.setAttribute("aria-pressed", String(active));
});
localStorage.setItem("portfolio-color", String(index));
}
function buildColorOptions() {
if (!colorsGrid) return;
colorsGrid.replaceChildren();
palette.forEach((color, index) => {
var button = document.createElement("button");
button.type = "button";
button.className = "theme-color-option";
button.style.background = `linear-gradient(135deg, ${color.primary}, ${color.secondary})`;
button.setAttribute("aria-label", `لون ${color.name}`);
button.setAttribute("title", color.name);
button.innerHTML = '<span aria-hidden="true"><i class="fa-solid fa-check"></i></span>';
button.addEventListener("click", () => applyColor(index));
colorsGrid.appendChild(button);
});
applyColor(activeColor);
}
var backdrop = document.getElementById("settings-backdrop");
if (!backdrop && settingsSidebar) {
backdrop = document.createElement("div");
backdrop.id = "settings-backdrop";
backdrop.setAttribute("aria-hidden", "true");
body.appendChild(backdrop);
}
function openSettings() {
if (!settingsSidebar) return;
settingsSidebar.classList.add("open");
settingsSidebar.setAttribute("aria-hidden", "false");
settingsToggle?.setAttribute("aria-expanded", "true");
backdrop?.classList.add("open");
body.style.overflow = "hidden";
settingsClose?.focus();
}
function closeSettings() {
if (!settingsSidebar) return;
settingsSidebar.classList.remove("open");
settingsSidebar.setAttribute("aria-hidden", "true");
settingsToggle?.setAttribute("aria-expanded", "false");
backdrop?.classList.remove("open");
body.style.overflow = "";
}
settingsToggle?.addEventListener("click", openSettings);
settingsClose?.addEventListener("click", closeSettings);
backdrop?.addEventListener("click", closeSettings);
document.addEventListener("keydown", event => {
if (event.key === "Escape") closeSettings();
});
resetButton?.addEventListener("click", () => {
setTheme(defaultTheme);
setFont("tajawal");
applyColor(0);
});
var filterButtons = [...document.querySelectorAll(".portfolio-filter")];
var portfolioItems = [...document.querySelectorAll(".portfolio-item")];
filterButtons.forEach(button => {
button.addEventListener("click", () => {
var filter = button.dataset.filter || "all";
filterButtons.forEach(item => {
var active = item === button;
item.classList.toggle("active", active);
item.setAttribute("aria-pressed", String(active));
});
portfolioItems.forEach(item => {
var visible = filter === "all" || item.dataset.category === filter;
item.classList.toggle("is-hidden", !visible);
item.setAttribute("aria-hidden", String(!visible));
});
});
});
function updateScrollUI() {
var y = window.scrollY;
header?.classList.toggle("scrolled", y > 20);
scrollTopButton?.classList.toggle("visible", y > 350);
scrollTopButton?.setAttribute("aria-hidden", String(y <= 350));
var current = "";
sections.forEach(section => {
if (section.getBoundingClientRect().top <= 150) current = section.id;
});
if (!current && sections[0]) current = sections[0].id;
navLinks.forEach(link => {
var active = link.getAttribute("href") === `#${current}`;
link.classList.toggle("nav-active", active);
if (active) link.setAttribute("aria-current", "page");
else link.removeAttribute("aria-current");
});
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();
scrollTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
var carousel = document.getElementById("testimonials-carousel");
var testimonialCards = carousel ? [...carousel.querySelectorAll(".testimonial-card")] : [];
if (carousel && testimonialCards.length) {
var outer = carousel.parentElement;
var controls = document.createElement("div");
controls.className = "testimonial-controls";
controls.setAttribute("aria-label", "التحكم في آراء العملاء");
var previous = document.createElement("button");
previous.type = "button";
previous.className = "testimonial-arrow";
previous.setAttribute("aria-label", "الرأي السابق");
previous.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
var dots = document.createElement("div");
dots.className = "flex items-center justify-center gap-2";
var next = document.createElement("button");
next.type = "button";
next.className = "testimonial-arrow";
next.setAttribute("aria-label", "الرأي التالي");
next.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
controls.append(previous, dots, next);
outer.insertAdjacentElement("afterend", controls);
var currentIndex = 0;
var visibleCount = 3;
var maxIndex = 0;
var timer;
function measureCarousel() {
visibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
maxIndex = Math.max(0, testimonialCards.length - visibleCount);
currentIndex = Math.min(currentIndex, maxIndex);
renderCarousel();
}
function renderCarousel() {
var cardWidth = testimonialCards[0].getBoundingClientRect().width;
var gap = parseFloat(getComputedStyle(carousel).columnGap || "0") || 0;
var offset = (cardWidth + gap) * currentIndex;
carousel.style.transform = `translateX(${document.documentElement.dir === "rtl" ? -offset : offset}px)`;
dots.replaceChildren();
var dotCount = maxIndex + 1;
for (var i = 0; i < dotCount; i++) {
var dot = document.createElement("button");
dot.type = "button";
dot.className = `testimonial-dot${i === currentIndex ? " active" : ""}`;
dot.setAttribute("aria-label", `عرض المجموعة ${i + 1}`);
dot.setAttribute("aria-pressed", String(i === currentIndex));
dot.addEventListener("click", () => goTo(i));
dots.appendChild(dot);
}
previous.disabled = currentIndex === 0;
next.disabled = currentIndex === maxIndex;
previous.style.opacity = previous.disabled ? ".45" : "1";
next.style.opacity = next.disabled ? ".45" : "1";
}
function goTo(index) {
currentIndex = Math.max(0, Math.min(index, maxIndex));
renderCarousel();
restartTimer();
}
function restartTimer() {
clearInterval(timer);
timer = setInterval(() => {
currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
renderCarousel();
}, 5000);
}
previous.addEventListener("click", () => goTo(currentIndex - 1));
next.addEventListener("click", () => goTo(currentIndex + 1));
window.addEventListener("resize", measureCarousel);
carousel.addEventListener("mouseenter", () => clearInterval(timer));
carousel.addEventListener("mouseleave", restartTimer);
measureCarousel();
restartTimer();
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
link.addEventListener("click", event => {
var target = document.querySelector(link.getAttribute("href"));
if (target) {
event.preventDefault();
target.scrollIntoView({ behavior: "smooth", block: "start" });
}
});
});
});
