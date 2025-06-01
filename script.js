const students = [];

const form = document.getElementById("studentform");
const tablebody = document.querySelector("#studentTable tbody");
const promedios = document.getElementById("average");

const inputs = {
  name: form.querySelector("#name"),
  lastName: form.querySelector("#lastName"),
  grade: form.querySelector("#grade"),
};

inputs.name.addEventListener("invalid", () => {
  if (inputs.name.validity.valueMissing) {
    inputs.name.setCustomValidity("Por favor ponga su nombre.");
  } else {
    inputs.name.setCustomValidity("");
  }
});
inputs.name.addEventListener("input", () => {
  inputs.name.setCustomValidity("");
});

inputs.lastName.addEventListener("invalid", () => {
  if (inputs.lastName.validity.valueMissing) {
    inputs.lastName.setCustomValidity("Por favor ponga su apellido.");
  } else {
    inputs.lastName.setCustomValidity("");
  }
});
inputs.lastName.addEventListener("input", () => {
  inputs.lastName.setCustomValidity("");
});

inputs.grade.addEventListener("invalid", () => {
  if (inputs.grade.validity.valueMissing) {
    inputs.grade.setCustomValidity("Por favor ponga su nota.");
  } else if (inputs.grade.validity.rangeUnderflow || inputs.grade.validity.rangeOverflow) {
    inputs.grade.setCustomValidity("Por favor, ingrese una nota válida entre 1.0 y 7.0.");
  } else {
    inputs.grade.setCustomValidity("");
  }
});
inputs.grade.addEventListener("input", () => {
  inputs.grade.setCustomValidity("");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const student = {
    name: inputs.name.value.trim(),
    lastName: inputs.lastName.value.trim(),
    grade: parseFloat(inputs.grade.value),
  };

  students.push(student);
  addStudentToTable(student);
  calcularPromedio();

  form.reset();
  inputs.name.focus();
});

function addStudentToTable(student) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade.toFixed(1)}</td>
    <td>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Eliminar</button>
    </td>
  `;
  tablebody.appendChild(row);

  row.querySelector(".delete-btn").addEventListener("click", () => {
    // Encontrar índice del estudiante en el arreglo
    const idx = students.findIndex(s =>
      s.name === student.name &&
      s.lastName === student.lastName &&
      s.grade === student.grade
    );
    if (idx > -1) {
      students.splice(idx, 1);
      row.remove();
      calcularPromedio();
    }
  });
  row.querySelector(".edit-btn").addEventListener("click", () => {
    // Cargar los datos en el formulario
    inputs.name.value = student.name;
    inputs.lastName.value = student.lastName;
    inputs.grade.value = student.grade.toFixed(1);

    // Remover temporalmente ese registro (se agregará de nuevo al enviar)
    const idx = students.findIndex(s =>
      s.name === student.name &&
      s.lastName === student.lastName &&
      s.grade === student.grade
    );
    if (idx > -1) {
      students.splice(idx, 1);
      row.remove();
      calcularPromedio();
    }

    inputs.name.focus();
  });
}

function calcularPromedio() {
  if (students.length === 0) {
    promedios.innerHTML = `
      Promedio General del Curso: N/A<br>
      Total de Estudiantes: 0<br>
      Aprobados (≥ 4.0): 0%<br>
      Reprobados (< 4.0): 0%
    `;
    return;
  }

  const total = students.reduce((sum, s) => sum + s.grade, 0);
  const promedio = total / students.length;

  const totalEst = students.length;
  const aprobadosCount = students.filter(s => s.grade >= 4.0).length;
  const reprobadosCount = totalEst - aprobadosCount;
  const porcAprobados = ((aprobadosCount / totalEst) * 100).toFixed(2);
  const porcReprobados = ((reprobadosCount / totalEst) * 100).toFixed(2);

  promedios.innerHTML = `
    Promedio General del Curso: ${promedio.toFixed(2)}<br>
    Total de Estudiantes: ${totalEst}<br>
    Aprobados (≥ 4.0): ${porcAprobados}%<br>
    Reprobados (< 4.0): ${porcReprobados}%
  `;
}
