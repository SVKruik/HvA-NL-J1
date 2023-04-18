// Profiel Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablink;
    tabcontent = document.getElementsByClassName("hero-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablink = document.getElementsByClassName("hero-tab-link");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    };
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};

// Profiel Sub Tabs
function openSubTab(evt, tabName) {
    var i, tabcontent, tablink;
    tabcontent = document.getElementsByClassName("hero-tab-content-sub");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablink = document.getElementsByClassName("hero-tab-link-sub");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    };
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};

// Default Functions
document.addEventListener('DOMContentLoaded', () => {
    openTab(event, 'tab-info');
    openSubTab(event, 'tab-alle');
});
