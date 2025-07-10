document.querySelector("#generate").addEventListener("click", generateCards);
let errors = [];

const printBtn = document.querySelector('#print');
printBtn.addEventListener('click', e => window.print());

function generateCards(evt) {
    errors = [];

    const allSongs = document.querySelector('textarea').value.trim().split('\n').map(s => s.trim());
    const numCards = parseInt(document.querySelector('#numCards').value);
    const cardTitleField = document.querySelector('#cardTitle');
    const cardTitle = cardTitleField.value.length > 0 ? cardTitleField.value : 'Bingo Benitandús fest';

    if (isNaN(numCards)) {
        errors.push('"Quantitat de cartrons" ha de ser un número');
    }
    if (allSongs.length < 9) {
        errors.push("Per favor necessitem 9 ítems mínim");
    }
    if (numCards < 1) {
        errors.push("Com a mínim es te que generar 1 cartró");
    }

    if (errors.length > 0) {
        document.querySelector('#validation').innerHTML = errors.map(e => `<li>${e}</li>`).join('');
        return;
    }

    // Verificar si hi ha suficients combinacions úniques
    const maxUniqueCards = calculateMaxUniqueCards(allSongs.length);
    if (numCards > maxUniqueCards) {
        errors.push(`Solament es poden generar ${maxUniqueCards} cartrons únics amb ${allSongs.length} ítems`);
        document.querySelector('#validation').innerHTML = errors.map(e => `<li>${e}</li>`).join('');
        return;
    }

    let data = generateUniqueCards(allSongs, numCards);
    renderCards(data, cardTitle);
}

function generateUniqueCards(songs, numCards) {
    const uniqueCards = new Set();
    const cards = [];
    
    while (cards.length < numCards) {
        const card = getCardData(songs);
        const signature = [...card].sort().join('|');
        
        if (!uniqueCards.has(signature)) {
            uniqueCards.add(signature);
            cards.push(card);
        }
        
        if (uniqueCards.size > 100000) {
            throw new Error("Error de molts reintents al generar cartrons únics");
        }
    }
    
    return cards;
}

function calculateMaxUniqueCards(totalSongs) {
    // Calcular combinacions possbles: C(n, 9) = n! / (9! * (n-9)!)
    if (totalSongs < 9) return 0;
    
    let n = totalSongs;
    let numerator = 1;
    let denominator = 1;
    
    for (let i = 0; i < 9; i++) {
        numerator *= n - i;
        denominator *= i + 1;
    }
    
    return Math.floor(numerator / denominator);
}

function renderCards(data, title) {
    let template = ``;
    let n = 1;
    const cardsPerPage = 6;
    const numPages = Math.ceil(data.length / cardsPerPage);

    for (let page = 0; page < numPages; page++) {
        template += `<div class="page">`;
        for (let i = 0; i < cardsPerPage; i++) {
            const index = page * cardsPerPage + i;
            if (index >= data.length) break;

            template += `<section class="card">
                    <header>
                        <h1>${title}</h1> 
                        <span class="no">Cartró n.${n + index}</span>
                    </header>
                <main>`;
            
            for (let j = 0; j < data[index].length; j++) {
                template += `<div class="cell">${data[index][j]}</div>`;
            }

            template += `</main></section>`;
        }
        template += `</div>`;
    }

    document.querySelector('#print').disabled = false;
    document.querySelector('#cards').innerHTML = template;
}

function getCardData(songs) {
    let shuffled = [...songs];
    let curr = songs.length;

    while (curr > 0) {
        const r = Math.floor(Math.random() * curr);
        curr--;
        [shuffled[curr], shuffled[r]] = [shuffled[r], shuffled[curr]];
    }

    return shuffled.slice(0, 9);
}