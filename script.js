class PomodoroTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workModeBtn = document.getElementById('workModeBtn');
        this.breakModeBtn = document.getElementById('breakModeBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.notificationSound = document.getElementById('notificationSound');
        this.progressRing = document.querySelector('.progress-ring-circle');

        // 计算进度环的周长（更新为新的半径值：140）
        const radius = 140;
        this.circumference = radius * 2 * Math.PI;
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

        this.isRunning = false;
        this.isWorkMode = true;
        this.timeLeft = this.workTimeInput.value * 60;
        this.timerId = null;
        this.totalTime = this.timeLeft;

        this.initializeEventListeners();
        this.updateProgress(1);
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.workTimeInput.addEventListener('change', () => this.handleTimeInputChange());
        this.breakTimeInput.addEventListener('change', () => this.handleTimeInputChange());
        this.workModeBtn.addEventListener('click', () => this.switchMode(true));
        this.breakModeBtn.addEventListener('click', () => this.switchMode(false));
    }

    switchMode(isWork) {
        if (this.isRunning) return;
        this.isWorkMode = isWork;
        this.workModeBtn.classList.toggle('active', isWork);
        this.breakModeBtn.classList.toggle('active', !isWork);
        this.timeLeft = isWork ? this.workTimeInput.value * 60 : this.breakTimeInput.value * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgress(1);
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = '暂停';
        this.startBtn.classList.add('paused');

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgress(this.timeLeft / this.totalTime);

            if (this.timeLeft <= 0) {
                this.handleTimerComplete();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = '开始';
        this.startBtn.classList.remove('paused');
        clearInterval(this.timerId);
    }

    resetTimer() {
        this.pauseTimer();
        this.isWorkMode = true;
        this.timeLeft = this.workTimeInput.value * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgress(1);
        this.workModeBtn.classList.add('active');
        this.breakModeBtn.classList.remove('active');
    }

    handleTimerComplete() {
        this.playNotificationSound();
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? 
            this.workTimeInput.value * 60 : 
            this.breakTimeInput.value * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgress(1);
        this.workModeBtn.classList.toggle('active', this.isWorkMode);
        this.breakModeBtn.classList.toggle('active', !this.isWorkMode);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateProgress(fraction) {
        const offset = this.circumference * (1 - fraction);
        this.progressRing.style.strokeDashoffset = offset;
        
        // 计算缩放比例，范围从1到0.95
        const scale = 0.95 + (0.05 * fraction);
        
        // 应用缩放动画到进度环和时间显示
        this.progressRing.style.transform = `rotate(-90deg) scale(${scale})`;
        this.timerDisplay.style.transform = `scale(${scale})`;
    }

    handleTimeInputChange() {
        if (!this.isRunning) {
            this.timeLeft = this.isWorkMode ? 
                this.workTimeInput.value * 60 : 
                this.breakTimeInput.value * 60;
            this.totalTime = this.timeLeft;
            this.updateDisplay();
            this.updateProgress(1);
        }
    }

    playNotificationSound() {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(error => {
            console.log('无法播放提示音:', error);
        });
    }
}

// 初始化计时器
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});