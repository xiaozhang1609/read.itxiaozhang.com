const content = document.getElementById('content');
const loadMoreBtn = document.querySelector('.load-more');
const navLinks = document.querySelectorAll('nav a');

let currentCategory = 'movie';
let page = 1;
let hasMoreData = true;
let groupedData = {};
let lastLoadedMonth = null;

async function fetchData(category, page) {
    const apiUrl = `https://neodb.social/api/me/shelf/complete?category=${category}&page=${page}`;
    const accessToken = NEODB_TOKEN;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function groupByMonth(data) {
    const grouped = {};
    data.forEach(item => {
        const date = new Date(item.created_time);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!grouped[monthYear]) {
            grouped[monthYear] = [];
        }
        grouped[monthYear].push(item);
    });
    return grouped;
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'item';

    const img = document.createElement('img');
    img.src = item.cover_image_url;
    img.alt = item.display_title;

    const rate = document.createElement('div');
    rate.className = 'rate';
    rate.innerHTML = `
        ${item.rating ? `<span><b>${item.rating}</b>🌟</span><br>` : `<span>暂无🌟</span><br>`}
        <span class="rating-count">${item.rating_count}人评分</span>
    `;

    const title = document.createElement('h3');
    title.textContent = item.display_title;

    const link = document.createElement('a');
    link.href = `https://neodb.social${item.url}`; // 构建完整的 URL
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.appendChild(img);
    link.appendChild(title);
    link.appendChild(rate);

    card.appendChild(link);

    return card;
}


function renderItems(groupedData) {
    Object.keys(groupedData).forEach(month => {
        const monthData = groupedData[month];

        if (lastLoadedMonth !== month) {
            const monthHeader = document.createElement('div');
            monthHeader.className = 'month-header';
            monthHeader.textContent = month;
            content.appendChild(monthHeader);

            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'items-grid';
            content.appendChild(itemsGrid);

            monthData.forEach(item => {
                const card = createCard(item.item);
                itemsGrid.appendChild(card);
            });

            lastLoadedMonth = month;
        } else {
            const itemsGrid = content.querySelector('.items-grid');
            monthData.forEach(item => {
                const card = createCard(item.item);
                itemsGrid.appendChild(card);
            });
        }
    });
}

async function loadContent(category, page) {
    const items = await fetchData(category, page);
    if (items.length === 0) {
        hasMoreData = false;
        loadMoreBtn.style.display = 'none'; // Hide the button if no more data
        return;
    }

    const newGroupedData = groupByMonth(items);
    groupedData = { ...groupedData, ...newGroupedData };
    renderItems(groupedData);

    // Handle the visibility of the "load more" button
    loadMoreBtn.style.display = hasMoreData ? 'block' : 'none';
}

function handleScroll() {
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

    if (nearBottom && hasMoreData) {
        page++;
        loadContent(currentCategory, page);
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        content.innerHTML = '';
        page = 1;
        hasMoreData = true;
        groupedData = {};
        lastLoadedMonth = null;
        loadContent(currentCategory, page);
    });
});

loadMoreBtn.addEventListener('click', () => {
    page++;
    loadContent(currentCategory, page);
});

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// Initial load
loadContent(currentCategory, page);
