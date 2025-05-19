
document.getElementById("certForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const curso = document.getElementById("curso").value;
  const instrutor = document.getElementById("instrutor").value;
  const cargaHoraria = document.getElementById("cargaHoraria").value;
  const ementa = document.getElementById("ementa").value;
  const alunosTexto = document.getElementById("alunos").value;
  const alunos = alunosTexto.split('\n').map(nome => nome.trim()).filter(nome => nome !== '');

  try {
    const batch = db.batch();

    for (const aluno of alunos) {
      const docRef = db.collection("certificados").doc();
      const dados = {
        aluno,
        curso,
        instrutor,
        cargaHoraria,
        ementa,
        dataGeracao: new Date()
      };
      batch.set(docRef, dados);

      const pdfBlob = await gerarCertificadoPDF(aluno, curso, instrutor, cargaHoraria, ementa);
      const storageRef = storage.ref(`certificados/${aluno.replace(/\s+/g, "_")}.pdf`);
      await storageRef.put(pdfBlob);
    }

    await batch.commit();
    document.getElementById("mensagem").textContent = "Certificados gerados, salvos e enviados com sucesso!";
    document.getElementById("certForm").reset();
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("mensagem").textContent = "Erro ao gerar certificados.";
  }
});

async function gerarCertificadoPDF(aluno, curso, instrutor, cargaHoraria, ementa) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("CERTIFICADO", 105, 30, null, null, "center");

  doc.setFontSize(12);
  const texto = `Certificamos que ${aluno} participou do curso "${curso}", ministrado por ${instrutor}, com carga horária total de ${cargaHoraria}.`;
  doc.text(texto, 20, 50, { maxWidth: 170, align: 'justify' });

  doc.text("Ementa do Curso:", 20, 80);
  doc.setFontSize(11);
  doc.text(ementa, 20, 90, { maxWidth: 170, align: 'justify' });

  doc.setFontSize(10);
  doc.text(`Emitido em: ${new Date().toLocaleDateString()}`, 20, 270);

  return doc.output("blob");
}
