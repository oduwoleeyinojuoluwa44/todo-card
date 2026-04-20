export function createTodoCard(initialData) {
    let data = { ...initialData };
    let isEditing = false;
    let isExpanded = false;
    let timerId = null;

    const card = document.createElement('article');
    card.classList.add('todo-card');
    card.setAttribute('data-testid', 'test-todo-card');

    function updateCardState() {
        card.className = 'todo-card';
        if (data.status === 'Done') card.classList.add('completed');
        if (data.status === 'In Progress') card.classList.add('in-progress');
        card.classList.add(`priority-${data.priority.toLowerCase()}`);
    }

    function render() {
        if (isEditing) {
            renderEditMode();
        } else {
            renderDisplayMode();
        }
        updateCardState();
        updateTimeRemaining();
    }

    function renderDisplayMode() {
        const dueDate = new Date(data.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const needsCollapse = data.description.length > 100;
        
        card.innerHTML = `
            <div class="todo-priority-indicator" data-testid="test-todo-priority-indicator"></div>
            <header class="todo-header">
                <div class="todo-title-container">
                    <input type="checkbox" id="todo-complete-${data.id}" class="todo-checkbox" data-testid="test-todo-complete-toggle" ${data.status === 'Done' ? 'checked' : ''}>
                    <label for="todo-complete-${data.id}" class="sr-only">Mark as complete</label>
                    <h2 class="todo-title" data-testid="test-todo-title">${data.title}</h2>
                </div>
            </header>

            <div class="todo-status-container">
                <label for="status-control-${data.id}" class="sr-only">Status</label>
                <select id="status-control-${data.id}" class="status-control" data-testid="test-todo-status-control">
                    <option value="Pending" ${data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${data.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${data.status === 'Done' ? 'selected' : ''}>Done</option>
                </select>
            </div>

            <div class="todo-description-container" data-testid="test-todo-collapsible-section">
                <p class="todo-description ${needsCollapse && !isExpanded ? 'collapsed' : ''}" 
                   id="description-${data.id}"
                   data-testid="test-todo-description">${data.description}</p>
                ${needsCollapse ? `
                    <button class="btn-text" data-testid="test-todo-expand-toggle" aria-expanded="${isExpanded}" aria-controls="description-${data.id}">
                        ${isExpanded ? 'Show less' : 'Read more'}
                    </button>
                ` : ''}
            </div>

            <div class="todo-actions">
                <button type="button" class="btn-icon" aria-label="Edit task" data-testid="test-todo-edit-button">✏️</button>
                <button type="button" class="btn-icon btn-danger" aria-label="Delete task" data-testid="test-todo-delete-button">🗑️</button>
            </div>

            <div class="todo-meta">
                <span class="badge priority-${data.priority.toLowerCase()}" data-testid="test-todo-priority" aria-label="Priority: ${data.priority}">${data.priority}</span>
                <span class="badge status" data-testid="test-todo-status">${data.status}</span>
            </div>

            <div class="todo-timing">
                <div class="due-date-info">
                    <time datetime="${dueDate.toISOString()}" data-testid="test-todo-due-date">Due ${formattedDate}</time>
                    <span class="overdue-indicator" data-testid="test-todo-overdue-indicator" hidden>Overdue</span>
                </div>
                <span aria-live="polite" class="time-remaining" data-testid="test-todo-time-remaining"></span>
            </div>

            <ul class="todo-tags" role="list" data-testid="test-todo-tags">
                ${data.tags.map(tag => `<li class="tag" data-testid="test-todo-tag-${tag.toLowerCase()}">${tag}</li>`).join('')}
            </ul>
        `;

        // Event Listeners for Display Mode
        card.querySelector('.todo-checkbox').addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            data.status = isChecked ? 'Done' : 'Pending';
            render();
        });

        card.querySelector('.status-control').addEventListener('change', (e) => {
            data.status = e.target.value;
            render();
        });

        const expandToggle = card.querySelector('[data-testid="test-todo-expand-toggle"]');
        if (expandToggle) {
            expandToggle.addEventListener('click', () => {
                isExpanded = !isExpanded;
                render();
            });
        }

        card.querySelector('[data-testid="test-todo-edit-button"]').addEventListener('click', () => {
            isEditing = true;
            render();
            // Trap focus would go here
            card.querySelector('[data-testid="test-todo-edit-title-input"]').focus();
        });

        card.querySelector('[data-testid="test-todo-delete-button"]').addEventListener('click', () => {
            if (confirm(`Delete "${data.title}"?`)) {
                card.remove();
            }
        });
    }

    function renderEditMode() {
        card.innerHTML = `
            <form class="todo-edit-form" data-testid="test-todo-edit-form">
                <div class="form-group">
                    <label for="edit-title-${data.id}">Title</label>
                    <input type="text" id="edit-title-${data.id}" data-testid="test-todo-edit-title-input" value="${data.title}" required>
                </div>
                <div class="form-group">
                    <label for="edit-desc-${data.id}">Description</label>
                    <textarea id="edit-desc-${data.id}" data-testid="test-todo-edit-description-input" rows="3">${data.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-priority-${data.id}">Priority</label>
                        <select id="edit-priority-${data.id}" data-testid="test-todo-edit-priority-select">
                            <option value="Low" ${data.priority === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${data.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${data.priority === 'High' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-due-${data.id}">Due Date</label>
                        <input type="date" id="edit-due-${data.id}" data-testid="test-todo-edit-due-date-input" value="${data.dueDate.split('T')[0]}">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" data-testid="test-todo-cancel-button">Cancel</button>
                    <button type="submit" class="btn btn-primary" data-testid="test-todo-save-button">Save</button>
                </div>
            </form>
        `;

        const form = card.querySelector('[data-testid="test-todo-edit-form"]');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            data.title = card.querySelector('[data-testid="test-todo-edit-title-input"]').value;
            data.description = card.querySelector('[data-testid="test-todo-edit-description-input"]').value;
            data.priority = card.querySelector('[data-testid="test-todo-edit-priority-select"]').value;
            data.dueDate = card.querySelector('[data-testid="test-todo-edit-due-date-input"]').value;
            isEditing = false;
            render();
            card.querySelector('[data-testid="test-todo-edit-button"]').focus();
        });

        card.querySelector('[data-testid="test-todo-cancel-button"]').addEventListener('click', () => {
            isEditing = false;
            render();
            card.querySelector('[data-testid="test-todo-edit-button"]').focus();
        });
    }

    function updateTimeRemaining() {
        if (isEditing) return;

        const timeRemainingEl = card.querySelector('[data-testid="test-todo-time-remaining"]');
        const overdueIndicator = card.querySelector('[data-testid="test-todo-overdue-indicator"]');
        if (!timeRemainingEl) return;

        if (data.status === 'Done') {
            timeRemainingEl.textContent = 'Completed';
            timeRemainingEl.className = 'time-remaining completed';
            overdueIndicator.hidden = true;
            return;
        }

        const dueDate = new Date(data.dueDate);
        const now = new Date();
        const diff = dueDate - now;

        timeRemainingEl.className = 'time-remaining';
        overdueIndicator.hidden = diff >= 0;

        const absDiff = Math.abs(diff);
        const mins = Math.floor(absDiff / (1000 * 60));
        const hours = Math.floor(absDiff / (1000 * 60 * 60));
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

        let timeText = '';
        if (diff < 0) {
            if (days > 0) timeText = `Overdue by ${days} day${days > 1 ? 's' : ''}`;
            else if (hours > 0) timeText = `Overdue by ${hours} hour${hours > 1 ? 's' : ''}`;
            else timeText = `Overdue by ${mins} minute${mins > 1 ? 's' : ''}`;
            timeRemainingEl.classList.add('overdue');
        } else {
            if (days > 0) timeText = `Due in ${days} day${days > 1 ? 's' : ''}`;
            else if (hours > 0) timeText = `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
            else if (mins > 0) timeText = `Due in ${mins} minute${mins > 1 ? 's' : ''}`;
            else timeText = 'Due now';
            
            if (hours < 24) timeRemainingEl.classList.add('due-soon');
        }

        timeRemainingEl.textContent = timeText;
    }

    // Initial render
    render();

    // Setup interval for time updates
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateTimeRemaining, 30000);

    return card;
}

