const hamBtn = document.getElementById('ham'),
      fullNav = document.getElementById('fullNav'),
      moreBtnIcon = document.getElementsByClassName('more-btn__icon'),
      communityImg = document.getElementsByClassName('community__bg');

//visual slide
const visualSlide = document.getElementById('visualSlide'),
      visualSlider = visualSlide.querySelector('.visual__slider'),
      visualSlides = visualSlider.getElementsByClassName('visual__slide'),
      visualSlidePage = visualSlide.querySelector('.visual__num'),
      visualSlideBtn = visualSlide.querySelector('.visual__slide-btn'),
      slideLength = visualSlides.length;
let currentSlide = 1;

//menu slide
const menuSlider = document.querySelector('.menu__slider'),
      menuSlideBtn = document.getElementById('menuBtn');
      

const mobile = 767;
let device = undefined;

(function init() {
    window.addEventListener('load', createGlider);
    window.addEventListener('resize', changeToImg);
    hamBtn.addEventListener('click', handleFullNav);
//    window.dispatchEvent(new Event('resize')); //페이지 로드 시
    visualSlideBtn.addEventListener('click', handleVisualSlide);
    menuSlideBtn.addEventListener('click', handleMenuSlide);
    
    changeToImg(); //페이지 로드 시
}());

(function checkPlatform() {
    let filter = 'win16|win32|win64|mac|macintel',
        userPlatform = navigator.platform.toLowerCase();
    if(filter.indexOf(userPlatform) >= 0){
        device = 'pc';
    } else {
        device = 'mobile';
    }
    document.body.classList.add(device);
}());

//function includeJs(jsFilePath) {
//    let js = document.createElement('script');
//    
//    js.type = "text/javascript";
//    js.src = jsFilePath;
//    
//    document.body.appendChild(js);
//}

function createGlider() {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 1,
        dots: document.querySelector('#menuSlidePage'),
        draggable: (device==='mobile') ? true : false,
        arrows: {
//          prev: '.glider-prev',
//          next: '.glider-next'
        },
        duration: 2
  });
}

function handleFullNav(e) {
    e.preventDefault();
    this.classList.toggle('active');
    fullNav.classList.toggle('show');
}

[].forEach.call(moreBtnIcon, function(elem){
    elem.addEventListener('mouseenter', scaleUpAni);
    elem.addEventListener('mouseout', scaleDownAni)
});

function scaleUpAni(e) {
    this.style.animationName = 'btnScaleUp';
}

function scaleDownAni(e) {
    this.style.animationName = 'btnScaleDown';
}

function changeToImg() { //창 크기에 따라 이미지 변경
    //커뮤니티 영역
    [].forEach.call(communityImg, function(elem, idx){
        let name = elem.dataset.name,
            newSrc = null;

        if(window.innerWidth <= mobile) {
            newSrc = 'images/main/bg_'+name+'_mo.jpg';
        } else {
            newSrc = 'images/main/bg_'+name+'.jpg';
        }
        elem.setAttribute('src', newSrc);
    });
    
    //프랜차이즈 영역
    const franchiseImg = document.querySelector('.franchise__img');
    if(window.innerWidth <= mobile) {
        franchiseImg.setAttribute('src', 'images/main/img_franchise_mo.jpg');
    } else {
        franchiseImg.setAttribute('src', 'images/main/img_franchise.jpg');
    }
}

//visual slide
function handleVisualSlide(e) {
    e.preventDefault();
    let btn = e.target.parentNode;
    
    initSlide();
    if(btn.classList.contains('--prev')) {
        goToSlide(-1);
    } else {
        goToSlide(1);
    }
    setSlidePage();
}

function initSlide() {
    [].forEach.call(visualSlides, function(elem){
        elem.classList.remove('active');
        elem.style.zIndex = 0;
        elem.querySelector('.visual__bg').style.animationName = null;
        elem.querySelector('.visual__item').classList.remove('img-ani');
    });
    
    visualSlides[currentSlide-1].style.zIndex = 1; //현재 슬라이드 최상위로
}

function goToSlide(value) {
    let animationName = null;
    
    if(value > 0) { //다음 슬라이드로
        if(currentSlide === slideLength) {
            currentSlide = 1;
        } else {
            ++currentSlide;
        }
        animationName = 'slideToTop';
    } else { //이전 슬라이드로
        if(currentSlide === 1) {
            currentSlide = slideLength;
        } else {
            --currentSlide;
        }
        animationName = 'slideToBottom';
    }
    
    let target = visualSlides[currentSlide-1];
    target.style.zIndex = 2;
    target.classList.add('active');
    
    let targetBg = target.querySelector('.visual__bg');
    targetBg.style.animationName = animationName;
    
    let targetImg = target.querySelector('.visual__item');
    targetImg.classList.add('img-ani');
}

function setSlidePage() {
    visualSlidePage.innerHTML = '0' + currentSlide;
}

//function setAnimation(elem, name) {
//    elem.style.animationName = name;
//}

//menu slide
function handleMenuSlide() {
    if(this.classList.contains('next')) {
        menuSlider.style.left = '-100%';
    } else {
        menuSlider.style.left = 0;
    }
    this.classList.toggle('next');
}