const students = [];

const form = document.getElementById("studentform");
const tablebody = document.querySelector("#studentTable tbody");
const promedios = document.getElementById("average");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const gradeInput = document.getElementById("grade").value.trim();
    const grade = parseFloat(gradeInput);

    // Validaciones específicas con mensajes en español
    if (!name) {
        alert("Por favor, ingrese el nombre.");
        return;
    }
    if (!lastName) {
        alert("Por favor, ingrese el apellido.");
        return;
    }
    if (!gradeInput || isNaN(grade) || grade < 1 || grade > 7) {
        alert("Por favor, ingrese una nota válida entre 1 y 7.");
        return;
    }

    const student = { name, lastName, grade };

    students.push(student);

    addStudentToTable(student);
    calcularPromedio();

    form.reset();
});

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(2)}</td>
    `;
    tablebody.appendChild(row);
}

function calcularPromedio() {
    if (students.length === 0) {
        promedios.textContent = "Promedio General del Curso: N/A";
        return;
    }
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;
    promedios.textContent = "Promedio General del Curso: " + prom.toFixed(2);
}
