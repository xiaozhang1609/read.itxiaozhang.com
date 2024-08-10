const content = document.getElementById('content');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

let currentCategory = 'all';
let page = 1;
let hasMoreData = true;
let groupedData = {};
let lastLoadedMonth = null;
let isLoading = false;

// Function to fetch data based on category and page number
async function fetchData(category, page) {
    if (category === 'all') {
        return fetchAllData(page);
    }
    
    const apiUrl = `https://neodb-api.suoliweng2099.workers.dev/?category=${category}&page=${page}`;
    
    try {
        showLoading();
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        showError(`获取数据时出错: ${error.message}`);
        return [];
    } finally {
        hideLoading();
    }
}

// Function to fetch all categories
async function fetchAllData(page) {
    const categories = ['movie', 'tv', 'book', 'music', 'podcast', 'game'];
    const fetchPromises = categories.map(category => fetchData(category, page));
    
    try {
        showLoading();
        const results = await Promise.all(fetchPromises);
        return results.flat();
    } catch (error) {
        showError(`获取所有数据时出错: ${error.message}`);
        return [];
    } finally {
        hideLoading();
    }
}

// Function to group data by month
function groupByMonth(data) {
    return data.reduce((acc, item) => {
        const date = new Date(item.created_time);
        const monthYear = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月`;
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(item);
        return acc;
    }, {});
}

// Function to create a card element for each item
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
        <a href="https://neodb.social${item.url}" target="_blank" rel="noreferrer">
            <img src="${item.cover_image_url}" alt="${item.display_title}" loading="lazy">
            <div class="item-info">
                <h3>${item.display_title}</h3>
                <div class="rate">
                    <span>${item.rating || '暂无评分'}</span>
                    <span>(${item.rating_count}人评分)</span>
                </div>
            </div>
        </a>
    `;
    return card;
}

// Function to render items to the page
function renderItems(groupedData) {
    const fragment = document.createDocumentFragment();

    Object.entries(groupedData).forEach(([month, monthData]) => {
        if (lastLoadedMonth !== month) {
            const monthHeader = document.createElement('div');
            monthHeader.className = 'month-header';
            monthHeader.textContent = month;
            fragment.appendChild(monthHeader);

            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'items-grid';
            fragment.appendChild(itemsGrid);

            monthData.forEach(item => {
                const card = createCard(item.item);
                itemsGrid.appendChild(card);
            });

            lastLoadedMonth = month;
        } else {
            const itemsGrid = fragment.querySelector('.items-grid:last-child');
            monthData.forEach(item => {
                const card = createCard(item.item);
                itemsGrid.appendChild(card);
            });
        }
    });

    content.appendChild(fragment);
}

// Function to load content based on category and page number
async function loadContent(category, page) {
    if (isLoading || !hasMoreData) return;
    isLoading = true;

    try {
        const items = await fetchData(category, page);
        
        if (items.length === 0) {
            hasMoreData = false;
            if (page === 1) {
                content.innerHTML = '<p>没有找到相关内容。</p>';
            }
            return;
        }

        const newGroupedData = groupByMonth(items);
        groupedData = { ...groupedData, ...newGroupedData };
        renderItems(newGroupedData);
    } catch (error) {
        showError(`加载内容时出错: ${error.message}`);
    } finally {
        isLoading = false;
    }
}

// Function to reset content and states
function resetContent() {
    content.innerHTML = '';
    page = 1;
    hasMoreData = true;
    groupedData = {};
    lastLoadedMonth = null;
    hideError();
}

// Function to show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'flex';
}

// Function to hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Function to hide error message
function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// Navigation click event
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        resetContent();
        loadContent(currentCategory, page);
    });
});

// IntersectionObserver to handle infinite scroll
const observer = new IntersectionObserver(entries => {
    if (isLoading || !hasMoreData) return;
    
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            page++;
            loadContent(currentCategory, page);
        }
    });
}, {
    rootMargin: '0px',
    threshold: 1.0
});

// Observe the content area to trigger loading when scrolled near the bottom
observer.observe(document.body);

// Initial load
loadContent(currentCategory, page);
