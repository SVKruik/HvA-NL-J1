// Oud navigatiebalk systeem.
// @kruiksv

/// Nav Dropdown
function dropdownMenu() {

    console.log("Executed dropdownMenu()");

    // Check
    const containers = document.querySelectorAll('.menu-container').length;
    if (containers > 0) {
        const subcontainer = document.querySelector('.menu-container');
        subcontainer.remove();
    };

    // Base
    const container = document.querySelector('.nav-menu-container');
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';

    // Top
    const menuTopListItemA = document.createElement('li');
    menuTopListItemA.className = 'menu-list-item';
    const menuName = document.createElement('p');
    menuName.appendChild(document.createTextNode('Pietera Meulesteen'));
    menuName.className = 'menu-name';
    menuTopListItemA.appendChild(menuName);

    const menuTopListItemB = document.createElement('li');
    menuTopListItemB.className = 'menu-list-item';
    const menuClose = document.createElement('button');
    menuClose.appendChild(document.createTextNode('X'));
    menuClose.className = 'menu-close'
    menuClose.onclick = function () {
        menuContainer.remove();
    };
    menuTopListItemB.appendChild(menuClose);

    const menuTopList = document.createElement('ul');
    menuTopList.className = 'menu-list';
    menuTopList.appendChild(menuTopListItemA);
    menuTopList.appendChild(menuTopListItemB);

    // Middle
    const menuSplitterA = document.createElement('div');
    menuSplitterA.className = 'menu-splitter'
    const menuSplitterB = document.createElement('div');
    menuSplitterB.className = 'menu-splitter'

    const menuMiddleListItemA = document.createElement('li');
    menuMiddleListItemA.className = 'menu-list-item';
    const menuA = document.createElement('a');
    menuA.href = 'profiel.html';
    const menuATitle = document.createElement('p');
    menuATitle.appendChild(document.createTextNode('Wijzig Profiel'));
    menuATitle.className = 'menu-a-title';
    menuA.appendChild(menuATitle);
    menuMiddleListItemA.appendChild(menuA);

    const menuMiddleListItemB = document.createElement('li');
    menuMiddleListItemB.className = 'menu-list-item';
    const menuB = document.createElement('a');
    menuB.href = 'instellingen.html';
    const menuBTitle = document.createElement('p');
    menuBTitle.appendChild(document.createTextNode('Instellingen'));
    menuBTitle.className = 'menu-a-title';
    menuB.appendChild(menuBTitle);
    menuMiddleListItemB.appendChild(menuB);

    const menuMiddleList = document.createElement('ul');
    menuMiddleList.className = 'menu-vertical-list';
    menuMiddleList.appendChild(menuMiddleListItemA);
    menuMiddleList.appendChild(menuMiddleListItemB);

    // Bottom
    const menuBottomListItemA = document.createElement('li');
    menuBottomListItemA.className = 'menu-list-item';
    const menuLogout = document.createElement('a');
    menuLogout.appendChild(document.createTextNode('Uitloggen'));
    menuLogout.className = 'menu-loguit';
    menuLogout.href = 'index.html';
    menuBottomListItemA.appendChild(menuLogout);

    const menuBottomListItemB = document.createElement('li');
    menuBottomListItemB.className = 'menu-list-item';
    const menuLogoutIcon = document.createElement('p');
    menuLogoutIcon.appendChild(document.createTextNode(">"));
    menuLogoutIcon.className = 'menu-loguit-icon';
    menuBottomListItemA.appendChild(menuLogoutIcon);

    const menuBottomList = document.createElement('ul');
    menuBottomList.className = 'menu-list';
    menuBottomList.appendChild(menuBottomListItemA);
    menuBottomList.appendChild(menuBottomListItemB);

    // Fractions
    const menuTop = document.createElement('div');
    menuTop.className = 'menu-top';
    menuTop.appendChild(menuTopList);

    const menuMiddle = document.createElement('div');
    menuMiddle.className = 'menu-middle';
    menuMiddle.appendChild(menuSplitterA);
    menuMiddle.appendChild(menuMiddleList);
    menuMiddle.appendChild(menuSplitterB);

    const menuBottom = document.createElement('div');
    menuBottom.className = 'menu-bottom';
    menuBottom.appendChild(menuBottomList);

    // Assembling
    menuContainer.appendChild(menuTop);
    menuContainer.appendChild(menuMiddle);
    menuContainer.appendChild(menuBottom);

    container.appendChild(menuContainer);
};

/// Nav Dropdown Delete
function dropdownMenuDelete() {
    console.log("Executed dropdownMenuDelete()");

    const container = document.querySelector('.menu-container');
    container.remove();
};