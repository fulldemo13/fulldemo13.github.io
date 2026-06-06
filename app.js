document.querySelector("#generate").addEventListener("click", generateCards);
let errors = [];

const printBtn = document.querySelector('#print');
printBtn.addEventListener('click', e => {
    document.fonts.ready.then(() => {
        const overflowErrors = checkOverflow();
        const validationEl = document.querySelector('#validation');
        validationEl.innerHTML = overflowErrors.map(e => `<li>${esc(e)}</li>`).join('');
        if (overflowErrors.length > 0) return;
        window.print();
    });
});

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function calculateGrid(cardsPerPage) {
    let bestCols = 1;
    let bestSize = 0;
    const padding = 5;
    const usableW = 210 - 2 * padding;
    const usableH = 297 - 2 * padding;

    for (let cols = 1; cols <= cardsPerPage; cols++) {
        const rows = Math.ceil(cardsPerPage / cols);
        const cellW = usableW / cols;
        const cellH = usableH / rows;
        const size = Math.min(cellW, cellH);
        if (size > bestSize) {
            bestSize = size;
            bestCols = cols;
        }
    }

    return { cols: bestCols, rows: Math.ceil(cardsPerPage / bestCols), cardSize: bestSize };
}

function generateCards(evt) {
    const validationEl = document.querySelector('#validation');
    validationEl.innerHTML = '';
    errors = [];

    const rawSongs = document.querySelector('textarea').value.trim().split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const seen = new Set();
    const duplicates = new Set();
    const allSongs = rawSongs.filter(s => {
        if (seen.has(s)) {
            duplicates.add(s);
            return false;
        }
        seen.add(s);
        return true;
    });
    const numCards = parseInt(document.querySelector('#numCards').value);
    const cardsPerPage = parseInt(document.querySelector('#cardsPerPage').value);
    const cardTitleField = document.querySelector('#cardTitle');
    const cardTitle = cardTitleField.value.length > 0 ? cardTitleField.value : 'Bingo Benitandús fest';
    const titleFont = document.querySelector('#titleFont').value;
    const cellFont = document.querySelector('#cellFont').value;
    const headerColor = document.querySelector('#headerColor').value;
    const cellOddColor = document.querySelector('#cellOddColor').value;
    const cellEvenColor = document.querySelector('#cellEvenColor').value;

    if (duplicates.size > 0) {
        const dupList = [...duplicates].map(d => `"${truncate(d, 30)}"`).join(', ');
        errors.push(`Cançons repetides a la llista: ${dupList}`);
    }

    if (isNaN(numCards)) {
        errors.push('"Quantitat de cartrons" ha de ser un número');
    }
    if (isNaN(cardsPerPage) || cardsPerPage < 1) {
        errors.push('"Cartrons per pàgina" ha de ser un número major que 0');
    }
    if (allSongs.length < 9) {
        errors.push("Per favor necessitem 9 ítems únics mínim");
    }
    if (numCards < 1) {
        errors.push("Com a mínim es te que generar 1 cartró");
    }

    if (errors.length > 0) {
        validationEl.innerHTML = errors.map(e => `<li>${esc(e)}</li>`).join('');
        return;
    }

    const maxUniqueCards = calculateMaxUniqueCards(allSongs.length);
    if (numCards > maxUniqueCards) {
        errors.push(`Solament es poden generar ${maxUniqueCards} cartrons únics amb ${allSongs.length} ítems`);
        validationEl.innerHTML = errors.map(e => `<li>${esc(e)}</li>`).join('');
        return;
    }

    let data = generateUniqueCards(allSongs, numCards);
    renderCards(data, cardTitle, cardsPerPage, titleFont, cellFont, headerColor, cellOddColor, cellEvenColor);
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

function quoteFont(font) {
    const genericFamilies = new Set(['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui']);
    return genericFamilies.has(font) ? font : `'${font}'`;
}

function renderCards(data, title, cardsPerPage, titleFont, cellFont, headerColor, cellOddColor, cellEvenColor) {
    const { cols, rows, cardSize } = calculateGrid(cardsPerPage);
    const escapedTitle = esc(title);
    const titleFontCSS = quoteFont(titleFont);
    const cellFontCSS = quoteFont(cellFont);
    const numPages = Math.ceil(data.length / (cols * rows));
    const slotsPerPage = cols * rows;
    let template = '';

    for (let page = 0; page < numPages; page++) {
        template += `<div class="page" style="--cols:${cols};--rows:${rows};--card-size:${cardSize.toFixed(2)}mm;grid-template-columns:repeat(${cols},var(--card-size));grid-template-rows:repeat(${rows},var(--card-size));justify-content:center;align-content:center">`;
        for (let i = 0; i < slotsPerPage; i++) {
            const index = page * slotsPerPage + i;
            if (index >= data.length) {
                template += `<div class="card empty"></div>`;
                continue;
            }

            template += `<section class="card" style="--title-font:${titleFontCSS};--cell-font:${cellFontCSS};--header-color:${headerColor};--cell-odd-color:${cellOddColor};--cell-even-color:${cellEvenColor}">
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

    document.fonts.ready.then(() => {
        const overflowErrors = checkOverflow();
        if (overflowErrors.length > 0) {
            document.querySelector('#validation').innerHTML = overflowErrors.map(e => `<li>${esc(e)}</li>`).join('');
        }
    });
}

function truncate(str, maxLen) {
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 1) + '…';
}

function checkOverflow() {
    const overflow = new Set();
    const cards = document.querySelectorAll('.card:not(.empty)');
    if (cards.length === 0) return [];

    const h1 = cards[0].querySelector('h1');
    if (h1 && h1.scrollWidth > h1.clientWidth + 1) {
        overflow.add(`El títol no cap a la capçalera: "${truncate(h1.textContent, 30)}"`);
    }

    cards.forEach(card => {
        card.querySelectorAll('.cell').forEach(cell => {
            if (cell.scrollHeight > cell.clientHeight + 1) {
                overflow.add(`La cançó no cap a la cel·la: "${truncate(cell.textContent, 30)}"`);
            }
        });
    });

    return [...overflow];
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