export function createTodoCard(data) {
    const card = document.createElement('article');
    card.classList.add('todo-card');
    card.setAttribute('data-testid', 'test-todo-card');
    
    if (data.status === 'Done') {
        card.classList.add('completed');
    }

    const dueDate = new Date(data.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    card.innerHTML = `
        <header class="todo-header">
            <div class="todo-title-container">
                <input type="checkbox" id="todo-complete-${data.id}" class="todo-checkbox" data-testid="test-todo-complete-toggle" ${data.status === 'Done' ? 'checked' : ''}>
                <label for="todo-complete-${data.id}" class="sr-only">Mark as complete</label>
                <h2 class="todo-title" data-testid="test-todo-title">${data.title}</h2>
            </div>
            <div class="todo-actions">
                <button type="button" class="btn-icon" aria-label="Edit task" data-testid="test-todo-edit-button">✏️</button>
                <button type="button" class="btn-icon btn-danger" aria-label="Delete task" data-testid="test-todo-delete-button">🗑️</button>
            </div>
        </header>

        <p class="todo-description" data-testid="test-todo-description">${data.description}</p>

        <div class="todo-meta">
            <span class="badge priority-${data.priority.toLowerCase()}" data-testid="test-todo-priority" aria-label="Priority: ${data.priority}">${data.priority}</span>
            <span class="badge status" data-testid="test-todo-status">${data.status}</span>
        </div>

        <div class="todo-timing">
            <time datetime="${dueDate.toISOString()}" data-testid="test-todo-due-date">Due ${formattedDate}</time>
            <span aria-live="polite" class="time-remaining" data-testid="test-todo-time-remaining"></span>
        </div>

        <ul class="todo-tags" role="list" data-testid="test-todo-tags">
            ${data.tags.map(tag => `<li class="tag" data-testid="test-todo-tag-${tag.toLowerCase()}">${tag}</li>`).join('')}
        </ul>
    `;

    // Interaction Listeners
    const checkbox = card.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const statusEl = card.querySelector('[data-testid="test-todo-status"]');
        if (isChecked) {
            card.classList.add('completed');
            statusEl.textContent = 'Done';
            data.status = 'Done';
        } else {
            card.classList.remove('completed');
            statusEl.textContent = 'Pending';
            data.status = 'Pending';
        }
    });

    const editBtn = card.querySelector('[data-testid="test-todo-edit-button"]');
    editBtn.addEventListener('click', () => {
        console.log("Edit clicked for task:", data.id);
    });

    const deleteBtn = card.querySelector('[data-testid="test-todo-delete-button"]');
    deleteBtn.addEventListener('click', () => {
        alert("Delete clicked for task: " + data.title);
    });

    // Time Remaining Logic
    const timeRemainingEl = card.querySelector('[data-testid="test-todo-time-remaining"]');
    
    const updateTimeRemaining = () => {
        const now = new Date();
        const diff = dueDate - now;

        timeRemainingEl.className = 'time-remaining'; // Reset classes

        if (diff < 0) {
            const absDiff = Math.abs(diff);
            const hours = Math.floor(absDiff / (1000 * 60 * 60));
            if (hours < 1) {
                timeRemainingEl.textContent = "Overdue by minutes";
            } else if (hours < 24) {
                timeRemainingEl.textContent = `Overdue by ${hours} hours`;
            } else {
                const days = Math.floor(hours / 24);
                timeRemainingEl.textContent = `Overdue by ${days} days`;
            }
            timeRemainingEl.classList.add('overdue');
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours < 1) {
                timeRemainingEl.textContent = "Due now!";
                timeRemainingEl.classList.add('due-now');
            } else if (hours < 24) {
                timeRemainingEl.textContent = "Due tomorrow";
            } else {
                const days = Math.floor(hours / 24);
                timeRemainingEl.textContent = `Due in ${days} days`;
            }
        }
    };

    updateTimeRemaining();
    // Update every 60 seconds
    setInterval(updateTimeRemaining, 60000);

    return card;
}
