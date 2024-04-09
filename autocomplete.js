const input = document.querySelector('.form__search');
const autocomplete = document.querySelector('.autocomplete');
const repositories = document.querySelector('.repo-list');
let timer;

input.addEventListener('input', async function(event) {
    if (event.target.value.trim() === '') {
        autocomplete.innerHTML = '';
        clearTimeout(timer);
        return;
    }

    clearTimeout(timer);
    timer = setTimeout(async () => {
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${event.target.value}`);
            if (!response.ok) {
                throw new Error('Ошибка получения данных');
            }
            const data = await response.json();
            showAutocomplete(data.items.slice(0, 5));
        } catch(error) {
            console.error('Ошибка:', error);
        }
    }, 300);
});

function showAutocomplete(repos) {
    autocomplete.innerHTML = '';
    if (repos.length === 0) {
        autocomplete.innerHTML = 'Репозитории не найдены';
        return;
    }
    repos.forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.textContent = repo.full_name;
        repoItem.classList.add('autocomplete__item');
        repoItem.addEventListener('click', () => {
            addToList(repo);
        });
        autocomplete.appendChild(repoItem);
    });
}

function addToList(repoItem) {
    autocomplete.innerHTML = '';
    const listItem = document.createElement('li');
    listItem.classList.add('repo-list__item');
    listItem.innerHTML = `
      <div class="item-info">
        <div>name: ${repoItem.full_name}</div>
        <div>Owner: ${repoItem.owner.login}</div>
        <div>Stars: ${repoItem.stargazers_count}</div>
      </div>
      <button class="delete-btn"></button>
    `;
    listItem.querySelector('.delete-btn').addEventListener('click', () => {
      listItem.remove();
    });
    repositories.appendChild(listItem);
    input.value = '';
}

