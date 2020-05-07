//0506-20:19

const mobile = 1024;
let mql = window.matchMedia('(max-width:' + mobile + 'px)');

window.onload = function() {
    setTimeout(function(){
        window.scrollTo(0, 0);
    }, 0);
    
    $('.menu__mo-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });
    $('.slick-dots button').addClass('slick-dot');
};

// 모바일 뷰포트 높이
//(function checkMobileVh(){
//    mql.addListener(setContainerHeight);
//    setContainerHeight(mql);
//    
//    function setContainerHeight(e) {
//        if(!e.matches && Modernizr.touch) {
//            let container = document.getElementsByClassName('container'),
//                vh = window.innerHeight;
//            
//            console.log(window.innerHeight, window.screen.height);
//            
//            [].forEach.call(container, function(elem){
//                elem.style.height = vh + 'px';
//            });
//        }
//    }
//}());


// 팝업
(function checkPopupCookie(){
    const popup = document.querySelector('.popup');
    
    if(document.cookie.indexOf('todayClose') > -1) { // 팝업 오늘 안보기
        popup.style.display = 'none';
    } else {
        showPopup();
    }
    
    // 팝업 보이기
    function showPopup() {
        const popupCloseBtn = document.querySelector('.popup__close'),
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
    }
}());

// 스크롤
(function scrollFunc(){
    const gnb = document.querySelector('.header__gnb');
    const scrollNav = document.querySelector('.scrollnav'),
          scrollNavList = scrollNav.querySelector('.scrollnav__list'),
          dots = scrollNav.getElementsByClassName('scrollnav__link'),
          scrollPage = document.querySelector('.scrollpage'),
          pages = scrollPage.getElementsByClassName('page');
    let scrollIdx = 0;
    
    // 반응형 이벤트
    mql.addListener(responsiveScrollFunc);
    responsiveScrollFunc(mql);
    function responsiveScrollFunc(e) {
        if(e.matches) {
            initForMobile();
            window.removeEventListener('wheel', handleWheelEvent);
            window.removeEventListener('resize', rescrollPage);
        } else {
            if(Modernizr.touch) {
                window.removeEventListener('wheel', handleWheelEvent);
                window.removeEventListener('resize', rescrollPage);
                document.body.style.overflowY = 'scroll';
                scrollNav.style.display = 'none';
            } else {
                window.addEventListener('wheel', handleWheelEvent);
                window.addEventListener('resize', rescrollPage);
            }
            initForPC();
        }
        scrollNavList.addEventListener('click', handleScrollPage);
    }
       
    function initForMobile() { // 문서 위치 설정
        scrollPage.classList.remove('scroll-ani');
        scrollPage.style.transform = 'translate3d(0,0,0)';
        
        if(scrollIdx >= pages.length) {
            let docHeight = Math.max(document.body.scrollHeight, document.querySelector('html').scrollHeight),
                bottom = docHeight - window.innerHeight;
            window.scrollTo(0, bottom);
        } else {
            window.scrollTo(0, pages[scrollIdx].offsetTop);
        }
    }
    
    function initForPC() { // 문서 위치 설정
        scrollPage.classList.remove('scroll-ani');
        window.scrollTo(0,0);
    }
    
    function rescrollPage(e) {
        scrollPage.classList.remove('scroll-ani');
        if(scrollIdx === pages.length) {
            scrollToBottom();
        } else {
            pageScroll();
        }
    }
    
    function handleWheelEvent(e) {
        if((e.deltaY <= 0 && scrollIdx === 0) || e.deltaY > 0 && scrollIdx >= pages.length) {
            return 0;
        }
        
        if(e.deltaY > 0) {
            if(scrollIdx === pages.length-1) {
//                scrollIdx++;
//                scrollNav.style.opacity = '0';
                scrollToBottom();
                return 0;
            }
            scrollIdx++;
        } else {
            scrollIdx--;
        }
        setScrollState(dots[scrollIdx]);

        window.removeEventListener('wheel', handleWheelEvent);
        setTimeout(function(){
            window.addEventListener('wheel', handleWheelEvent);
        }, 500);
    }
    
    function scrollToBottom() {
        let bottom = scrollPage.scrollHeight - window.innerHeight;
        
        scrollIdx++;
        scrollNav.style.opacity = '0';
        scrollPage.style.transform = 'translate3d(0,' + -bottom + 'px, 0)';
    }
    
    function handleScrollPage(e) { // 스크롤 내비게이션 클릭 이벤트
        e.preventDefault();
        setScrollState(e.target);
    }
    
    function setScrollState(targetDot) { // 스크롤 네비게이션, GNB 테마 설정
        //scrollNav.style.opacity = 1;
        scrollIdx = parseInt(targetDot.dataset.idx);
        
        if(targetDot.tagName === 'A') {
            if(scrollIdx % 2 > 0) {
                scrollNav.classList.add('scrollnav--color-bk');
                gnb.classList.add('gnb--color-bk');
            } else {
                scrollNav.classList.remove('scrollnav--color-bk');
                gnb.classList.remove('gnb--color-bk');
            }

            scrollPage.classList.add('scroll-ani');
            if(targetDot.classList.contains('active')) {
                if(scrollNav.style.opacity === '0') {
                    scrollNav.style.opacity = '1';
                    pageScroll();
                }
            } else {
                [].forEach.call(dots, function(elem){
                    if(elem.classList.contains('active')) {
                        elem.classList.remove('active');
                    }
                });
                targetDot.classList.add('active');
                pageScroll();
            }
        }
    }
    
    function pageScroll() { // 페이지 스크롤
        let scrollTarget = pages[scrollIdx],
            scrollY = scrollTarget.offsetTop;

        scrollPage.style.transform = 'translate3d(0,' + -scrollY + 'px, 0)';
    }
}());

// 풀내비게이션
(function setFullNav(){
   const hamBtn = document.getElementById('ham'),
         fullNav = document.getElementById('fullNav'),
         fullNavMenu = fullNav.querySelector('.fullnav__menu');
    
    hamBtn.addEventListener('click', handleFullNav);
    fullNavMenu.addEventListener('click', handleFullNavMenuList);
    
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
}());

// 메인 슬라이드
(function mainSlideFunc(){
    const mainSlideshow = document.querySelector('.main__slideshow'),
          mainSlider = mainSlideshow.querySelector('.main__slider'),
          mainSlides = mainSlider.getElementsByClassName('main__slide'),
          mainSlidePage = mainSlideshow.querySelector('.main__num'),
          mainSlideBtn = mainSlideshow.querySelector('.main__slide-btn'),
          slideLength = mainSlides.length;
    let currentSlide = 1;
    let mainMobileSlider = null;
    
    mainSlider.autoSlide = function() {
        this.timer = setInterval(function() {
            goToSlide(1);
        }, 4000);
    };
    mainSlideBtn.addEventListener('click', handleMainSlide);
    
    mql.addListener(responsiveMainSlide);
    responsiveMainSlide(mql);
    function responsiveMainSlide(e) {
        if(e.matches) {
            if(!mainMobileSlider) { // 모바일 슬라이드 생성
                createMobileSlide();
            } else if(!mainMobileSlider.timer) { // 모바일 타이머 생성
                mainMobileSlider.autoSlide();
            }
            if (mainSlider && mainSlider.timer) { // PC 타이머 제거
                initSlideTimer(mainSlider);
            }
        } else {
            if (!mainSlider.timer) { // PC 타이머 생성
                mainSlider.autoSlide();
            } 
            if (mainMobileSlider && mainMobileSlider.timer) { // 모바일 타이머 제거
                initSlideTimer(mainMobileSlider);
            }
        }
    }
    
    function initSlideTimer(slider) {
        clearInterval(slider.timer);
        slider.timer = null;
    }

    function initSlide(slides) {
        [].forEach.call(slides, function(elem){
            elem.classList.remove('active');
            elem.style.zIndex = 0;
            elem.querySelector('.main__bg').style.animationName = null;
            elem.querySelector('.main__item').classList.remove('img-ani');
        });

        slides[currentSlide-1].style.zIndex = 1; // 현재 슬라이드 최상위로
    }
    
    function handleMainSlide(e) { // 컨트롤 버튼 클릭시
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
    
    /*****************************************************************/
    // 메인 모바일 슬라이드
    if(Modernizr.touch && !mainMobileSlider) {
        createMobileSlide();
    }
    
    function createMobileSlide() {
        let mobileSlider = mainSlider.cloneNode(true),
            mobileSlides = mobileSlider.querySelectorAll('li'),
            mobileSlidesLength = mobileSlider.childElementCount,
            mobileSlideBtn = mainSlideshow.querySelector('.main__mo-slide-btn'),
            currentPage = 1;

        createInfiniteSlide();
        setSlideHeight();
        window.addEventListener('resize', function(){
            setSlideHeight();
        });
        makeSlidePager();
        mobileSlideBtn.addEventListener('click', handleMobileSlide);

        mobileSlider.autoSlide = function() {
            this.timer = setInterval(function(){
                goToMobileSlide(currentPage + 1);
            }, 4000);
        };
        mobileSlider.autoSlide();
        
        if(Modernizr.touch) {
            setSlideTouchEvent();
        }

        function createInfiniteSlide() {
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
            
            mainMobileSlider = mobileSlider;
        }

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

        function setSlideHeight() {
            let img = mobileSlider.querySelectorAll('img'),
                height = null,
                display = window.getComputedStyle(mobileSlider).display;

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
            mobileSlider.style.height = 100 + height + 'px';
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
        
        function setSlideTouchEvent() {
            mobileSlider.addEventListener('touchstart', handleTouchStart);
            mobileSlider.addEventListener('touchmove', handleTouchMove);
            mobileSlider.addEventListener('touchend', handleTouchEnd);

            let touchStartX, touchMoveX = 0; 

            function handleTouchStart(e) {
                touchStartX = e.touches[0].clientX;
            }

            function handleTouchMove(e) {
                touchMoveX = e.touches[0].clientX;
            }

            function handleTouchEnd(e) {
                let touchX = Math.abs(touchStartX - touchMoveX);

                if(touchX < 100 || !touchMoveX) {
                    return 0;
                }

                if(touchStartX > touchMoveX) { // 다음 슬라이드 이동
                    goToMobileSlide(++currentPage);
                } else if(touchStartX < touchMoveX) { // 이전 슬라이드 이동
                    goToMobileSlide(--currentPage);
                }
                touchStartX, touchMoveX = 0;
            }
        }
    };
}());

// 메뉴 슬라이드
(function menuSlideFunc(){
    const menuSlideshow = document.querySelector('.menu__slideshow'),
          menuSlider = menuSlideshow.querySelector('.menu__slider'),
          menuItem = menuSlider.getElementsByClassName('menu__item'),
          menuImg = document.getElementsByClassName('menu__img-box'),
          menuSlideBtn = document.querySelector('.menu__btn');
    
    menuSlideBtn.addEventListener('click', handleMenuSlide);
    window.addEventListener('resize', function(e){
        setSlideHeight();
    });
    
    // 슬라이드 높이 설정
    function setSlideHeight() {
        let height = 0;
        [].forEach.call(menuItem, function(elem){
            if(elem.offsetHeight > height) {
                height = elem.offsetHeight;
            }
        });
        menuSlideshow.style.height = height + 'px';
        menuSlider.style.height = height + 'px';
    }
    setSlideHeight();
    
    // 슬라이드 버튼
    function handleMenuSlide(e) {
        if(this.classList.contains('next')) {
            menuSlider.style.left = '-100%';
        } else {
            menuSlider.style.left = 0;
        }
        this.classList.toggle('next');
    }
    
    // 마우스오버 효과
    [].forEach.call(menuImg, function(elem){
        elem.addEventListener('mouseenter', movingMenuImg);
    });
    
    // 메뉴 이미지 마우스 오버 움직임
    function movingMenuImg(e) {
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

// 더보기 아이콘 애니메이션
(function btnAniFunc(){
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

// 맨위로 버튼
(function scrollToTopFunc(num){
    mql.addListener(setScrollToTopBtn);
    setScrollToTopBtn(mql);

    function setScrollToTopBtn(e) {
        const topBtn = document.querySelector('.scroll-to-top');
        if(e.matches) {
            window.addEventListener('scroll', showScrollToTopBtn);
        } else {
            topBtn.classList.remove('show');
            window.removeEventListener('scroll', showScrollToTopBtn);
        }
    }
    
    function showScrollToTopBtn(e) {
        const topBtn = document.querySelector('.scroll-to-top'),
              display = window.getComputedStyle(topBtn).display;
        
        topBtn.addEventListener('click', scrollToTop);

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
    
    let timer = null;
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