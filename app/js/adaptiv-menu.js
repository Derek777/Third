btn.onclick = function myFunction() {
    let x = document.getElementById('menu__list');
    if(x.className === "menu__list"){
        x.className +=" responsive";
    }else{
        console.log(x);
        x.className = "menu__list";
    }
};