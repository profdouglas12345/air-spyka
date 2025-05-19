document.getElementById("certForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const curso = document.getElementById("curso").value;
  const ministradoPor = document.getElementById("ministradoPor").value;
  const cargaHoraria = document.getElementById("cargaHoraria").value;
  const ementa = document.getElementById("ementa").value;
  const alunosTexto = document.getElementById("alunos").value;

  const alunos = alunosTexto.split("\n").filter((nome) => nome.trim() !== "");

  if (alunos.length === 0) {
    alert("Adicione pelo menos um aluno.");
    return;
  }

  alunos.forEach((aluno) => {
    gerarCertificadoPDF(aluno.trim(), curso, ministradoPor, cargaHoraria, ementa);
  });

  alert("Certificados gerados e iniciando download para cada aluno.");
});

function gerarCertificadoPDF(nomeAluno, curso, ministradoPor, cargaHoraria, ementa) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CERTIFICADO", 105, 30, null, null, "center");

  doc.setFontSize(14);
  doc.setFont("Helvetica", "normal");
  doc.text(
    `Certificamos que ${nomeAluno} participou do curso "${curso}",`,
    20,
    50
  );
  doc.text(`ministrado por ${ministradoPor}, com carga horária de ${cargaHoraria}.`, 20, 60);
  
  doc.text("Ementa do curso:", 20, 80);
  doc.setFontSize(12);
  const ementaLinhas = doc.splitTextToSize(ementa, 170);
  doc.text(ementaLinhas, 20, 90);

  doc.setFontSize(10);
  doc.text("Emitido automaticamente por CertificaAluno", 105, 280, null, null, "center");

  const nomeArquivo = `Certificado_${nomeAluno.replace(/ /g, "_")}.pdf`;
  doc.save(nomeArquivo);
}
