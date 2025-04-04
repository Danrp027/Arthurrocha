// api/minha-api.js

const express = require('express');
const path = require('path');
const sqlite = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const app = express();

const db = new sqlite.Database("GAM.sqlite");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Função para enviar e-mails
const enviarEmail = async ({ local, operador, matricula, dia_hora, empilhadeira, batida, limpeza, luzes, torre, garfos, freios, bateria, ruidos, buzina, horimetro, observacoes }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou qualquer outro serviço de e-mail que você esteja usando
    auth: {
      user: 'daniel.rpereira027@gmail.com',  // Substitua pelo seu e-mail
      pass: 'eehz liso znfa fxbh'  // Substitua pela sua senha ou melhor, uma variável de ambiente
    }
  });

  const mailOptions = {
    from: 'daniel.rpereira027@gmail.com',
    to: 'acallifs@gmail.com', // Alvo do e-mail
    subject: 'Novo Checklist Submetido',
    text: `Um novo checklist foi submetido:

    Local: ${local}
    Operador: ${operador}
    Matrícula: ${matricula}
    Data e Hora: ${dia_hora}
    Empilhadeira: ${empilhadeira}
    Batida: ${batida}
    Limpeza: ${limpeza}
    Luzes: ${luzes}
    Torre: ${torre}
    Garfos: ${garfos}
    Freios: ${freios}
    Bateria: ${bateria}
    Ruídos: ${ruidos}
    Buzina: ${buzina}
    Horímetro: ${horimetro}
    Observações: ${observacoes}
    `
  };

  await transporter.sendMail(mailOptions);
};

// Função para lidar com as requisições
module.exports = (req, res) => {
  if (req.method === 'POST' && req.url === '/addchecklist') {
    // Lógica para o POST /addchecklist
    const { local, operador, matricula, dia_hora, empilhadeira, batida, limpeza, luzes, torre, garfos, freios, bateria, ruidos, buzina, horimetro, observacoes } = req.body;

    const sql = `
      INSERT INTO CHECKLISTS (
        LOCAL, OPERADOR, MATRICULA, DIA_HORA, EMPILHADEIRA, BATIDA, LIMPEZA, LUZES, TORRE, GARFOS, FREIOS, BATERIA, RUIDOS, BUZINA, HORIMETRO, OBSERVACOES
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      local,
      operador,
      matricula,
      dia_hora,
      empilhadeira,
      batida,
      limpeza,
      luzes,
      torre,
      garfos,
      freios,
      bateria,
      ruidos,
      buzina,
      horimetro,
      observacoes
    ], async (err) => {
      if (err) {
        console.error("Erro ao inserir checklist:", err);
        return res.status(500).send("Erro ao armazenar checklist");
      }

      // Enviar o e-mail, se necessário
      try {
        await enviarEmail({ local, operador, matricula, dia_hora, empilhadeira, batida, limpeza, luzes, torre, garfos, freios, bateria, ruidos, buzina, horimetro, observacoes });
        res.send('Checklist recebido e e-mail enviado com sucesso!');
      } catch (emailError) {
        res.status(500).send('Erro ao enviar e-mail.');
      }
    });
  } else if (req.method === 'POST' && req.url === '/addbateria') {
    // Lógica para o POST /addbateria
    const { local, operador, matricula, dia_hora, empilhadeira, batida, limpeza, luzes, torre, garfos, freios, bateria, ruidos, buzina, horimetro, observacoes } = req.body;

    const sql = `
      INSERT INTO CHECKLISTS (
        LOCAL, OPERADOR, MATRICULA, DIA_HORA, EMPILHADEIRA, BATIDA, LIMPEZA, LUZES, TORRE, GARFOS, FREIOS, BATERIA, RUIDOS, BUZINA, HORIMETRO, OBSERVACOES
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      local,
      operador,
      matricula,
      dia_hora,
      empilhadeira,
      batida,
      limpeza,
      luzes,
      torre,
      garfos,
      freios,
      bateria,
      ruidos,
      buzina,
      horimetro,
      observacoes
    ], async (err) => {
      if (err) {
        console.error("Erro ao inserir checklist:", err);
        return res.status(500).send("Erro ao armazenar checklist");
      }

      // Enviar o e-mail, se necessário
      try {
        await enviarEmail({ local, operador, matricula, dia_hora, empilhadeira, batida, limpeza, luzes, torre, garfos, freios, bateria, ruidos, buzina, horimetro, observacoes });
        res.send('Checklist de bateria recebido e e-mail enviado com sucesso!');
      } catch (emailError) {
        res.status(500).send('Erro ao enviar e-mail.');
      }
    });
  } else {
    res.status(404).send('Não encontrado');
  }
};
