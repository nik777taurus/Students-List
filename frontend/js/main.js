// Адрес сервера

const SERVER_URL = 'http://localhost:3000';

// Функция отправки данных на сервер

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });

  let data = await response.json();

  return data;
}

// Функция получения данных с сервера

async function serverGetStudents() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  let data = await response.json();

  return data;
}

// Функция удаления данных с сервера

async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
    method: 'DELETE',
  });

  let data = await response.json();

  return data;
}

// Получение базы данных при наличии информации на сервере

let serverData = await serverGetStudents();

let listData = [];

if (serverData != null) {
  listData = serverData;
}

// Создание элементов

const $app = document.getElementById('app');

const $addForm = document.getElementById('add-form');
const $surnameInp = document.getElementById('add-form__surname-inp');
const $nameInp = document.getElementById('add-form__name-inp');
const $lastnameInp = document.getElementById('add-form__lastname-inp');
const $birthDateInp = document.getElementById('add-form__birth-date-inp');
const $firstYearInp = document.getElementById('add-form__first-year-inp');
const $facInp = document.getElementById('add-form__fac-inp');

const $table = document.createElement('table');
const $tHead = document.createElement('thead');
const $tBody = document.createElement('tbody');

const $tHeadTr = document.createElement('tr');
const $tHeadThFIO = document.createElement('th');
const $tHeadThFac = document.createElement('th');
const $tHeadThBirthDateAndAge = document.createElement('th');
const $tHeadThLearningYearsAndCourse = document.createElement('th');
const $tHeadDel = document.createElement('th');

$table.classList.add('table', 'table-dark', 'table-striped');

$tHeadThFIO.textContent = 'ФИО';
$tHeadThFac.textContent = 'Факультет';
$tHeadThBirthDateAndAge.textContent = 'Дата рождения и возраст';
$tHeadThLearningYearsAndCourse.textContent = 'Годы обучения и курс';

$tHeadTr.append($tHeadThFIO);
$tHeadTr.append($tHeadThFac);
$tHeadTr.append($tHeadThBirthDateAndAge);
$tHeadTr.append($tHeadThLearningYearsAndCourse);
$tHeadTr.append($tHeadDel);

$tHead.append($tHeadTr);
$table.append($tHead);
$table.append($tBody);
$app.append($table);

$table.querySelectorAll('th').forEach((th) => {
  th.style.cursor = 'pointer';
});

const $filterForm = document.getElementById('filter-form');
const $fioFilterInp = document.getElementById('filter-form__fio-inp');
const $facFilterInp = document.getElementById('filter-form__fac-inp');
const $firstYearFilterInp = document.getElementById('filter-form__first-year-inp');
const $lastYearFilterInp = document.getElementById('filter-form__last-year-inp');

// Функция форматирования даты

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  year = year.toString().slice(-2);
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return {
    year,
    month,
    day,
  };
}

function formatYearUnit(date) {
  let age = new Date().getFullYear() - date.getFullYear();
  let yearUnit;

  if (age.toString().slice(-1) == 1) {
    yearUnit = 'год';
  } else if (age.toString().slice(-1) > 1 && age.toString().slice(-1) < 5) {
    yearUnit = 'года';
  } else {
    yearUnit = 'лет';
  }

  return yearUnit;
}

// Функция отрисовки одной записи

function createStudentTr(student) {
  const $studentTr = document.createElement('tr');
  const $studentFIO = document.createElement('td');
  const $studentFac = document.createElement('td');
  const $studentBirthDateAndAge = document.createElement('td');
  const $studentLearningYearsAndCourse = document.createElement('td');
  const $studentDel = document.createElement('td');
  const $btnDel = document.createElement('button');

  $btnDel.classList.add('btn', 'btn-danger', 'w-100');
  $btnDel.textContent = 'Удалить';

  // События кнопки удаления записи

  $btnDel.addEventListener('click', async () => {
    await serverDeleteStudent(student.id);
    $studentTr.remove();
  });

  // Подготовка

  student.birthday = new Date(student.birthday);
  student.fio = student.surname.trim() + ' ' + student.name.trim() + ' ' + student.lastname.trim();
  student.age = new Date().getFullYear() - student.birthday.getFullYear();
  student.lastYear = parseInt(student.studyStart) + 4;

  if (new Date().getFullYear() < student.lastYear) {
    student.course = `${new Date().getFullYear() - student.studyStart} курс`;
  } else if (new Date().getFullYear() == student.lastYear) {
    if (new Date().getMonth() <= 9) {
      student.course = `${new Date().getFullYear() - student.studyStart} курс`;
    } else {
      student.course = 'Закончил';
    }
  } else {
    student.course = 'Закончил';
  }

  // Отрисовка

  $studentFIO.textContent = student.fio;
  $studentFac.textContent = student.faculty.trim();
  $studentBirthDateAndAge.textContent = `${formatDate(student.birthday).day}.${formatDate(student.birthday).month}.${formatDate(student.birthday).year} (${student.age} ${formatYearUnit(student.birthday)})`;
  $studentLearningYearsAndCourse.textContent = `${student.studyStart}-${student.lastYear} (${student.course})`;

  $studentDel.append($btnDel);
  $studentTr.append($studentFIO);
  $studentTr.append($studentFac);
  $studentTr.append($studentBirthDateAndAge);
  $studentTr.append($studentLearningYearsAndCourse);
  $studentTr.append($studentDel);
  $tBody.append($studentTr);
}

// Функция отрисовки таблицы

function createStudentsTable(list) {
  $tBody.innerHTML = '';

  let copyList = [...list];

  for (let student of copyList) {
    createStudentTr(student);
  }
}

// Функция добавления ошибки при валидации

function createError(input, text) {
  const parent = input.parentNode;
  const errorLabel = document.createElement('label');

  errorLabel.classList.add('error-label');
  errorLabel.textContent = text;

  parent.classList.add('error');
  parent.append(errorLabel);
}

// Функция удаления ошибки при валидации

function removeError(input) {
  const parent = input.parentNode;

  if (parent.classList.contains('error')) {
    parent.querySelector('.error-label').remove();
    parent.classList.remove('error');
  }
}

// Функция проверки на пустоту

function checkEmpty(input) {
  let result = true;

  if (input.dataset.required == 'true') {
    if (String(input.value).trim() == '') {
      removeError(input);
      createError(input, 'Поле не заполнено!');
      result = false;
    }
  }

  return result;
}

// Функции проверки диапазона даты рождения

function checkDateRange(input) {
  let result = true;

  if (new Date(input.value) < new Date(1900, 0, 1) || new Date(input.value) > new Date() || input.value.length > 10) {
    removeError(input);
    createError(input, 'Значение должно быть в диапазоне от 01.01.1900 до сегодняшнего дня!');
    result = false;
  }

  return result;
}

function checkDateRangeValue() {
  let result = true;

  if ($birthDateInp.value != '') {
    if (!checkDateRange($birthDateInp)) {
      result = false;
    }
  }

  return result;
}

// Функции проверки диапазона года начала обучения

function checkFirstYearRange(input) {
  let result = true;

  if (input.value < 2000 || input.value > new Date().getFullYear()) {
    removeError(input);
    createError(input, 'Значение должно быть в диапазоне от 2000 до теущего года!');
    result = false;
  }

  return result;
}

function checkFirstYearRangeValue() {
  let result = true;

  if ($firstYearInp.value != '') {
    if (!checkFirstYearRange($firstYearInp)) {
      result = false;
    }
  }

  return result;
}

// Функция общей проверки на диапазон

function checkRangeSummary() {
  let result = true;

  if (!checkDateRangeValue()) {
    result = false;
  }

  if (!checkFirstYearRangeValue()) {
    result = false;
  }

  return result;
}

// Функция валидации формы при добавлении записи

function validation(form) {
  let result = true;
  const $inputs = form.querySelectorAll('input');

  for (const input of $inputs) {
    removeError(input);

    if (!checkEmpty(input)) {
      result = false;
    }
  }

  if (!checkRangeSummary()) {
    result = false;
  }

  return result;
}

// Функция очистки полей ввода формы

function clearFormInputs(form) {
  form.querySelectorAll('input').forEach((input) => {
    input.value = '';
  });
}

// Функция добавления записи из формы в базу данных

async function addStudentToDataBase(list) {
  let newStudObj = {
    surname: $surnameInp.value.trim(),
    name: $nameInp.value.trim(),
    lastname: $lastnameInp.value.trim(),
    birthday: new Date($birthDateInp.value),
    studyStart: parseInt($firstYearInp.value.trim()),
    faculty: $facInp.value.trim(),
  }

  let serverDataObj = await serverAddStudent(newStudObj);

  serverDataObj.birthday = new Date(serverDataObj.birthday);

  list.push(serverDataObj);
}

// Функция сортировки записей таблицы

function sorting(list, dir, flag) {
  list = list.sort((a, b) => {
    let sort = a[flag] < b[flag];

    if (dir == false) sort = a[flag] > b[flag];

    if (sort) return -1;
  });
}

// Функции фильтрации записей таблицы

function filterString(list, prop, value) {
  return list.filter((student) => {
    if (student[prop].includes(value.trim())) return true;
  });
}

function filterNumber(list, prop, value) {
  return list.filter((student) => {
    if (student[prop] == value) return true;
  });
}

// Функция общей фильтрации

function filterSummary(list) {
  let copyList = [...list];

  copyList = filterString(copyList, 'fio', $fioFilterInp.value);

  copyList = filterString(copyList, 'faculty', $facFilterInp.value);

  if ($firstYearFilterInp.value != '') {
    copyList = filterNumber(copyList, 'studyStart', $firstYearFilterInp.value);
  }

  if ($lastYearFilterInp.value != '') {
    copyList = filterNumber(copyList, 'lastYear', $lastYearFilterInp.value);
  }

  return copyList;
}

// Первая отрисовка таблицы

createStudentsTable(listData);

// События формы добавления записи

$addForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (validation($addForm)) {
    await addStudentToDataBase(listData);

    clearFormInputs($addForm);

    createStudentsTable(listData);
  }
});

// События кнопок сортировки

let dir = true;

$tHeadThFIO.addEventListener('click', () => {
  let flag = 'fio';
  let list = filterSummary(listData);

  sorting(list, dir, flag);

  dir = !dir;

  createStudentsTable(list);
});

$tHeadThFac.addEventListener('click', () => {
  let flag = 'faculty';
  let list = filterSummary(listData);

  sorting(list, dir, flag);

  dir = !dir;

  createStudentsTable(list);
});

$tHeadThBirthDateAndAge.addEventListener('click', () => {
  let flag = 'birthday';
  let list = filterSummary(listData);

  sorting(list, dir, flag);

  dir = !dir;

  createStudentsTable(list);
});

$tHeadThLearningYearsAndCourse.addEventListener('click', () => {
  let flag = 'studyStart';
  let list = filterSummary(listData);

  sorting(list, dir, flag);

  dir = !dir;

  createStudentsTable(list);
});

// События формы фильтрации

$filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

$fioFilterInp.addEventListener('input', () => {
  let list = filterSummary(listData);

  createStudentsTable(list);
});

$facFilterInp.addEventListener('input', () => {
  let list = filterSummary(listData);

  createStudentsTable(list);
});

$firstYearFilterInp.addEventListener('input', () => {
  let list = filterSummary(listData);

  createStudentsTable(list);
});

$lastYearFilterInp.addEventListener('input', () => {
  let list = filterSummary(listData);

  createStudentsTable(list);
});
