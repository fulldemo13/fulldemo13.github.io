document.querySelector("#generate").addEventListener("click", generateCards);
let errors = [];

const printBtn = document.querySelector('#print');
printBtn.addEventListener('click', e => window.print());

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function generateCards(evt) {
    errors = [];

    const rawSongs = document.querySelector('textarea').value.trim().split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const seen = new Set();
    const allSongs = rawSongs.filter(s => {
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
    });
    const numCards = parseInt(document.querySelector('#numCards').value);
    const cardTitleField = document.querySelector('#cardTitle');
    const cardTitle = cardTitleField.value.length > 0 ? cardTitleField.value : 'Bingo Benitandús fest';

    if (isNaN(numCards)) {
        errors.push('"Quantitat de cartrons" ha de ser un número');
    }
    if (allSongs.length < 9) {
        errors.push("Per favor necessitem 9 ítems únics mínim");
    }
    if (numCards < 1) {
        errors.push("Com a mínim es te que generar 1 cartró");
    }

    if (errors.length > 0) {
        document.querySelector('#validation').innerHTML = errors.map(e => `<li>${esc(e)}</li>`).join('');
        return;
    }

    const maxUniqueCards = calculateMaxUniqueCards(allSongs.length);
    if (numCards > maxUniqueCards) {
        errors.push(`Solament es poden generar ${maxUniqueCards} cartrons únics amb ${allSongs.length} ítems`);
        document.querySelector('#validation').innerHTML = errors.map(e => `<li>${esc(e)}</li>`).join('');
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
    const cardsPerPage = 6;
    const numPages = Math.ceil(data.length / cardsPerPage);
    const escapedTitle = esc(title);

    for (let page = 0; page < numPages; page++) {
        template += `<div class="page">`;
        for (let i = 0; i < cardsPerPage; i++) {
            const index = page * cardsPerPage + i;
            if (index >= data.length) break;

            template += `<section class="card">
                    <header>
                        <h1>${escapedTitle}</h1> 
                        <span class="no">n.${index + 1}</span>
                    </header>
                <main>`;
            
            for (let j = 0; j < data[index].length; j++) {
                template += `<div class="cell">${esc(data[index][j])}</div>`;
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