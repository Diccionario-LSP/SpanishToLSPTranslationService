function actionTopbar() {
    var menu = document.querySelector('nav.nav-sec>ul');
    var menuClass = menu.getAttribute("class");
    console.log(menu);

    if (menu.getAttribute("class").includes("active")) {
        menu.setAttribute("class", menuClass.replace(" active", ""));
    } else {
        menu.setAttribute("class", menuClass + " active");
    }
}