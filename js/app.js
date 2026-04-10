import { createTodoCard } from '../features/todo-card/todo-card.js';

document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('app-root');

    // Create a fixed due date based on current time (+ 3 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const todoData = {
        id: 1,
        title: 'Review PR & Deploy Frontend',
        description: 'Review the latest pull requests from the team, ensure all tests pass, and deploy the new frontend changes to the staging environment.',
        priority: 'High',
        status: 'Pending',
        dueDate: futureDate.toISOString(),
        tags: ['Work', 'Urgent', 'Frontend']
    };

    const card = createTodoCard(todoData);
    appRoot.appendChild(card);
});
