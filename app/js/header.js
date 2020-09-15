document.addEventListener('DOMContentLoaded', function() {

    //header
    let header = document.querySelector('.header');
    function checkOffset() {
        window.pageYOffset ? header.classList.add('sticky') : header.classList.remove('sticky');
    }
    document.addEventListener('scroll', checkOffset)

    let burger = document.querySelector('.burger'),
        menu   = document.querySelector('.header-mob');
    burger.addEventListener('click', function () {
        menu.classList.toggle('active')
    })

    let lItem = document.querySelectorAll('.header-mob__item');
    lItem.forEach(function (item) {
        item.addEventListener('click', function () {
            this.classList.toggle('active');
        })
    })
    //end

    //footer
    let trigger = document.querySelectorAll('.footer__title');
    trigger.forEach(function (item) {
        item.addEventListener('click', function () {
            this.parentNode.classList.toggle('active');
        })
    })
    //end

});