document.addEventListener('DOMContentLoaded', function() {
    const statusItems = document.querySelectorAll('.status-item');
    const taskLists = document.querySelectorAll('.task-list');
    const toast = document.getElementById('toast-notification');
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

    function getInitials(name) {
        if (!name) return '?';
        return name.slice(-2);
    }

    function initAvatar() {
        const savedAvatar = localStorage.getItem('userAvatar');
        const profile = getProfile();
        const generatedAvatar = document.getElementById('generated-avatar-large');
        const placeholder = document.getElementById('avatar-placeholder');
        const navAvatar = document.getElementById('navAvatar');
        const defaultAvatarUrl = 'https://api.dicebear.com/7.x/initials/svg?seed=志愿者&backgroundColor=0052D9';
        
        if (savedAvatar) {
            avatarImg.src = savedAvatar;
            avatarImg.style.display = 'block';
            if (generatedAvatar) generatedAvatar.style.display = 'none';
            if (placeholder) placeholder.style.display = 'none';
            if (navAvatar) navAvatar.src = savedAvatar;
        } else if (profile && profile.nickname) {
            const displayName = profile.nickname;
            if (generatedAvatar) {
                generatedAvatar.textContent = getInitials(displayName);
                generatedAvatar.style.backgroundColor = generateAvatarColor(displayName);
                generatedAvatar.style.display = 'flex';
            }
            avatarImg.style.display = 'none';
            if (placeholder) placeholder.style.display = 'none';
            if (navAvatar) {
                navAvatar.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=0052D9`;
            }
        } else {
            if (placeholder) placeholder.style.display = 'none';
            avatarImg.src = defaultAvatarUrl;
            avatarImg.style.display = 'block';
            if (generatedAvatar) generatedAvatar.style.display = 'none';
            if (navAvatar) navAvatar.src = defaultAvatarUrl;
        }
    }

    if (avatarWrapper && avatarInput) {
        avatarWrapper.addEventListener('click', function() {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showToast('请选择图片文件');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    showToast('图片大小不能超过5MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    const generatedAvatar = document.getElementById('generated-avatar-large');
                    const placeholder = document.getElementById('avatar-placeholder');
                    avatarImg.src = imageUrl;
                    avatarImg.style.display = 'block';
                    if (generatedAvatar) generatedAvatar.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'none';
                    localStorage.setItem('userAvatar', imageUrl);
                    showToast('头像更换成功');
                    // 同步导航头像
                    const navAvatar = document.getElementById('navAvatar');
                    if (navAvatar) navAvatar.src = imageUrl;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    initAvatar();

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ===== 数据模拟 =====
    const servingTasks = [
        {
            id: 'VOL-20260413-001',
            seeker: '张小明',
            company: '阿里云计算有限公司',
            job: '前端开发工程师',
            time: '2026.04.13 18:00',
            duration: '预计30分钟',
            status: '翻译进行中'
        }
    ];

    const pendingTasks = [
        {
            id: 'VOL-20260414-002',
            seeker: '李小红',
            company: '腾讯科技',
            job: 'UI设计师',
            time: '2026.04.14 09:30',
            duration: '预计45分钟',
            status: '待接单',
            urgent: false
        },
        {
            id: 'VOL-20260413-003',
            seeker: '王小华',
            company: '京东集团',
            job: '客服专员',
            time: '2026.04.13 20:00',
            duration: '预计30分钟',
            status: '急单',
            urgent: true
        }
    ];

    const completedTasks = [
        {
            id: 'VOL-20260412-004',
            seeker: '赵小芳',
            company: '美团',
            job: '数据录入员',
            time: '2026.04.12 14:00',
            duration: '28分钟',
            rating: 5.0,
            review: '翻译非常专业，沟通顺畅'
        },
        {
            id: 'VOL-20260410-005',
            seeker: '陈小军',
            company: '滴滴出行',
            job: '小车驾驶员',
            time: '2026.04.10 10:00',
            duration: '35分钟',
            rating: 5.0,
            review: '服务态度很好，很耐心'
        },
        {
            id: 'VOL-20260408-006',
            seeker: '刘小伟',
            company: '顺丰同城',
            job: '骑手',
            time: '2026.04.08 16:00',
            duration: '22分钟',
            rating: 4.8,
            review: '整体不错，时间把控准确'
        }
    ];

    const reviews = [
        {
            seeker: '赵小芳',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
            date: '2026-04-12',
            rating: 5,
            content: '翻译非常专业，沟通顺畅，帮助我顺利完成了面试。',
            tags: ['专业', '有耐心']
        },
        {
            seeker: '陈小军',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
            date: '2026-04-10',
            rating: 5,
            content: '服务态度很好，很耐心，手语表达清晰准确。',
            tags: ['表达清晰', '态度好']
        },
        {
            seeker: '刘小伟',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu',
            date: '2026-04-08',
            rating: 4,
            content: '整体不错，时间把控准确，希望能继续合作。',
            tags: ['守时']
        }
    ];

    function renderStars(count) {
        return Array(5).fill(0).map((_, i) => 
            `<i class="fas fa-star${i < count ? '' : ' style=opacity:0.3'}"></i>`
        ).join('');
    }

    function renderServing() {
        const container = document.getElementById('serving');
        document.querySelector('#tab-serving span').textContent = servingTasks.length;
        if (servingTasks.length === 0) {
            container.innerHTML = '<p class="empty-state">暂无服务中的任务</p>';
            return;
        }
        container.innerHTML = servingTasks.map(task => `
            <div class="task-item">
                <div class="task-header-row">
                    <div class="task-title"><i class="fas fa-video" style="color:#0052D9"></i> ${task.seeker} · ${task.company}</div>
                    <span class="task-status-badge serving">服务中</span>
                </div>
                <div class="task-meta-row">
                    <span><i class="fas fa-briefcase"></i> ${task.job}</span>
                    <span><i class="fas fa-clock"></i> ${task.time}</span>
                    <span><i class="fas fa-hourglass-half"></i> ${task.duration}</span>
                </div>
                <div class="task-footer-row">
                    <span class="task-time">任务编号：${task.id}</span>
                    <div class="task-actions">
                        <a href="../视频翻译室/index.html?room=${task.id}" class="btn-action btn-primary">进入翻译室</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderPending() {
        const container = document.getElementById('pending');
        document.querySelector('#tab-pending span').textContent = pendingTasks.length;
        if (pendingTasks.length === 0) {
            container.innerHTML = '<p class="empty-state">暂无待接单任务</p>';
            return;
        }
        container.innerHTML = pendingTasks.map(task => `
            <div class="task-item">
                <div class="task-header-row">
                    <div class="task-title"><i class="fas fa-handshake" style="color:${task.urgent ? '#ff4d4f' : '#0052D9'}"></i> ${task.seeker} · ${task.company}</div>
                    <span class="task-status-badge ${task.urgent ? 'pending' : 'pending'}">${task.status}</span>
                </div>
                <div class="task-meta-row">
                    <span><i class="fas fa-briefcase"></i> ${task.job}</span>
                    <span><i class="fas fa-clock"></i> ${task.time}</span>
                    <span><i class="fas fa-hourglass-half"></i> ${task.duration}</span>
                </div>
                <div class="task-footer-row">
                    <span class="task-time">任务编号：${task.id}</span>
                    <div class="task-actions">
                        <button class="btn-action btn-default" onclick="showToast('已拒绝该订单')">拒单</button>
                        <button class="btn-action btn-primary" onclick="showToast('接单成功')">接单</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderCompleted() {
        const container = document.getElementById('completed');
        document.querySelector('#tab-completed span').textContent = completedTasks.length;
        if (completedTasks.length === 0) {
            container.innerHTML = '<p class="empty-state">暂无已完成任务</p>';
            return;
        }
        container.innerHTML = completedTasks.map(task => `
            <div class="task-item">
                <div class="task-header-row">
                    <div class="task-title"><i class="fas fa-check-circle" style="color:#52c41a"></i> ${task.seeker} · ${task.company}</div>
                    <span class="task-status-badge completed">已完成</span>
                </div>
                <div class="task-meta-row">
                    <span><i class="fas fa-briefcase"></i> ${task.job}</span>
                    <span><i class="fas fa-clock"></i> ${task.time}</span>
                    <span><i class="fas fa-hourglass-half"></i> 实际时长 ${task.duration}</span>
                </div>
                <div class="task-footer-row">
                    <span class="task-time">任务编号：${task.id}</span>
                    <div class="task-actions">
                        <span style="color:#faad14; font-weight:600; font-size:14px"><i class="fas fa-star"></i> ${task.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderReviews() {
        const container = document.getElementById('reviews');
        document.querySelector('#tab-reviews span').textContent = reviews.length;
        if (reviews.length === 0) {
            container.innerHTML = '<p class="empty-state">暂无评价</p>';
            return;
        }
        container.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.avatar}" alt="" class="reviewer-avatar">
                        <div>
                            <div class="reviewer-name">${review.seeker}</div>
                            <div class="review-stars">${renderStars(review.rating)}</div>
                        </div>
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-content">${review.content}</div>
                <div class="review-tags">
                    ${review.tags.map(t => `<span class="review-tag">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Tab切换
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
            taskLists.forEach(list => {
                list.classList.toggle('active', list.id === tabId);
            });
            
            if (tabId === 'serving') renderServing();
            else if (tabId === 'pending') renderPending();
            else if (tabId === 'completed') renderCompleted();
            else if (tabId === 'reviews') renderReviews();
            
            const tabText = this.textContent.trim().split(' ')[0];
            showToast(`已切换到 '${tabText}'`);
        });
    });

    renderServing();
    renderPending();
    renderCompleted();
    renderReviews();
    initProfile();
});

// ========== 编辑资料功能 ==========
function getProfile() {
    const stored = localStorage.getItem('volunteerProfile');
    return stored ? JSON.parse(stored) : null;
}

function saveProfileToStorage(profile) {
    localStorage.setItem('volunteerProfile', JSON.stringify(profile));
}

function initProfile() {
    const profile = getProfile();
    if (!profile) {
        updateProfileDisplay(null);
        setTimeout(() => {
            openEditProfileModal();
        }, 500);
    } else {
        updateProfileDisplay(profile);
    }
}

function updateProfileDisplay(profile) {
    const nicknameEl = document.getElementById('user-nickname');
    const basicInfoEl = document.getElementById('user-basic-info');
    const educationInfoEl = document.getElementById('user-education-info');
    
    if (!profile) {
        nicknameEl.textContent = '请设置昵称';
        nicknameEl.style.color = '#999';
        basicInfoEl.textContent = '请填写年龄、服务地区、从业年限';
        basicInfoEl.style.color = '#999';
        educationInfoEl.textContent = '请填写联系方式、擅长领域';
        educationInfoEl.style.color = '#999';
        updateSkillTags([]);
    } else {
        nicknameEl.style.color = '';
        basicInfoEl.style.color = '';
        educationInfoEl.style.color = '';
        
        nicknameEl.textContent = profile.nickname || '未设置昵称';
        basicInfoEl.textContent = 
            `${profile.age || '--'}岁 | ${profile.region || '未设置'} | 从业${profile.experience || '--'}`;
        educationInfoEl.textContent = 
            `${profile.phone || '未设置'} | ${profile.email || '未设置'}`;
        
        updateSkillTags(profile.skillTypes || []);
    }
}

function updateSkillTags(skillTypes) {
    const container = document.getElementById('user-skill-types');
    if (!container) return;
    if (skillTypes.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = skillTypes.map(type => `
        <span class="skill-tag">${type}</span>
    `).join('');
}

window.openEditProfileModal = function() {
    const profile = getProfile();
    document.getElementById('edit-nickname').value = profile ? (profile.nickname || '') : '';
    document.getElementById('edit-age').value = profile ? (profile.age || '') : '';
    document.getElementById('edit-region').value = profile ? (profile.region || '') : '';
    document.getElementById('edit-experience').value = profile ? (profile.experience || '') : '';
    document.getElementById('edit-phone').value = profile ? (profile.phone || '') : '';
    document.getElementById('edit-email').value = profile ? (profile.email || '') : '';
    
    const checkboxes = document.querySelectorAll('input[name="skill"]');
    const selected = profile ? (profile.skillTypes || []) : [];
    checkboxes.forEach(cb => cb.checked = selected.includes(cb.value));
    
    document.getElementById('edit-profile-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeEditProfileModal = function() {
    document.getElementById('edit-profile-modal').style.display = 'none';
    document.body.style.overflow = '';
};

window.saveProfile = function() {
    const form = document.getElementById('edit-profile-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const checked = document.querySelectorAll('input[name="skill"]:checked');
    const skillTypes = Array.from(checked).map(cb => cb.value);
    
    const profile = {
        nickname: document.getElementById('edit-nickname').value.trim(),
        age: parseInt(document.getElementById('edit-age').value),
        region: document.getElementById('edit-region').value.trim(),
        experience: document.getElementById('edit-experience').value,
        phone: document.getElementById('edit-phone').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        skillTypes: skillTypes
    };
    
    saveProfileToStorage(profile);
    updateProfileDisplay(profile);
    closeEditProfileModal();
    
    const toast = document.getElementById('toast-notification');
    toast.textContent = '个人资料已更新';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    
    // 刷新头像显示
    const avatarImg = document.getElementById('profile-avatar');
    const savedAvatar = localStorage.getItem('userAvatar');
    const generatedAvatar = document.getElementById('generated-avatar-large');
    const placeholder = document.getElementById('avatar-placeholder');
    const navAvatar = document.getElementById('navAvatar');
    if (!savedAvatar && profile.nickname) {
        if (generatedAvatar) {
            generatedAvatar.textContent = profile.nickname.slice(-2);
            const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F8B500','#6C5CE7','#A29BFE','#74B9FF','#00B894'];
            let hash = 0;
            for (let i = 0; i < profile.nickname.length; i++) hash = profile.nickname.charCodeAt(i) + ((hash << 5) - hash);
            generatedAvatar.style.backgroundColor = colors[Math.abs(hash) % colors.length];
            generatedAvatar.style.display = 'flex';
        }
        avatarImg.style.display = 'none';
        if (placeholder) placeholder.style.display = 'none';
        if (navAvatar) {
            navAvatar.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.nickname)}&backgroundColor=0052D9`;
        }
    }
};

document.addEventListener('click', function(e) {
    const modal = document.getElementById('edit-profile-modal');
    if (e.target === modal) {
        closeEditProfileModal();
    }
});
