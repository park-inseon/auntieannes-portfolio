const mainSlideshow = document.querySelector('.main__slideshow'),
      mainSlider = document.querySelector('.main__slider');
let mainMobileSlider = null;

const mobile = 1024;
// let device = undefined;

let wheelEventFunc;

window.onload = function() {
    setTimeout(function(){
        window.scrollTo(0, 0);
    }, 0);
    createGlider();
    
    // 미디어 쿼리 감지
    let mql = window.matchMedia('(max-width:' + mobile + 'px)');
    mql.addListener(mediaQueryCheck);
    mediaQueryCheck(mql);
};

(function checkCookie(){
    // 쿠키 확인
    if(document.cookie.indexOf('todayClose') > -1) { // 팝업 오늘 안보기
        let popup = document.querySelector('.popup');
        popup.style.display = 'none';
    } else {
        // 팝업 다시 띄우기
    }
}());

function mediaQueryCheck(e) {
    if(e.matches){ // 모바일        
        if(!mainMobileSlider) { // 모바일 슬라이드 생성
            setMobileSlide();
        }       
        if(!mainMobileSlider.timer) { // 모바일 자동 슬라이드
            mainMobileSlider.autoSlide();
        }
        if(mainSlider.timer) { // PC 타이머 제거
            clearInterval(mainSlider.timer);
            mainSlider.timer = null;
        }
        window.removeEventListener('wheel', wheelEventFunc);
        setScrollToTop(1);
    } else { // PC        
        if(!mainSlider.timer) { // PC 자동 슬라이드
            mainSlider.autoSlide();
        }
        if(mainMobileSlider && mainMobileSlider.timer) { // 모바일 타이머 제거
            clearInterval(mainMobileSlider.timer);
            mainMobileSlider.timer = null;
        }
        if(!Modernizr.touch) {
            console.log(wheelEventFunc);
            window.addEventListener('wheel', wheelEventFunc);
        }
        setScrollToTop(-1);
    }
}

//팝업
(function popupFunc() {
    const popup = document.querySelector('.popup'),
          popupCloseBtn = document.querySelector('.popup__close'),
          popupTodayCloseBtn = document.querySelector('.popup__today-close');
    
    popupCloseBtn.addEventListener('click', closePopup);
    popupTodayCloseBtn.addEventListener('click', todayClosePopup);
    
    function closePopup() {
        popup.classList.add('hide');
        setTimeout(function(){
            popup.style.display = 'none';
        }, 500);
    }
    
    function todayClosePopup() {
        let date = new Date(),
            setCookie = '';
        
        date.setHours(23, 59, 59);
        date.setMinutes(36);
        setCookie += 'popup = todayClose;';
        setCookie += 'expires = ' + date.toUTCString();
        document.cookie = setCookie;
        console.log(setCookie);
        closePopup();
    }
}());

(function scrollToTopFunc(){
    const topBtn = document.querySelector('.scroll-to-top');
    let timer = null;
    
    topBtn.addEventListener('click', scrollToTop);
    
    function scrollToTop(e) {
        let distance = window.pageYOffset,
            time = 20,//20
//            speed = Math.ceil(distance/time),
            speed = 1;
        
        if(timer === null) {
            timer = setInterval(function(){
                if(window.pageYOffset > 0) {
                    speed = Math.ceil(speed * 1.2);
                    window.scrollBy(0, -speed);
                } else {
                    clearInterval(timer);
                    timer = null;
                }                
            }, time);
        } else {
            return 0;
        }
    }
}());

function setScrollToTop(num) {
    const topBtn = document.querySelector('.scroll-to-top');
    
    if(num > 0) {
        window.addEventListener('scroll', handleScrollToTop);
    } else {
        topBtn.classList.remove('show');
        window.removeEventListener('scroll', handleScrollToTop);
    }
}

function handleScrollToTop(e) {
    const topBtn = document.querySelector('.scroll-to-top');
    let display = window.getComputedStyle(topBtn).display;

    if(window.pageYOffset >= 500 && display === 'none') {
        topBtn.style.animationName = 'fadeIn';
        topBtn.classList.add('show');
    } else if(window.pageYOffset < 500 && display === 'block') {
        topBtn.style.animationName = 'fadeOut';
        setTimeout(function(){
            topBtn.classList.remove('show');
        }, 500);
    }
}

(function btnAniFunc() {
    const moreBtnIcon = document.getElementsByClassName('more-btn__icon');
    
    // 더보기 아이콘 애니메이션
    [].forEach.call(moreBtnIcon, function(elem){
        elem.addEventListener('mouseenter', addScaleUpAni);
        elem.addEventListener('mouseout', addScaleDownAni)
    });

    function addScaleUpAni(e) {
        this.style.animationName = 'btnScaleUp';
    }

    function addScaleDownAni(e) {
        this.style.animationName = 'btnScaleDown';
    }
}());

(function navFunc(){
    //nav
    const hamBtn = document.getElementById('ham'),
          fullNav = document.getElementById('fullNav'),
          fullNavMenu = fullNav.querySelector('.fullnav__menu'),
          scrollNav = document.getElementById('scrollNav'),
          scrollNavList = scrollNav.querySelector('.scrollnav__list');
    
    hamBtn.addEventListener('click', handleFullNav);
    fullNavMenu.addEventListener('click', handleFullNavMenuList);
    scrollNavList.addEventListener('click', handlePageScroll);
    
    function handleFullNav(e) {
        e.preventDefault();
        this.classList.toggle('active');
        fullNav.classList.toggle('show');
    }

    function handleFullNavMenuList(e) {
        let target = e.target.parentElement;

        if(target.classList.contains('active')) {
            target.classList.remove('active');
        } else {
            let contents = fullNavMenu.getElementsByClassName('fullnav__content');
            [].forEach.call(contents, function(elem){
                if(elem.classList.contains('active')) {
                    elem.classList.remove('active');
                }
            });
            target.classList.add('active');
        }
    }

    function handlePageScroll(e) {
        e.preventDefault();
        setScrollNavDots(e.target);
    }

    wheelEventFunc = function checkWheelEvent(e) {
        if(scrollNav.timer) {
            return 0;
        }

        let dots = scrollNav.getElementsByClassName('scrollnav__link');

        const active = scrollNav.querySelector('.scrollnav__link.active');
        let idx = parseInt(active.dataset.idx);

        if(e.deltaY > 0) { // 하단 영역으로 스크롤
            if(idx >= scrollNavList.childElementCount-1) { //푸터
                scrollToBottom();
                return 0;
            } else {
                ++idx;
            }
        } else { // 상단 영역으로 스크롤
            if(idx !== 0) {
                if(scrollNav.style.opacity === '0') {
                    active.classList.remove('active');
                    idx = dots.length-1;
                } else {
                    --idx;
                }
            }
        }
        setScrollNavDots(dots[idx]);
    };

    function scrollToSection(idx) { 
        const scrollPos = document.getElementsByClassName('container')[idx],
              targetPos = scrollPos.offsetTop,
              scrollDirection = targetPos-window.pageYOffset,
              distance = Math.abs(scrollDirection),
              time = 25,//20
              speed = Math.ceil(distance/time);

        scrollNav.timer = setInterval(function() {
            let currentDistance = Math.abs(targetPos-window.pageYOffset);

            if(scrollDirection > 0 ) { // 하단 영역으로 스크롤
                if(window.pageYOffset <= targetPos) {
                    if(currentDistance < speed) {
                        scrollTo(0, targetPos);
                        clearInterval(scrollNav.timer);
                        scrollNav.timer = null;
                    } else {
                        window.scrollBy(0, speed);
                    }
                } else {
                    clearInterval(scrollNav.timer);
                    scrollNav.timer = null;
                }
            } else {
                if(window.pageYOffset >= targetPos) {
                    if(currentDistance < speed) {
                        scrollTo(0, targetPos);
                        clearInterval(scrollNav.timer);
                        scrollNav.timer = null;
                    } else {
                        window.scrollBy(0, -speed);
                    }
                } else {
                    clearInterval(scrollNav.timer);
                    scrollNav.timer = null;
                }
            }
        }, time);  
    }

    function setScrollNavDots(targetDot) {
        if(scrollNav.timer) {
            return 0;
        }

        scrollNav.style.opacity = 1;

        const gnb = document.querySelector('.header__gnb');
        const targetIdx = parseInt(targetDot.dataset.idx);

        if(targetDot.tagName === 'A') {
            if(targetIdx % 2 > 0) {
                scrollNav.classList.add('scrollnav--color-bk');
                gnb.classList.add('gnb--color-bk');
            } else {
                scrollNav.classList.remove('scrollnav--color-bk');
                gnb.classList.remove('gnb--color-bk');
            }

            if(targetDot.classList.contains('active')) {
                // 현재 상태 유지
            } else {
                let dots = scrollNavList.getElementsByClassName('scrollnav__link');
                [].forEach.call(dots, function(elem){
                    if(elem.classList.contains('active')) {
                        elem.classList.remove('active');
                    }
                });
                targetDot.classList.add('active');
                scrollToSection(targetIdx);
            }
        }
    }

    function scrollToBottom() {
        scrollNav.style.opacity = 0;
        scrollNav.timer = setInterval(function(){
            let scrollHeight = Math.max(document.body.scrollHeight, document.querySelector('html').scrollHeight),
                pos = scrollHeight - window.pageYOffset;

            if(pos === window.innerHeight) {
                clearInterval(scrollNav.timer);
                scrollNav.timer = null;
            } else {
                window.scrollBy(0, 15);
            }
        }, 15);
    }
}());

(function mainSlideFunc(){
   //main slide
    const mainSlides = mainSlider.getElementsByClassName('main__slide'),
          mainSlidePage = mainSlideshow.querySelector('.main__num'),
          mainSlideBtn = mainSlideshow.querySelector('.main__slide-btn'),
          slideLength = mainSlides.length;
    let currentSlide = 1;
    
    mainSlideBtn.addEventListener('click', handlemainSlide);

    mainSlider.autoSlide = function() {
        this.timer = setInterval(function() {
            goToSlide(1);
        }, 4000);
    }; 
    
    function initSlide(slides) {
        [].forEach.call(slides, function(elem){
            elem.classList.remove('active');
            elem.style.zIndex = 0;
            elem.querySelector('.main__bg').style.animationName = null;
            elem.querySelector('.main__item').classList.remove('img-ani');
        });

        slides[currentSlide-1].style.zIndex = 1; // 현재 슬라이드 최상위로
    }
    
    function handlemainSlide(e) { // 컨트롤 버튼 클릭시
        e.preventDefault();
        let btn = e.target.parentNode;

        clearInterval(mainSlider.timer);
        mainSlider.timer = null;

        if(btn.classList.contains('prev')) {
            goToSlide(-1);
        } else {
            goToSlide(1);
        }
    }

    function goToSlide(value) {
        initSlide(mainSlides);

        let animationName = null;

        if(value > 0) { // 다음 슬라이드로
            if(currentSlide === slideLength) {
                currentSlide = 1;
            } else {
                ++currentSlide;
            }
            animationName = 'slideToTop';
        } else { // 이전 슬라이드로
            if(currentSlide === 1) {
                currentSlide = slideLength;
            } else {
                --currentSlide;
            }
            animationName = 'slideToBottom';
        }

        let target = mainSlides[currentSlide-1];
        target.style.zIndex = 2;
        target.classList.add('active');

        let targetBg = target.querySelector('.main__bg');
        targetBg.style.animationName = animationName;

        let targetImg = target.querySelector('.main__item');
        targetImg.classList.add('img-ani');

        setSlidePage();
        if(!mainSlider.timer) {
            mainSlider.autoSlide();
        }
    }

    function setSlidePage() {
        mainSlidePage.innerHTML = '0' + currentSlide;
    }    
}());

let setMobileSlide = function mobileSlideFunc() {
    // 기초 설정
    let mobileSlider = mainSlider.cloneNode(true),
        mobileSlides = mobileSlider.querySelectorAll('li'),
        mobileSlidesLength = mobileSlider.childElementCount,
        mobileSlideBtn = mainSlideshow.querySelector('.main__mo-slide-btn'),
        currentPage = 1;

    // 무한반복 슬라이드를 위한 복제
    let firstSlide = mobileSlides[0].cloneNode(true),
        lastSlide = mobileSlider.lastElementChild.cloneNode(true);

    [].forEach.call(mobileSlides, function(elem, idx){ // left 값 설정
        elem.style.left = 100 * idx + '%';
    });
    firstSlide.style.left = 100 * mobileSlidesLength + '%';
    lastSlide.style.left = '-100%';

    // DOM 추가
    mobileSlider.appendChild(firstSlide);
    mobileSlider.insertBefore(lastSlide, mobileSlider.firstElementChild);
    mainSlider.parentElement.insertBefore(mobileSlider, mainSlider);

    mobileSlides = mobileSlider.querySelectorAll('li'); // 복제 슬라이드 포함
    mobileSlider.className = 'main__mo-slider';

    setSlideSize(mobileSlider);

    window.addEventListener('resize', function(){
        setSlideSize(mobileSlider);
    });
    mobileSlideBtn.addEventListener('click', handleMobileSlide);

    mobileSlider.autoSlide = function() {
        this.timer = setInterval(function(){
            goToMobileSlide(currentPage + 1);
        }, 4000);
    };
    mobileSlider.autoSlide();

    makeSlidePager();

    mainMobileSlider = mobileSlider;
    
    function initSlide() {
        [].forEach.call(mobileSlides, function(elem){
            elem.classList.remove('active');
//            elem.style.zIndex = 0;
            elem.querySelector('.main__bg').style.animationName = null;
            elem.querySelector('.main__item').classList.remove('img-ani');
        });
    }

    function makeSlidePager() {
        let container = mainSlideshow.querySelector('.main__mo-pages');

        for(let i=0; i<mobileSlidesLength; i++) {
            let btn = document.createElement('button');
            btn.setAttribute('data-idx', i+1);
            btn.innerHTML = i+1;
            btn.className = 'main__mo-page';
            if(i===0) {
                btn.classList.add('active');
            }
            container.appendChild(btn);
        }

        container.addEventListener('click', function(e){
            let idx = parseInt(e.target.dataset.idx);
            goToMobileSlide(idx);
        });
    }

    function setSlideSize(slider) {
        let img = slider.querySelectorAll('img'),
            height = null,
            display = window.getComputedStyle(slider).display;

        if(display === 'none') {
            [].forEach.call(img, function(elem){
                if(height < elem.naturalHeight) {
                    height = elem.naturalHeight;
                }
            });
        } else {
            [].forEach.call(img, function(elem){
                if(height < elem.offsetHeight) {
                    height = elem.offsetHeight;
                }
            });
        }       
        slider.style.height = 100 + height + 'px';
    }

    function handleMobileSlide(e) { // 슬라이드 버튼 컨트롤    
        let btn = e.target;
        if(btn.classList.contains('prev') || btn.parentElement.classList.contains('prev')) {
            goToMobileSlide(currentPage - 1);
        } else {
            goToMobileSlide(currentPage + 1);
        }
    }

    function goToMobileSlide(page) {
        clearInterval(mobileSlider.timer);
        mobileSlider.timer = null;

        initSlide();

//        let currentPage = page;    
        let nextLeft = (page - 1) * -100,
            lastLeft = (mobileSlidesLength - 1) * -100;
        mobileSlider.style.transition = 'transform 0.5s';
        mobileSlider.style.transform = 'translateX('+nextLeft+'%)';

        if(page > mobileSlidesLength) {
            // 첫 슬라이드로 이동
            setTimeout(function(){
                mobileSlider.style.transition = 'none';
                mobileSlider.style.transform = 'translateX(0)';
            }, 500);
            page = 1;
        } else if(page <= 0) {
            // 마지막 슬라이드로 이동
            setTimeout(function(){
                mobileSlider.style.transition = 'none';
                mobileSlider.style.transform = 'translateX('+lastLeft+'%)';
            }, 500);
            page = mobileSlidesLength;
        }

        mobileSlides[page].classList.add('active');
        mobileSlides[page].querySelector('.main__item').classList.add('img-ani');
        currentPage = page;
        
        setMoblieSlidePage();

        if(!mobileSlider.timer) {
            mobileSlider.autoSlide();
        }
    }

    function setMoblieSlidePage() {
        let pages = document.querySelectorAll('.main__mo-page');
        [].forEach.call(pages, function(elem) {
           if(elem.classList.contains('active')) {
               elem.classList.remove('active');
           } 
        });
        pages[currentPage-1].classList.add('active');
    }
};

// glider.js - 메뉴 모바일 슬라이드
function createGlider() {
    new Glider(document.querySelector('.menu__mo-slider'), {
        slidesToShow: 1,
        dots: document.querySelector('.menu__mo-page'),
//        draggable: (Modernizr.touch) ? true : false,
        scrollLock: true,
        scrollLockDelay: 0,
        duration: 2
    });
}

(function menuSlideFunc(){ // 메뉴 PC 슬라이드
    const menuSlider = document.querySelector('.menu__slider'),
          menuSlideBtn = document.querySelector('.menu__btn');
    menuSlideBtn.addEventListener('click', handleMenuSlide);

    function handleMenuSlide() {
        if(this.classList.contains('next')) {
            menuSlider.style.left = '-100%';
        } else {
            menuSlider.style.left = 0;
        }
        this.classList.toggle('next');
    }
}());

// 메뉴 hover effect
(function menuHoverFunc() {
    const menuImg = document.getElementsByClassName('menu__img-box');
    
    [].forEach.call(menuImg, function(elem){
        elem.addEventListener('mouseenter', moveMenuImg);
    });
    
    function moveMenuImg(e) {
        let width = this.offsetWidth,
            height = this.offsetHeight,
            rangeWidth = Math.floor(width / 3),
            rangeHeight = Math.floor(height / 3),
            x = e.offsetX,
            y = e.offsetY;

        if(x <= rangeWidth) { // 왼쪽
            if(y <= rangeHeight) { // ↘ 방향
                this.style.transform = 'translate(10px, 10px)';
                console.log('↘');
            } else if(rangeHeight < y && y < 2 * rangeHeight) { // → 방향
                this.style.transform = 'translate(20px, 0)';
                console.log('→');
            } else if(2 * rangeHeight <= y && y <= height) { // ↗ 방향
                this.style.transform = 'translate(-10px, -10px)';
                console.log('↗');
            }
        } else if(rangeWidth < x && x <= 2 * rangeWidth) { // 가운데
            if(y <= rangeHeight) { // ↓ 방향
                this.style.transform = 'translate(0, 20px)';
                console.log('↓');
            } else if(2 * rangeHeight <= y && y <= height) { // ↑ 방향
                this.style.transform = 'translate(0, -20px)';
                console.log('↑');
            }
        } else if(2 * rangeWidth < x && x <= width) { // 오른쪽
            if(y <= rangeHeight) { // ↙ 방향
                this.style.transform = 'translate(-10px, 10px)';
                console.log('↙');
            } else if(rangeHeight < y && y < 2 * rangeHeight) { // ← 방향
                this.style.transform = 'translate(-20px, 0)';
                console.log('←');
            } else if(2 * rangeHeight <= y && y <= height) { // ↖ 방향
                this.style.transform = 'translate(-10px, -10px)';
                console.log('↖');
            }
        }
    }
}());
