// 置顶按钮
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// 加载头像
function loadNavAvatar() {
    const navAvatar = document.getElementById('navAvatar');
    if (navAvatar) {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            navAvatar.src = savedAvatar;
        } else {
            navAvatar.src = 'https://api.dicebear.com/7.x/initials/svg?seed=志愿者&backgroundColor=0052D9';
        }
    }
}
loadNavAvatar();

// 当前操作的任务ID
let currentTaskId = null;
let currentTaskData = null;

// 接单
function acceptTask(taskId) {
    currentTaskId = taskId;
    // 模拟获取任务数据
    const tasks = {
        'VOL-20260413-001': { seeker: '张小明', company: '阿里云计算有限公司', time: '2026.04.13 18:00' },
        'VOL-20260414-002': { seeker: '李小红', company: '腾讯科技', time: '2026.04.14 09:30' }
    };
    currentTaskData = tasks[taskId];
    if (currentTaskData) {
        document.getElementById('acceptJobSeeker').textContent = currentTaskData.seeker;
        document.getElementById('acceptCompany').textContent = currentTaskData.company;
        document.getElementById('acceptTime').textContent = currentTaskData.time;
    }
    document.getElementById('acceptModal').style.display = 'flex';
}

// 确认接单
function confirmAccept() {
    if (currentTaskId) {
        // 从待接单列表移除
        const pendingList = document.getElementById('pendingList');
        const cards = pendingList.querySelectorAll('.task-card');
        cards.forEach(card => {
            if (card.querySelector('.task-id').textContent.includes(currentTaskId)) {
                card.remove();
            }
        });
        updatePendingCount();
        showToast('接单成功！请准时参加面试翻译服务。');
    }
    closeModal('acceptModal');
}

// 拒单
function rejectTask(taskId) {
    currentTaskId = taskId;
    document.getElementById('rejectModal').style.display = 'flex';
}

// 确认拒单
function confirmReject() {
    if (currentTaskId) {
        const pendingList = document.getElementById('pendingList');
        const cards = pendingList.querySelectorAll('.task-card');
        cards.forEach(card => {
            if (card.querySelector('.task-id').textContent.includes(currentTaskId)) {
                card.remove();
            }
        });
        updatePendingCount();
        showToast('已拒绝该订单');
    }
    closeModal('rejectModal');
}

// 关闭弹窗
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    currentTaskId = null;
}

// 更新待接单数量
function updatePendingCount() {
    const pendingList = document.getElementById('pendingList');
    const count = pendingList.querySelectorAll('.task-card').length;
    document.getElementById('pendingCount').textContent = count;
}

// 刷新任务
function refreshTasks() {
    const btn = document.querySelector('.refresh-btn i');
    btn.classList.add('fa-spin');
    setTimeout(() => {
        btn.classList.remove('fa-spin');
        showToast('任务列表已刷新');
    }, 800);
}

// 切换在线状态
function toggleOnline() {
    const toggle = document.getElementById('onlineToggle');
    const label = document.getElementById('onlineLabel');
    if (toggle.checked) {
        label.textContent = '当前可接单';
        label.style.color = '#52c41a';
    } else {
        label.textContent = '已暂停接单';
        label.style.color = '#999';
    }
}

// Toast提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 3000;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// 日历生成
const calDays = document.getElementById('calDays');
const calMonth = document.getElementById('calMonth');
let currentDate = new Date(2026, 3, 13); // 2026年4月13日

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    calMonth.textContent = `${year}年${month + 1}月`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // 上个月末尾日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    calDays.innerHTML = '';
    
    // 上月空位
    for (let i = startDay - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'day-cell other-month';
        cell.textContent = prevMonthLastDay - i;
        calDays.appendChild(cell);
    }
    
    // 当月
    const today = 13; // 模拟今天
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.textContent = d;
        
        if (d === today) {
            cell.classList.add('today');
        }
        // 模拟排班数据
        if ([8, 10, 12, 15, 18, 22].includes(d)) {
            cell.classList.add('busy');
        } else if (d > today && d <= 25) {
            cell.classList.add('free');
        }
        
        calDays.appendChild(cell);
    }
    
    // 下月空位
    const remaining = (7 - ((startDay + daysInMonth) % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell other-month';
        cell.textContent = d;
        calDays.appendChild(cell);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar(currentDate);
}

renderCalendar(currentDate);
