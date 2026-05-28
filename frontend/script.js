let quizData = null;

async function generateQuiz() {
    const fileInput = document.getElementById('pdfFile');
    const numQuestions = document.getElementById('numQuestions').value;
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const quizContainer = document.getElementById('quizContainer');

    // Vérifier qu'un fichier est sélectionné
    if (!fileInput.files[0]) {
        showError("⚠️ Veuillez choisir un fichier PDF !");
        return;
    }

    // Préparer l'envoi
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Afficher le loading
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    quizContainer.innerHTML = '';

    try {
        const response = await fetch(`http://127.0.0.1:8000/generate-quiz?num_questions=${numQuestions}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Erreur serveur");

        quizData = await response.json();
        displayQuiz(quizData);

    } catch (err) {
        showError("❌ Erreur : " + err.message);
    } finally {
        loading.classList.add('hidden');
    }
}

function displayQuiz(data) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '<h2 style="color:#4a4a8a; margin-bottom:20px;">📝 Ton Quiz</h2>';

    data.questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `<h3>Question ${index + 1} : ${q.question}</h3>`;

        q.options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = option;
            div.onclick = () => checkAnswer(div, option, q.answer, card);
            card.appendChild(div);
        });

        container.appendChild(card);
    });
}

function checkAnswer(div, selected, correct, card) {
    // Désactiver tous les clics de cette carte
    card.querySelectorAll('.option').forEach(o => o.onclick = null);

    // Vérifier la réponse
    if (selected.startsWith(correct)) {
        div.classList.add('correct');
        div.textContent += " ✅";
    } else {
        div.classList.add('wrong');
        div.textContent += " ❌";
        // Montrer la bonne réponse
        card.querySelectorAll('.option').forEach(o => {
            if (o.textContent.startsWith(correct)) {
                o.classList.add('correct');
                o.textContent += " ✅";
            }
        });
    }
}

function showError(msg) {
    const error = document.getElementById('error');
    error.textContent = msg;
    error.classList.remove('hidden');
}