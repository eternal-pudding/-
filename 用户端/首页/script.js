document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkLoginStatus();

    // Hero Section Carousel
    const heroSlides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentHeroSlide = 0;

    function showHeroSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
                dots[i].classList.add('active');
            }
        });
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
    }

    // 自动轮播
    let autoPlayInterval = setInterval(nextHeroSlide, 5000);

    // 点击圆点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentHeroSlide = index;
            showHeroSlide(currentHeroSlide);
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextHeroSlide, 5000);
        });
    });

    // 点击按钮切换
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevHeroSlide();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextHeroSlide, 5000);
        });

        nextBtn.addEventListener('click', () => {
            nextHeroSlide();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextHeroSlide, 5000);
        });
    }

    // 新闻卡片点击效果
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('新闻卡片被点击');
        });
    });

    // 手语翻译功能按钮点击效果
    const featureCard = document.querySelector('.feature-card');
    const featureBtn = document.querySelector('.feature-btn');
    
    if (featureCard) {
        featureCard.addEventListener('click', () => {
            console.log('手语翻译功能被点击');
        });
    }

    // 退出登录
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 清除登录信息
            localStorage.removeItem('loginInfo');
            sessionStorage.removeItem('loginInfo');
            // 刷新页面
            window.location.reload();
        });
    }
});

// 从localStorage获取用户资料
function getUserProfile() {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : null;
}

// 检查登录状态
function checkLoginStatus() {
    const loginInfo = localStorage.getItem('loginInfo') || sessionStorage.getItem('loginInfo');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    if (loginInfo) {
        const info = JSON.parse(loginInfo);
        if (info.isLoggedIn) {
            // 已登录，隐藏登录按钮
            if (loginBtn) loginBtn.style.display = 'none';
            // 显示用户信息
            if (userInfo) {
                userInfo.style.display = 'flex';
                // 优先使用个人资料中的昵称或姓名
                let displayName = '';
                const profile = getUserProfile();
                if (profile && profile.nickname) {
                    displayName = profile.nickname;
                } else if (profile && profile.name) {
                    displayName = profile.name;
                } else if (info.userName) {
                    displayName = info.userName;
                } else {
                    displayName = info.account;
                }
                userName.textContent = `欢迎，${displayName}`;
            }
        }
    } else {
        // 未登录，显示登录按钮
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}
