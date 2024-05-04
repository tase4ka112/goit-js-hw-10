import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      refs.startButton.disabled = true;
    } else {
      refs.startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

refs.startButton.addEventListener('click', () => {
  const selectedDate = new Date(refs.inputDate.value);
  const currentDate = new Date();
  if (selectedDate <= currentDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a future date to start the timer.',
    });
    return;
  }
  startTimer(selectedDate);

  refs.inputDate.disabled = true;
  refs.startButton.disabled = true;
});

function startTimer(endDate) {
  const timerInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const distance = endDate.getTime() - currentTime;

    if (distance <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay(0, 0, 0, 0);
      refs.inputDate.disabled = false;
      refs.startButton.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(distance);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  refs.daysEl.textContent = zeroToStart(days);
  refs.hoursEl.textContent = zeroToStart(hours);
  refs.minutesEl.textContent = zeroToStart(minutes);
  refs.secondsEl.textContent = zeroToStart(seconds);
}

function zeroToStart(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6, minutes: 42, seconds: 20}
