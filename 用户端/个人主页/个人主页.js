document.addEventListener('DOMContentLoaded', function() {
    const statusItems = document.querySelectorAll('.status-item');
    const jobLists = document.querySelectorAll('.job-list');
    const toast = document.getElementById('toast-notification');
    const header = document.getElementById('header');
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const avatarInput = document.getElementById('avatar-input');
    const avatarImg = document.getElementById('profile-avatar');

    // 根据名字生成头像颜色
    function generateAvatarColor(name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B500', '#6C5CE7', '#A29BFE', '#74B9FF', '#00B894'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    // 获取显示名称的首字母
    function getInitials(name) {
        if (!name) return '?';
        return name.slice(-2);
    }

    // 初始化头像（从localStorage加载）
    function initAvatar() {
        const savedAvatar = localStorage.getItem('userAvatar');
        const profile = getProfile();
        const avatarImg = document.getElementById('profile-avatar');
        const generatedAvatar = document.getElementById('generated-avatar-large');
        const placeholder = document.getElementById('avatar-placeholder');
        
        if (savedAvatar) {
            // 有上传的头像
            avatarImg.src = savedAvatar;
            avatarImg.style.display = 'block';
            if (generatedAvatar) generatedAvatar.style.display = 'none';
            if (placeholder) placeholder.style.display = 'none';
        } else if (profile && (profile.nickname || profile.name)) {
            // 有资料但没上传头像，显示生成头像
            const displayName = profile.nickname || profile.name;
            if (generatedAvatar) {
                generatedAvatar.textContent = getInitials(displayName);
                generatedAvatar.style.backgroundColor = generateAvatarColor(displayName);
                generatedAvatar.style.display = 'flex';
            }
            avatarImg.style.display = 'none';
            if (placeholder) placeholder.style.display = 'none';
        } else {
            // 无资料，显示占位符
            if (placeholder) placeholder.style.display = 'flex';
            avatarImg.style.display = 'none';
            if (generatedAvatar) generatedAvatar.style.display = 'none';
        }
    }

    // 头像上传功能
    if (avatarWrapper && avatarInput) {
        avatarWrapper.addEventListener('click', function() {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 验证文件类型
                if (!file.type.startsWith('image/')) {
                    showToast('请选择图片文件');
                    return;
                }
                // 验证文件大小（限制为5MB）
                if (file.size > 5 * 1024 * 1024) {
                    showToast('图片大小不能超过5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    const avatarImg = document.getElementById('profile-avatar');
                    const generatedAvatar = document.getElementById('generated-avatar-large');
                    const placeholder = document.getElementById('avatar-placeholder');
                    
                    avatarImg.src = imageUrl;
                    avatarImg.style.display = 'block';
                    if (generatedAvatar) generatedAvatar.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'none';
                    
                    // 保存到localStorage
                    localStorage.setItem('userAvatar', imageUrl);
                    showToast('头像更换成功');
                };
                reader.onerror = function() {
                    showToast('图片读取失败，请重试');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 初始化头像
    initAvatar();

    // Toast logic
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 从localStorage获取感兴趣的职位
    function getInterestedJobs() {
        const stored = localStorage.getItem('interestedJobs');
        return stored ? JSON.parse(stored) : [];
    }

    // 渲染感兴趣的职位列表
    function renderInterestedJobs() {
        const interestedList = document.getElementById('interested');
        const jobs = getInterestedJobs();
        
        if (jobs.length === 0) {
            interestedList.innerHTML = '<p class="empty-state">暂无感兴趣的职位</p>';
            // 更新标签上的数字
            const interestedTab = document.querySelector('[data-tab="interested"] span');
            if (interestedTab) {
                interestedTab.textContent = '0';
            }
            return;
        }
        
        // 更新标签上的数字
        const interestedTab = document.querySelector('[data-tab="interested"] span');
        if (interestedTab) {
            interestedTab.textContent = jobs.length;
        }
        
        // 渲染职位列表
        interestedList.innerHTML = jobs.map(job => `
            <div class="job-item" role="listitem" tabindex="0" data-job-id="${job.id}">
                <div class="job-item-info">
                    <h3>${job.title}</h3>
                    <p class="salary">${job.salary}</p>
                    <p class="tags">${job.tags}</p>
                </div>
                <div class="company-info">
                    <p>${job.company}</p>
                    <p class="tags">${job.companyDesc}</p>
                </div>
            </div>
        `).join('');
        
        // 添加点击事件
        interestedList.querySelectorAll('.job-item').forEach(item => {
            item.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                // 跳转到职位详情页
                window.location.href = `../求职招聘/job-detail.html?id=${jobId}`;
            });
        });
    }

    // 从localStorage获取沟通过的职位
    function getCommunicatedJobs() {
        const stored = localStorage.getItem('communicatedJobs');
        return stored ? JSON.parse(stored) : [];
    }

    // 从localStorage获取已投递的职位
    function getAppliedJobs() {
        const stored = localStorage.getItem('appliedJobs');
        return stored ? JSON.parse(stored) : [];
    }

    // 渲染已投递的职位列表
    function renderAppliedJobs() {
        const appliedList = document.getElementById('applied');
        const jobs = getAppliedJobs();
        
        // 更新标签上的数字
        const appliedTab = document.querySelector('#tab-applied span');
        if (appliedTab) {
            appliedTab.textContent = jobs.length;
        }
        
        if (jobs.length === 0) {
            appliedList.innerHTML = '<p class="empty-state">暂无已投递的职位</p>';
            return;
        }
        
        // 渲染职位列表（简洁格式，类似字节跳动示例）
        appliedList.innerHTML = jobs.map(job => {
            const applyDate = new Date(job.applyTime).toLocaleDateString('zh-CN');
            return `
            <div class="job-item" role="listitem" tabindex="0" data-job-id="${job.id}">
                <div class="job-item-info">
                    <h3>${job.title} <span class="apply-status">${job.status || '投递成功'}</span></h3>
                    <p class="salary">${job.salary}</p>
                    <p class="tags">${job.tags}</p>
                    <p class="apply-time">投递时间: ${applyDate}</p>
                </div>
                <div class="company-info">
                    <p>${job.company}</p>
                    <p class="tags">${job.companyDesc}</p>
                </div>
            </div>
        `}).join('');
        
        // 添加点击事件
        appliedList.querySelectorAll('.job-item').forEach(item => {
            item.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                window.location.href = `../求职招聘/job-detail.html?id=${jobId}`;
            });
        });
    }

    // 从localStorage获取面试列表
    function getInterviewJobs() {
        const stored = localStorage.getItem('interviewJobs');
        return stored ? JSON.parse(stored) : [];
    }

    // 渲染面试列表
    function renderInterviewJobs() {
        const interviewList = document.getElementById('interview');
        const jobs = getInterviewJobs();
        
        if (jobs.length === 0) {
            interviewList.innerHTML = '<p class="empty-state">暂无面试安排</p>';
            // 更新标签上的数字
            const interviewTab = document.querySelector('[data-tab="interview"] span');
            if (interviewTab) {
                interviewTab.textContent = '0';
            }
            return;
        }
        
        // 更新标签上的数字
        const interviewTab = document.querySelector('[data-tab="interview"] span');
        if (interviewTab) {
            interviewTab.textContent = jobs.length;
        }
        
        // 渲染面试列表（带面试信息）
        interviewList.innerHTML = jobs.map(job => {
            const acceptDate = new Date(job.acceptTime).toLocaleDateString('zh-CN');
            return `
            <div class="job-item interview-item" role="listitem" tabindex="0" data-job-id="${job.id}">
                <div class="interview-header">
                    <span class="interview-status">${job.status}</span>
                    <span class="interview-date"><i class="far fa-clock"></i> ${job.interviewDate} ${job.interviewTime}</span>
                </div>
                <div class="job-item-info">
                    <h3>${job.title}</h3>
                    <p class="salary">${job.salary}</p>
                    <p class="tags">${job.tags}</p>
                </div>
                <div class="interview-location">
                    <i class="fas fa-map-marker-alt"></i> ${job.interviewLocation}
                </div>
                <div class="company-info">
                    <p>${job.company}</p>
                    <p class="tags">${job.companyDesc}</p>
                </div>
                <div class="interview-actions">
                    <button class="btn-accept" onclick="viewInterviewDetail(${job.id}, event)">查看详情</button>
                    <span class="accept-time">接受于 ${acceptDate}</span>
                </div>
            </div>
        `}).join('');
        
        // 添加点击事件
        interviewList.querySelectorAll('.interview-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // 如果点击的是按钮，不跳转
                if (e.target.tagName === 'BUTTON') return;
                
                const jobId = this.getAttribute('data-job-id');
                window.location.href = `../求职招聘/job-detail.html?id=${jobId}`;
            });
        });
    }

    // 查看面试详情
    window.viewInterviewDetail = function(jobId, event) {
        event.stopPropagation();
        const interviews = getInterviewJobs();
        const job = interviews.find(j => j.id === jobId);
        if (job) {
            alert(`面试详情：\n\n职位：${job.title}\n公司：${job.company}\n时间：${job.interviewDate} ${job.interviewTime}\n地点：${job.interviewLocation}\n状态：${job.status}`);
        }
    };

    // 渲染沟通过的职位列表
    function renderCommunicatedJobs() {
        const communicatedList = document.getElementById('communicated');
        const jobs = getCommunicatedJobs();
        
        // 更新标签上的数字
        const communicatedTab = document.querySelector('#tab-communicated span');
        if (communicatedTab) {
            communicatedTab.textContent = jobs.length;
        }
        
        if (jobs.length === 0) {
            communicatedList.innerHTML = '<p class="empty-state">暂无沟通过的职位</p>';
            return;
        }
        
        // 渲染职位列表（带招聘官信息格式）
        communicatedList.innerHTML = jobs.map(job => `
            <div class="job-item" role="listitem" tabindex="0" data-job-id="${job.id}">
                <div class="recruiter-info">
                    <img src="${job.recruiterAvatar || 'https://img.bosszhipin.com/beijin/upload/avatar/20210609/d8922c74373c386934f3231f94096cc42569bf6476d1f21550636549e45f988b_s.png'}" alt="招聘官头像">
                    <span>${job.recruiterName || 'HR'}</span>
                    <span class="recruiter-title">${job.recruiterTitle || '招聘经理'}</span>
                </div>
                <div class="job-details-wrapper">
                    <div class="job-item-info">
                        <h3>${job.title}</h3>
                        <p class="salary">${job.salary}</p>
                        <p class="tags">${job.tags}</p>
                    </div>
                    <div class="company-info">
                        <img src="https://img.bosszhipin.com/beijin/mcs/chatphoto/20200810/202a73eda0742d2b63ab76274c45543835a935b38495b428634570621439c635_s.png" alt="公司logo" class="company-logo">
                        <div>
                            <p>${job.company}</p>
                            <p class="tags">${job.companyDesc}</p>
                        </div>
                    </div>
                </div>
                <button class="btn-communicate" onclick="continueCommunication(${job.id}, event)">继续沟通</button>
            </div>
        `).join('');
        
        // 添加点击事件（点击整个卡片跳转到详情页）
        communicatedList.querySelectorAll('.job-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // 如果点击的是"继续沟通"按钮，不跳转
                if (e.target.classList.contains('btn-communicate')) return;
                
                const jobId = this.getAttribute('data-job-id');
                window.location.href = `../求职招聘/job-detail.html?id=${jobId}`;
            });
        });
    }

    // 继续沟通（打开聊天窗口）
    window.continueCommunication = function(jobId, event) {
        event.stopPropagation(); // 阻止冒泡，避免触发卡片点击
        // 跳转到聊天页面
        const chatUrl = encodeURI(`../聊天窗口(新增)/聊天窗口/index.html?jobId=${jobId}`);
        window.location.href = chatUrl;
    };

    // Tab switching logic
    statusItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update tab states
            statusItems.forEach(i => {
                i.classList.remove('active');
                i.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Show corresponding job list
            const tabId = this.getAttribute('data-tab');
            jobLists.forEach(list => {
                if (list.id === tabId) {
                    list.classList.add('active');
                } else {
                    list.classList.remove('active');
                }
            });
            
            // 切换到相应tab时刷新数据
            if (tabId === 'communicated') {
                renderCommunicatedJobs();
            } else if (tabId === 'applied') {
                renderAppliedJobs();
            } else if (tabId === 'interview') {
                renderInterviewJobs();
            } else if (tabId === 'interested') {
                renderInterestedJobs();
            }
            
            const tabText = this.textContent.trim().split(' ')[0];
            showToast(`已切换到 '${tabText}'`);
        });
    });

    // Job item click logic
    function attachJobItemListeners() {
        document.querySelectorAll('.job-item').forEach(item => {
            // Remove existing to avoid duplicates if called multiple times
            item.removeEventListener('click', handleJobItemClick);
            item.addEventListener('click', handleJobItemClick);

            item.removeEventListener('keydown', handleJobKeydown);
            item.addEventListener('keydown', handleJobKeydown);
        });
    }

    function handleJobItemClick() {
        const title = this.querySelector('.job-item-info h3').textContent;
        showToast(`已选择职位: ${title}`);
    }

    function handleJobKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleJobItemClick.call(this);
        }
    }

    attachJobItemListeners();

    // Sticky Header Scroll Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Logic (Intersection Observer)
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 页面加载时渲染所有职位列表
    renderCommunicatedJobs();
    renderAppliedJobs();
    renderInterviewJobs();
    renderInterestedJobs();

    // 初始化个人资料
    initProfile();

    // 加载用户状态和头像
    function loadUserState() {
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const navAvatarLink = document.getElementById('navAvatarLink');
        const navAvatar = document.getElementById('navAvatar');
        const generatedAvatar = document.getElementById('generatedAvatar');

        const loginInfo = localStorage.getItem('loginInfo') || sessionStorage.getItem('loginInfo');

        if (!loginInfo) {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (navAvatarLink) navAvatarLink.style.display = 'none';
            return;
        }

        const info = JSON.parse(loginInfo);
        if (info.isLoggedIn === false) {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (navAvatarLink) navAvatarLink.style.display = 'none';
            return;
        }

        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (navAvatarLink) navAvatarLink.style.display = 'flex';

        let displayName = '';
        const profile = getProfile();
        if (profile && profile.nickname) {
            displayName = profile.nickname;
        } else if (profile && profile.name) {
            displayName = profile.name;
        } else if (info.userName) {
            displayName = info.userName;
        } else {
            displayName = info.account || '用户';
        }

        if (userName) userName.textContent = '欢迎，' + displayName;

        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar && navAvatar) {
            navAvatar.src = storedAvatar;
            navAvatar.style.display = 'block';
            if (generatedAvatar) generatedAvatar.style.display = 'none';
        } else if (generatedAvatar) {
            if (navAvatar) navAvatar.style.display = 'none';
            generatedAvatar.style.display = 'flex';
            generatedAvatar.textContent = getInitials(displayName);
            generatedAvatar.style.backgroundColor = generateAvatarColor(displayName);
        }
    }

    loadUserState();

    // 退出登录
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loginInfo');
        sessionStorage.removeItem('loginInfo');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userAvatar');
        window.location.href = '../登录界面/login.html';
    });
});

// ========== 编辑资料功能 ==========


// 从localStorage获取用户资料
function getProfile() {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : null;
}

// 保存用户资料到localStorage
function saveProfileToStorage(profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
}

// 初始化页面显示
function initProfile() {
    const profile = getProfile();
    if (!profile) {
        // 第一次登录，资料为空，显示空状态并自动弹出编辑框
        updateProfileDisplay(null);
        // 延迟弹出，等待页面加载完成
        setTimeout(() => {
            openEditProfileModal();
        }, 500);
    } else {
        updateProfileDisplay(profile);
    }
}

// 更新页面显示
function updateProfileDisplay(profile) {
    const nicknameEl = document.getElementById('user-nickname');
    const basicInfoEl = document.getElementById('user-basic-info');
    const educationInfoEl = document.getElementById('user-education-info');
    
    if (!profile) {
        // 空状态显示
        nicknameEl.textContent = '请设置昵称';
        nicknameEl.style.color = '#999';
        basicInfoEl.textContent = '请填写年龄、毕业年份、学历';
        basicInfoEl.style.color = '#999';
        educationInfoEl.textContent = '请填写学校、专业、在校时间';
        educationInfoEl.style.color = '#999';
        updateDisabilityTags([]);
    } else {
        // 恢复正常颜色
        nicknameEl.style.color = '';
        basicInfoEl.style.color = '';
        educationInfoEl.style.color = '';
        
        nicknameEl.textContent = profile.nickname || '未设置昵称';
        basicInfoEl.textContent = 
            `${profile.age || '--'}岁 | ${profile.graduateYear === '社招' ? profile.graduateYear : (profile.graduateYear ? profile.graduateYear + '年应届生' : '未设置')}， | ${profile.education || '未设置'}`;
        educationInfoEl.textContent = 
            `${profile.school || '未设置'} · ${profile.major || '未设置'} | ${profile.schoolYears || '未设置'}`;
        
        // 更新残疾类型标签
        updateDisabilityTags(profile.disabilityTypes || []);
    }
}

// 更新残疾类型标签
function updateDisabilityTags(disabilityTypes) {
    const container = document.getElementById('user-disability-types');
    if (!container) return;
    
    if (disabilityTypes.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const iconMap = {
        '视力残疮': 'fa-eye-slash',
        '听力残疮': 'fa-deaf',
        '言语残疮': 'fa-comment-slash',
        '肢体残疮': 'fa-wheelchair',
        '智力残疮': 'fa-brain',
        '精神残疮': 'fa-head-side-virus',
        '多重残疮': 'fa-layer-group'
    };
    
    container.innerHTML = disabilityTypes.map(type => `
        <span class="disability-tag">
            <i class="fas ${iconMap[type] || 'fa-wheelchair'}"></i>
            ${type}
        </span>
    `).join('');
}

// 打开编辑资料模态框
window.openEditProfileModal = function() {
    const profile = getProfile();
    
    // 填充表单（如果资料存在）
    document.getElementById('edit-nickname').value = profile ? (profile.nickname || '') : '';
    document.getElementById('edit-age').value = profile ? (profile.age || '') : '';
    document.getElementById('edit-graduate-year').value = profile ? (profile.graduateYear || '') : '';
    document.getElementById('edit-education').value = profile ? (profile.education || '') : '';
    document.getElementById('edit-school').value = profile ? (profile.school || '') : '';
    document.getElementById('edit-major').value = profile ? (profile.major || '') : '';
    document.getElementById('edit-school-years').value = profile ? (profile.schoolYears || '') : '';
    
    // 填充残疾类型复选框
    const disabilityCheckboxes = document.querySelectorAll('input[name="disability"]');
    const selectedTypes = profile ? (profile.disabilityTypes || []) : [];
    disabilityCheckboxes.forEach(checkbox => {
        checkbox.checked = selectedTypes.includes(checkbox.value);
    });
    
    // 显示模态框
    document.getElementById('edit-profile-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

// 关闭编辑资料模态框
window.closeEditProfileModal = function() {
    document.getElementById('edit-profile-modal').style.display = 'none';
    document.body.style.overflow = '';
};

// 保存资料
window.saveProfile = function() {
    const form = document.getElementById('edit-profile-form');
    
    // 验证表单
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 获取残疾类型选中的值
    const disabilityCheckboxes = document.querySelectorAll('input[name="disability"]:checked');
    const disabilityTypes = Array.from(disabilityCheckboxes).map(cb => cb.value);
    
    // 获取表单数据
    const profile = {
        nickname: document.getElementById('edit-nickname').value.trim(),
        age: parseInt(document.getElementById('edit-age').value),
        graduateYear: document.getElementById('edit-graduate-year').value,
        education: document.getElementById('edit-education').value,
        school: document.getElementById('edit-school').value.trim(),
        major: document.getElementById('edit-major').value.trim(),
        schoolYears: document.getElementById('edit-school-years').value.trim(),
        disabilityTypes: disabilityTypes // 添加残疾类型
    };
    
    // 保存到localStorage
    saveProfileToStorage(profile);
    
    // 更新页面显示
    updateProfileDisplay(profile);
    
    // 关闭模态框
    closeEditProfileModal();
    
    // 显示提示
    showToast('个人资料已更新');
    
    // 如果是首次填写，刷新首页以更新头像和用户名
    const isFirstTime = !getProfile();
    if (isFirstTime) {
        // 通知首页资料已更新（通过存储事件触发同步）
        window.dispatchEvent(new Event('storage'));
    }
};

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('edit-profile-modal');
    if (e.target === modal) {
        closeEditProfileModal();
    }
});

// 显示提示消息（如果还没有定义）
if (typeof showToast === 'undefined') {
    window.showToast = function(message) {
        const toast = document.getElementById('toast-notification');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };
}
