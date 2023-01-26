// Match Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablink;
    tabcontent = document.getElementsByClassName("match-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablink = document.getElementsByClassName("match-tab-link");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    };
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};

// Default Functions
document.addEventListener('DOMContentLoaded', () => {
    openTab(event, 'inkomend');
});
