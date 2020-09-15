let postsData = {
    i: 0,
    count: 12
}

document.addEventListener('DOMContentLoaded', function () {
    let scrollTop = document.querySelector('.stories__to-top');
    if (scrollTop) {
        scrollTop.addEventListener('click', function () {
            window.scrollTo(0, 0)
        })
    }
    if (document.querySelector('.wrap-blue')) {
        function moveLeft() {
            let wrapBlue = document.querySelector('.wrap-blue'),
                coverBlue = document.querySelector('.wrap-blue__cover');

            coverBlue.style.left = '-' + wrapBlue.offsetLeft + 'px';
            coverBlue.style.width = document.querySelector('html').clientWidth + 'px';
        }

        moveLeft();
        window.addEventListener('resize', moveLeft)
    }

    //filter for blog-posts
    (async function getData (){
        const firstResponse = await fetch('../js/info.json');
              postsData.data = await firstResponse.json();

        filterByType('all', postsData.data)
    })()

    function filterByType(type, data) {
        let fltData;
        postsData.newType = type;

        if (type !== 'all') {
            fltData = data.filter(function(e){
                return e.type === type;
            });
        } else {
            fltData = data;
        }

        renderDOM(fltData)
    }

    function renderDOM(filteredData) {
        let container = document.querySelector('.stories--last-articles'),
            button = document.querySelector('.stories__more');

        if (postsData.newType === postsData.currentType) {
            (filteredData.length - postsData.count) >= 12 ? postsData.count += 12 : postsData.count = (filteredData.length - postsData.count);
        } else {
            container.innerHTML = "";
            filteredData.length >= 12 ? postsData.count = 12 : postsData.count = filteredData.length;
            postsData.i = 0;
        }

        while (postsData.i < postsData.count) {
            let obj = filteredData[postsData.i],
                time = obj.time || "Jan 1",
                likes = obj.time || "00",
                msgs = obj.time || "00",
                item = document.createElement('a');

            item.href = obj.link;
            item.classList.add('stories__item');
            item.innerHTML = `<div class="stories__top">
                                  <img class="stories__img" src="${obj.imgSrc}" alt="">
                                  <p class="stories__title">${obj.title}</p>
                              </div>
                              <div class="stories__bot">
                                  <p class="stories__data">${time}</p>
                                  <p class="stories__data stories__data--like">${likes}</p>
                                  <p class="stories__data stories__data--msg">${msgs}</p>
                              </div>`

            container.appendChild(item)
            postsData.i++
        }

        ((filteredData.length - postsData.count) === 0) ? button.style.display = 'none' : button.style.display = 'flex';

        postsData.currentType = postsData.newType;
        if (postsData.newType === 'video') ytInit();
    }

    document.querySelector('.stories__more').addEventListener('click', function () {
        filterByType(postsData.newType, postsData.data);
    })
    document.querySelectorAll('.primary__card').forEach(function(item) {
        item.addEventListener('click', function() {
            postsData.newType = this.getAttribute('data-type');
            filterByType(postsData.newType, postsData.data);
            appendTag();
        })
    })

    //search filter
    let search = document.querySelector('.primary__input');
    search.addEventListener('input', function() {
        filterByTitle(this.value)
    })

    let dropdown = document.querySelector('.primary__dropdown');
    function filterByTitle(input) {
        postsData.newType = input;

        if (input !== '') {
            fltData = postsData.data.filter(function(e){
                return e.title.toLowerCase().indexOf(input.toLowerCase()) + 1
            });

            renderDOM(fltData)
            renderDropdown(fltData)

            if ( !dropdown.classList.contains('active') ) dropdown.parentNode.classList.add('active')
        } else {
            filterByType('all', postsData.data)
            dropdown.parentNode.classList.remove('active')
        }
    }

    //dropdown render
    function renderDropdown(data) {
        let list = '';

        data.length > 5 ? count = 5 : count = data.length;

        for (let i = 0; i < count; i++) {
            list += `<a href="#search-result" class="primary__dd-item">${data[i].title}</a>`
        }

        dropdown.innerHTML = list;
        initAnchors();
    }

    //dropdown events
    dropdown.addEventListener('click', function(e) {
        search.value = e.target.innerText;
        filterByTitle(search.value);
        this.parentNode.classList.remove('active');
    })
    search.addEventListener('focusout', function () {
        let that = this;
        setTimeout(function(){that.parentNode.classList.remove('active')}, 200)
    })

    //smooth anchor scroll
    function initAnchors() {
        const anchors = document.querySelectorAll('a[href*="#"]')

        for (let anchor of anchors) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()

                const blockID = anchor.getAttribute('href').substr(1)

                document.getElementById(blockID).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            })
        }
    }
    initAnchors()

    function ytInit() {
        let items    = document.querySelectorAll('.stories__item'),
            pop      = document.querySelector('.stories__pop'),
            popFrame = document.querySelector('#player');

        items.forEach(function(item) {
            if (item.getAttribute('href')) {
                let link = item.href;
                item.removeAttribute('href');

                item.addEventListener('click', function() {
                    popFrame.src = link + '?autoplay=1';
                    pop.classList.add('active');
                })
            }
        })
    }
    document.querySelector('.stories__fade').addEventListener('click', function() {
        let pop = this.parentNode;

        pop.classList.remove('active');
        pop.querySelector('#player').src = '';
    })

    function appendTag() {
        //append tag element to title
        let newTag    = document.createElement('span'),
            container = document.querySelector('.stories--last-articles'),
            tag       = container.parentNode.parentNode.querySelector('.tag');

        if (tag) {
            tag.remove();
        }

        newTag.classList.add('tag');
        newTag.innerHTML = postsData.currentType + '<button class="tag__button"></button><div class="tag__bg"></div>';

        container.parentNode.parentNode.querySelector('.title').appendChild(newTag);
        initTag();
    }

    //init tag
    function initTag() {
        document.querySelector('.tag__button').addEventListener('click', function () {
            this.parentNode.remove()
            filterByType('all', postsData.data)
        })
    }
})