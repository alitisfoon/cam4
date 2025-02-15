
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // فعال‌سازی دوربین متناسب با صفحه
    if (sectionId === 'recognition') {
        startCamera('recognitionVideo');
    } else if (sectionId === 'add-student') {
        startCamera('addStudentVideo');
    }
}

async function startCamera(videoId) {
    const video = document.getElementById(videoId);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert('اجازه دسترسی به دوربین داده نشد.');
    }
}

function takePhoto() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('addStudentVideo');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const photo = document.getElementById('photo');
    photo.src = canvas.toDataURL('image/png');
    photo.style.display = 'block';
}

function saveStudent() {
    const name = document.getElementById('studentName').value;
    const father = document.getElementById('studentFather').value;
    const birthYear = document.getElementById('studentBirthYear').value;
    const grade = document.getElementById('studentGrade').value;
    const absences = document.getElementById('studentAbsences').value;
    const photo = document.getElementById('photo').src;

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push({ name, father, birthYear, grade, absences, photo });
    localStorage.setItem('students', JSON.stringify(students));

    updateArchive();
    alert('دانش‌آموز ذخیره شد.');
}

function updateArchive() {
    const table = document.querySelector('#archiveTable tbody');
    table.innerHTML = '';
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.father}</td>
            <td>${student.birthYear}</td>
            <td>${student.grade}</td>
            <td>${student.absences}</td>
            <td><img src="${student.photo}" style="width:50px;height:50px;"></td>
            <td><button onclick="deleteStudent('${student.name}')">حذف</button></td>
        `;
        table.appendChild(row);
    });
}

function deleteStudent(name) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filtered = students.filter(student => student.name !== name);
    localStorage.setItem('students', JSON.stringify(filtered));
    updateArchive();
}

window.onload = () => {
    showSection('recognition');
    updateArchive();
};
