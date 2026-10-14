document.addEventListener('DOMContentLoaded', function() {
    const statusItems = document.querySelectorAll('.status-item');
    const jobLists = document.querySelectorAll('.job-list');
    const toast = document.getElementById('toast-notification');
    const header = document.getElementById('header');
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const avatarInput = document.getElementById('avatar-input');
    const avatarImg = document.getElementById('profile-avatar');
    
    // 检查是否是从登录页跳转过来的HR用户
    checkLoginRedirect();

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


// ========================================
// HR特有功能 - 职位管理
// ========================================

// 渲染职位列表
function renderJobs() {
    const container = document.getElementById('jobs-container');
    const jobs = JSON.parse(localStorage.getItem('hrPublishedJobs') || '[]');
    
    document.getElementById('jobs-total').textContent = jobs.length;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase" style="font-size: 48px; color: var(--text-muted); margin-bottom: 15px; display: block;"></i>
                <p>暂无在招职位，点击上方按钮发布新职位</p>
            </div>
        `;
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-item" data-job-id="${job.id}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div>
                    <h3 style="margin: 0 0 10px 0; color: var(--text-title);">${job.title}</h3>
                    <div style="color: var(--text-desc); font-size: 14px;">
                        <span style="margin-right: 15px;"><i class="fas fa-money-bill-wave" style="color: var(--tencent-blue); margin-right: 5px;"></i> ${job.salary}</span>
                        <span style="margin-right: 15px;"><i class="fas fa-map-marker-alt" style="color: var(--tencent-blue); margin-right: 5px;"></i> ${job.location}</span>
                        <span style="margin-right: 15px;"><i class="fas fa-graduation-cap" style="color: var(--tencent-blue); margin-right: 5px;"></i> ${job.education}</span>
                        <span><i class="fas fa-briefcase" style="color: var(--tencent-blue); margin-right: 5px;"></i> ${job.experience}</span>
                    </div>
                </div>
                <span style="color: #ff6600; font-weight: 600; font-size: 16px;">${job.salary}</span>
            </div>
            <div style="margin-bottom: 15px;">
                ${job.disability.map(d => `<span class="disability-tag" style="margin-right: 8px;">${d}</span>`).join('')}
                <span style="display: inline-flex; align-items: center; padding: 4px 12px; background: var(--bg-light); border-radius: 20px; font-size: 12px; color: var(--text-desc);">${job.jobType}</span>
            </div>
            <div style="display: flex; gap: 10px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px;" onclick="viewJob(${job.id})">查看</button>
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px; background: var(--bg-light); color: var(--text-main); border-color: var(--border-color);" onclick="editJob(${job.id})">编辑</button>
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px; background: #fff2f0; color: #ff4d4f; border-color: #ff4d4f;" onclick="deleteJob(${job.id})">下架</button>
            </div>
        </div>
    `).join('');
}

// 渲染简历列表
function renderResumes(filter = 'all') {
    const container = document.getElementById('resumes-container');
    const resumes = JSON.parse(localStorage.getItem('hrReceivedResumes') || '[]');
    
    let filteredResumes = resumes;
    if (filter !== 'all') {
        filteredResumes = resumes.filter(r => r.status === filter);
    }
    
    if (filteredResumes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt" style="font-size: 48px; color: var(--text-muted); margin-bottom: 15px; display: block;"></i>
                <p>暂无${filter === 'all' ? '' : getStatusText(filter)}简历</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredResumes.map(resume => `
        <div class="job-item" data-resume-id="${resume.id}">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <img src="${resume.avatar}" alt="${resume.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-title); margin-bottom: 5px;">${resume.name}</div>
                    <div style="color: var(--text-desc); font-size: 13px;">
                        <span style="margin-right: 10px;">${resume.age}岁</span>
                        <span style="margin-right: 10px;">|</span>
                        <span style="margin-right: 10px;">${resume.education}</span>
                        <span style="margin-right: 10px;">|</span>
                        <span>${resume.experience}</span>
                    </div>
                </div>
                <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; ${getStatusStyle(resume.status)}">${getStatusText(resume.status)}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 15px;">
                投递职位：${resume.jobTitle}
            </div>
            <div style="display: flex; gap: 10px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px;" onclick="viewResume(${resume.id})">查看简历</button>
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px;" onclick="contactCandidate(${resume.id})">立即沟通</button>
            </div>
        </div>
    `).join('');
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待查看',
        'screened': '已通过初筛',
        'interview': '待面试',
        'rejected': '不合适'
    };
    return statusMap[status] || status;
}

// 获取状态样式
function getStatusStyle(status) {
    const styleMap = {
        'pending': 'background: #fff7e6; color: #fa8c16;',
        'screened': 'background: #f6ffed; color: #52c41a;',
        'interview': 'background: #e6f7ff; color: #1890ff;',
        'rejected': 'background: #f5f5f5; color: #999;'
    };
    return styleMap[status] || '';
}

// 渲染沟通列表
function renderCommunications() {
    const container = document.getElementById('communication-container');
    const communications = JSON.parse(localStorage.getItem('hrCommunications') || '[]');
    
    if (communications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments" style="font-size: 48px; color: var(--text-muted); margin-bottom: 15px; display: block;"></i>
                <p>暂无沟通记录</p>
            </div>
        `;
        return;
    }

    container.innerHTML = communications.map(comm => `
        <div class="job-item" data-comm-id="${comm.id}">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--bg-light); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-user" style="color: var(--text-muted); font-size: 20px;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-title); margin-bottom: 5px;">
                        ${comm.candidateName} 
                        <span style="font-weight: normal; color: var(--text-muted);">- ${comm.jobTitle}</span>
                    </div>
                    <div style="color: var(--text-desc); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${comm.lastMessage}</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">${comm.lastTime}</div>
                    ${comm.unread > 0 ? `<span style="display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; background: #ff4d4f; color: #fff; border-radius: 10px; font-size: 12px; padding: 0 6px;">${comm.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// 渲染面试列表
function renderInterviews() {
    const container = document.getElementById('interviews-container');
    const interviews = JSON.parse(localStorage.getItem('hrInterviews') || '[]');
    
    if (interviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check" style="font-size: 48px; color: var(--text-muted); margin-bottom: 15px; display: block;"></i>
                <p>暂无面试安排</p>
            </div>
        `;
        return;
    }

    container.innerHTML = interviews.map(interview => `
        <div class="job-item interview-item" data-interview-id="${interview.id}" style="border-left: 4px solid #722ed1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
                <span style="font-weight: 600; color: var(--text-title);">${interview.jobTitle}</span>
                <span style="color: #722ed1; font-weight: 500; font-size: 14px;"><i class="far fa-clock" style="margin-right: 5px;"></i> ${interview.date} ${interview.time}</span>
            </div>
            <div style="color: var(--text-desc); margin-bottom: 10px;">
                候选人：${interview.candidateName} | ${interview.candidatePhone}
            </div>
            <div style="display: flex; align-items: center; color: var(--text-desc); font-size: 14px; margin: 12px 0; padding: 10px; background: #f9f0ff; border-radius: 6px;">
                <i class="fas fa-map-marker-alt" style="color: #722ed1; margin-right: 8px;"></i> ${interview.location}
            </div>
            <div style="display: flex; gap: 10px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px;" onclick="editInterview(${interview.id})">修改</button>
                <button class="btn-communicate" style="padding: 8px 16px; font-size: 13px; background: #fff2f0; color: #ff4d4f; border-color: #ff4d4f;" onclick="cancelInterview(${interview.id})">取消</button>
            </div>
        </div>
    `).join('');
}

// 打开发布职位模态框
function openPublishJobModal() {
    document.getElementById('publish-job-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 关闭发布职位模态框
function closePublishJobModal() {
    document.getElementById('publish-job-modal').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('publish-job-form').reset();
}

// 发布职位
function publishJob() {
    const form = document.getElementById('publish-job-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const disabilityTypes = Array.from(document.querySelectorAll('input[name="disability"]:checked')).map(cb => cb.value);
    
    const job = {
        id: Date.now(),
        title: document.getElementById('job-title').value.trim(),
        salary: document.getElementById('job-salary').value.trim(),
        location: document.getElementById('job-location').value.trim(),
        education: document.getElementById('job-education').value,
        experience: document.getElementById('job-experience').value,
        disability: disabilityTypes,
        jobType: '全职',
        desc: document.getElementById('job-desc').value.trim(),
        publishTime: new Date().toISOString()
    };
    
    const jobs = JSON.parse(localStorage.getItem('hrPublishedJobs') || '[]');
    jobs.unshift(job);
    localStorage.setItem('hrPublishedJobs', JSON.stringify(jobs));
    
    // 更新职位数量
    const jobsTab = document.getElementById('tab-jobs');
    if (jobsTab) {
        const badge = jobsTab.querySelector('span');
        if (badge) badge.textContent = jobs.length;
    }
    
    closePublishJobModal();
    showToast('职位发布成功');
    
    // 刷新职位列表
    renderJobs();
}

// 职位操作
function viewJob(jobId) {
    showToast('查看职位详情');
}

function editJob(jobId) {
    showToast('编辑职位');
}

function deleteJob(jobId) {
    if (confirm('确定要下架该职位吗？')) {
        let jobs = JSON.parse(localStorage.getItem('hrPublishedJobs') || '[]');
        jobs = jobs.filter(j => j.id !== jobId);
        localStorage.setItem('hrPublishedJobs', JSON.stringify(jobs));
        showToast('职位已下架');
        renderJobs();
    }
}

// 简历操作
function viewResume(resumeId) {
    showToast('查看简历详情');
}

function contactCandidate(resumeId) {
    window.location.href = '../聊天窗口/index.html';
}

// 面试操作
function openScheduleInterviewModal() {
    showToast('安排面试功能开发中');
}

function editInterview(interviewId) {
    showToast('编辑面试');
}

function cancelInterview(interviewId) {
    if (confirm('确定要取消该面试吗？')) {
        showToast('面试已取消');
    }
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const publishModal = document.getElementById('publish-job-modal');
    if (e.target === publishModal) {
        closePublishJobModal();
    }
});

// 检查是否是从登录页跳转过来的HR用户
function checkLoginRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogin = urlParams.get('fromLogin');
    const role = urlParams.get('role');
    const firstTime = urlParams.get('firstTime');
    
    // 如果是从登录页跳转、是HR角色、且是首次登录，自动弹出编辑资料弹窗
    if (fromLogin === 'true' && role === 'hr' && firstTime === 'true') {
        // 清除URL参数（避免刷新页面再次触发）
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // 延迟弹出编辑资料弹窗，等待页面完全加载
        setTimeout(() => {
            openEditProfileModal();
            showToast('欢迎登录！请完善您的HR资料');
        }, 800);
    }
}

// 初始化示例数据
function initSampleData() {
    // 如果没有数据，添加一些示例数据
    if (!localStorage.getItem('hrPublishedJobs')) {
        const sampleJobs = [
            {
                id: 1,
                title: '人事专员，朝九晚四，周末双休',
                salary: '8000-20000元/月',
                location: '南京市-江宁区',
                education: '学历不限',
                experience: '经验不限',
                disability: ['听力残疾', '言语残疾'],
                jobType: '全职',
                desc: '负责人事招聘、员工关系等工作',
                publishTime: new Date().toISOString()
            },
            {
                id: 2,
                title: '行政助理',
                salary: '5000-8000元/月',
                location: '南京市-江宁区',
                education: '大专',
                experience: '1年以内',
                disability: ['肢体残疾'],
                jobType: '全职',
                desc: '负责行政事务处理',
                publishTime: new Date().toISOString()
            }
        ];
        localStorage.setItem('hrPublishedJobs', JSON.stringify(sampleJobs));
    }

    if (!localStorage.getItem('hrReceivedResumes')) {
        const sampleResumes = [
            {
                id: 1,
                name: '张小明',
                age: 25,
                education: '本科',
                experience: '2年经验',
                jobTitle: '人事专员',
                avatar: 'https://img.bosszhipin.com/beijin/upload/avatar/20210609/d8922c74373c386934f3231f94096cc42569bf6476d1f21550636549e45f988b_s.png',
                status: 'pending'
            },
            {
                id: 2,
                name: '李小红',
                age: 23,
                education: '大专',
                experience: '应届生',
                jobTitle: '行政助理',
                avatar: 'https://img.bosszhipin.com/beijin/upload/avatar/20210609/d8922c74373c386934f3231f94096cc42569bf6476d1f21550636549e45f988b_s.png',
                status: 'screened'
            }
        ];
        localStorage.setItem('hrReceivedResumes', JSON.stringify(sampleResumes));
    }

    if (!localStorage.getItem('hrCommunications')) {
        const sampleCommunications = [
            {
                id: 1,
                candidateName: '张小明',
                jobTitle: '人事专员',
                lastMessage: '您好，我对这个职位很感兴趣...',
                lastTime: '10:30',
                unread: 2
            },
            {
                id: 2,
                candidateName: '李小红',
                jobTitle: '行政助理',
                lastMessage: '请问面试时间可以调整到下午吗？',
                lastTime: '昨天',
                unread: 0
            }
        ];
        localStorage.setItem('hrCommunications', JSON.stringify(sampleCommunications));
    }

    if (!localStorage.getItem('hrInterviews')) {
        const sampleInterviews = [
            {
                id: 1,
                jobTitle: '人事专员',
                candidateName: '王小华',
                candidatePhone: '138****8888',
                date: '2026-04-10',
                time: '14:00',
                location: '南京市江宁区XX大厦15楼'
            }
        ];
        localStorage.setItem('hrInterviews', JSON.stringify(sampleInterviews));
    }
}

// 修改标签切换逻辑，添加HR特有的数据刷新
document.addEventListener('DOMContentLoaded', function() {
    const statusItems = document.querySelectorAll('.status-item');
    const jobLists = document.querySelectorAll('.job-list');
    
    statusItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            statusItems.forEach(i => {
                i.classList.remove('active');
                i.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            const tabId = this.getAttribute('data-tab');
            jobLists.forEach(list => {
                if (list.id === tabId) {
                    list.classList.add('active');
                } else {
                    list.classList.remove('active');
                }
            });
            
            // 刷新对应数据
            if (tabId === 'jobs') {
                renderJobs();
            } else if (tabId === 'resumes') {
                renderResumes();
            } else if (tabId === 'communication') {
                renderCommunications();
            } else if (tabId === 'interviews') {
                renderInterviews();
            }
        });
    });

    // 筛选标签
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderResumes(filter);
        });
    });

    // 初始化数据
    initSampleData();
    
    // 初始渲染
    renderJobs();
    renderResumes();
    renderCommunications();
    renderInterviews();
});

// 重写编辑资料相关函数以支持HR资料
const originalOpenEditProfileModal = window.openEditProfileModal;
const originalSaveProfile = window.saveProfile;
const originalGetProfile = window.getProfile;

window.getProfile = function() {
    const stored = localStorage.getItem('hrProfile');
    return stored ? JSON.parse(stored) : null;
};

window.saveProfileToStorage = function(profile) {
    localStorage.setItem('hrProfile', JSON.stringify(profile));
};

window.openEditProfileModal = function() {
    const profile = getProfile();
    
    // 填充HR表单
    document.getElementById('edit-hr-name').value = profile ? (profile.name || '') : '';
    document.getElementById('edit-hr-gender').value = profile ? (profile.gender || 'male') : 'male';
    document.getElementById('edit-hr-position').value = profile ? (profile.position || '') : '';
    document.getElementById('edit-hr-phone').value = profile ? (profile.phone || '') : '';
    
    // 填充企业表单
    const companyProfile = JSON.parse(localStorage.getItem('hrCompanyProfile') || '{}');
    document.getElementById('edit-company-name').value = companyProfile.name || '';
    document.getElementById('edit-industry').value = companyProfile.industry || '人力资源';
    document.getElementById('edit-company-type').value = companyProfile.type || '民营';
    document.getElementById('edit-company-size').value = companyProfile.size || '100-499人';
    document.getElementById('edit-location').value = companyProfile.location || '';
    
    // 显示模态框
    document.getElementById('edit-profile-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.saveProfile = function() {
    const form = document.getElementById('edit-profile-form');
    
    // 验证表单
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 获取HR表单数据
    const hrProfile = {
        name: document.getElementById('edit-hr-name').value.trim(),
        gender: document.getElementById('edit-hr-gender').value,
        position: document.getElementById('edit-hr-position').value,
        phone: document.getElementById('edit-hr-phone').value.trim()
    };
    
    // 获取企业表单数据
    const companyProfile = {
        name: document.getElementById('edit-company-name').value.trim(),
        industry: document.getElementById('edit-industry').value,
        type: document.getElementById('edit-company-type').value,
        size: document.getElementById('edit-company-size').value,
        location: document.getElementById('edit-location').value.trim()
    };
    
    // 保存到localStorage
    saveProfileToStorage(hrProfile);
    localStorage.setItem('hrCompanyProfile', JSON.stringify(companyProfile));
    
    // 更新页面显示
    updateProfileDisplay(hrProfile, companyProfile);
    
    // 关闭模态框
    closeEditProfileModal();
    
    // 显示提示
    showToast('资料已更新');
};

window.updateProfileDisplay = function(hrProfile, companyProfile) {
    if (!hrProfile) hrProfile = getProfile() || {};
    if (!companyProfile) companyProfile = JSON.parse(localStorage.getItem('hrCompanyProfile') || '{}');
    
    const nicknameEl = document.getElementById('user-nickname');
    const basicInfoEl = document.getElementById('user-basic-info');
    const educationInfoEl = document.getElementById('user-education-info');
    
    if (nicknameEl) nicknameEl.textContent = hrProfile.name || '王经理';
    if (basicInfoEl) basicInfoEl.textContent = `${hrProfile.position || '招聘经理'} | ${companyProfile.name || '南京顺众人力资源'}`;
    if (educationInfoEl) educationInfoEl.textContent = `${companyProfile.industry || '人力资源'} | ${companyProfile.type || '民营'} | ${companyProfile.size || '100-200人'}`;
};

// 初始化时更新显示
document.addEventListener('DOMContentLoaded', function() {
    updateProfileDisplay();
});
