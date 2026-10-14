document.addEventListener('DOMContentLoaded', () => {
    // 标签切换功能
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            // 移除所有active类
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 添加active类到当前选中的标签
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 获取验证码按钮倒计时
    const getCodeBtns = document.querySelectorAll('.get-code-btn');
    getCodeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let countdown = 60;
            btn.disabled = true;
            btn.textContent = `${countdown}s后重试`;

            const timer = setInterval(() => {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.textContent = '获取验证码';
                } else {
                    btn.textContent = `${countdown}s后重试`;
                }
            }, 1000);
        });
    });

    // 背景轮播
    const bgSlides = document.querySelectorAll('.bg-slide');
    let currentSlide = 0;

    function showSlide(index) {
        bgSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % bgSlides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000);

    // 获取当前选择的身份
    function getSelectedRole() {
        const roleInput = document.querySelector('input[name="role"]:checked');
        return roleInput ? roleInput.value : 'jobseeker';
    }

    // 检查HR是否是首次登录（没有完善资料）
    function isHRFirstLogin() {
        // 检查localStorage中是否有HR资料
        const hrProfile = localStorage.getItem('hrProfile');
        const hrCompanyProfile = localStorage.getItem('hrCompanyProfile');
        
        // 如果没有HR资料或企业资料，认为是首次登录
        if (!hrProfile || !hrCompanyProfile) return true;
        
        try {
            const profile = JSON.parse(hrProfile);
            const company = JSON.parse(hrCompanyProfile);
            // 检查是否有基本的HR资料字段（如姓名）和企业名称
            return !profile.name || !company.name;
        } catch (e) {
            return true;
        }
    }

    // 根据身份获取跳转地址
    function getRedirectUrl(role) {
        if (role === 'hr') {
            // HR首次登录（未完善资料）→ 个人主页，弹出编辑资料
            // HR非首次登录（已完善资料）→ 直接跳转首页
            if (isHRFirstLogin()) {
                console.log('HR首次登录，跳转到个人主页完善资料');
                return '../../HR端/个人主页/个人主页.html?fromLogin=true&role=hr&firstTime=true';
            } else {
                console.log('HR非首次登录，跳转到首页');
                return '../../HR端/首页/index.html';
            }
        } else if (role === 'volunteer') {
            return '../../志愿者端/个人主页/个人主页.html';
        } else {
            return '../个人主页/个人主页.html';
        }
    }

    // 密码登录表单提交
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(passwordForm);
            const account = formData.get('account');
            const password = formData.get('password');
            const remember = formData.get('remember') === 'on';
            const role = getSelectedRole();
            
            // 模拟登录验证
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.phone === account || u.email === account);
            
            // 保存登录信息
            const loginInfo = {
                account: account,
                userName: user ? user.name : null,
                loginType: 'password',
                role: role,
                loginTime: new Date().toISOString(),
                isLoggedIn: true
            };
            
            if (remember) {
                localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            } else {
                sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            }
            
            // 根据身份跳转
            alert('登录成功！');
            const redirectUrl = getRedirectUrl(role);
            console.log('跳转地址:', redirectUrl);
            window.location.href = redirectUrl;
        });
    }

    // 短信登录表单提交
    const smsForm = document.getElementById('smsForm');
    if (smsForm) {
        smsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(smsForm);
            const phone = formData.get('phone');
            const code = formData.get('code');
            const remember = formData.get('remember') === 'on';
            const role = getSelectedRole();
            
            // 模拟登录验证
            // 这里可以添加实际的登录验证逻辑
            
            // 尝试从用户数据中获取用户名
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.phone === phone);
            
            // 保存登录信息
            const loginInfo = {
                account: phone,
                userName: user ? user.name : null,
                loginType: 'sms',
                role: role,
                loginTime: new Date().toISOString(),
                isLoggedIn: true
            };
            
            if (remember) {
                localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            } else {
                sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            }
            
            // 根据身份跳转
            alert('登录成功！');
            const redirectUrl = getRedirectUrl(role);
            console.log('跳转地址:', redirectUrl);
            window.location.href = redirectUrl;
        });
    }

    // 检查是否已登录
    const loginInfo = localStorage.getItem('loginInfo') || sessionStorage.getItem('loginInfo');
    if (loginInfo) {
        const info = JSON.parse(loginInfo);
        if (info.isLoggedIn) {
            // 已登录，可以显示用户信息或自动跳转
            console.log('用户已登录:', info.account);
        }
    }
});
