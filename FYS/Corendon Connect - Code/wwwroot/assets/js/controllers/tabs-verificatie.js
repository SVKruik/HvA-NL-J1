function autotab(current, original) {
    if (original.getAttribute && original.value.length == original.getAttribute("maxlength")) {
        document.getElementById(`input-${current}`).nextElementSibling.focus();
    };
};
